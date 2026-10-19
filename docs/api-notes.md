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
