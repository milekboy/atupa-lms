"use client";
import {publishSessionChange} from "./session-events";
import {ApiError} from "@/lib/api/contracts";
// The lock spans the fetch and cookie update, including logout, across same-origin tabs.
export async function sessionFetch(input:string,init:RequestInit={},renew=true):Promise<Response>{
 let renewed=false;
 const run=async()=>{const send=()=>fetch(input,{...init,credentials:"same-origin",signal:init.signal??AbortSignal.timeout(60000)});let response=await send();
  if(renew&&response.status===409){const body=await response.clone().json().catch(()=>null);if(body?.errors?.includes("SESSION_REFRESH_REQUIRED")){if(!navigator.locks)throw new ApiError(401,"Please sign in again to continue.");const refreshed=await fetch("/api/auth/refresh",{method:"POST",credentials:"same-origin",signal:AbortSignal.timeout(30000)});if(!refreshed.ok)return refreshed;renewed=true;response=await send();}}
  return response;
 };
 const response=await (navigator.locks?navigator.locks.request("atupa-session",run):run());
 if(renewed||response.ok&&init.method?.toUpperCase()==="POST"&&["/api/auth/login","/api/auth/logout","/api/auth/refresh"].includes(input)||response.status===401&&input!=="/api/auth/session")publishSessionChange();
 return response;
}
