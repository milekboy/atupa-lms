import { isRole } from "../auth/roles";
import type { Session, User } from "@/types/auth";
export class ApiError extends Error {
  constructor(public status: number, message: string, public errors?: string[]) { super(message); }
}
export function object(value: unknown): Record<string, unknown> { return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}; }
export function safeUser(value: unknown): User {
  const u = object(value);
  if (typeof u.id !== "string" || !isRole(u.role)) throw new ApiError(502, "The server returned an invalid account profile.");
  return { id: u.id, role: u.role, firstName: typeof u.firstName === "string" ? u.firstName : "", lastName: typeof u.lastName === "string" ? u.lastName : "", ...(typeof u.email === "string" ? { email: u.email } : {}) };
}
export function normalizeSession(value: unknown, now = Date.now()): Session {
  const envelope = object(value); const data = object(envelope.data); const session = data.session ? object(data.session) : data;
  if (envelope.success !== true || typeof session.accessToken !== "string" || !session.accessToken || typeof session.refreshToken !== "string" || !session.refreshToken || typeof session.expiresIn !== "number" || session.expiresIn <= 0) throw new ApiError(502, "The server returned an invalid session.");
  return { user: safeUser(session.user), accessToken: session.accessToken, refreshToken: session.refreshToken, accessExpiresAt: now + session.expiresIn * 1000, expiresAt: now + 7 * 86400000 };
}
export function normalizeError(value: unknown, status: number): ApiError {
  const v = object(value); const message = typeof v.message === "string" ? v.message : "The service could not complete this request.";
  return new ApiError(status, message, Array.isArray(v.errors) ? v.errors.filter((e): e is string => typeof e === "string") : undefined);
}
export function normalizeData<T>(value: unknown): T { const body = object(value); return (body.success === true && "data" in body ? body.data : value) as T; }
export function sanitize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).filter(([key]) => !/^(accessToken|refreshToken|password|passwordHash|resetToken|authorization)$/i.test(key)).map(([key, v]) => [key, sanitize(v)]));
  return value;
}
