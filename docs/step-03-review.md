# Session architecture — updated 2026-10-17

Redis was removed at the user's request. Earlier Redis/distributed-lock verification notes describe the superseded implementation.

## Current behavior

- AES-256-GCM authenticated encryption seals the session into an HttpOnly, SameSite=Lax cookie. Production uses Secure and the __Host- prefix. Nonces are random for each seal; associated data identifies the cookie format. Tokens never appear in client JSON, page props, localStorage or sessionStorage.
- SESSION_SECRET is required in production, at least 32 cryptographically random characters. Every server instance uses the same deployment secret. No process-local session database or Redis is used. Local development may use an ephemeral key; restarting then requires sign-in.
- Cookies expire after seven days at most; rotation preserves the original deadline. Tampered/expired cookies and old opaque session IDs are rejected. The encrypted value is bounded to 3800 characters to remain within browser cookie limits; oversized upstream sessions fail clearly rather than silently truncate.
- Protected backend requests remain server-mediated, with fixed upstream base, caller Authorization replacement, CSRF origin checks, safe response projection, bounded uploads and timeouts. Role and ownership checks remain backend-authoritative; dashboard identity is checked through users/me.
- Access expiry produces a 409 SESSION_REFRESH_REQUIRED signal before forwarding any mutation. The browser request coordinator serializes authenticated requests, refresh and logout across same-origin tabs with Web Locks. It renews once, receives a new cookie and retries the original buffered request. Fresh refresh requests do not rotate backend tokens again.
- Server-rendered protected pages redirect expired access to /session/renew, which performs a locked POST refresh and returns to a validated dashboard path. Browsers without Web Locks reauthenticate on expiry rather than risk simultaneous refresh-token reuse. Unexpected backend 401 responses require sign-in, not blind rotation/retry.

## Revocation tradeoff

Without a shared session database the frontend cannot centrally revoke a copied encrypted cookie. Logout clears the browser cookie and calls backend logout; successful password change and account deletion also clear the cookie. Backend revocation and token expiry are authoritative. If backend logout is unavailable, local logout still clears the cookie, but a copied cookie may remain usable until the backend rejects its credentials or it expires. Frontend locking is not a distributed lock for arbitrary HTTP clients; live backend revocation across devices and tabs remains a release check. No claim of Redis-era server-side invalidation is retained.

## Vercel setup

- APP_ORIGIN=https://atupa-lms.vercel.app (use the actual deployed origin, without trailing slash).
- API_BASE_URL=https://atupa-lms-backend.onrender.com/api/v1.
- SESSION_SECRET: generate privately with Node crypto randomBytes(32), encoded as base64url; never commit or paste it into chat.
- REDIS_URL and SESSION_STORE are not used. Redeploy after changing environment variables. Secret rotation invalidates all existing cookies; existing opaque cookies also require a new login.

## Validation

21 contract tests pass, including confidentiality, fresh nonces, round-trip decryption, tampering, expiry, key changes, payload size and missing production secret. Local Postman HTTP checks cover login, safe profile, authorization replacement, 403 preservation, validation, uploads, timeout, explicit renewal and eight concurrent fresh requests, failed refresh and backend-owned logout revocation. Seven account scenarios cover registration, profile changes, recovery, password change and deletion using synthetic accounts. No real account credentials are used.

Run npm run simulate:auth and npm run dev:auth-test, then npm run test:session-http and npm run test:account-http. For production-mode checks, build first and use npm run start:session-test instead of the dev test server. Test launchers use a public synthetic secret and local fixture backend; never deploy that secret. Restart the simulation before repeating single-use reset-token tests.

Production-mode browser verification with synthetic fixtures: immediate access expiry renewed through /session/renew and reached the dashboard; reload retained the encrypted session; logout returned to sign-in. Production build/TypeScript and lint passed. Real deployed backend revocation remains unverified.
