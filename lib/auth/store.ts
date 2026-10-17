import "server-only";
import {openSession,sealSession} from "./cookie-codec";
import type {Session} from "@/types/auth";
// Stateless: no database, process-local sessions or distributed cache.
export async function readSession(value:string){return openSession(value);}
export async function createSession(session:Session){return sealSession(session);}
