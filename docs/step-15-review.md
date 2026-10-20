# Step 15 — Assignments and teacher workflows

Frontend delivered 20 October 2026. Keep the plan checkbox open pending the live contract and authorization gates below.

## Delivered

- **Assignments** is available from teacher, learner, school-admin and platform-admin navigation, and from class details. School/admin grants remain subject to backend confirmation. Learners' classes and assignments are grouped under Learning.
- Teachers choose an authorized, paginated class, create written work (title, instructions, maximum score) or a lesson assignment, open class assignments, review responses, save a score/feedback/completion and delete with exact-title confirmation. Creation confirms the class name. Archived or other-teacher class controls are read-only.
- Lesson targets come from published outlines for courses assigned to the selected class. No pasted lesson IDs or invented assignment enums are exposed. A class without assigned courses prompts the teacher to assign one first.
- Learners get a paginated assignment list with API status, start an assignment, submit written text, read score/feedback, and open the existing lesson reader for lesson work. Submitted/completed written work has no duplicate-submit control. An opened assignment does not mark completion. Lesson status is refreshed from the backend, never set by a launch click.
- Teacher overview uses `/dashboards/teacher`: students, active students, authored/assigned courses, assignment totals/statuses, assessment average and recent quiz/activity records. Class and learner reports use authorized class/roster selectors and the documented report endpoints. Missing metrics display an em dash. No attendance, fabricated comparisons or time series were added. The active-student time window is not supplied by the saved contract.
- Mutations reuse pending/duplicate prevention, inline validation/server errors, preserved input on failure, cancellation and toasts. Uncertain network/5xx results disable resubmission within the dialog and ask the user to check saved records. No automatic mutation retry is made. Server-side role/path checks protect assignment operations; a learner response allowlist removes other learners' submissions and rejects unrelated records.

## Verification

- Production build/TypeScript and targeted ESLint passed. All 50 unit/contract tests passed; navigation checks also passed after grouping learner links under Learning.
- Six HTTP scenarios through the production frontend transport passed: create/read; start/submit/review/reload with Yoruba text; role and unrelated-record denials; dashboard/reports; persisted-but-unconfirmed submission reconciliation and deletion; published lesson target selection.
- Browser review with synthetic accounts verified class selection, creation fields, published lesson selector, teacher class reports, learner start/written submission, teacher review/completion, feedback and score, and 375px learner layout. The reviewed result was stored by the local simulation, not by a live account.
- Postman simulation request logs were inspected to confirm frontend requests reached the fixture. The simulation composes Step 14 authentication/school fixtures with the supplied collection's assignment, teacher dashboard and report examples. Earlier owner-mock discovery provided no reusable owner mock; these fixtures remain local-only. Their modeled transitions/permissions are tests of the frontend, not proof of the live backend's enforcement.

Repeat: `npm run build`, then run `npm run simulate:assignments` and `npm run start:session-test` in separate terminals; run `npm run test:assignments-http`. Ports are 4900 and 3100. Synthetic role addresses and disposable `fixture-password` are only for this simulation, never production. Do not use the entire saved collection against a shared environment.

## Still pending for release

1. Live isolated teacher/learner flow, school/admin grants, ownership, cross-class/school denial, deletion effects and concurrent/duplicate enforcement.
2. Learner assignment-detail response shape: the collection saves a teacher detail (`assignment` plus `submissions`) and a learner mine list. The UI accepts that documented shape and a single `submission`; the actual learner detail contract needs verification.
3. Lesson automatic completion, already-completed lesson behavior, quiz targets/completion rules and resubmission/review-edit policy. The frontend does not invent completion or grading transitions.
4. Quiz, vocabulary, audio, game and cultural-research assignment enum values/DTOs, target lookup and grading behavior. Only `written_work` and `lesson` creation are demonstrated and enabled.
5. Submission upload roles, attachment request fields, file limits and ownership. The saved submission sends only `text`; response `mediaUrls` is not evidence of an upload contract. Safe existing HTTPS attachment links can be opened; no speculative upload/URL-entry form was added.
6. Teacher active-student period and dashboard/report reconciliation with real learning events; date/score validation limits and reliable idempotency/outcome reconciliation.

## Brief manual test

Teacher: Assignments → choose a class → New assignment → written work. Learner: start it, submit Yoruba text, then confirm Submitted after refresh. Teacher: open it, score within the maximum, add feedback and save completion. Learner: refresh and confirm score, feedback and Completed. Also test lesson target selection/opening, class/learner reports on the teacher overview, cancelling dialogs, invalid scores, delete confirmation and mobile layout.
