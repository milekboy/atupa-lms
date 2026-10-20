# ATUPA API notes and integration baseline

Recorded 2026-10-16 (Africa/Lagos). This is a documentation and read-only contract baseline, not production certification.

## Sources and integrity

- Collection: `C:/Users/User/Downloads/ATUPA LMS API.postman_collection.json`.
- Collection SHA-256: `ecbd1867d6b04f7534b18c8a886a09faec8e81711443a3550250113f08cc29aa`.
- Collection preserved in place, unmodified. Do not copy sample secrets or credentials into this repository.
- PRD section 34 defines 16 must-haves; user-story acceptance criteria are transcribed individually in the verification matrix.
- API base: `https://atupa-lms-backend.onrender.com/api/v1`.
- The reference contains 191 saved requests, not 191 verified unique endpoints. Saved successes, expected security failures and placeholder failures must be interpreted separately.

## Evidence rules

- **Saved example:** a request/response in the supplied collection, not rerun here.
- **Local check:** document/collection structure and traceability checks; no server claim.
- **Live read-only:** dated anonymous GET requests and explicit assertions in `live-checks.json`.
- **Not verified:** authenticated workflows, data persistence, authorization boundaries, uploads, invitations, timers, game identity, and payments until tested with isolated fixtures.

No complete collection run, account creation, login attempt, payment initiation or destructive request was executed in Step 1. No backend deployment settings were changed.

## Response and authentication contract

- Standard success `{ success: true, message, data }`; lists commonly use `data: { items, page, limit, total }`; languages/plans can return arrays.
- Errors use `{ success: false, statusCode, message, errors?, path, timestamp }`; error fields must be mapped defensively.
- Ordinary registration/login examples return `data.user`, `data.accessToken`, `data.refreshToken`, `data.expiresIn`. School registration returns `data.school` plus `data.session`.
- Access-token lifetime is documented as 900 seconds. Refresh rotates tokens; documented reuse invalidates sessions. Concurrency-safe server session transport is required in step 3.
- Public registration accepts learner, parent, teacher; school registration is separate; content creators/admins require privileged provisioning.
- Sample bearer-token roles are recorded per endpoint in the matrix. They establish example callers, not a complete role permission list.
- Author course/quiz responses contain answers. Learner-safe responses must not be replaced with author endpoints.

## Integration gates

Owners below are proposed responsible functions, not confirmed individual assignments.

| ID | Area | Saved evidence | Proposed owner | Next action | Status |
| --- | --- | --- | --- | --- | --- |
| G01 | Media | Ticket 201; placeholder confirm 404; server multipart 400 | Backend + frontend | Upload actual image/audio/video, confirm, publish and play | Open; no authenticated test |
| G02 | Practice/question formats | MC activity; MC/true_false/translation quiz examples | Backend + content + frontend | Supply enum/payload/solution/submission/grade schema for every P1 format | Open |
| G03 | GameApp/pronunciation | Card challenge/session examples; no demonstrated audio or launch handoff | Backend + game team + content | Provide audio, launch/deep links, identity handoff, result validation/reward rules | Open |
| G04 | Frontend links | Saved certificate/card links use localhost; QR bytes truncated | Backend deployment + frontend | Configure deployed frontend origin; scan real QR; verify reset/invite links | Open |
| G05 | Email onboarding | Invitation and forgot endpoints; reset invalid-token 400 | Backend/email owner | Deliver real isolated invite/reset emails and complete token flow | Open |
| G06 | Languages/catalog | Saved list omits Hausa; catalog contains Hausa courses | Backend/content | Verify live active languages, full nine language/level combinations and content quality | Resolved for catalog availability: all three languages and nine pathways passed live; educational content quality remains unverified |
| G07 | Timed attempts | Timer setting exists; saved untimed attempt omits deadline | Backend + frontend | Start configured timed quiz; establish expiresAt/server time and reload/expiry rules | Open |
| G08 | Assignment formats | Written-work/lesson samples; started/submitted/completed examples | Backend + frontend | Verify remaining enum values, attachments, status transitions and auto-completion | Open |
| G09 | Payments (conditional) | 503 checkout IP restriction; empty-reference verify 404; test accepts 503 | Backend/payment owner + product | Decide scope; verify real checkout/reference/webhook/entitlements if included | Pending scope; no payment test |

## Contract questions to resolve before implementing affected features

1. Full activity/question/assignment enum values and per-type payload, response, solution, feedback and grading validation.
2. Lesson image/audio/video block shapes and media reference identifiers; allowed formats and upload limits by kind; attachment permissions for learners.
3. Timed-quiz deadline/server-time fields, resume/abandon behavior, randomization persistence, max-attempt enforcement and submission retry semantics.
4. Score/session integrity and repeated scan/challenge/session reward limits; real GameApp launch and authenticated result handoff.
5. Role grants for teacher, content_creator and school_admin on each authoring endpoint; school membership and ownership requirements.
6. Certificate course-completion rules, automatic issue timing, full QR data, parent detail access and revocation visibility.
7. Supported profile/avatar fields, phone authentication (not established), invite expiry, reset expiry and frontend callback configuration.
8. Backend progress validation, multi-device conflict policy, video timestamps beyond block position, heartbeat limits, timezone/streak definitions.
9. Notification payload destinations/channels, parent teacher-feedback fields and report metric periods/definitions.
10. Search filters beyond demonstrated q/types/languageCode/level; report downloads are not established endpoints.

## Test environment and scope decisions

All six isolated role accounts remain **not supplied / not confirmed**. Role, ownership and school-boundary verification is blocked until a secure provisioning method is supplied. Do not mark a seeded/demo ID as an isolated fixture. Do not place passwords in this document or ask for them in chat.

Full search remains P2 pending product decision. Payments remain conditional pending product decision; school subscriptions remain phase 2 unless explicitly moved. Required catalog browsing remains in scope. If launching free, verify premium flags do not block required learning content.

Step 1 can deliver its contract baseline now, but its requirement to confirm six isolated accounts is outstanding. Keep Step 1 unchecked until account availability and ownership/membership policies are confirmed. Steps 2 UI work can be authorized independently without pretending these integrations have passed.

## Manual review for Step 1

1. Review the scope baseline and source-criterion rows in the verification matrix, especially GameApp and assignment formats.
2. Review dated live health/language/course checks; verify all three languages and nine language/level combinations if the service is reachable.
3. Confirm a secure way to provision the six test roles and two separate school fixtures; no password needs to be posted in chat.
4. Decide whether full search and individual payments belong in MVP; identify backend owners for open gates.

No visible frontend change is expected at this step. Authenticated functional checks remain future work.

## Live read-only result

All four anonymous GET checks passed on the verification rerun: health, languages, paginated courses, and Yoruba beginner filtering. All 23 explicit assertions passed with zero transport errors. The initial health request timed out after 40 seconds; the warmed rerun returned healthy status. No cold-start diagnosis is established by this observation. Full timestamped responses and assertion names are in `live-checks.json`.

The live language response contains Yoruba, Igbo and Hausa, plus two test-like Edo entries. All nine initial language/level course combinations are published. The advanced courses carry premium flags, so a free MVP still requires an entitlement/content-access decision. Catalog availability does not prove lesson quality or successful enrollment.

The user subsequently supplied `https://atupa-lms-backend.onrender.com/api` and confirmed backend work across the collection folders. The original collection and successful requests use `/api/v1`; retain that verified base until a replacement collection establishes a changed routing contract. The user indicated a replacement collection will follow; it was not received during this baseline. This message did not provide isolated accounts or decide search/payment scope.


## Step 4 account implementation (2026-10-16)

Registration (including nested school sessions), recovery/reset, restricted profile PATCH, password change and password-confirmed deletion now have frontend routes and local simulation tests. G05 email delivery remains open; actual reset/invitation links and backend frontend-origin configuration are unverified. Avatar changes await G01/Step 7. See `step-04-review.md` for evidence and scope.

## Step 6 public discovery (2026-10-17)

Anonymous GET /languages, /courses and /courses/:courseId are live-verified. Twelve read-only requests confirmed active Yoruba, Igbo and Hausa, all nine language/level pathways and a premium outline. See `step-06-live-checks.json` and `step-06-review.md`. Frontend filters send languageCode, level, page and limit only. Two test-like Edo records remain in live active languages and have no matching courses; labels distinguish the codes. Advanced courses are premium. No entitlement response was tested, no lesson access is granted by catalog browsing, and G09/conditional payment scope remains open. Educational content quality is still unverified.


## Step 7 media contract gates (2026-10-18)

The staff media frontend is implemented, but live upload verification is blocked by the absence of isolated staff accounts (confirmed by the user). The saved confirmation request uses a placeholder publicId and returns 404; detail returns a list envelope rather than a media record; server upload returns `property file should not exist`. Request a successful image/audio/video upload, confirmation and detail response plus role/ownership/usage rules from the backend team. The current media record adapter is explicitly provisional; see `step-07-review.md`. Pagination query behavior also requires confirmation. No remote records were created or deleted. Published-lesson playback remains an integration gate for Steps 8/10.


## Step 8 — authoring (2026-10-19)

Course studio uses `/authoring/courses` and its answer-bearing course tree, never the public outline as editable content. The projection drops activities/quizzes/answers; writes explicitly allow only course/module/lesson fields, not ownership, status or order. Saved examples establish create shapes, description-only course PATCH, title-only module PATCH, summary-only lesson PATCH, publish/unpublish, child deletion and course `{archived:true}`. Sending all editable create fields on course/lesson PATCH remains an inferred DTO compatibility point, covered locally but requiring live verification.

Only text and cultural_note blocks have demonstrated lesson write shapes. No image/audio/video lesson media field or order-update payload appears in the collection. New media attachments and reordering remain unavailable; unknown existing blocks retain their exact content and extra fields on save. The media library remains available separately. Language course type, children/all age groups and three launch languages are exposed from available examples; unfamiliar persisted values are preserved.

No isolated live account was supplied. A local stateful Postman simulation exercises actual frontend HTTP transport and synthetic ownership/role failures, failure recovery, public draft hiding, separate publication, deletion and archival. These are local contract expectations, not evidence of live backend enforcement or school rules. Owner workspace mock discovery was skipped because no authenticated workspace binding was available in this task; no mocks were published and no shared backend content was changed. See `step-08-review.md`.


## Step 9 — assessment authoring (2026-10-19)

Course studio now includes staff-only activity/quiz authoring. Practice writes use demonstrated multiple-choice payload/solution/feedback; quizzes support the three demonstrated question types and documented settings. Existing quizzes load via GET `/authoring/quizzes/:id`; activities are read through the answer-bearing course tree. No activity GET or quiz publish endpoint is invented.

Saved PATCH examples establish feedback-only activity updates and pass-score/attempt-only quiz updates. Full activity PATCH and question-array replacement remain inferred from create fields and must be confirmed live, including question-ID behavior. Known question writes omit response-only IDs and default points. Custom-weight or unfamiliar questions are read-only, with settings-only PATCH preserving their array. New quiz association uses demonstrated lessonId; course/module move/create semantics, order updates and timer-zero semantics await examples.

Matching, fill-in-the-blank, drag-and-drop, word arrangement, listening, picture identification, flashcards, media-based and vocabulary-based P1 questions remain contract gaps, not approved scope reductions. `assessment-format-matrix.md` contains evidence and a backend clarification draft; nothing was sent to the team. Learner-side scoring, timing, attempts and review enforcement are not established by authoring or local mocks.

Verification: 31 contract tests, ten HTTP scenarios through frontend/proxy to stateful Postman simulation, production build, TypeScript, targeted lint, browser create/save/reload, unsaved-change and 503 recovery, and 320px overflow check. Simulation logs showed 46 authoring requests in the inspected output. All accounts/data were synthetic; no live account, ownership or school-policy checks were performed.


## Step 10 learner implementation — 2026-10-19

Learner-only protected routes cover saved enrollments, course progress, lessons, practice and quiz attempts. The backend proxy allowlists lesson/start payloads to remove grading keys before browser delivery; review answers require explicit reviewAvailable. Public course outline projection retains published status so it remains valid when parsed again by the client. Practice uses the documented response string; quiz answers are an object keyed by question ID. Completion, progress and grades use server results.

Creation/submission POSTs are not automatically retried after ambiguous network/5xx outcomes. Named Web Locks and fresh attempt history reduce duplicate starts; safe GET history reconciles uncertain results. Answers remain in tab memory. This does not establish backend idempotency or active-attempt resume support.

The saved quiz start has no authoritative deadline/remaining-time/server-clock fields, and no documented endpoint restores an active attempt's questions and answers. A consequential timer and reload resume remain blocked on contract clarification. Lesson media block schemas and additional P1 formats remain pending from Steps 8/9. No isolated live learner/staff accounts were available; synthetic prerequisite, entitlement, ownership, expiry and limit tests do not verify live backend policy. See step-10-review.md for the clarification draft and test checklist.


## Step 11 learner overview and telemetry — 2026-10-19

Overview uses GET /dashboards/learner only. Progress details independently request stats, badges, activity?limit=10 and quiz-results. All progress endpoints and dashboards/learner enforce learner role in the frontend proxy; backend remains responsible for ownership/policy. Resume uses GET /progress/continue plus PUT /progress/lessons/:id/position with progressPercent and lastBlockIndex. Reading percent is capped at 99 and completed lessons do not write. Position writes serialize per mounted reader, debounce and flush before completion; no revision/ETag is documented for cross-device conflicts.

POST /progress/heartbeat increments documented seconds with no automatic ambiguous retry. Foreground/focus, recent input, monotonic bounded deltas and a single named Web Lock avoid ordinary hidden/idle/multiple-tab inflation. Unsupported Web Locks skips telemetry conservatively. This is not server enforcement and cannot arbitrate concurrent devices. Remaining live gates are recorded in step-11-review.md. Local fixtures preserve collection response shapes; stateful persistence and error rules are synthetic.


## Step 12 discovery and GameCards — 2026-10-19

The saved vocabulary, concept comparison, cultural topic, game catalog, card read/scan/challenge and play-list shapes are implemented. Vocabulary language filtering and pagination use demonstrated list contracts. Unknown cultural block types pause completion. Cards are projected through a server allowlist before delivery, stripping challenge answers; grading/reward flags are displayed only from mutation responses. Reading a card does not record a scan. Scan/challenge/completion do not automatically retry after ambiguous outcomes; the UI asks the learner to inspect history/progress. Local fixture deduplication is a modeled expectation, not proof of live reward policy.

Native BarcodeDetector plus explicit camera start provides QR scanning where supported. Camera streams stop on close, navigation, errors and successful decode. Manual codes remain available. QR payloads accept a code or exact same-origin /scan/:code with no query/hash/credentials; unrelated URLs never navigate. The /scan route preserves the card in the login return path. Staff can retrieve authoring/gamecards/:code/qr; printing refuses foreign-origin scan links and incomplete image examples. The saved example uses localhost:3000 and truncated base64, so it cannot prove deployable QR printing.

No pronunciation audio field/asset or trustworthy game launch/deep-link/session identity/result handoff is demonstrated. These remain required contracts. No POST /games/:id/sessions is dispatched from a launch click or fabricated score. Physical QR, camera-denied/device compatibility, real entitlement/ownership and repeated reward handling remain live gates. See step-12-review.md.


## Step 13 certificates — 2026-10-19

The collection's mine test script stores certificateId from data[0].id, so detail/revoke requests use the internal id, while the visible ATUPA certificateId is the confirmation/display identifier. Learners use GET /certificates/mine; super_admin uses paginated GET /certificates. Detail is GET /certificates/:id, with backend ownership authoritative. The frontend proxy restricts list/revoke to super_admin and mine to learners; other staff permissions are not assumed. POST /certificates/issue is explicitly blocked. No issuance form, invented PDF endpoint or local completion certificate is exposed.

Public /certificates/verify/:code calls a dedicated anonymous no-store route through GET /certificates/verify/:code, without forwarding session cookies/tokens. It projects only public validity/identity/course fields, strips user IDs and revocation reasons, and treats 404, valid=false and upstream failure separately. Checking another code updates the shareable page URL. Unknown/contradictory validity cannot display success.

Certificate printing uses verified backend fields and refuses non-valid status, a link for a different origin/code, a missing/truncated PNG payload or an image decode error. The saved QR is truncated and its URL is localhost, so deployed print/scanning remains pending. The accessible certificate sheet and A4 landscape stylesheet exist; actual complete-QR print preview, long record fitting and second-device scan require real data.

Revocation sends only reason after exact visible certificate-ID confirmation. Ambiguous POST outcomes disable resubmission and use GET detail for reconciliation; a saved revoked status resolves uncertainty without another POST. Live idempotency/consistency and administrator scope remain backend verification gates. No live records were revoked.


## Step 14 — 20 October 2026

School/class frontend implemented and locally exercised; see `step-14-review.md`. Saved class creation is teacher-authenticated; member invitation demonstrates learner only; member list and `/schools/mine` use school-admin authentication. Teacher roster access, teacher invitation DTO/delivery, school-admin class creation and teacher/learner mine behavior remain unverified. Current UI uses the demonstrated member shape and known teacher/learner roles, surfaces backend denials/validation, and does not add privileged invitations. No school contact-field PATCH editor was guessed; demonstrated privacy settings are editable. Class join's saved example is 409 only; successful fixture joins are transport tests, not live contract proof. Verify cross-school ownership, archive and removal consequences, announcement recipients and invalidated join codes with isolated accounts before launch. The server proxy now rejects unsupported school/class operations and disallowed account roles while leaving resource authorization with the backend. This does not establish actual live grants.


## Step 15 — 20 October 2026

Written-work and lesson assignment UI plus teacher dashboard/reports are implemented and locally verified; see `step-15-review.md`. Saved creation/submission/review/delete uses teacher and learner tokens. School-admin/platform-admin assignment grants remain unverified. A learner detail response is not saved: the saved teacher detail is `assignment` plus `submissions`; learner mine is a paginated list of `assignment`/`submission` pairs. Confirm the live learner detail shape; the browser receives only the current learner's projected submission. Only `written_work` and `lesson` creation are demonstrated. Quiz/vocabulary/audio/game/cultural-research enum/target/submission contracts, resubmission policy, automatic lesson/quiz completion and submission upload permissions/DTOs remain gates. `mediaUrls` in responses does not establish a supported upload request. Existing safe HTTPS attachment links are viewable, but no upload contract was guessed. Live cross-school/class isolation, deletion effects, scoring/feedback persistence, active-student time windows and backend idempotency require isolated-account verification. Local Postman scenarios are not live evidence.


## Step 16 — 20 October 2026

Parent linking/monitoring frontend is implemented and locally verified; see `step-16-review.md`. The proxy checks the parent's current linked-child list before retrieving details and projects only needed child fields. Validate backend-side linkage authorization directly with isolated parents; frontend checks cannot prove upstream enforcement. Code expiry/reuse/re-link policy and actual parent event delivery/read ownership remain live gates. Parent notification examples show assignment and assignment-feedback events. Family updates only display currently linked children from the loaded inbox page, and preserve the inbox pagination meaning. The child dashboard saves `teacherFeedback: []` without a populated item contract; no speculative feedback-object fields are rendered. Existing authorized notification bodies can convey actual feedback. Verify populated dashboard feedback, achievement notifications, post-unlink history/privacy and cross-device freshness with the backend team.


## Step 17 — administrator and publishing management (2026-10-20)

Users support paginated `q` / `role` queries, detail by ID, creator-only invitation DTO `{email,role:"content_creator",firstName,lastName}`, and PATCH `{isActive}`. No role promotion, arbitrary permission editing or privileged public signup was added. Invitation acceptance/email delivery requires live verification.

Schools support list/create `{name,region}`, detail, settings, documented `isActive=false` deactivation and deletion. A 409 for existing members remains visible; it never removes the school optimistically. Existing membership/settings screens are reused. Languages use the direct-array `/admin/languages` list, creation `{code,name,nativeName}`, and the demonstrated native-name PATCH by code. Language DELETE is not offered.

Library studio uses paginated authoring lists plus demonstrated create/update/delete DTOs. Vocabulary updates pronunciation/exampleSentence; cultural topics update summary; games and GameCards update description. Richer updates are not assumed from GET shapes. New cultural content uses text blocks; games use the demonstrated web metadata; card challenges validate unique choices and an exact answer. GameCard PATCH/DELETE addresses the code, not the record ID. Vocabulary defaults to published and cards to active under the saved creation examples; the UI warns before creation.

Super-admin scope is demonstrated in the collection. Creator publishing scope follows the product responsibility and remains a live permission-matrix gate; teacher library CRUD is not enabled. Existing staff QR retrieval remains available. The proxy bounds newly exposed admin/library routes and methods and continues to leave upstream ownership/authorization authoritative. Course authoring and certificates retain their existing editors. Admin overview uses only `/dashboards/admin` response totals, role/language breakdowns, completion, engagement and popular-course rows, with missing numbers shown as unavailable.

Validation uses the local-only Postman admin simulation, adapted from the existing synthetic auth/school fixture and supplied saved management responses. No owner-published mock was available from earlier discovery. These are frontend transport checks against a stand-in, not proof of live backend permissions, persistence or email delivery. No live records were changed.


## Step 18 — notifications and reports (2026-10-20)

Notifications use paginated GET, `{count}` unread count, PATCH one/read-all and DELETE one. Read-all's `{updated}` result is not a new unread total: the UI refetches authoritative count and list. Header and inbox refresh from successful mutations (including the existing parent-page read action), drawer open and window focus; no realtime subscription is claimed. Parent privacy still hides unlinked-child list entries while account totals remain account-wide. Only known assignment/child identifiers can yield role-appropriate links; arbitrary URLs and unsupported notification types never generate destinations.

Reports are read-only: learner self, linked parents, and permitted staff; classes for teacher/school/super admins; schools for school/super admins. School dashboard is used for the authenticated school admin without inventing a school-selection query. These intended scopes must still be checked against the direct backend. Parent report transport checks fresh children before forwarding. Requested report IDs must match returned IDs. Allowlist projections exclude quiz answers/private metadata while preserving existing class-report renderer compatibility. Direct backend authorization remains required for staff ownership/school scope and notification ownership.

Learner report extends the saved dashboard with courseProgress, quizPerformance (including recent attempts) and gamePerformance. Class report adds assignment totals; school report includes studentEngagement, courseCompletion, averagePerformance and teacherActivity. Missing fields remain unavailable. Each report request has an independent error/retry state. Explicit 7/30-day labels come from the demonstrated metrics; other totals/lists do not get an invented date filter. The printable loaded-page view is not a server export or complete dataset export. Optional leaderboards, broadcasts, scheduling and CSV/PDF export endpoints were not added.

Local validation uses the insights Postman simulation derived from existing synthetic auth/school/family fixtures and supplied saved response shapes. Earlier discovery found no reusable owner mock. These tests do not establish live delivery, permissions or aggregate accounting.


## Step 19 — learner library search (2026-10-20)

Scope: the user's instruction to proceed includes US-17 search in MVP. Saved search requests explicitly use noauth. The learner workspace invokes the shared frontend proxy, whose upstream `/search` read and course-outline reads are anonymous. This is a frontend placement choice aligned with the existing learner readers, not a claim that the backend search API requires learner authentication. Public course browsing remains unchanged.

Supported query fields are q, types, languageCode and level. The demonstrated comma-separated type value is vocabulary,games,lessons; individual established tokens are offered too. No age group, course type, duration or server pagination was inferred. Search responses contain grouped arrays, not a verified global-total/paging contract. The unpopulated languages array is not guessed into a new result DTO; active language filtering remains supported.

Server projections drop draft and unsafe records/metadata and generate destinations from validated IDs. Course/lesson entries are checked against anonymously accessible published outlines; lesson names are taken from the outline and lead to course/access pages. Bounded checks omit unverifiable entries with a partial-results notice rather than exposing their names or discarding unrelated groups. Backend entitlement/publication controls remain authoritative.

The UI debounces, aborts superseded frontend requests, hides old matches while input changes, retains URL filters and handles empty/error/partial states. Counts mean shown matches only. Local Postman simulation/HTTP/browser checks establish frontend behavior against saved contract shapes and synthetic fixtures, not live backend search ranking, availability or authorization. Live anonymous reads were attempted separately with bounded timeouts; availability remains a release check. Full P2 filter coverage and populated language-hit examples remain contract dependencies.


## Step 20 — free-launch decision (2026-10-20)

The owner selected a free MVP. Individual checkout is excluded and school subscriptions remain phase 2. The frontend proxy rejects subscription checkout/verification; it does not grant or override backend entitlements. See `docs/step-20-review.md` for local evidence and scope. Live catalog reads returned 10 courses, with Hausa Advanced, Igbo Advanced and Yoruba Advanced premium-labelled; games returned 0. Required launch-course access still needs an isolated non-premium learner and approved backend access configuration. Provider checkout 503/IP allowlist, valid-reference verification and signed webhook tests remain deferred paid-scope gates.


## Step 21 release evidence (2026-10-20)

Full local quality checks and 15 Postman simulation groups pass; current workflow inventory is at the top of `verification-matrix.md`. This is frontend/contract evidence only. `step-21-review.md` consolidates live role/ownership, media attachment/provider, missing P1 formats, timed/idempotent learning, game/pronunciation assets, email delivery, certificate/QR and production acceptance gates. No missing contract was inferred to be a missing backend feature, no live records were mutated, and no essential requirement was waived. Remaining dropdowns use the shared custom component.

Read-only live checks in Step 21: languages, courses and games each exceeded a 20-second client bound; search returned success. Earlier successful course/game counts remain a dated snapshot, not a current availability guarantee. No live mutations were attempted.
