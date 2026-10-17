import {test} from "node:test";
import assert from "node:assert/strict";
import {sealSession,openSession} from "../lib/auth/cookie-codec";
const session={user:{id:"test-user",role:"learner" as const,firstName:"Ada",lastName:"Test"},accessToken:"private-access",refreshToken:"private-refresh",accessExpiresAt:Date.now()+900000,expiresAt:Date.now()+86400000};
test("encrypted sessions are confidential, authenticated, expiring and key-bound",()=>{
 process.env.SESSION_SECRET="test-only-stable-encryption-secret-123456789";
 const cookie=sealSession(session);assert.ok(cookie.startsWith("v1."));assert.deepEqual(openSession(cookie),session);assert.doesNotMatch(cookie,/private-access|private-refresh|test-user/);assert.notEqual(cookie,sealSession(session));
 const raw=Buffer.from(cookie.slice(3),"base64url");raw[raw.length-1]^=1;assert.equal(openSession("v1."+raw.toString("base64url")),null);assert.equal(openSession(cookie,session.expiresAt+1),null);assert.equal(openSession("old-opaque-session-id"),null);
 process.env.SESSION_SECRET="a-different-test-only-encryption-secret-123456";assert.equal(openSession(cookie),null);
 process.env.SESSION_SECRET="test-only-stable-encryption-secret-123456789";assert.deepEqual(openSession(cookie),session);
 assert.throws(()=>sealSession({...session,accessToken:"a".repeat(5000)}),/cookie size/);
});
test("production fails clearly without a strong session secret",()=>{
 const mode=process.env.NODE_ENV,secret=process.env.SESSION_SECRET;
 try{Object.assign(process.env,{NODE_ENV:"production",SESSION_SECRET:"short"});assert.throws(()=>sealSession(session),/SESSION_SECRET/);delete process.env.SESSION_SECRET;assert.throws(()=>sealSession(session),/SESSION_SECRET/);}finally{if(mode===undefined)Reflect.deleteProperty(process.env,"NODE_ENV");else Object.assign(process.env,{NODE_ENV:mode});if(secret===undefined)delete process.env.SESSION_SECRET;else process.env.SESSION_SECRET=secret;}
});

