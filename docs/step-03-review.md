# Step 3 session and API foundation

## Delivered

- Opaque 256-bit session cookie. Access/refresh tokens live only in the server session store. HttpOnly, SameSite=Lax, path=/; production also uses Secure and the __Host- cookie prefix.
- Login, safe profile, refresh, logout and expired-session handling at `/api/auth/[action]`. School-registration response normalization is implemented/tested; registration routes remain Step 4.
- Fixed API origin/base, namespace/path restrictions, upstream redirect rejection, no forwarded browser Authorization/Cookie headers, JSON error mapping, timeout handling, multipart body preservation and bounded upload sizes. JSON output removes token/password fields; safe profile explicitly selects allowed fields.
- Shared browser API client and server transport. A 401 triggers at most one renewal/retry; 403 preserves the session. Cross-origin mutations are rejected. The standalone login checkpoint allows review before Step 4's fuller onboarding UI.
- `/dashboard` uses an optimistic proxy cookie check plus request-time backend profile verification. Every future protected page/data loader must call `requireUser(actualPath)` before retrieving data; layouts alone are not a data-access boundary. Role helpers govern UI/page access; backend school/ownership permissions remain authoritative.
- Production Redis sessions with shared refresh lock and atomic conditional rotation. Lock owners cannot overwrite a deleted session or resurrect logout. Explicit refresh is a no-op for a still-fresh session. Ambiguous/failed refresh discards the session rather than reuse a rotated token.
- A maximum seven-day application session lifetime, independent of the backend's refresh-token lifetime. The backend can expire/revoke earlier; no assumption is made that its refresh token lasts seven days.

## Configuration

Copy `.env.example` to a gitignored `.env.local` for local setup. Defaults use the verified staging `/api/v1` base. Never put real credentials in the template or tests.

- `API_BASE_URL`: server-only backend base including `/api/v1` exactly once.
- `APP_ORIGIN`: actual browser origin, required in production for mutation-origin checks.
- `REDIS_URL`: required in production; use a private authenticated/TLS Redis service and protect its data/backups. No production memory fallback exists.
- `API_TIMEOUT_MS`: defaults to 15000; bounded to 100–20000ms.
- `SESSION_STORE=memory`: optional local development/test mode only. Without REDIS_URL, development defaults to this mode. One process only; restarting clears sessions. Not suitable for deployment or multi-worker testing.

Redis downtime returns a controlled 503 rather than permitting access. An in-flight refresh may finish after a logout but cannot restore the removed session. Backend logout is best-effort after local invalidation.

## Verification evidence

- Six contract tests passed: ordinary/nested-school session shape, invalid roles/auth, response envelopes/arrays, error fields/token stripping, safe return URLs, and role access.
- Eight real-HTTP scenarios passed against a local Postman simulation: anonymous/CSRF rejection; safe profile and replaced Authorization; 403 session preservation and 422/non-JSON failures; multipart preservation; 504 timeout; eight concurrent expired requests with exactly one refresh; failed-refresh cookie/session removal; logout invalidation. The Node runner reports nine tests including the parent suite.
- The real Next.js app called the stand-in over HTTP; Postman emitted request events for login, profile, refresh, logout, upload and failure paths. The owner workspace search was skipped because no owner mock/workspace was provided; the local stand-in is derived from supplied collection shapes with synthetic fixtures and explicit injected failures. Nothing was deployed or published to Postman.
- Browser checks with synthetic fixtures confirmed sign-in, authenticated name/role checkpoint, persistence after page reload, and logout. No production/staging credentials were used.
- A development reload loop reset typed fields after adding test sources. Restricting Tailwind scanning to app/components and restarting stabilized the browser. Request-time connection marking avoids cache-component prerendering of session expiry checks.
- Production build/TypeScript and ESLint are checked after final changes; see terminal verification for pass/failure.

## Not yet verified

- Live staging login/refresh and all six real roles; isolated accounts are still not supplied.
- Redis connection, distributed locking and failover against a real service. No Redis instance was supplied; Docker is installed but its daemon is not running. HTTP concurrency tests used the development store, so do not claim multi-instance Redis verification.
- Deployed HTTPS cookie behavior, production APP_ORIGIN/proxy configuration and multi-instance refresh/logout races. Verify before release.
- Real audio/video uploads remain Step 7. This step verifies multipart transport with a synthetic file, not Cloudinary processing.
- Registration, recovery and full profile editing remain Step 4; dashboard shell remains Step 5.

## Repeat local tests

Use separate terminals from the project directory; stop the normal `npm run dev` first because Next.js allows only one development server per checkout.

1. `npm run simulate:auth` (requires installed Postman CLI >=1.70).
2. `npm run dev:auth-test` (starts port 3100 against the simulation only).
3. `npm run test:contracts` then `npm run test:session-http`.

These commands do not create staging accounts. Synthetic fixture login for the local simulation only: `learner@example.test` / `fixture-password`. Never expect it to work against staging. Stop the test server/simulation after use, then run `npm run dev` to return to staging on port 3000. No environment file is modified by the test launcher.

## What to review

1. Open `/dashboard` while signed out: it should lead to `/login?returnTo=...`.
2. On `/login`, invalid credentials should show a clear error and retain the email.
3. With a valid staging account, sign in, reload the checkpoint, then log out. Returning to `/dashboard` should require login again.
4. In local simulation mode, verify fixture login/logout and run automated timeout/refresh/permission scenarios above.
5. Browser responses/storage must not contain access or refresh tokens. Only the opaque HttpOnly session identifier is set in a cookie.

There is no finished dashboard or registration page yet. Step 3 supplies the protected session boundary used by later screens.
