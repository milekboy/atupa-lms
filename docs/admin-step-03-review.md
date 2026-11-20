# Admin Step 3 — School/class operations and bulk learner onboarding

Date: 17 November 2026 (Africa/Lagos).

## Delivery status

Frontend delivered and locally verified. Step 3 remains unchecked for live C01/C03/C12 acceptance, real invitations/audit evidence and the 100-learner timing target. No real learners, schools, classes or emails were created during implementation.

## Implemented

- `/admin/onboarding` is a Super Admin workspace linked from Users. Existing school profile, settings, join-code, membership and class/course tools are reused through links to their protected LMS pages. Existing teacher, school, learner and parent workflows retain their authorization and contracts.
- Super Admin can create a class for a selected active teacher. A searchable paginated teacher picker sends the documented `teacherUserId`, name and language, then links to the existing class workspace for learners, course assignment and teaching operations. The existing Super Admin class form also requires teacher selection; teacher-created classes keep their previous behavior.
- Bulk invitations download the actual protected backend CSV template. Operators can choose one CSV file or paste CSV text, optionally select an authorized active class, validate, inspect row errors and confirm the learner count before saving. CSV content, validation results and errors stay visible on failure. Input/class changes invalidate the validation pass. The current interface conservatively caps CSV at 512 KB pending confirmed backend limits.
- The bounded console transport requires a fresh profile and permission check, Super Admin role and `users.manage`; teacher search additionally requires `users.view`. Missing permissions fail closed. Support/School/Content access to the new bulk endpoints is withheld pending complete C01 grants; existing scoped school/class tools remain available to their established roles.
- Validation saves nothing. A ten-minute signed HttpOnly receipt binds approval to the exact CSV, class and encrypted session. A save without matching validation is denied. The receipt is cleared on a save outcome or invalid validation. This is validation binding, not backend idempotency or a transaction guarantee: the backend must revalidate duplicates, school/class ownership and every row atomically. Concurrent/replayed requests still require backend protection under C12.
- File/form/query fields and class-create payloads are explicitly bounded. Response projections expose documented counts and row fields only; tokens, passwords and arbitrary fields are removed. Inconsistent results fail visibly. Saving is locked against double-clicks; an ambiguous result locks the current import and points to record reconciliation before any fresh import. No passwords are generated or printed.

## Local evidence

- Lint, production build and 86 contract checks pass.
- All 16 existing regression groups passed with the new HTTP suite; final admin rerun also covered a 100-learner save and a duplicate introduced between validation and save (120 HTTP checks total across the groups).
- Tests cover real frontend transport, protected CSV download, selected teacher, bounded payloads, no-save validation, errors, changed CSV/class/session, invalid receipts, inconsistent results, file upload, missing grants/roles, CSRF, successful accounts/class membership, duplicate/race behavior and an uncertain saved outcome.
- Browser checks used isolated synthetic records: login, template download, teacher/class creation, invalid CSV, corrected validation, edit invalidation, count confirmation, saved learner readback, custom dropdowns, tablet width and light/dark layouts. Existing school, teaching, learning, media, family, assignment, reporting and session regressions passed.

## What to test

1. Sign in with an existing Super Admin. Open Admin console → Users → School onboarding & bulk learners. Confirm unauthorized roles and missing-grant accounts cannot open or call the new workflow.
2. Open Schools & profiles and School membership. On isolated records, check profile/settings, join-code rotation, teacher/learner invitations and roster changes; verify another school's records remain inaccessible to a school administrator.
3. Create a class for a selected teacher. Refresh its details, verify teacher and school association, then use Classes & course assignments to add learners, assign a course and inspect the roster. Check teacher-created classes still work.
4. Download the CSV template. Upload or paste a file with invalid email, missing name, future birth date and unknown language. Validate: each row should explain errors and no learner should be created. Fix the rows and validate again.
5. Change a validated row or target class: saving must become unavailable until another validation. Confirm the learner count and save a clean isolated list. Check actual created/failed/added-to-class counts, Users search and refreshed class membership. Try a duplicate email: no rows should save as documented.
6. Verify actual password-setup emails and fresh learner sign-in against the real backend. On an approved 100-learner cohort, measure the full onboarding journey against the under-30-minute target. Local fixture timing does not satisfy this acceptance criterion.
7. Recheck learner enrollment/lessons/quizzes/progress, parent views, teacher authoring/classes, school membership, logout/expiry and tablet/light/dark layouts. On a controlled interrupted save, check actual records before attempting another import.

## Backend clarification and live acceptance

- C01: confirm complete permissions/menu and which roles may bulk onboard or create classes for other teachers. `users.manage` is the conservative current gate, not a confirmed complete permission vocabulary.
- C03: school profile/join-code and account-versus-verification terminology remain to reconcile. The new bulk contract has only `classId`, not `schoolId`; verify whether class assignment also establishes school membership. The interface does not claim it does or invent a school target.
- C12: backend CSV row/size limits, quoted/multiline/BOM/encoding behavior, duplicate/race atomicity, idempotent reconciliation, setup-link delivery and approved onboarding alternatives need real evidence. The 512 KB interface cap is not a backend limit.
- Verify backend audit capture for invitations/class creation/imports, session/ownership enforcement and production CSV response headers. No live backend certification is inferred from mocks or saved examples.
