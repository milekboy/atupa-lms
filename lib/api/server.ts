import "server-only";
import { ApiError, normalizeSession } from "./contracts";
import { readSession } from "../auth/store";
import type { Session } from "@/types/auth";

export async function upstream(path: string, init: RequestInit = {}): Promise<Response> {
  const base = (process.env.API_BASE_URL ?? "https://atupa-lms-backend.onrender.com/api/v1").replace(/\/$/, "");
  const url = new URL(base); if (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost","127.0.0.1"].includes(url.hostname))) throw new ApiError(503,"The API destination is not configured safely.");
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) throw new ApiError(400,"Invalid API path.");
  const timeout = Math.min(20000,Math.max(100,Number(process.env.API_TIMEOUT_MS) || 15000));
  try { return await fetch(base + path, { ...init, cache: "no-store", redirect: "manual", signal: AbortSignal.timeout(timeout) }); }
  catch (error) { if (error instanceof Error && ["TimeoutError","AbortError"].includes(error.name)) throw new ApiError(504,"The service took too long. Please try again."); throw new ApiError(502,"The service is unavailable. Please try again."); }
}
export async function responseJson(response: Response): Promise<unknown> {
  try { return await response.json(); } catch { throw new ApiError(502,"The service returned an unreadable response."); }
}
export async function refreshSession(value:string):Promise<Session>{
 const old=await readSession(value);if(!old)throw new ApiError(401,"Please log in again.");
 if(old.accessExpiresAt>Date.now()+10000)return old;
 const response=await upstream("/auth/refresh",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refreshToken:old.refreshToken})});
 const body=await responseJson(response);if(!response.ok){if([400,401,403].includes(response.status))throw new ApiError(401,"Your session ended. Please sign in again.");throw new ApiError(503,"Your session could not be renewed. Please try again.");}
 const next=normalizeSession(body);if(next.user.id!==old.user.id)throw new ApiError(401,"Please sign in again.");next.expiresAt=old.expiresAt;return next;
}
export async function authenticated(value:string,path:string,init:RequestInit={}){
 const session=await readSession(value);if(!session)throw new ApiError(401,"Please log in again.");
 if(session.accessExpiresAt<=Date.now()+10000)throw new ApiError(409,"Your session needs to be renewed.",["SESSION_REFRESH_REQUIRED"]);
 const headers=new Headers(init.headers);headers.set("Authorization",`Bearer ${session.accessToken}`);
 const response=await upstream(path,{...init,headers});
 if(response.status===401)throw new ApiError(401,"Your session ended. Please sign in again.");return response;
}
