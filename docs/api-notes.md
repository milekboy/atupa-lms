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
