import "server-only";
import { randomBytes } from "node:crypto";
import { createClient } from "redis";
import type { Session } from "@/types/auth";
type Memory = { sessions: Map<string, Session>; locks: Map<string, { owner: string; until: number }> };
const globalStore = globalThis as typeof globalThis & { atupaMemory?: Memory; atupaRedis?: ReturnType<typeof createClient>; atupaRedisConnection?: Promise<unknown> };
function memory() { return globalStore.atupaMemory ??= { sessions: new Map(), locks: new Map() }; }
function memoryEnabled() {
  if (process.env.SESSION_STORE === "memory") { if (process.env.NODE_ENV === "production") throw new Error("Production requires Redis sessions."); return true; }
  if (!process.env.REDIS_URL && process.env.NODE_ENV !== "production") return true;
  return false;
}
async function redis() {
  if (!process.env.REDIS_URL) throw new Error("REDIS_URL is required in production.");
  if (!globalStore.atupaRedis) { globalStore.atupaRedis = createClient({ url: process.env.REDIS_URL, socket: { connectTimeout: 3000, reconnectStrategy: false } }); globalStore.atupaRedis.on("error", () => {}); }
  if (!globalStore.atupaRedis.isOpen) globalStore.atupaRedisConnection ??= globalStore.atupaRedis.connect().finally(() => { globalStore.atupaRedisConnection = undefined; });
  if (globalStore.atupaRedisConnection) await globalStore.atupaRedisConnection;
  return globalStore.atupaRedis;
}
const key = (id: string) => `atupa:session:${id}`;
export const newSessionId = () => randomBytes(32).toString("hex");
export async function readSession(id: string): Promise<Session | null> {
  if (!/^[a-f0-9]{64}$/.test(id)) return null;
  const raw = memoryEnabled() ? memory().sessions.get(id) : await (await redis()).get(key(id));
  const session: Session | undefined = typeof raw === "string" ? JSON.parse(raw) : raw;
  if (!session || session.expiresAt <= Date.now()) { if (session) await deleteSession(id); return null; } return session;
}
export async function createSession(session: Session): Promise<string> {
  const id = newSessionId();
  if (memoryEnabled()) memory().sessions.set(id, session); else await (await redis()).set(key(id), JSON.stringify(session), { PX: Math.max(1, session.expiresAt - Date.now()) }); return id;
}
export async function deleteSession(id: string) { if (memoryEnabled()) memory().sessions.delete(id); else await (await redis()).del(key(id)); }
export async function acquireLock(id: string, owner: string) {
  if (memoryEnabled()) { const current = memory().locks.get(id); if (current && current.until > Date.now()) return false; memory().locks.set(id, { owner, until: Date.now() + 30000 }); return true; }
  return await (await redis()).set(`${key(id)}:lock`, owner, { NX: true, PX: 30000 }) === "OK";
}
export async function saveRotated(id: string, owner: string, session: Session) {
  if (memoryEnabled()) { const lock = memory().locks.get(id); if (!memory().sessions.has(id) || lock?.owner !== owner || lock.until <= Date.now()) return false; memory().sessions.set(id, session); return true; }
  return await (await redis()).eval("if redis.call('get',KEYS[2]) == ARGV[1] and redis.call('exists',KEYS[1]) == 1 then redis.call('psetex',KEYS[1],ARGV[3],ARGV[2]); return 1 else return 0 end", { keys: [key(id), `${key(id)}:lock`], arguments: [owner, JSON.stringify(session), String(Math.max(1,session.expiresAt-Date.now()))] }) === 1;
}
export async function releaseLock(id: string, owner: string) {
  if (memoryEnabled()) { if (memory().locks.get(id)?.owner === owner) memory().locks.delete(id); }
  else await (await redis()).eval("if redis.call('get',KEYS[1]) == ARGV[1] then return redis.call('del',KEYS[1]) else return 0 end", { keys: [`${key(id)}:lock`], arguments: [owner] });
}
