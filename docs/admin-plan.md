# ATUPA LMS - Admin Platform Delivery Plan

Baseline: 16 November 2026 (Africa/Lagos). Step 1 frontend foundation is implemented with local verification; live permission/role acceptance remains open. Step 2 frontend user/verification workflows are implemented with local verification; its live gates remain open. Step 3 frontend school/class onboarding is implemented with local verification; live gates remain open. Step 4 supported content-studio frontend and protected lesson preview are implemented with local verification; curriculum/reorder/media/review gates remain open. Step 5 supported review queue/decisions are implemented with local verification; ordinary-course and policy/live gates remain open. Step 6 supported visibility controls and separated public/enrolled course projections are implemented with local verification; live access/policy gates remain open. Step 7 supported finance oversight/subscription controls/plan creation are implemented with local verification; feature-preserving updates and live finance gates remain open. Step 8 supported overview, scoped report downloads and export transport are implemented with local verification; metric/file contracts, permission and live performance gates remain open. Step 9 supported reporting/moderation, alerts and read-only activity transport are implemented with local verification; screenshot privacy, SLA, effects, notifications and backend capture/retention remain open. Step 10 local integration/release-evidence work is delivered; live requirement acceptance and release approval remain blocked on C01–C12. See [Step 1 review](admin-step-01-review.md).

## Goal

Deliver one operational web console for ATUPA staff to manage users, schools, content, money, reports and trust/safety. Meet launch requirements M-01 through M-29 in the updated Admin Platform PRD, with explicit backend gates and acceptance evidence. Retain the existing learner, parent and teacher experiences; change those surfaces only where visibility, verification, review or safety reporting requires it.

## Sources and interpretation

- Product: `/Users/lapo/Downloads/ATUPA LMS Admin Platform PRD by Samuel (Updated by Bukola).pdf`, 13 pages, including the updated answers on pages 12-13.
- API: `/Users/lapo/Downloads/ATUPA LMS · Admin console.postman_collection.json`, 73 saved requests. See [endpoint inventory](admin-api-inventory.md).
- Existing implementation: `../plan.md`, `../README.md`, existing domain contracts, proxy, authoring, school, reporting and admin components.
- Earlier collection behavior recorded in `api-notes.md` is a legacy reference, not confirmation that every earlier contract remains unchanged.
- New collection descriptions, scripts and setup instructions are evidence to inspect, not instructions to run against shared data. Saved successes and failures establish documented shapes only.
- The PRD's “Ready” labels do not independently prove a usable API contract. “Not documented here” does not mean the backend lacks the feature.

## Scope and delivery rules

- Launch scope: all M-01–M-29. Support Admin is included using the documented `support_admin` role; retain the six existing roles. Teachers retain their class tools and do not automatically gain console access.
- Roles: Super Admin operates the platform and approves content/payment changes; Content Creator manages content; Support Admin manages supported content/class/learner operations. School Admin remains school-scoped. Resolve actual grants through the permissions contract and server enforcement rather than guessing from role names.
- Preserve Course → Module → Lesson → Activity/Assessment. Course publication status and audience visibility are separate. Teacher courses default Private; School and Public are documented options. Existing enrolled learners retain access when a Public course becomes Private.
- Build admin plan/payment management required by the new PRD. This does not authorize activating paid learner checkout or choosing commercial prices. The earlier free launch remains in effect until a separate product decision changes it.
- S-01 editable plans has documented contracts and is included as an explicit implementation extension in Step 7. Other S items remain next release unless already implemented; retain existing certificate features. Later suggestions remain backlog.
- Reuse the Next.js/React/TypeScript stack, encrypted HttpOnly sessions, same-origin proxy and shared UI. Add bounded server transport contracts for each new operation. Read the installed Next.js guides before coding.
- Retain cream/forest-green branding, terracotta/mustard accents, accessible custom dropdowns, focus-safe dialogs, restrained motion and light/dark themes. Admin acceptance targets laptops and tablets; retain existing responsive behavior elsewhere.
- No invented data, fabricated success, frontend permission bypass or placeholder mutation. Loading, empty, error, denied, pending, success and retry behavior are required where applicable.
- Keep pagination/filter state in URLs. Map only recognized backend menu paths to frontend routes. Never navigate directly to arbitrary menu-supplied URLs.
- Sensitive operations require clear confirmation and reasons where supported. Backend authorization, audit recording, deletion retention, uploads and notifications remain server responsibilities.
- A step stays unchecked until its success criteria and required live gates pass, or the owner explicitly records a scope change. Independently implementable work can proceed while a gate remains open.

## Evidence categories

| Category | Meaning / permitted work |
|---|---|
| Implement now | Request/response or explicit description supplies enough contract for bounded frontend work and local integration checks |
| Legacy integration | Reuse existing implemented contracts, then reconcile with the updated backend; not fully documented by this new collection |
| Clarification | Missing/contradictory fields, permissions or behavior; do not invent the affected feature |
| Live acceptance | Verify on approved isolated records against the actual deployment; local simulations cannot satisfy this |

## PRD coverage and delivery ownership

| Requirement | Delivery step | Contract position |
|---|---|---|
| M-01 Overview | 8 | Documented; metric inconsistencies C08 |
| M-02 Role menus | 1 | Documented; incomplete permission/menu example C01 |
| M-03 Find users; M-04 user detail; M-05 staff creation; M-07 access help | 2 | Documented; invitation/delivery and grants require acceptance |
| M-06 edit/deactivate/delete | 2 | Details PATCH demonstrated; role/deactivate/delete and safeguards require legacy reconciliation/C02 |
| M-08 registration approval; M-09 profile/join code | 2, 3 | Verification partly covers approval; PRD teacher/school terminology and approval semantics C03 |
| M-10 members; M-11 bulk learners; M-12 classes/assignments | 3 | Bulk/class creation documented; remaining membership/assignment contracts legacy |
| M-13 languages; M-14 hierarchy/reorder/preview; M-15 quizzes | 4 | Existing editors + new setup examples; reorder/all eight formats unresolved C04 |
| M-16 media; M-17 vocabulary/culture/games; M-18 GameCards | 4 | Existing contracts; updated limits/private assets/review coverage C05/C06 |
| M-19 review | 5 | Lesson/library/visibility documented; course approval and exceptions C06 |
| M-20 payments; M-21 subscriptions | 7 | Documented lists/grant/cancel; refund/entitlement policies C10 |
| M-22 learner reports; M-23 export | 8 | Class report + export routes documented; files and universal export scope C09 |
| M-24 activity log | 9 | Documented list/filter; full capture/retention C11 |
| M-25 visibility | 6 | Documented transitions and denial; access matrix/live regression required |
| M-26 reporting; M-27 queue; M-28 verification; M-29 alerts | 9, 2 | Core requests documented; SLA/alert/notification coverage C07 |

## Backend and product clarification register

All entries below are open at this baseline. Proposed owners identify functions, not confirmed assignees. Record answers and dated evidence in `api-notes.md` during implementation.

| ID | Clarification / acceptance evidence needed | Proposed owner | Affected steps |
|---|---|---|---|
| C01 | Complete permission keys and menu entries for Super/Support/Content/School Admin; response example exposes only three entries/permissions. Confirm Support scope, school boundaries and UI path mapping. | Backend + product | 1–10 |
| C02 | Role-change/deactivation/delete DTOs; last-Super-Admin protection; session invalidation; 30-day soft-delete and restoration endpoint/retention. Reconcile permanent user deletion wording with content retention rules. | Backend + product | 2, 4, 10 |
| C03 | Distinguish account approval from credential verification and school verification. Clarify M-08/M-09's users/teacher wording inside Schools; logo/plan/join-code contracts and teacher agreement enforcement. Rejection currently documents blocked login. | Product + backend | 2, 3 |
| C04 | Reorder endpoints and payloads; all eight quiz types and required activity types, answer/grading shapes; existing edit semantics. Confirm faithful preview and draft access. | Backend + curriculum | 4 |
| C05 | Enforced 10 MB image / 20 MB audio / 300 MB video limits versus existing 25 MB direct / 4 MB fallback; production upload/progress flow, asset-kind checks, private verification/report delivery, unused-file deletion and attachment rules. | Backend + media | 2, 4, 9 |
| C06 | Ordinary course review-decision method/path and response; all reviewed entity types including quizzes/GameCards; published edits/re-review and author identity. PRD says second-person approval, but example permits Super Admin vocabulary to publish directly; Private teacher lessons also publish directly. Resolve policy, don't silently treat exceptions as accepted. | Product + backend | 4–6 |
| C07 | Child-safety SLA: description says critical/24h, saved inappropriate-content report is high/48h. Confirm severity mapping, notification delivery, 24h maximum response target, full alert types/thresholds and resolution privacy. | Product + safety/backend | 9, 10 |
| C08 | Define active learners versus all active users; reconcile zero quiz attempts/two passes/0% pass rate; metric windows/timezone and GameCard time window. Validate aggregates before displaying as reliable KPI. | Backend + reporting | 8 |
| C09 | Export MIME/disposition/error contracts and complete authorized coverage for “any report table”; current download requests lack saved file examples. Confirm learner reports and school CSV where required, full filtered dataset behavior and performance. | Backend + reporting | 8 |
| C10 | Confirm feature-preserving plan PATCH: the saved price-only update clears features. Refund operation/approval/limits and payment audit semantics; grant is not a monetary refund. Define plan-to-content entitlement mapping (features text is not enforcement), renewal/cancellation behavior, school plans and grant limits. Paid checkout activation/pricing remains a product decision. | Product + payments/backend | 7 |
| C11 | Search/filter/pagination contracts and complete audit capture for create/edit/delete/role/publish/payment actions; tamper protection, redaction and explicit retention/access policy. “As long as possible” is not a precise retention rule. | Backend + product | 9 |
| C12 | Bulk max rows/size, duplicate handling, transaction/concurrency behavior and ambiguous retry reconciliation; delivered onboarding email and secure printable alternative if required. Never print reusable passwords without an approved contract. | Backend + onboarding | 3 |

---

# [ ] Step 1 - Establish admin contracts, permissions and console foundation

Status: frontend foundation delivered 16 November 2026; local evidence and manual tests in [Step 1 review](admin-step-01-review.md). Checkbox remains open for C01 and live role/school acceptance.

## Requirements — implement now

- Map M-01–M-29 to screens, roles, methods, payloads, success/error states and evidence. Start with the coverage table and endpoint inventory above.
- Integrate GET `/admin/me/permissions`; add `support_admin` throughout role parsing/session/navigation and explicit operation allowlists.
- Adapt the existing dashboard shell into one admin console with shared components, safe route mapping and server-side checks. `/admin` is the collection's proposed menu namespace; reconcile it with existing `/dashboard` routes without duplicating business logic.
- Document role-specific local fixtures and set up isolated contract/HTTP simulations. Keep old learner/parent/teacher flows intact.

## Backend clarification / live gates

- Resolve C01 before treating dynamic menus as complete. No privilege inferred from a missing permission or menu item.
- Confirm real Super/Support/Content/School Admin grants and cross-school denial using approved isolated accounts.

## Success criteria

- Each role sees and can execute only supported operations; direct URL/proxy access also enforces restrictions.
- Expired/denied/error states are usable; sessions remain protected; the baseline traceability is reviewable.

---

# [ ] Step 2 - Deliver user administration and teacher/school verification

Status: frontend delivered; see [Step 2 review and test checklist](admin-step-02-review.md). Live C01/C02/C03/C05 and email/audit acceptance remain open.

## Requirements — implement now

- Use GET `/admin/users` with demonstrated name/email/role/active/verification filters and GET `/admin/users/:id/overview` for profile, school, subscription, progress, courses, classes and last login.
- Reuse POST `/admin/users` for invited staff, PATCH `/admin/users/:id` for demonstrated edits, POST `/admin/users/:id/access-link` for invite/reset delivery. Never expose passwords.
- Build teacher verification document submission through POST `/users/me/verification`, queue GET `/admin/verifications`, and decision POST `/admin/users/:id/verification`.
- Build school submission POST `/schools/:id/verification` and decision POST `/schools/:id/verification/decision`. Reuse documented purpose-specific `/media/upload` forms for images; protect document display.

## Backend clarification / live gates

- Resolve C02/C03/C05 for destructive actions, account approval, private documents and production delivery. Reconcile legacy user management fields before extending edits.
- Confirm invitation/reset delivery, expired links, rejection behavior, verified badges, last-admin protection and revoked/deactivated sessions.

## Success criteria

- Authorized staff can find users, inspect permitted details, invite/recover access and make auditable verification decisions.
- Unauthorized accounts cannot retrieve verification assets or change roles/statuses; destructive controls remain unavailable until supported.

---

# [ ] Step 3 - Complete school/class operations and bulk learner onboarding

Status: frontend delivered 17 November 2026; see [Step 3 review and test checklist](admin-step-03-review.md). C01/C03/C12 and real onboarding/email/audit acceptance remain open.

## Requirements — implement now

- Reuse existing school/profile/member/class/assignment components and reconcile their contracts with current role grants.
- Use POST `/classes` with demonstrated `teacherUserId`; support teacher selection, learner membership and course assignment through reconciled existing endpoints.
- Implement GET `/admin/learners/bulk/template` and POST `/admin/learners/bulk`: select CSV or supported text, dry-run first, show row errors, then explicit save with `dryRun=false` and optional documented class target.
- Show actual created/failed/added-to-class results and preserve input on failure. Do not blindly retry an uncertain import.

## Backend clarification / live gates

- Resolve C03/C12; confirm school profile, join-code rotation and teacher/member scope through legacy reconciliation.
- Verify a 100-learner onboarding journey, duplicate/race behavior and delivered setup links; no guessed printable credentials.

## Success criteria

- An authorized operator can onboard a school with 100 learners in under 30 minutes, assign the right teacher/classes/courses and inspect each validation failure.
- Invalid rows save nothing as documented; unrelated schools remain inaccessible.

---

# [ ] Step 4 - Adapt the complete content studio and course structure

Status: supported frontend delivered 17 November 2026; see [Step 4 review and test checklist](admin-step-04-review.md). C01/C04/C05/C06 and real media/curriculum acceptance remain open.

## Requirements — implement now

- Retain Course → Module → Lesson and language/level organization. Reuse existing course, lesson, assessment, vocabulary, culture, game, GameCard and media editors.
- Preserve new `visibility`, `ownerType`, review and author fields across normalization; separate editing, publication and audience controls.
- Support demonstrated text/media lesson blocks and current verified assessment formats; preserve unknown data on edit.
- Build permission-scoped draft preview using the learner renderer and safe preview data, never publicizing draft answers or author-only fields.
- Retain media reuse, GameCard-to-lesson links and QR tools where existing contracts support them.

## Backend clarification / live gates

- Resolve C04/C05/C06 before claiming drag reorder, all eight question types, all required practice formats, new limits or complete library review support.
- Implement clarified contracts within this step; missing formats remain launch gaps, not automatic deferrals. Verify real upload → attach → reload → preview → learner playback.

## Success criteria

- Staff can create/edit the agreed full curriculum without losing blocks, ordering or metadata; preview matches the authorized learner experience.
- Every required question/activity format and media limit has documented serialization, grading and live evidence, or an explicit owner-approved scope change.

---

# [ ] Step 5 - Implement content review and controlled publication

Status: supported frontend delivered 17 November 2026; see [Step 5 review and test checklist](admin-step-05-review.md). C01/C06 and actual server policy/audit/publication acceptance remain open.

## Requirements — implement now

- Build GET `/admin/reviews` with courses, lessons, visibility requests, library groups and returned totals.
- Use lesson publish to submit eligible content; represent `in_review` and `submittedForReview` rather than falsely showing Published.
- Implement POST `/admin/reviews/lessons/:id`, `/admin/reviews/library/:kind/:id` and `/admin/reviews/courses/:id/visibility` with supported approve/reject/comment bodies.
- Display author, submission state and rejection feedback; refresh after decisions and handle 409 for content no longer pending.

## Backend clarification / live gates

- Resolve C06 for ordinary course approval, Super Admin exceptions, private-course policy, self-review and published edits. Don't invent a course review endpoint.
- Verify creator/support submission and Super Admin approval, rejection/resubmission, stale decisions and no self-approval where required.

## Success criteria

- The agreed second-person policy is enforced server-side for every included content type; unapproved content cannot leak to public learners.
- Approvals/rejections persist with identifiable reviewers, comments and audit evidence.

---

# [ ] Step 6 - Deliver course visibility and learner-facing access changes

Status: supported frontend delivered 17 November 2026; see [Step 6 review and test checklist](admin-step-06-review.md). C01/C06, actual notification and retained-access acceptance remain open.

## Requirements — implement now

- Implement PATCH `/authoring/courses/:id/visibility` for Private/School and requested Public; show pending public requests separately from current visibility.
- Gate Public requests on returned verification/permission state; backend remains authoritative.
- Add admin course listing GET `/admin/courses` and PATCH `/admin/courses/:id/visibility` with reason.
- Update public catalog cards with `byAtupa` and author verification data. Retain private defaults, safe authorized destinations and existing enrollment/progress.

## Backend clarification / live gates

- Resolve C01/C06; verify Private assigned-class access, School audience membership, Public review, unverified-teacher restrictions and behavior after member removal.
- Verify previously enrolled learners retain access after an admin makes a course Private, while unrelated new learners cannot discover/take it.

## Success criteria

- Audience and publication controls behave independently and consistently in catalog, search, direct URLs and enrollment/lesson APIs.
- Admin reasons reach the teacher; verified and “By ATUPA” labels reflect backend identity.

---

# [ ] Step 7 - Build payment oversight, subscriptions and editable plan tiers

Status: supported frontend delivered 17 November 2026; see [Step 7 review and test checklist](admin-step-07-review.md). C01/C10, feature-preserving plan PATCH and live financial/access/audit acceptance remain open.

## Requirements — implement now

- Implement GET `/admin/payments` with demonstrated date/status filters; payment records are read-only.
- Use GET `/admin/subscriptions`, POST `/admin/subscriptions/grant` and `/cancel`, with reasons and explicit consequences.
- Implement S-01 through GET/POST `/admin/plans` and PATCH `/admin/plans/:code`; use integer kobo, period, owner type, tier, feature descriptions and active state.
- Honor documented grant caps (366 days per grant; 732 days ahead total), with server validation authoritative. Price changes affect new payments only as documented.
- Restrict financial changes to Super Admin. Preserve existing free learner launch and do not activate checkout as a side effect.

## Backend clarification / live gates

- Resolve C10 before offering refunds or claiming feature descriptions enforce entitlements. Confirm plan price changes, cancellation timing and school ownership behavior.
- Validate authorization, subscription access changes, audit records and ambiguous mutation outcomes on isolated records.

## Success criteria

- Super Admin can inspect payments and manage documented plans/subscriptions without editing payment history or confusing grants with refunds.
- Existing users' access and payment amounts follow confirmed policy; paid checkout remains a separately recorded decision.

---

# [ ] Step 8 - Deliver overview, scoped reports and real file exports

Status: supported frontend delivered 18 November 2026; see [Step 8 review and test checklist](admin-step-08-review.md). C01/C08/C09 and live dataset/file/performance acceptance remain open.

## Requirements — implement now

- Use GET `/admin/overview` for platform totals and needs-attention links. Render only defined, internally consistent metrics.
- Reuse GET `/reports/classes/:id` and reconciled learner/school reports with role/school boundaries.
- Integrate documented CSV/PDF export routes for class reports, school PDF, users, payments, subscriptions, safety reports and activity log through server-mediated file transport.
- Preserve filters, handle file response versus JSON error, use safe filenames and avoid labeling current-page printing as a full export.

## Backend clarification / live gates

- Resolve C08/C09 before accepting KPI correctness or universal export coverage; keep unresolved panels explicitly unavailable.
- Validate actual downloaded files, totals/filter parity, authorization, readable PDFs and missing learner/school export needs.

## Success criteria

- Leadership sees accurate growth/learning metrics and relevant pending work; users can download authorized complete report datasets.
- Lists meet the PRD's under-two-second target with 10,000 users in an agreed test environment using server pagination/search.

---

# [ ] Step 9 - Complete trust/safety operations, alerts and activity log

Status: supported frontend delivered 18 November 2026; see [Step 9 review and test checklist](admin-step-09-review.md). C01/C05/C07/C11 and backend effects/capture/privacy/SLA acceptance remain open; screenshot uploads are off by default.

## Requirements — implement now

- Add learner/parent Report entry points on supported teacher/course/class contexts; allow documented school targets. Use purpose-specific screenshot upload, POST `/safety-reports` and GET `/safety-reports/mine`.
- Build GET `/admin/safety-reports` and `/:id`; use returned severity, assignee, due time and `allowedOutcomes`.
- Implement assign/comments/resolve actions with documented reason/outcome handling; do not reveal reporter identity to the reported party.
- Integrate GET `/admin/alerts` and PATCH `/admin/alerts/:id`; display returned signals without claiming every detection rule is present.
- Integrate GET `/admin/activity-log` with documented filters and links. Audit data is read-only; never create substitute browser logs.
- Build safety/audit transport and essential backend capture before enabling risky admin mutations in earlier steps; the completed operational workspace is accepted here.

## Backend clarification / live gates

- Resolve C05/C07/C11: private screenshots, 24h safety response, actual notifications, full detectors and audit/retention guarantees.
- Verify target-specific moderation effects, critical escalation, reporter updates, sensitive-data redaction and denied access for unauthorized roles.

## Success criteria

- Reports move from submission to recorded outcome with privacy, a reference and notification; child-safety handling meets the agreed maximum 24h response requirement.
- Sensitive operations are attributable in a protected searchable log; alert acknowledgements persist.

---

# [ ] Step 10 - Complete integration, regression and release acceptance

Status: local QA/release-evidence work delivered 18 November 2026; see [Step 10 review and test checklist](admin-step-10-review.md) and [live release acceptance](admin-release-acceptance.md). All M-01–M-29 records have dated local evidence and remaining gates; no live/product acceptance or production approval is inferred.

## Requirements

- Close the M-01–M-29 evidence matrix: contract, frontend status, backend gap, role, success/empty/error behavior, test environment and dated evidence.
- Run isolated Super/Support/Content/School Admin journeys plus learner/parent/teacher regressions, including direct API and cross-school/record denial.
- Test review/self-review, verification, visibility/enrollment retention, bulk import, real emails/uploads/exports, subscription changes, safety SLA and complete audit capture.
- Confirm last-admin protection, 30-day content recovery, session invalidation, production origins, private asset delivery and all clarification answers.
- Run full lint, TypeScript, production build and relevant contract/HTTP suites; add meaningful coverage for new permission and workflow boundaries.
- Verify keyboard/focus/dialog/error behavior, laptop/tablet light/dark/reduced-motion layouts and diacritics. Retest learner/parent reporting and catalog on mobile.
- Record product acceptance: zero developer dependency for must-have operations within one month, 100-learner onboarding under 30 minutes, agreed performance evidence and unresolved accepted scope changes.
- Update README, API notes, verification matrix and review documents. Never mark saved examples or simulation results as live backend certification.

## Success criteria

- All 29 launch requirements are accepted with appropriate real deployment evidence or explicitly re-scoped by the owner.
- Open essential backend gates block release approval, while completed frontend work remains separately recorded.
- No unintended paid-launch activation, data exposure, regression in existing learning journeys or undocumented permission expansion.

---

## Next release and later backlog

- S-01 is explicitly included in Step 7 because the new collection supplies editable plan contracts; commercial activation remains separate.
- S-02 discounts, S-03 announcements, S-04 content health, S-05 versions, S-06 copying, S-07 expanded support view, S-08 scheduled reports, S-09 settings and S-11 admin two-step login remain next release pending scope and contracts.
- S-10 certificate administration already has frontend coverage; retain it and reconcile live permissions rather than rebuilding it.
- Later: recorded support impersonation, translation workspace, advanced learning insights, invoice billing, data-request workflows, GameCard stock and custom roles. No endpoints are inferred from these suggestions.

## Release dependency rule

Numbered steps are work packages, not permission to launch partially governed content. Audit capture and server permissions are prerequisites to enabling sensitive operations. Verification and review must precede Public publication; safety reporting/moderation must be live before any new Public course rollout. Backend contract work can proceed alongside independent frontend work, but affected acceptance criteria remain open.
