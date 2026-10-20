# Step 21 — integration QA and release readiness

20 October 2026. Local frontend QA is complete for the demonstrated contracts; **release approval remains pending**. No essential P1 format or live integration has been silently removed from scope. Free launch is the owner-approved monetization scope; individual payments are excluded and school subscriptions remain phase 2.

## Delivered

- Replaced remaining native dropdown rendering in registration/profile, course/lesson editors, assignments, class record pickers and public course filters with the shared custom control. The option-compatible wrapper preserves controlled and FormData-based forms, required validation, disabled fieldsets, default-value changes, resets and implicit option values. Required errors focus the visible combobox. Dialog focus traversal excludes hidden/validation proxy fields.
- Removed the unused foundation demo component and five unreferenced Next starter SVGs. Synthetic fixtures remain confined to tests/Postman tooling; real screens continue to request backend records.
- Replaced the starter README with project setup, server-only environment variables, Vercel/session responsibilities, route/role inventory, media behavior, test commands and launch gates.
- Added `npm run typecheck` and `npm run test:integration`. The integration runner starts the actual built frontend and each existing Postman simulation, refuses occupied ports, records request evidence, uses synthetic data and stops only its own process trees. Test logs are temporary and must not be committed. Updated the legacy six-role shell test for current role-specific homes and permission-denied pages; parent inbox behavior is covered by the dedicated parent/insights suites.

## Automated verification

- Full ESLint, TypeScript, all **66 contract tests**, and production build passed after cleanup.
- **15 simulation groups / 18 HTTP test files / 90 checks** passed across the full run plus the repaired six-role auth regression. These exercise session renewal/logout, registration/recovery, public browsing/session continuity, course CRUD, quiz authoring/submission, position/heartbeats, GameCards, certificates/revocation, schools/classes, assignments/review, parents/linkage, administration, inbox/reports, search and free-launch guards.
- Actual upstream request events were present in all 15 simulation logs. Authorization denial, malformed/empty responses, timeouts, ambiguous mutations and retry/reconciliation are covered by the focused suites. Simulated ownership rules demonstrate frontend behavior against those expectations; they do not establish live backend isolation.
- Reused repository simulations derived from the supplied collection and earlier synthetic fixtures. Earlier owner-mock discovery found no reusable published mock. No simulation was deployed and no live records were created, modified or deleted.

## Browser verification

- Registration: a missing required language prevented submission, displayed “Choose an option” and focused the visible combobox. Keyboard End/Enter selected Hausa, cleared the error and placed `hausa` in the named form value. No account was created by this UI check.
- Reports: Home/End/Enter selection changed the learner URL and loaded the expected class/learner record. The Find a page dialog trapped forward/reverse Tab, closed on Escape and restored focus to its trigger.
- The report page had no horizontal document overflow at 320, 375, 768, 1024 and 1440px, with zero native select elements. Light/dark views were inspected. Body/muted text token ratios against their tested surfaces were 13.14/6.23/5.79 in light and 13.49/8.12/7.26 in dark. These checks do not cover every component/state.
- Public catalog: keyboard-selected Hausa/Beginner submitted the GET form with the correct URL and one matching synthetic course. Clear reset both visible custom controls; Back restored the filtered choices. At 375px the page had no horizontal document overflow or native select elements.
- Screenshot: `atupa-step-21-qa.png` in the task output folder. Temporary browser tab/viewport and test listeners were cleaned up; the user's tabs/port 3000 were untouched.

This is a focused keyboard/responsive review, not a complete screen-reader, physical-device, media-provider or WCAG certification. Reduced-motion rules are present; final assistive-technology and OS preference checks remain in acceptance.

## Current read-only live availability

During this pass, `/languages`, `/courses?page=1&limit=100` and `/games?page=1&limit=20` timed out at the 20-second client bound; `/search?q=yoruba` returned a successful envelope. This does not establish a permanent outage, full search correctness or entitlement behavior. The earlier Step 20 successful catalog snapshot remains 10 courses / 3 premium-labelled advanced courses / 0 games. Recheck availability during the controlled deployed acceptance run.

## Release blockers and acceptance work

| Gate | Concrete next check | Owner / evidence needed |
|---|---|---|
| Free required content | Fresh non-premium learner enrolls in every approved launch pathway and opens required lessons/practice/quizzes | Product confirms launch set; backend configures approved access. Last successful catalog: 10 courses, 3 advanced premium labels; games empty. |
| Real role boundaries | Two unrelated learners/parents/teachers/schools attempt cross-record GET and mutation, before/after unlink/removal/deactivation | Isolated accounts for six roles and permission to use disposable records; backend denial evidence |
| Lessons and media | Actual image/audio/video upload → confirm → attach → reload → play; upload failure/limit handling | Provider configuration and demonstrated lesson attachment/storage DTOs; no guessed contract |
| Required assessment formats | Agree and verify every P1 question/activity format and serialization/grading | `assessment-format-matrix.md`; missing matching/listening/etc. contracts remain blocking unless owner re-scopes |
| Games and pronunciation | Physical card scan on another device, real pronunciation asset, agreed game launch/result and reward deduplication | Backend/media/game team; current saved records do not prove complete launch assets |
| Email onboarding | Delivered creator/member invitations, successful password setup/reset, expired/reused token handling | Disposable inboxes and valid delivered links; synthetic token tests are insufficient |
| Progress and timed attempts | Two devices retain position, foreground minutes reconcile, timed reload/expiry and duplicate submit/reward checks | Isolated learner and backend timing/idempotency evidence |
| Assignments and parents | Written/lesson create-submit-review + remaining P1 types/media; code expiry/reuse/unlink, real feedback/achievement events | Confirm remaining DTOs, populated examples and live event delivery |
| Certificates and printing | Backend course completion issues certificate; valid deployed QR scans; revoke reflected publicly; landscape PDF readable | Isolated learner/admin and actual full QR; deployed print preview/physical scan |
| Production | HTTPS cookie/refresh/revocation, correct origins/base path, QR/email links, search/public content availability | Deployed environment access and controlled smoke run; backend revocation across devices |
| Product/accessibility acceptance | 320/375/768/1024/wide, keyboard/dialog focus, light/dark contrast, reduced motion, long diacritics, screen reader and slow/empty accounts | Owner review + real devices/assistive technology; record explicit acceptance or scope changes |

Conditional paid-provider IP allowlist, valid payment-reference verification and signed webhook entitlement tests are deferred with paid scope. A browser callback never grants access.

## Brief manual review

1. Use course language/level filters and registration/profile language dropdowns by mouse and keyboard. Reload/Back/Clear must keep the displayed choice accurate. Required choices must prevent incomplete submission and show a useful error.
2. Test teacher class/assignment pickers and a confirmation dialog: keyboard focus stays inside; Escape closes when idle; focus returns to its trigger. Check at phone/tablet/desktop sizes and in both themes.
3. Run a learner course through practice/quiz/progress/certificate, plus one teacher assignment review and parent view. Repeat with unrelated accounts and verify denied access. Use only approved isolated data.
4. Complete the live gates above before launch approval. A local passing suite is not evidence that real email, media, entitlements or deployed QR links work.

Step 21 remains unchecked until these essential acceptance gates are met or explicitly re-scoped by the owner. No deployment, commit, push or live test-data cleanup was performed.
