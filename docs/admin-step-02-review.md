# Admin Step 2 — User administration and verification

Date: 16 November 2026 (Africa/Lagos).

## Delivered frontend

- `/admin/users`: paginated URL-based search and role/active/verification filters, safe user overview, account invitations, supported surname/phone edits and access-link delivery requests.
- Super Admin can invite all seven roles, including Super Admin, Support Admin, Content Creator and School Admin. Support Admin can invite only learners, parents and teachers. Invitations use email setup links; the interface never sets or reveals passwords. Creating the first Super Admin still requires backend provisioning.
- `/admin/verifications`: Super Admin teacher/school queues and confirmed approve/reject decisions with rejection reasons.
- `/dashboard/verification`: teacher/school document upload and submission, linked from Profile. School submission checks current ownership. The conservative upload limit is 4 MB for PNG/JPEG/WebP pending C05; the PRD's larger limits are not claimed.
- Separate bounded `/api/console/*` transport uses the existing encrypted session, fresh user/permission checks, same-origin mutation protection, explicit method/path/payload rules and safe response projections. New operations require documented `users.view`/conservative `users.manage` grants plus role restrictions. Missing grants fail closed; backend authorization remains authoritative.
- Existing LMS management, authoring, learning, school and family workflows retain their established contracts. No role change, deactivation or deletion control was added to the new console pending C02 safeguards.

## Acceptance still open

Step 2 remains unchecked for live acceptance. Confirm C01 permission/menu coverage; C02 destructive actions, last-admin/session/audit safeguards; C03 account approval versus credential verification; and C05 private document delivery/upload limits. Private document previews are withheld: only document labels and IDs are displayed, never saved example URLs. Operators must review evidence through an approved process before deciding.

Local mocks do not establish real invitation/reset email delivery, backend audit capture, actual role/school authorization or verification effects. No live account was created and no real invitation was sent during implementation.

## Verification

81 contract checks, lint and production build passed. Local HTTP coverage includes the new invitations, projection, filter, permission, CSRF and verification boundaries plus existing LMS suites. Browser checks exercised Super Admin invitation, search/readback, editing, laptop/tablet sizing, dark theme and verification queue with synthetic records. See test commands in README; local runner uses synthetic fixtures and stops its servers.

## What to test

1. Sign in with an existing Super Admin. Open Admin console → Users → Invite account. Invite a separate test address for each staff role, type the requested role confirmation, and check the record appears after refresh. Verify the actual email setup link and correct-role sign-in on the real backend.
2. Search by name/email; combine role, active and verification filters; paginate and reload. Open the user overview and confirm school, subscription and progress data are appropriate.
3. Edit surname/phone, reload and confirm persistence. Request the access link, then verify actual delivery. Try duplicate email and invalid fields: input should remain available with an error.
4. With Support Admin, confirm only learner/parent/teacher invitations are available and privileged operations/direct URLs are denied. Check a read-only or missing-grant account cannot mutate.
5. As teacher or school admin, open Profile → Submit verification documents; upload an allowed image and submit. As Super Admin, inspect the queue and approve/reject an isolated record after approved evidence review. Check reason persistence and the backend's documented login effects.
6. Recheck learner enrollment/lesson/quiz/progress, parent views, teacher authoring/classes and school membership. Check logout and expired-session handling, and tablet/light/dark layouts.

## Verification and acceptance

81 contract tests and 110 HTTP checks across the admin and existing LMS regression groups pass against isolated synthetic fixtures. ESLint and production build pass. A browser check exercised Super Admin invitation, search, overview, supported edit, verification queue and desktop/tablet light/dark layouts. No shared backend accounts or emails were created.

Manual tests:
1. Sign in as an existing Super Admin, open `/admin/users`, invite each required staff role and confirm its role name. Verify the actual invitation email, password setup and subsequent role-specific login in an approved backend environment.
2. Search/filter users, paginate, open details, edit surname/phone, refresh and check persistence. Request an access link and verify delivery.
3. Exercise duplicate/invalid email and denied permissions. Support Admin must not invite staff; learners/parents/teachers must not access console pages or mutations.
4. As a teacher or school administrator, use Profile → Submit verification documents. Confirm the school owner boundary, pending queue, rejection reason and approval persistence. Private evidence preview remains unavailable pending C05.
5. Recheck existing learner course/lesson/quiz/progress, teacher authoring/classes, parent linking and school management journeys.

Step 2 remains unchecked for live permission keys and server enforcement (C01), destructive-action safeguards (C02), account-versus-verification semantics (C03), private assets/upload limits (C05), real email delivery and backend audit capture. New role changes, deactivation and deletion are intentionally absent from this console until those safeguards are clarified.
