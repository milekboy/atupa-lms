# ATUPA LMS - MVP Functionality Completion Plan

## Goal

Bring the ATUPA LMS application from its current Next.js starter state to a complete, responsive MVP for learners, parents, teachers, school administrators, content creators, and super administrators. Use the available backend as the source of truth and meet the PRD and P1 user-story acceptance criteria.

Use the BiblePlus V2 plan and dashboard structure as the implementation reference, adapted to ATUPA's learning workflows and cream, forest-green, terracotta, and mustard identity. A working learner experience includes focused lessons, practice, quizzes, GameCards, progress, and certificates alongside the management dashboards.

---

# Current State and Source of Truth

- Project: `C:/Users/User/OneDrive/Desktop/Atupa LMS/atupa-lms`.
- Installed foundation: Next.js 16.4.2, React 19.3.0, TypeScript, Tailwind CSS 4, ESLint, and npm lockfile. Public homepage, course browsing and outlines are implemented.
- Product sources: `C:/Users/User/Downloads/ATUPA LMS — PRD.pdf`, especially section 34, and `C:/Users/User/Downloads/ATUPA_LMS_User_Stories.docx`, especially P1 stories US-01 through US-16, US-18, and US-19.
- API source: `C:/Users/User/Downloads/ATUPA LMS API.postman_collection.json`, containing 191 saved request examples across 20 folders. Examples and scripts are evidence of documented behavior, not a live verification report.
- Visual references: the supplied ATUPA website screenshot and `C:/Users/User/OneDrive/Desktop/Bible plus v2/bibleplus-admin-v2/plan.md` plus its dashboard shell. BiblePlus endpoints, role names, blue colors, and domain features do not apply to ATUPA.
- Step 1 contract documentation and public API verification are delivered; isolated-account and ownership-policy confirmation remains outstanding. Step 2 visual foundation is implemented and reviewed; see `docs/step-02-review.md`. Step 3 session/API foundation is implemented with local contract/HTTP verification; production cookie-secret configuration and real staging roles remain unverified. Step 4 account UI is implemented and locally tested, awaiting real email/link verification; Step 5 shell is implemented; Step 6 public discovery is implemented; Step 7 onward remain unstarted. Mark steps checked only when requirements and success criteria are met.

---

# Important Project Constraints

- Keep the existing Next.js App Router, TypeScript, Tailwind CSS, and npm setup. Read relevant guides in `node_modules/next/dist/docs/` before writing code, as required by `AGENTS.md`.
- Add React Icons, React Toastify, and `motion` when implementing the shared foundation. These packages are now installed. Import animation primitives from `motion/react`.
- Use the exact backend roles: `learner`, `parent`, `teacher`, `school_admin`, `content_creator`, and `super_admin`. Verify each endpoint's allowed roles rather than assuming all staff have equal access.
- Use a server-only `API_BASE_URL` for backend transport, defaulted in `.env.example` to `https://atupa-lms-backend.onrender.com/api/v1`. Paths below are relative to this base. Never generate `/api/v1/api/v1/...`.
- Keep access and refresh tokens server-side in protected session cookies or an equivalent server session. Never put tokens in localStorage, sessionStorage, rendered HTML, URLs, or logs.
- Route protected requests through one shared server transport/proxy that injects the Bearer token. Browser components should use same-origin application endpoints.
- Keep backend feature data authoritative. Browser storage may retain UI preferences such as theme, but must not masquerade as saved courses, submissions, progress, permissions, or achievements.
- Do not fabricate dashboard metrics, testimonials, activity records, certificates, game results, payment success, or unavailable features.
- Every data page must have loading, empty, recoverable-error, permission-denied, and success states where applicable.
- Every mutation needs pending state, duplicate-submission prevention, field errors where available, and concise success/failure feedback.
- Require named confirmation for destructive or high-impact operations. Keep forms open and preserve input on recoverable failure.
- Do not run the whole Postman collection against a shared environment as a smoke test: it creates accounts, changes content, and deletes records. Use isolated test accounts and data.
- Missing contracts and failed integrations belong in `docs/api-notes.md`; do not hide them behind dummy implementations.
- The PRD's phase 2 features are excluded: live classes, AI tutoring, automated pronunciation assessment, advanced analytics/gamification, native mobile apps, and additional language rollout.
- Search US-17 is P2 and payments US-20 require scope confirmation. They have conditional steps below and must not silently expand the required MVP.

---

# Design System

## Color tokens

Centralize semantic tokens in `app/globals.css`. Initial brand values are approximated from the supplied screenshot:

- `--color-brand: #294C35` - forest-green headings and sidebar.
- `--color-primary: #3E6B43` - primary actions and active controls.
- `--color-primary-hover: #315738` - primary hover state.
- `--color-primary-soft: #E7EDDF` - selected navigation and subtle emphasis.
- `--color-background: #F3F1DF` - cream application canvas.
- `--color-surface: #FFFFFF` - working cards, tables, editors, and dialogs.
- `--color-surface-muted: #F8F7EE` - quiet supporting surfaces.
- `--color-accent: #C56542` - terracotta emphasis.
- `--color-highlight: #E1C64E` - mustard highlights.
- `--color-text: #243429`, `--color-muted: #667064`, `--color-border: #DEDFCC`.
- Define success, warning, danger, focus, and disabled tokens separately. Status colors must convey actual status and retain sufficient contrast.

Use one complete `.dark` token set for dashboard themes. Keep cream and green branding recognizable without reducing contrast. Verify all final color combinations rather than assuming screenshot colors are accessible at every size.

## Typography and visual language

- Use an expressive serif for public headings and selected learner headings, paired with a legible sans-serif for navigation, forms, tables, and body text.
- Choose fonts that correctly render Yoruba, Igbo, and Hausa diacritics. Verify sample phrases and accented names at all used weights. Do not assume the BiblePlus Aeonik files are present or copy trial fonts without an appropriate license.
- Adapt BiblePlus's floating rounded sidebar, icon-first collapsed rail, hover expansion, top bar, and rounded main workspace. The main workspace should resize smoothly with sidebar expansion and collapse, as requested during Step 5 review.
- Use grouped role-specific navigation, clear page titles, concise supporting copy, primary actions, filters, summary cards, and a main data surface.
- Prefer thin borders, `rounded-2xl` containers, `rounded-xl` controls, restrained shadows, and generous spacing. Cultural patterns belong mainly on public/introductory surfaces and must not interfere with reading.
- Learner pages can feel welcoming and engaging. Staff pages should retain compact, professional information density.
- Do not add large hero headings to every management screen, bright gradients, heavy shadows, or decorative badges that resemble earned achievements.
- Use accessible React Icons with visible labels or accessible names. Clickable controls need pointer cursors and visible keyboard focus. Mobile touch targets should be at least 44px.

## Motion rules

- Use `motion/react` for major section entrance: opacity 0 to 1, vertical offset around 12px, and 220-300ms ease-out duration.
- Stagger major sections by roughly 40-60ms; do not animate every table cell or repeated data refresh.
- Use `AnimatePresence` for dialogs, menus, and mobile drawers; keep backdrop fades and panel movement subtle with no bounce.
- Honor reduced-motion preferences. Motion must not delay data access or keyboard interaction.

## Shared interaction patterns

- Use accessible dialogs with labelled title/description, focus trap, Escape handling, focus restoration, scroll lock, and safe backdrop handling.
- Use responsive desktop tables and mobile record cards or controlled table scrolling. The entire page must never overflow horizontally.
- Use backend pagination and totals where supplied. Debounce server search by about 300ms, cancel stale requests, and reset pagination when filters change.
- Keep page, search, and supported filters in URL parameters. Never label a filter of one loaded page as a search of all records.
- Show skeletons for initial loading, localized pending indicators for mutations, and retries for recoverable failures.

---

# Recommended Project Structure

```text
app/
  page.tsx
  courses/page.tsx
  courses/[courseId]/page.tsx
  login/page.tsx
  register/page.tsx
  register/school/page.tsx
  forgot-password/page.tsx
  reset-password/page.tsx
  certificates/verify/[code]/page.tsx
  scan/[code]/page.tsx
  api/auth/[...action]/route.ts
  api/backend/[...path]/route.ts
  dashboard/
    layout.tsx
    page.tsx
    courses/
    learn/[lessonId]/
    quizzes/
    games/
    progress/
    achievements/
    certificates/
    children/
    classes/
    assignments/
    content/
    users/
    schools/
    languages/
    reports/
    notifications/
    profile/
components/
  dashboard/
  learning/
  forms/
  ui/
hooks/
lib/
  api/client.ts
  api/server.ts
  api/endpoints.ts
  auth/session.ts
  auth/roles.ts
  formatters.ts
  validators.ts
types/
  api.ts
  auth.ts
  learning.ts
  school.ts
  domain.ts
docs/
  api-notes.md
  verification-matrix.md
proxy.ts
```

Frontend routes are proposed organization, not claims that matching backend endpoints exist. Use shared pages where contracts and permissions match. Keep role-specific data adapters and actions explicit rather than duplicating entire dashboards or relying on an unrestricted role switcher.

---

# [ ] Step 1 - Establish the MVP contract and verification baseline

**Status (2026-10-16):** Documentation and read-only baseline delivered in `docs/verification-matrix.md`, `docs/api-notes.md`, and `docs/live-checks.json`. All 63 source acceptance criteria and 191 saved requests are mapped. Four live GET checks passed 23 assertions. Pending: secure access to six isolated roles, confirmation of school/ownership policies, and product decisions for conditional search/payments. The replacement collection mentioned by the user has not yet been received. Do not mark authenticated workflows verified.

## Requirements

- Map the PRD must-haves and P1 stories to frontend routes, API methods, payloads, role access, and verification evidence in `docs/verification-matrix.md`.
- Preserve the supplied collection as the reference; distinguish saved examples, local checks, and live test results.
- Inspect request bodies, response examples, scripts, and authorization for each feature before implementing it. Document missing enum values, validation rules, and response fields.
- Verify staging health through `GET /health` and initial language/catalog data through `GET /languages` and `GET /courses` without creating or deleting data.
- Confirm isolated test accounts for all six roles, school membership rules, and content ownership expectations. Provision credentials securely without committing them.
- Record the integration gates below with owner, next action, evidence, and resolution status. Do not mark unresolved P1 acceptance criteria complete.

## Success Criteria

- Every P1 acceptance criterion has an implementation destination and known contract or explicit backend dependency.
- The base URL and test environment are documented without secrets.
- MVP launch scope clearly distinguishes required features from conditional search/payments and phase 2.

---

# [x] Step 2 - Build the ATUPA visual foundation and shared UI

**Status (2026-10-16):** Implemented shared UI, semantic light/dark themes, typography, branding and an interactive homepage review. Build/TypeScript and ESLint passed; dialog focus, form errors, filters, pagination and 320px layout checked in the browser. Review details and remaining release checks: `docs/step-02-review.md`.

## Requirements

- Replace starter branding, metadata, and styles with the agreed ATUPA tokens and typography.
- Install and configure React Icons, React Toastify, and `motion`; keep a single global toast container.
- Build typed Button, IconButton, Input, Select, Textarea, Checkbox, Switch, Modal, ConfirmModal, DropdownMenu, PageHeader, StatCard, DataTable, Pagination, SearchField, FilterBar, Skeleton, EmptyState, ErrorState, and StatusPill components.
- Add a restrained animated PageSection wrapper, date/number formatters, and shared validation utilities.
- Establish mobile-first layouts, visible focus, labels, error associations, and dark-theme token support.

## Success Criteria

- Shared components look consistent in light/dark themes and work at 320px width.
- Dialogs support keyboard use, focus restoration, and reduced motion.
- Language text renders correctly and no starter branding remains on implemented routes.

---

# [x] Step 3 - Build production API transport, sessions, and authorization

**Status (2026-10-16):** Session/API foundation implemented and tested with six contract tests plus eight HTTP scenarios against local Postman simulation. Browser sign-in/reload/logout checked with synthetic fixtures. Redis was removed at the user's request on 2026-10-17; encrypted HttpOnly cookies now require SESSION_SECRET. Live backend revocation and staging-account verification remain release dependencies; see `docs/step-03-review.md`. Step 4 account UI is implemented and locally tested, awaiting real email/link verification; Step 5 shell is implemented; Step 6 public discovery is implemented; Step 7 onward remain unstarted.

## Requirements

- Implement server-mediated transport with the configured `/api/v1` base and one typed response/error normalizer.
- Support success envelopes `{ success, message, data }`, list envelopes containing `{ items, page, limit, total }`, direct arrays, and errors containing `statusCode`, `message`, and optional validation `errors`.
- Support JSON, multipart upload forwarding, and request timeouts. Do not forward browser-supplied Authorization headers or allow arbitrary proxy destinations.
- Implement login, logout, refresh, and safe profile retrieval using `POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh`, and `GET /users/me`.
- Access tokens last 900 seconds in the saved examples. Refresh rotates both tokens; reuse of an old refresh token is documented as revoking sessions. Coordinate refresh and authentication writes across same-origin tabs using browser Web Locks; browsers without Web Locks reauthenticate when renewal is needed, and avoid blindly retrying refresh mutations.
- Store tokens in HttpOnly cookies or an equivalent protected server session with production Secure settings, appropriate SameSite behavior, expiry, and protection against cross-site mutations.
- On access expiry, return a renewal signal before forwarding, renew once under the browser lock and retry the buffered request. Backend 401 responses clear the cookie and require sign-in; do not retry revoked credentials. On 403, keep the session and show permission denied.
- Use the installed Next.js route-protection convention and server-side checks for dashboard routes. Backend authorization remains authoritative for school, learner, and content scope.
- Normalize school registration's `data.session` separately from ordinary auth's session response; do not assume identical nesting.

## Success Criteria

- Login, refresh, concurrent expired requests, logout, refresh failure, and return-to behavior work without token exposure or loops.
- Missing/expired sessions and unauthorized roles cannot retrieve protected page data.
- Error, validation, timeout, and upload responses remain usable through the shared transport.

---

# [ ] Step 4 - Complete registration, recovery, and profile workflows

**Status (2026-10-16):** Frontend implementation ready for review: all registration types, recovery/reset/invitation screens, protected profile edits, password change and account deletion. Ten contract tests plus fifteen HTTP scenarios passed locally; browser flows checked with synthetic fixtures. Remains unchecked pending actual reset/invitation email delivery, backend link configuration and staging sign-off. Avatar updates await Step 7 media verification. See `docs/step-04-review.md`. Step 5 shell is implemented; see its review notes.

## Requirements

- Use `POST /auth/register` for learner, parent, and teacher registration. Do not expose public super-admin/content-creator registration.
- Map learner names, date of birth, email, password, and preferred language; parent contact fields; teacher phone, experience, and language specializations according to the actual request contract.
- Register schools with `POST /schools/register`, including school details, declared student count, and nested administrator details. Route the returned school administrator to the appropriate workspace.
- Use `GET /users/me`, `PATCH /users/me`, `POST /auth/password/forgot`, `POST /auth/password/reset`, and `POST /auth/password/change` for account workflows.
- Confirm reset/invitation link URL configuration and complete the email-delivered set-password flow. The saved reset response only demonstrates an invalid token.
- Use neutral forgot-password feedback, clear invalid/expired token handling, password visibility controls, and pending-state locking.
- Implement profile/avatar updates only with supported fields and the verified media flow. Confirm email-versus-phone login requirements; a phone profile field does not establish phone authentication.
- Offer `DELETE /users/me` only with the documented password confirmation and an explicit description of its effect.

## Success Criteria

- Every supported registration type reaches the correct dashboard and handles invalid/duplicate details clearly.
- Real reset and invitation emails lead to a successful password-setting workflow.
- Profile changes persist after refresh; changing/deleting credentials handles session consequences correctly.

---

# [x] Step 5 - Build the responsive role-aware dashboard shell

**Status (2026-10-17):** Implemented the floating sidebar, keyboard pinning, mobile drawer, role overviews, workspace page search, theme/account/logout controls and read-only notification shortcut. Fourteen contract/navigation tests, six-role synthetic HTTP checks, lint, TypeScript and production build passed. Browser checks covered desktop and 320px layouts, focus trapping/restoration, active navigation, page search, notifications and themes. Live staging roles remain a release dependency. See `docs/step-05-review.md`. Step 6 public discovery is implemented; Step 7 remains unstarted.

## Requirements

- Adapt BiblePlus's rounded floating sidebar, collapsed icon rail, hover expansion, mobile drawer, top bar, search entry, notifications shortcut, account menu, and logout.
- Define navigation for learner learning/progress; teacher classes/content/assignments; parent children; school-admin members/classes/reports; content-creator CMS; and super-admin platform management.
- Resolve `/dashboard` to the authenticated role's overview. Derive active navigation from pathname and enforce permissions on direct navigation and page actions.
- Keep shell navigation search distinct from backend learning-content search. Search only pages accessible to the signed-in role.
- Persist theme preference only. Support keyboard-accessible expansion/pinning behavior, labelled collapsed icons, mobile Escape/backdrop close, and closing the drawer after navigation.
- Use a focused learning layout for lessons and attempts so management navigation does not compete with the learning task.

## Success Criteria

- All six roles see appropriate navigation without privileged control leakage.
- Sidebar behavior is stable on desktop; mobile drawers fit the viewport and restore focus.
- Only implemented, accessible destinations are shown; release navigation contains no placeholder routes.

---

# [x] Step 6 - Implement the public homepage and course discovery

**Status (2026-10-17):** Public homepage, anonymous course catalog and course outlines implemented. All three languages and nine level pathways passed live read-only checks. Filtering/pagination, premium labels, loading/empty/retry states and mobile navigation delivered. Nineteen contract tests, live public-page HTTP checks, local Postman failure checks, lint, TypeScript and production build passed. Premium lesson entitlement and educational content quality remain release checks; see `docs/step-06-review.md`. Step 7 is unstarted.

## Requirements

- Build the public homepage around the supplied visual reference: introduction, three languages, featured learning, how it works, GameCard connection, school/parent benefits, and relevant registration CTAs.
- Use approved product copy and real assets. Omit testimonials until approved genuine testimonials are supplied.
- Browse with `GET /languages`, `GET /courses`, and `GET /courses/:courseId`. Implement language, level, and pagination using documented query parameters; add other filters only when accepted by the backend.
- Display course modules, lesson titles, quizzes, level, language, and premium status from actual data. Confirm which catalog endpoints permit anonymous access before choosing public data-loading behavior.
- Verify Yoruba, Igbo, and Hausa and Beginner/Intermediate/Advanced pathways against actual catalog data. The saved language list omits Hausa even though course examples contain it; investigate rather than hard-code over the discrepancy.
- Hide or explain inaccessible premium content using actual entitlement responses; the free-MVP decision must include required course availability.

## Success Criteria

- Public CTAs lead to working flows and the catalog renders actual courses with accurate filters.
- All three initial language pathways are discoverable with approved content or an explicitly accepted empty state.
- Mobile layout follows ATUPA branding without copying the public hero into staff dashboards.

---

# [ ] Step 7 - Complete media uploads and reusable media selection

## Requirements

- Request tickets through `POST /media/uploads`. For `mode=direct`, post the file and returned fields to the provided upload URL, then confirm through `POST /media/uploads/confirm` using the provider's real public identifier.
- For `mode=server`, use multipart `POST /media/upload` with the documented field names. Respect the collection's stated 25MB server-upload limit and verified type restrictions.
- Browse with `GET /media`, read a real media identifier through `GET /media/:mediaId`, and delete with `DELETE /media/:mediaId` subject to ownership and usage restrictions.
- Build previews, progress/pending state, validation, retry, and media selection reusable by lessons, vocabulary, cultural topics, profiles, and assignment attachments where permitted.
- Resolve the saved server-upload `400 property file should not exist` with a real file. The saved direct confirmation uses a placeholder public ID and returns 404; it does not prove a broken confirm endpoint or a successful upload.
- Obtain successful image, audio, and video examples and the corresponding lesson block/media reference shapes. Never send fake media IDs or treat an empty list response as verified media detail.

## Success Criteria

- Each required media type uploads, confirms, persists, and plays/renders in a published learner lesson.
- Unsupported/oversized files and network failures preserve editor values and offer recoverable feedback.
- Staff and learner attachment permissions are verified; credentials/signatures are not logged.

---

# [ ] Step 8 - Implement course, module, and lesson authoring

## Requirements

- List and open authored content with `GET /authoring/courses` and `GET /authoring/courses/:courseId`; do not use the public outline as a substitute for editable draft content.
- Create/update courses through `POST /authoring/courses` and `PATCH /authoring/courses/:courseId` using documented language, level, title, description, course type, age group, duration, premium flag, and tags.
- Create modules through `POST /authoring/courses/:courseId/modules`, update through `PATCH /authoring/modules/:moduleId`, and create lessons through `POST /authoring/modules/:moduleId/lessons`.
- Update lessons with `PATCH /authoring/lessons/:lessonId`; implement text, cultural notes, vocabulary, pronunciation notes, GameCard references, and verified image/audio/video blocks.
- Publish/unpublish through `POST /authoring/courses/:courseId/publish`, `/unpublish`, and `POST /authoring/lessons/:lessonId/publish`, `/unpublish`.
- Delete through `DELETE /authoring/courses/:courseId`, `/authoring/modules/:moduleId`, and `/authoring/lessons/:lessonId`. Reflect returned archive behavior instead of assuming permanent deletion.
- Use a structured tree editor with explicit save and publish states. Preserve dirty forms on upload/API failures and warn before discarding changes.
- Support order fields only through verified update contracts; do not invent reorder endpoints. Keep author answer-bearing data separate from learner-facing data.

## Success Criteria

- Authorized staff can create a full course tree, upload media, publish it, and retrieve it through the learner catalog.
- Drafts and unpublished content remain restricted; ownership and school restrictions survive direct API attempts.
- Edit, publish, unpublish, delete/archive, and reload preserve canonical backend state.

---

# [ ] Step 9 - Implement activity and quiz authoring contracts

## Requirements

- Create activities with `POST /authoring/lessons/:lessonId/activities`; update/delete through `PATCH` and `DELETE /authoring/activities/:activityId`.
- Create quizzes with `POST /authoring/courses/:courseId/quizzes`; read/edit/delete through `GET`, `PATCH`, and `DELETE /authoring/quizzes/:quizId`.
- Build question editing for demonstrated multiple choice, true/false, and translation, including accepted answers and explanation where supported.
- Support documented quiz settings: lesson/module association where accepted, pass score, timer, randomized questions, attempt limit, and answer-review permission.
- Obtain payload, solution, response, and grading examples for matching, fill-in-the-blank, drag-and-drop, word arrangement, listening, picture identification, flashcards, image/audio questions, and vocabulary questions required by US-06/US-07.
- Maintain a supported-type matrix. A missing example is an unverified contract, not proof that the backend lacks the feature. Resolve or obtain an explicit MVP scope revision for every unsupported P1 format.
- Validate options, answers, scoring, ordering, timing, and diacritics without silently altering educational meaning.

## Success Criteria

- Staff can create, reload, and edit each agreed required format without corrupting solutions or options.
- Quiz settings persist and are enforced during learner attempts.
- Every P1 activity/question format is verified or covered by an explicitly accepted scope change before release.

---

# [ ] Step 10 - Complete learner lessons, practice, and quiz attempts

## Requirements

- Enroll through `POST /progress/courses/:courseId/enroll`; list enrollments with `GET /progress/courses` and read course progress with `GET /progress/courses/:courseId`.
- Load lessons with `GET /learning/lessons/:lessonId`, using the learner-safe response and its activities/quizzes. Render media and all verified activity types accessibly.
- Submit practice through `POST /learning/activities/:activityId/submit` using the type-specific response shape; display returned feedback/results rather than award points locally.
- Complete lessons with `POST /progress/lessons/:lessonId/complete`. Preserve backend prerequisites and completion rules.
- Start attempts with `POST /learning/quizzes/:quizId/attempts`, submit with `POST /learning/attempts/:attemptId/submit`, list with `GET /learning/attempts`, and review with `GET /learning/attempts/:attemptId/review`.
- Verify timing metadata and reload behavior for a configured timed quiz. The saved start example is untimed and lacks deadline fields; do not build a consequential timer from an assumed duration.
- Respect attempt limits, expired attempts, pass/fail, review permissions, and backend scoring. Avoid auto-retrying attempt creation/submission unless safe retry semantics are established.
- Support `DELETE /progress/courses/:courseId/enroll` only where allowed; the collection describes unenrollment as restricted to in-progress courses.

## Success Criteria

- A learner can enroll, learn, practice, complete lessons, take/review quizzes, and see saved results after refresh.
- Learner responses do not expose solutions before permitted review.
- Timers, retries, invalid submissions, exhausted attempts, entitlement denial, and connectivity failure have tested behavior.

---

# [ ] Step 11 - Implement progress, achievements, and learner overview

## Requirements

- Build the overview from `GET /dashboards/learner`; use `GET /progress/stats`, `/progress/badges`, `/progress/activity`, and `/progress/quiz-results` for detailed views as needed without duplicating equivalent requests.
- Display real welcome/profile context, current courses, Continue Learning, completion, quiz scores, points, badges, streaks, learning time, certificates, and recent activity where supplied.
- Save position with `PUT /progress/lessons/:lessonId/position` using documented `progressPercent` and `lastBlockIndex`; retrieve with `GET /progress/continue`.
- Debounce position writes and protect against stale responses. Verify cross-device resume and completed-lesson behavior. Video playback timestamp resume requires a confirmed additional contract if block position is insufficient.
- Send `POST /progress/heartbeat` for active learning time with documented seconds. Pause counting when inactive/hidden and avoid duplicate intervals or inflated time across tabs.
- Display recommendations only if provided by a verified backend response or clearly defined product rule; do not label arbitrary lists personalized.

## Success Criteria

- Progress and achievements update from backend results and remain correct after refresh and on a second device.
- Idle/background use does not inflate learning time; repeated completion does not duplicate rewards.
- Empty and fully completed learning states offer appropriate next actions.

---

# [ ] Step 12 - Complete vocabulary, cultural content, and GameCard integration

## Requirements

- Browse vocabulary through `GET /vocabulary`, `/vocabulary/:vocabId`, and `/vocabulary/concepts/:conceptKey`; browse culture through `GET /cultural-topics` and `/cultural-topics/:topicId`.
- Record cultural completion with `POST /progress/cultural-topics/:topicId/complete`.
- Browse games through `GET /games` and `/games/:gameId`; read cards through `GET /gamecard/cards/:code` and record scans through `POST /gamecard/scan`.
- Submit challenges with `POST /gamecard/cards/:code/challenge`; show returned correctness/reward status. List play history with `GET /gamecard/plays`.
- Provide camera QR scanning with permission/error handling and a manual-code fallback. Validate scanned content against supported ATUPA routes/codes rather than navigating arbitrary QR URLs.
- Retrieve printable card QR data through `GET /authoring/gamecards/:code/qr`. Configure the backend's frontend origin so scan links use the deployed application, not localhost.
- Complete US-09's pronunciation flow with real audio assets. The saved vocabulary/card examples do not demonstrate pronunciation audio.
- Establish a real game launch URL/deep link and identity/result handoff for GameApp integration. `POST /games/:gameId/sessions` accepts score/duration in the collection; it does not alone demonstrate secure mobile integration or result validation.
- Confirm repeated-scan/session reward rules and safe retries. Do not invent results, games, or completion credit from a launch click.

## Success Criteria

- A real printed-card QR reaches the deployed learner experience, plays pronunciation, and records a challenge result.
- Game launches and result synchronization are verified for the agreed integration scope.
- Repeated requests cannot incorrectly duplicate points; camera-denied and invalid-code states remain usable.

---

# [ ] Step 13 - Implement certificates and public verification

## Requirements

- List learner certificates through `GET /certificates/mine`, retrieve detail through `GET /certificates/:certificateId`, and publicly verify through `GET /certificates/verify/:verificationCode`.
- Use backend-issued eligibility and records; never expose `POST /certificates/issue`, which is explicitly removed in the collection.
- Show learner name, course, language, completion date, certificate ID, ATUPA branding, verification URL, and QR from verified data.
- Build an accessible printable certificate view. A downloadable PDF is optional unless separately agreed; do not invent a backend PDF-download endpoint.
- Verify real complete QR data and deployed verification URLs. Saved QR data is truncated and certificate links point to localhost.
- Allow permitted administrators to list `GET /certificates` and revoke with `POST /certificates/:certificateId/revoke` using a reason and confirmation.

## Success Criteria

- Completing qualifying learning issues a certificate automatically according to backend rules.
- Its QR resolves on another device; revoked, invalid, and missing certificates have accurate public states.
- Users can access only authorized certificate details; the printable layout is legible.

---

# [ ] Step 14 - Implement schools, classes, and membership workflows

## Requirements

- Load schools with `GET /schools/mine` and `/schools/:schoolId`; edit permitted details/settings with `PATCH /schools/:schoolId`.
- Join with `POST /schools/join`, list/invite members with `GET` and `POST /schools/:schoolId/members`, remove through `DELETE /schools/:schoolId/members/:userId`, and rotate join codes with `POST /schools/:schoolId/join-code/rotate`.
- Support teacher/student invitations with actual allowed role values and email onboarding. Never equate membership in a school with unrestricted school administration.
- Create/list classes through `POST` and `GET /classes`; read/update/archive through `GET`, `PATCH`, and `DELETE /classes/:classId`.
- Manage students with `POST /classes/:classId/students` and `DELETE /classes/:classId/students/:learnerId`; join through `POST /classes/join` and leave through `DELETE /classes/:classId/membership`.
- Assign/remove courses through `POST` and `DELETE /classes/:classId/courses/:courseId`; assign teachers with `PATCH /classes/:classId/teacher`.
- Post announcements through `POST /classes/:classId/announcements`; rotate codes through `POST /classes/:classId/join-code/rotate`.
- Include school leaderboard settings for enabling leaderboards and showing learner names. Do not turn activity reporting into an invented attendance register.
- The saved class-join example returns 409 because of existing membership; verify a successful new-member join separately.

## Success Criteria

- School administrators and teachers can manage authorized classes/members, and learners can join/leave using the documented rules.
- Course and teacher assignments persist; archived classes and membership conflicts are handled clearly.
- Cross-school access and unauthorized member/teacher changes are rejected.

---

# [ ] Step 15 - Complete assignments and teacher workflows

## Requirements

- Create through `POST /assignments`, list learner work through `GET /assignments/mine`, read details through `GET /assignments/:assignmentId`, and list class work through `GET /assignments/classes/:classId`.
- Start with `POST /assignments/:assignmentId/start`, submit with `POST /assignments/:assignmentId/submit`, review through `POST /assignments/:assignmentId/submissions/:learnerId/review`, and delete through `DELETE /assignments/:assignmentId`.
- Support demonstrated written-work and lesson assignments, including `classroomId`, target identifiers, instructions, score, feedback, and completion where accepted.
- Verify quiz, vocabulary, audio, game, and cultural-research assignment type values, target behavior, submission media, and automatic-completion rules required by US-13.
- Display Assigned, Started, Submitted, Reviewed, and Completed as returned by the backend; do not mark work complete merely because a teacher opened it.
- Use `GET /dashboards/teacher` for real students, active students, authored/assigned courses, assignments, assessment averages, and recent results/activity.
- Present teacher results and reports with learner/class selectors populated from authorized records, not manually entered IDs.

## Success Criteria

- A teacher assigns work, a learner starts/submits it, and the teacher reviews it with persistent feedback and status.
- Lesson/quiz automatic completion is verified where supported; attachment uploads work for intended roles.
- All agreed P1 assignment types are verified or explicitly resolved through scope review.

---

# [ ] Step 16 - Implement parent linking and monitoring

## Requirements

- Generate a learner link code with `POST /parents/link-codes`; link through `POST /parents/children`, list with `GET /parents/children`, and unlink with `DELETE /parents/children/:learnerId`.
- Build parent overview through `GET /dashboards/parent` and child details through `GET /dashboards/children/:learnerId`.
- Show available child courses, progress, scores, time, badges, certificates, streaks, and activity. Render teacher feedback only if present in an authorized response; otherwise record its contract gap.
- Handle expired/reused codes and unlink confirmation. Never support linking by guessed child IDs or email lookup without a documented verification flow.
- Surface child learning/achievement updates through the parent's notifications contract.

## Success Criteria

- A parent can securely link multiple children, view each child's real information, and unlink them.
- Unlinked parents and unrelated accounts cannot retrieve child details.
- Notifications and child achievements remain accurate after the parent refreshes or changes child selection.

---

# [ ] Step 17 - Complete administrator and content-creator management

## Requirements

- Manage users with `GET /admin/users`, `POST /admin/users`, and `GET`, `PATCH`, `DELETE /admin/users/:userId` using verified search/role fields and invite/update rules.
- Support content-creator invitations and active-status changes without exposing unsupported permission editors or public privileged registration.
- Manage schools with `GET /schools`, `POST /schools`, and existing school detail/update/delete routes. Handle 409 for schools with members; offer documented deactivation where appropriate.
- Manage languages through `GET /admin/languages`, `POST /languages`, and `PATCH /languages/:code`. Do not add a language-delete action without an actual endpoint.
- Manage vocabulary, cultural topics, games, and GameCards with their documented list/create/update/delete routes under `/authoring/vocabulary`, `/authoring/cultural-topics`, `/authoring/games`, and `/authoring/gamecards`. GameCard update/delete uses its code.
- Reuse course authoring and certificate administration rather than maintaining duplicate editors.
- Use `GET /dashboards/admin` for users by role, activity, courses, languages, completion, game engagement, certificates, schools, and other returned metrics.
- Do not copy BiblePlus audit logs, exports, moderation, generic configuration pages, or admin-management endpoints; those contracts are not established for ATUPA.

## Success Criteria

- Super administrators and content creators can perform only their verified responsibilities.
- Invites, content changes, language updates, deactivation, and delete/archive behavior persist after reload.
- Administrative totals and charts reflect actual backend data without invented comparisons or trends.

---

# [ ] Step 18 - Implement notifications and basic reports

## Requirements

- List notifications through `GET /notifications`, count unread through `GET /notifications/unread-count`, mark one/all read with `PATCH /notifications/:notificationId/read` and `/notifications/read-all`, and delete through `DELETE /notifications/:notificationId`.
- Link notification destinations only when the payload supports a safe authorized frontend target. Do not invent broadcast or reminder-scheduling endpoints.
- Implement `GET /reports/learners/:learnerId`, `/reports/classes/:classId`, and `/reports/schools/:schoolId` alongside `GET /dashboards/school` and the role dashboards already covered.
- Show actual completion, engagement, quiz/game performance, activities, learning time, and teacher activity where returned. Keep metric definitions and time windows explicit.
- Use charts only for meaningful returned data; no fabricated time series. Handle partial panel failures without discarding successful sections.
- If reports must be printable, add a print layout. CSV/PDF server export is not demonstrated; do not invent export endpoints or claim a loaded-page export covers all records.
- Optional leaderboards use `GET /leaderboards` with verified scope/period values and school privacy settings. They are not a substitute for basic reports.

## Success Criteria

- Read/unread state and counts stay consistent after mutations and refresh.
- Parents, teachers, school admins, and super admins access only permitted reports.
- Report values agree with the related course/quiz/activity records for isolated test learners.

---

# [ ] Step 19 - Implement search and discovery if included in MVP

## Requirements

- Record the US-17 scope decision. Course language/level browsing remains required regardless of full-search scope.
- If included, use `GET /search` with demonstrated `q`, `types`, `languageCode`, and `level` parameters; verify age-group, course-type, and duration filtering before exposing them.
- Group actual returned courses, lessons, vocabulary, cultural topics, and games with safe authorized destinations.
- Debounce, cancel stale searches, retain URL state, and show useful no-result and retry states. Do not expose draft or unauthorized content in suggestions.

## Success Criteria

- Search is either explicitly deferred or functional against the verified backend contract.
- No unsupported filters or misleading global-result totals are shown.

---

# [ ] Step 20 - Resolve monetization scope and implement payments if required

## Requirements

- Record whether the MVP is free or monetized. Individual payments remain conditional; school subscriptions belong to phase 2 unless explicitly moved into MVP.
- For a free launch, verify that premium flags/entitlement enforcement do not block required content. Do not bypass backend premium checks in the frontend.
- If payments are included, list `GET /subscriptions/plans`, read `GET /subscriptions/mine`, initiate `POST /subscriptions/checkout`, and verify with `GET /subscriptions/payments/:reference/verify`.
- Use the returned authorization URL and real reference. A browser callback alone must never grant access; refresh subscription status after backend verification.
- Resolve saved checkout 503 responses reporting an IP restriction. The saved verification 404 used an empty reference after checkout failure and does not establish a missing verify route.
- Test the backend Paystack webhook integration and entitlement updates in a provider test environment. Payment secrets and webhook verification remain server-side.
- Use `GET /subscriptions/payments` for permitted admin payment history. Do not invent cancellation, refund, or subscription-management endpoints.

## Success Criteria

- A free MVP has a recorded scope decision and accessible required courses, or the paid flow completes with verified backend entitlement changes.
- Failed, canceled, repeated, and pending payments do not falsely unlock content.
- A Postman assertion accepting either 201 or 503 is not accepted as evidence of working checkout.

---

# [ ] Step 21 - Complete integration QA, accessibility, and release readiness

## Requirements

### Functional verification

- Complete the verification matrix for every included workflow: role, method/path, request, success/empty/error behavior, implementation status, tested environment, and evidence.
- Run the full learner flow: register, select language/level, enroll, complete multimedia lessons and practice, take a quiz, scan a card/play the agreed game, earn backend rewards, complete a course, and verify its certificate.
- Run teacher/class/assignment, parent-link/monitoring, school-management/reporting, and administrator/content-creator publishing flows with isolated data.
- Test actual image/audio/video uploads, invited-account setup, password reset, expired sessions, concurrent refresh, cross-device position, timed attempts, revoked certificates, and duplicate submissions/rewards.
- Verify unauthorized roles, unrelated parents, other teachers, and other schools cannot read or mutate protected records. Hiding navigation is not authorization evidence.
- Test configured completion rules and every agreed activity/question/assignment format. Retest unresolved gates after backend changes.
- Avoid destructive shared-environment collection runs; document and clean up only the isolated records created for verification.

### Quality and maintainability

- Remove placeholders, mock records, unused starter assets, duplicate fetch helpers, console secrets, broad untyped API boundaries, and dead routes.
- Run `npm run lint`, `npx tsc --noEmit`, and `npm run build`; resolve correctness and accessibility issues.
- Add a suitable test runner when implementing meaningful tests. Test response normalization, role guards, refresh coordination, quiz/activity serialization, position persistence, and high-impact confirmation behavior.
- Add focused integration tests for login failure, one content CRUD flow, quiz submission, assignment review, and parent/school access boundaries. Do not substitute snapshot tests for real persistence checks.

### Accessibility and responsive QA

- Verify keyboard navigation, focus visibility, dialog focus trapping/restoration, error associations, screen-reader names, media controls, and camera alternatives.
- Test at 320px, 375px, 768px, 1024px, and wide desktop sizes in relevant roles.
- Verify light/dark contrast, reduced motion, long language text, diacritics, missing media, slow connections, empty accounts, and partially completed courses.
- Confirm optimized media delivery, restrained request counts, no duplicate heartbeat loops, and usable pending/retry states.

### Release documentation

- Add `.env.example` with documented backend base and frontend-origin configuration responsibilities; never commit credentials.
- Update README with setup, scripts, routes, roles, session behavior, media flow, and API base-path rules.
- Keep known backend discrepancies and verification outcomes in `docs/api-notes.md`; include concrete reproduction and evidence.
- Confirm deployed GameCard/certificate/reset/invitation URLs, production cookie settings, actual initial language content, and the selected monetization scope.
- Obtain product-owner acceptance against the P1 criteria and record any explicitly accepted scope changes.

## Success Criteria

- Lint, TypeScript, focused tests, and production build pass.
- Every included navigation destination works with real data and appropriate permissions across relevant screen sizes.
- All P1 acceptance criteria are met or explicitly re-scoped by the product owner; unresolved essential integrations block launch approval.
- A new developer can run and continue the project from repository documentation and environment configuration.

---

# Backend Integration Gates

| Gate | Supplied evidence | Required resolution |
|---|---|---|
| Media | Ticket 201; placeholder confirm 404; server upload 400 | Real image/audio/video upload, confirmation, lesson storage and playback |
| Activity and quiz formats | Multiple choice activity and three quiz authoring types demonstrated | Document and verify all required P1 formats and grading payloads |
| GameApp and pronunciation | Card scans/challenges and score submission exist; example lacks launch/audio assets | Real QR pronunciation flow and agreed game launch/result integration |
| Frontend URLs | QR/certificate examples contain localhost | Deployed URLs and actual QR scan tests; verify email links too |
| Email onboarding/recovery | Invitation/forgot endpoints exist; reset example is invalid-token only | Delivered email and successful password setup/reset |
| Languages | Hausa courses exist but saved public language list omits Hausa | Verify active public language catalog and initial pathways |
| Timed attempts | Timer authoring exists; saved untimed start example lacks timing fields | Verify timed start metadata, expiry enforcement and reload behavior |
| Assignments | Written and lesson examples demonstrated | Verify remaining required assignment types and media permissions |
| Payments, conditional | Checkout 503; verification uses empty reference | Resolve provider configuration and prove entitlement updates if included |

These are verification/configuration/contract gates, not assertions that every listed backend feature is absent. Maintain their status in the API notes as evidence improves.

---

# Final Readiness Definition

The MVP is complete when all required steps are checked, conditional steps have an explicit inclusion or deferral decision, included workflows operate on real backend data, the integration gates are resolved for the agreed scope, and Step 21 release checks pass.

The intended delivery is a coherent ATUPA learning platform: a welcoming public website, focused mobile-first learning, role-aware dashboards inspired by BiblePlus, cream/forest-green branding, accessible interactions, reliable saved progress, and working school, teacher, parent, and administrator workflows. A visually complete placeholder does not count as completion.
