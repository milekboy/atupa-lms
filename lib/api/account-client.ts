"use client";
import {ApiError,normalizeError} from "./contracts";
export async function accountRequest<T>(action:string,body?:unknown,method="POST"):Promise<{message?:string;data:T}>{let response:Response;try{response=await fetch(`/api/account/${action}`,{method,headers:{"Content-Type":"application/json"},...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(45000)});}catch{throw new ApiError(502,"Unable to connect. Please try again.");}const value=await response.json().catch(()=>null);if(!response.ok)throw normalizeError(value,response.status);return value;}
