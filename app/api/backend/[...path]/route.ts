import {learnerBoundary} from "@/lib/learning/boundary";
import {readSession} from "@/lib/auth/store";
import { NextRequest, NextResponse } from "next/server";
import { authenticated, responseJson } from "@/lib/api/server";
import { ApiError, normalizeError, sanitize } from "@/lib/api/contracts";
import { sessionCookie } from "@/lib/auth/session";
import { checkOrigin,errorResponse,json } from "@/lib/api/http";
type Context={params:Promise<{path:string[]}>};
const namespaces=new Set(["users","admin","schools","classes","courses","languages","authoring","vocabulary","cultural-topics","games","media","learning","progress","certificates","gamecard","parents","assignments","notifications","search","dashboards","reports","leaderboards","subscriptions"]);
async function handle(request:NextRequest,context:Context) {
  try {
    const {path}=await context.params;
    if(!path.length || !namespaces.has(path[0]) || path.some(segment=>!/^[A-Za-z0-9_-]+$/.test(segment)) || path.includes("webhooks")) throw new ApiError(400,"This API path is not supported.");
    const mutation=!["GET","HEAD"].includes(request.method); if(mutation) checkOrigin(request);
    const id=request.cookies.get(sessionCookie)?.value; if(!id) throw new ApiError(401,"Please log in again.");
    if(path[0]==="learning"||path[0]==="gamecard"||path[0]==="progress"||path[0]==="dashboards"&&path[1]==="learner"){const session=await readSession(id);if(!session)throw new ApiError(401,"Please log in again.");if(session.user.role!=="learner")throw new ApiError(403,"This learning action requires a learner account.");}
    if(path[0]==="certificates"){
      if(path[1]==="issue")throw new ApiError(404,"Certificate issuance is automatic.");
      const session=await readSession(id);if(!session)throw new ApiError(401,"Please log in again.");
      const admin=session.user.role==="super_admin",learner=session.user.role==="learner";
      if(!admin&&!learner)throw new ApiError(403,"This certificate action is not available to your account.");
      if(path.length===1&&(!admin||request.method!=="GET")||path[2]==="revoke"&&(!admin||request.method!=="POST")||path[1]==="mine"&&(!learner||request.method!=="GET"))throw new ApiError(403,"This certificate action is not permitted.");
      if(path.length===2&&!["GET"].includes(request.method)||path.length>3||path.length===3&&path[2]!=="revoke")throw new ApiError(400,"This certificate action is not supported.");
    }
    const type=request.headers.get("content-type")??"";
    if(mutation && Number(request.headers.get("content-length"))>26*1024*1024) throw new ApiError(413,"This upload is too large.");
    const headers=new Headers(); if(type) headers.set("Content-Type",type); headers.set("Accept",request.headers.get("accept")??"application/json");
    // Buffer once so an authentication rejection can be retried with identical multipart boundaries.
    const body=mutation?await request.arrayBuffer():undefined;
    if(body && body.byteLength>26*1024*1024) throw new ApiError(413,"This upload is too large.");
    const upstream=await authenticated(id,"/"+path.join("/")+request.nextUrl.search,{method:request.method,headers,body});
    if(upstream.status>=300 && upstream.status<400) throw new ApiError(502,"The API returned an unexpected redirect.");
    if(!upstream.ok) throw normalizeError(await responseJson(upstream),upstream.status);
    if(upstream.status===204 || request.method==="HEAD") return new NextResponse(null,{status:upstream.status,headers:{"Cache-Control":"no-store"}});
    const contentType=upstream.headers.get("content-type")??"";
    if(contentType.includes("application/json")) return json(sanitize(learnerBoundary(path,request.method,await responseJson(upstream))),upstream.status);
    // Support media/download payloads, but never serve backend HTML as same-origin active content.
    if(!/^(image\/|audio\/|video\/|application\/(pdf|octet-stream)|text\/csv)/i.test(contentType)) throw new ApiError(502,"The API returned an unsupported response format.");
    return new NextResponse(upstream.body,{status:upstream.status,headers:{"Content-Type":contentType,"Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Content-Security-Policy":"sandbox",...(upstream.headers.get("content-disposition")?{"Content-Disposition":upstream.headers.get("content-disposition")!}:{})}});
  }catch(error){return errorResponse(error);}
}
export const GET=handle; export const POST=handle; export const PUT=handle; export const PATCH=handle; export const DELETE=handle; export const HEAD=handle;
