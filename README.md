# ATUPA LMS frontend

A Next.js 16.4 / React 19 / TypeScript application for Nigerian language and cultural learning. The MVP launches **free** (owner decision, 20 October 2026); individual payments are excluded and school subscriptions remain phase 2. Frontend implementation does not constitute release acceptance: see [release readiness](docs/step-21-review.md) and [API gates](docs/api-notes.md).

## Run locally

Use Node.js 20.9+ and npm. Install the lockfile dependencies with `npm ci`. Copy `.env.example` to `.env.local`, configure the server-only values, then run `npm run dev` and open http://localhost:3000. For production, run `npm run build` then `npm start`.

| Variable | Responsibility |
|---|---|
| `API_BASE_URL` | Backend URL including `/api/v1` exactly once. Default is the supplied Render API. Browser requests use same-origin frontend routes; no public token/base variable is needed. |
| `APP_ORIGIN` | Exact frontend origin, such as `https://atupa-lms.vercel.app`, without a path. Set the actual deployment origin for each environment. |
| `SESSION_SECRET` | Stable cryptographically random secret, at least 32 characters, shared across instances of a deployment. Generate privately using the command in `.env.example`. Never commit its output. |
| `API_TIMEOUT_MS` | Bounded upstream timeout; default 15000ms, maximum 20000ms. |

Set these in Vercel's matching environment and redeploy after changes. Production requires HTTPS and a valid secret/origin. Redis is not used. Do not deploy synthetic test-server secrets or simulation URLs.

## Routes and roles

Public routes include `/`, `/courses`, `/courses/:id`, `/login`, `/register`, `/register/school`, recovery/setup links and `/certificates/verify/:code`. `/scan/:code` continues into the authorized card flow.

| Role | Main workspace |
|---|---|
| Learner | My courses, lesson/practice/quiz attempts, progress, search, vocabulary, culture, GameCards/games, certificates, parent linking and assignments |
| Parent | Linked children, learning summaries and notifications |
| Teacher | Course/media authoring, classes, assignments, scoped reports and card QR tools |
| School admin | School/members/classes and scoped school reports |
| Content creator | Course/media and library publishing tools |
| Super admin | User/school/language/library management, reports, certificate revocation and free-launch access review |

The exact route/role allowlists are in `lib/auth/roles.ts` and `lib/dashboard/navigation.ts`. Navigation visibility is not authorization. The server transport rejects unsupported operations; the backend must enforce ownership, school boundaries and entitlements on every resource. Existing UI supports demonstrated contracts only; the API notes identify remaining formats and permissions.

## Sessions and media

Login stores access/refresh credentials in an AES-GCM encrypted HttpOnly cookie, Secure with `__Host-` prefix in production and SameSite=Lax. Tokens are never browser JSON or localStorage state. Same-origin mutation checks and a fixed upstream base protect the proxy. Web Locks coordinate same-origin refresh/logout. Backend expiry and revocation remain authoritative; a copied encrypted cookie cannot be centrally revoked by this stateless frontend. See [session details](docs/step-03-review.md).

Media supports validated image/audio/video selection and previews, signed direct upload/confirmation and a bounded multipart fallback (25 MB direct; 4 MB server fallback). Ambiguous confirmation can be retried without uploading again. Actual provider uploads, lesson attachment contracts and playback still need live acceptance; see [media review](docs/step-07-review.md).

## Checks

- `npm run lint` — full ESLint.
- `npm run typecheck` — TypeScript, after generating Next types with a build on a fresh checkout.
- `npm run test:contracts` — normalization, serialization, role and security contracts.
- `npm run build` — production compilation and TypeScript.
- `npm run test:integration` — after a build, runs existing local Postman simulations and the real production frontend on ports 4900/3100. Requires Postman CLI 1.70+ on PATH. Refuses occupied test ports and leaves port 3000 untouched. Logs go to a temporary directory printed by the runner. `npm run test:integration -- schools assignments` selects specific simulations.

Simulation accounts and content are synthetic. These checks prove frontend behavior against the saved/expected contracts, not the deployed backend. Never run the entire supplied destructive Postman collection against shared data. Keep live test credentials outside the repository and use isolated accounts/records.

## UI conventions and release

Use the shared CustomSelect (or the option-compatible Select wrapper) for dropdowns, shared dialogs for focus restoration/trapping, server-authoritative rewards/completion, and explicit loading/empty/error states. Brand tokens and reduced-motion rules live in `app/globals.css`; retain long-language/diacritic support.

Before release, complete the real-account journeys, upload/email/QR checks, cross-account authorization, free-content access and product acceptance in [Step 21](docs/step-21-review.md). [Verification matrix](docs/verification-matrix.md) distinguishes historical collection examples, local simulation evidence and outstanding live checks. Do not mark the plan complete until essential gates have passed or the owner explicitly re-scopes them.
