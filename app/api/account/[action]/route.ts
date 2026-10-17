import { NextRequest } from "next/server";
import { ApiError, normalizeError, normalizeSession, object, safeUser } from "@/lib/api/contracts";
import { authenticated, responseJson, upstream } from "@/lib/api/server";
import { checkOrigin, clearCookie, errorResponse, json } from "@/lib/api/http";
import { accountPayload } from "@/lib/auth/account-contracts";
import { createSession } from "@/lib/auth/store";
import { sessionCookie } from "@/lib/auth/session";
type Context={params:Promise<{action:string}>};
function profile(value:unknown){const u=object(value);return {...safeUser(u),preferredLanguageCode:typeof u.preferredLanguageCode==="string"?u.preferredLanguageCode:"",phone:typeof u.phone==="string"?u.phone:""};}
export async function GET(request:NextRequest,context:Context){
  try{const {action}=await context.params;if(action!=="profile")throw new ApiError(404,"Unknown account action.");const id=request.cookies.get(sessionCookie)?.value;if(!id)throw new ApiError(401,"Please log in again.");const response=await authenticated(id,"/users/me");const value=await responseJson(response);if(!response.ok)throw normalizeError(value,response.status);return json({success:true,data:profile(object(value).data)});}catch(error){return errorResponse(error);}
}
async function mutate(request:NextRequest,context:Context){
  try{
    checkOrigin(request);const {action}=await context.params;
    const methods:Record<string,string>={register:"POST","register-school":"POST","forgot-password":"POST","reset-password":"POST","change-password":"POST",profile:"PATCH","delete-account":"DELETE"};
    if(!methods[action])throw new ApiError(404,"Unknown account action.");if(methods[action]!==request.method)throw new ApiError(405,"This account action does not support that method.");
    if(!request.headers.get("content-type")?.startsWith("application/json"))throw new ApiError(415,"Send account details as JSON.");
    const raw=await request.text();if(raw.length>16384)throw new ApiError(413,"The account request is too large.");
    let body:unknown;try{body=JSON.parse(raw);}catch{throw new ApiError(400,"The account details could not be read.");}
    const payload=accountPayload(action,body);const id=request.cookies.get(sessionCookie)?.value;
    const protectedAction=["profile","change-password","delete-account"].includes(action);
    if(protectedAction&&!id)throw new ApiError(401,"Please log in again.");
    const paths:Record<string,string>={register:"/auth/register","register-school":"/schools/register","forgot-password":"/auth/password/forgot","reset-password":"/auth/password/reset","change-password":"/auth/password/change",profile:"/users/me","delete-account":"/users/me"};
    const init={method:request.method,headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)};
    const response=protectedAction?await authenticated(id!,paths[action],init):await upstream(paths[action],init);
    const value=response.status===204?{success:true,data:null}:await responseJson(response);if(!response.ok)throw normalizeError(value,response.status);
    if(["register","register-school","reset-password"].includes(action)){
      const session=normalizeSession(value);const nextId=await createSession(session);
      const result=json({success:true,message:action==="reset-password"?"Password updated":"Account created",data:{user:session.user}},response.status);
      result.cookies.set(sessionCookie,nextId,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:7*86400});return result;
    }
    if(action==="forgot-password")return json({success:true,message:"If that email is registered, a password link has been sent.",data:null});
    if(action==="profile")return json({success:true,message:"Profile saved",data:profile(object(value).data)});
    // Re-authenticate this device as well after a credential change/deletion.
    return clearCookie(json({success:true,message:action==="delete-account"?"Account deleted":"Password changed. Please sign in again.",data:null}));
  }catch(error){return errorResponse(error);}
}
export const POST=mutate;export const PATCH=mutate;export const DELETE=mutate;
