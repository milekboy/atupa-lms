"use client";
import { redirect } from "next/navigation";
import { ApiError, normalizeData, normalizeError } from "./contracts";
export async function api<T>(path:string,init:RequestInit={}):Promise<T> {
  if(!/^\/[A-Za-z0-9_/-]+(?:\?.*)?$/.test(path) || path.includes("..")) throw new ApiError(400,"Invalid API path.");
  const headers=new Headers(init.headers); headers.delete("Authorization");
  if(init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) headers.set("Content-Type","application/json");
  let response:Response;
  try {response=await fetch(`/api/backend${path}`,{...init,headers,credentials:"same-origin",signal:init.signal??AbortSignal.timeout(60000)});}catch{throw new ApiError(502,"Unable to connect. Please try again.");}
  const value=await response.json().catch(()=>null);
  if(response.status===401) {redirect(`/login?returnTo=${encodeURIComponent(window.location.pathname+window.location.search)}`);}
  if(!response.ok) throw normalizeError(value,response.status); return normalizeData<T>(value);
}
