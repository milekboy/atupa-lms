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


Lesson media attachments/playback, media-bearing multiple-choice questions and server-based quiz resume/timers are implemented. See [29 October media/quiz QA](docs/media-quiz-fixes-review.md) for test steps, source-format fallback and remaining live response/upload checks. Run `npm run test:integration -- media-learning` to repeat the isolated scenarios.

## Admin console foundation (16 November 2026)

`/admin` is a separate entry point using the shared dashboard shell and existing sessions. Super Admin, Support Admin (`support_admin`), Content Creator and School Admin can request their current `/admin/me/permissions` contract. Only implemented, explicitly permitted, known menu destinations appear. Existing `/dashboard` functionality remains available. Support Admin business operations remain blocked until subsequent admin steps define their grants. Public registration cannot create this role.

See [admin delivery plan](docs/admin-plan.md), [Step 1 review and manual tests](docs/admin-step-01-review.md), and [coverage matrix](docs/admin-implementation-matrix.md). Run `npm run test:admin-foundation` after building; add `-- --regression` for all existing HTTP fixture groups. The runner uses local synthetic mock sources directly in Node and requires free ports 3100/4900. Full live permission/school-boundary acceptance remains outstanding.


## Admin Step 2 update — 16 November 2026

User invitations and management are available at `/admin/users`; teacher/school verification is at `/admin/verifications` and self-submission at `/dashboard/verification`. See [Step 2 review and what to test](docs/admin-step-02-review.md). Existing Super Admin access is required to invite staff; initial bootstrap and live email delivery remain backend responsibilities. Role/deactivation/delete safeguards and private document previews remain clarification gates. Existing LMS workflows are preserved.


## Admin Step 3 update — 17 November 2026

Super Admin school/class onboarding and validated bulk learner invitations are available at `/admin/onboarding`, linked from Admin console → Users. Existing school/member/class/course workspaces are reused. Class creation supports teacher selection; bulk imports use the actual CSV template, a required dry run and an explicit confirmed save. CSV is conservatively limited to 512 KB pending C12. See [Step 3 review and what to test](docs/admin-step-03-review.md). Live grants, school membership semantics, atomic imports, audit and delivered setup emails remain acceptance gates.


## Admin Step 4 update — 17 November 2026

The existing Course studio now preserves audience/owner/review metadata, linked vocabulary and media-block extension fields; supports lesson-block movement and protected saved-lesson preview with the shared learner renderer; and reports returned review status accurately. Existing media/library/assessment/GameCard tools are reused. Admin home links authorized publishers to those workspaces. See [Step 4 review and what to test](docs/admin-step-04-review.md). Complete formats, hierarchy reorder, larger upload limits and review/access policies remain C01/C04/C05/C06 gates; existing LMS journeys are preserved.


## Admin Step 5 update — 17 November 2026

Super Admin content review is available at `/admin/reviews` from console home. It shows returned queue groups/totals and supports documented lesson, library and Public-visibility decisions with comments, confirmation, fresh pending-state checks and known self-review denial. Library tools show actual returned review status/feedback. Ordinary course approval, unsupported kinds and incomplete queue identities remain unavailable pending C01/C06. See [Step 5 review and what to test](docs/admin-step-05-review.md); backend atomic authorization, audit, notification and publication-policy acceptance remain open.


## Admin Step 6 update — 17 November 2026

Teachers can change owned course audiences or request reviewed Public visibility from Course studio. Super Admin oversight is at `/admin/courses`, with reason-backed Private/School changes; direct Public overrides await C06 clarification. Catalog/search attribution uses actual backend identity flags. Public-only projections are separated from authenticated course projections to preserve authorized prior enrollment and progress. See [Step 6 review and what to test](docs/admin-step-06-review.md); real grants, school scope, notifications, retained access and Public policy remain C01/C06 acceptance gates.


## Admin Step 7 update — 17 November 2026

Super Admin financial oversight is at `/admin/finance`: read-only payments, documented subscription grants/cancellations and plan creation. Prices use integer kobo; learner checkout remains disabled. Price/active-state edits are guarded for feature-bearing plans because the supplied price-only PATCH response clears features; empty-feature plans support verified updates. See [Step 7 review and what to test](docs/admin-step-07-review.md). Feature-preserving DTOs, real entitlement/cancellation/school behavior, grant reconciliation and audit evidence remain C01/C10 gates.


## Admin Step 8 update — 18 November 2026

Super Admin console home now shows the new `/admin/overview` totals and needs-attention counts, isolating inconsistent or undefined metrics. Report downloads are at `/admin/exports`, People & access, Finance and the existing scoped Learning reports. The server validates access, filters, attachment type/bytes and safe filenames; current-page printing stays separate. See [Step 8 review and what to test](docs/admin-step-08-review.md). C01/C08/C09, actual backend file completeness/readability and the 10,000-user performance benchmark remain acceptance gates.


## Admin Step 9 update — 18 November 2026

Learner/parent reporting and private receipt history are at `/dashboard/safety`. Super Admin queue/detail, assignment/comments/returned-outcome resolution, alert acknowledgement and read-only backend activity are at `/admin/safety-reports`, `/admin/alerts` and `/admin/activity-log`. Current permission/profile checks and record reconciliation guard actions. Screenshot upload is off by default until private storage/delivery is confirmed; new responses never expose screenshot URLs. See [Step 9 review and what to test](docs/admin-step-09-review.md). C01/C05/C07/C11, actual enforcement/notifications, the 24-hour SLA and complete protected backend audit capture remain release gates.


## Admin Step 10 update — 18 November 2026

`npm run test:admin-release` runs and records local lint/contracts/build/type/HTTP/browser verification. `npm run test:admin-browser` runs the repeatable browser journeys with installed Playwright/Chrome. Admin return URLs now preserve supported filters and report IDs without allowing external/unknown redirect queries; Support home links respect Super-only review scope. All 29 requirement records have dated test mappings and explicit deployment gaps. See [Step 10 review and what to test](docs/admin-step-10-review.md) and [release acceptance checklist](docs/admin-release-acceptance.md). Local success does not approve production release: private media, actual permissions/effects/notifications, review/recovery/audit guarantees and product/performance targets remain open.
