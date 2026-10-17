import "server-only";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { ApiError, safeUser } from "../api/contracts";
import { authenticated, responseJson } from "../api/server";
import { canAccess } from "./roles";
export const sessionCookie = process.env.NODE_ENV === "production" ? "__Host-atupa_session" : "atupa_session";
export async function requireUser(path = "/dashboard") {
  await connection();
  const id=(await cookies()).get(sessionCookie)?.value;
  if (!id) redirect(`/login?returnTo=${encodeURIComponent(path)}`);
  try {
    const response=await authenticated(id,"/users/me");
    if (response.status===403) return null;
    if (!response.ok) throw new ApiError(response.status,"Account verification is unavailable.");
    const body=await responseJson(response) as {data:unknown}; const user=safeUser(body.data);
    return canAccess(path,user.role) ? user : null;
  } catch (e) { if(e instanceof ApiError&&e.status===409)redirect(`/session/renew?returnTo=${encodeURIComponent(path)}`); if(e instanceof ApiError && e.status===401) redirect(`/api/auth/expired?returnTo=${encodeURIComponent(path)}`); throw e; }
}
