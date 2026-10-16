import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "./contracts";
import { sessionCookie } from "../auth/session";
export function json(value:unknown,status=200) { return NextResponse.json(value,{status,headers:{"Cache-Control":"no-store"}}); }
export function clearCookie(response:NextResponse) { response.cookies.set(sessionCookie,"",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:0}); return response; }
export function errorResponse(error:unknown) {
  const known=error instanceof ApiError; const status=known?error.status:503;
  const response=json({success:false,statusCode:status,message:known?error.message:"The session service is unavailable. Please try again.",...(known && error.errors?{errors:error.errors}:{})},status);
  return status===401?clearCookie(response):response;
}
export function checkOrigin(request:NextRequest) {
  const configured=process.env.APP_ORIGIN;
  if(process.env.NODE_ENV==="production" && !configured) throw new ApiError(503,"The application origin is not configured.");
  const origin=request.headers.get("origin"); const expected=configured ? new URL(configured).origin : request.nextUrl.origin;
  if(origin!==expected || request.headers.get("sec-fetch-site")==="cross-site") throw new ApiError(403,"This request must come from ATUPA LMS.");
}
