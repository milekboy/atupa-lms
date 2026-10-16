import "server-only";
import { randomUUID } from "node:crypto";
import { ApiError, normalizeSession } from "./contracts";
import { acquireLock, deleteSession, readSession, releaseLock, saveRotated } from "../auth/store";
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
export async function refreshSession(id: string, staleToken?: string): Promise<Session> {
  const owner = randomUUID(); const deadline = Date.now() + 25000;
  while (Date.now() < deadline) {
    const latest = await readSession(id); if (!latest) throw new ApiError(401,"Please log in again.");
    if (staleToken && latest.accessToken !== staleToken) return latest;
    if (await acquireLock(id,owner)) {
      try {
        const locked = await readSession(id); if (!locked) throw new ApiError(401,"Please log in again.");
        if (staleToken && locked.accessToken !== staleToken) return locked;
        const response = await upstream("/auth/refresh", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({refreshToken:locked.refreshToken}) });
        if (!response.ok) { await deleteSession(id); throw new ApiError(401,"Your session ended. Please log in again."); }
        const next = normalizeSession(await responseJson(response)); next.expiresAt = locked.expiresAt;
        if (next.user.id !== locked.user.id || !await saveRotated(id,owner,next)) throw new ApiError(401,"Please log in again."); return next;
      } catch { await deleteSession(id); throw new ApiError(401,"Your session could not be renewed. Please log in again."); }
      finally { await releaseLock(id,owner); }
    }
    await new Promise(resolve => setTimeout(resolve,50));
  }
  throw new ApiError(503,"Your session is being updated. Please try again.");
}
export async function authenticated(id: string, path: string, init: RequestInit = {}) {
  let session = await readSession(id); if (!session) throw new ApiError(401,"Please log in again.");
  let refreshed = false;
  if (session.accessExpiresAt <= Date.now()+10000) { session=await refreshSession(id,session.accessToken); refreshed=true; }
  const send = (s: Session) => { const headers = new Headers(init.headers); headers.set("Authorization",`Bearer ${s.accessToken}`); return upstream(path,{...init,headers}); };
  let response = await send(session);
  if (response.status===401 && !refreshed) { session=await refreshSession(id,session.accessToken); response=await send(session); }
  if (response.status===401) { await deleteSession(id); throw new ApiError(401,"Your session ended. Please log in again."); }
  return response;
}
