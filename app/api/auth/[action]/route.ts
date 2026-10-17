import { NextRequest, NextResponse } from "next/server";
import { createSession, readSession } from "@/lib/auth/store";
import { sessionCookie } from "@/lib/auth/session";
import { safeReturnTo } from "@/lib/auth/roles";
import { ApiError, normalizeError, normalizeSession, safeUser } from "@/lib/api/contracts";
import { authenticated, refreshSession, responseJson, upstream } from "@/lib/api/server";
import { checkOrigin, clearCookie, errorResponse, json } from "@/lib/api/http";
type Context={params:Promise<{action:string}>};
export async function POST(request:NextRequest,context:Context) {
  try {
    checkOrigin(request); const {action}=await context.params;
    const id=request.cookies.get(sessionCookie)?.value;
    if(action==="login") {
      if(!request.headers.get("content-type")?.startsWith("application/json")) throw new ApiError(415,"Send account details as JSON.");
      if(Number(request.headers.get("content-length"))>8192) throw new ApiError(413,"The request is too large.");
      let body:Record<string,unknown>; try {body=await request.json();} catch {throw new ApiError(400,"Invalid account details.");}
      if(!body || typeof body.email!=="string" || typeof body.password!=="string" || body.email.length>320 || body.password.length>1024 || !body.email.trim() || !body.password) throw new ApiError(400,"Email and password are required.");
      const response=await upstream("/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:body.email.trim(),password:body.password})});
      const value=await responseJson(response); if(!response.ok) throw normalizeError(value,response.status);
      const session=normalizeSession(value); const nextId=await createSession(session); 
      const result=json({success:true,message:"Logged in",data:{user:session.user}});
      result.cookies.set(sessionCookie,nextId,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:7*86400}); return result;
    }
    if(action==="logout") {
      if(id) {const old=await readSession(id); if(old) {try {await upstream("/auth/logout",{method:"POST",headers:{Authorization:`Bearer ${old.accessToken}`}});} catch {/* Local logout must succeed even if the backend is unreachable. */}}}
      return clearCookie(json({success:true,message:"Logged out",data:null}));
    }
    if(action==="refresh") {
      if(!id) throw new ApiError(401,"Please log in again.");
      const old=await readSession(id); if(!old) throw new ApiError(401,"Please log in again.");
      // A still-fresh session needs no rotation; prevents duplicate explicit refreshes across tabs.
      const session=await refreshSession(id);
      const result=json({success:true,message:"Session ready",data:{user:session.user}});
      result.cookies.set(sessionCookie,await createSession(session),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:Math.max(0,Math.floor((session.expiresAt-Date.now())/1000))});return result;
    }
    throw new ApiError(404,"Unknown authentication action.");
  } catch(error) { return errorResponse(error); }
}
export async function GET(request:NextRequest,context:Context) {
  const {action}=await context.params;
  if(action==="expired") {
    const response=NextResponse.redirect(new URL(`/login?returnTo=${encodeURIComponent(safeReturnTo(request.nextUrl.searchParams.get("returnTo")))}`,request.url));
    return clearCookie(response);
  }
  if(action!=="session") return errorResponse(new ApiError(404,"Unknown authentication action."));
  try { const id=request.cookies.get(sessionCookie)?.value;if(!id) throw new ApiError(401,"Please log in again.");
    const response=await authenticated(id,"/users/me"); const value=await responseJson(response); if(!response.ok) throw normalizeError(value,response.status);
    return json({success:true,data:{user:safeUser((value as {data:unknown}).data)}});
  } catch(error) {return errorResponse(error);}
}
