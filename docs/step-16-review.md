# Step 16 — Parent linking and monitoring

Frontend delivered 20 October 2026. Keep the plan checkbox open until real role, linkage and notification checks pass.

## Delivered

- Learners have **Connect a parent**, with code generation, expiry display, expired-code state and copy support. Codes remain in component memory only, never browser storage or URLs. The backend validates expiry and reuse.
- Parents have an overview and **My children**: link by a learner-generated code, view multiple linked children, switch to one child's details and unlink with exact-name confirmation. There is no ID/email linking form or account impersonation.
- A new shared **CustomSelect** uses a styled combobox/listbox with arrow keys, Home/End, Enter/Space, Escape, typeahead, outside-click dismissal and visible focus. The new screens contain no native `<select>`. Use custom dropdowns for new work as requested by the user.
- Child views show returned courses/progress, quiz scores, learning minutes, points, streaks, counters, badges, certificate summaries and activity. Missing metrics are not replaced with fabricated zeros. Parent views do not link into learner-only course/certificate routes.
- Family updates use parent notifications, current linked child IDs and optional selected-child filtering. Read state can be saved. Pagination totals are explicitly for the inbox; a filtered page is not presented as a search of all family updates. No new notification type or scheduler was invented.
- The server restricts family routes by role and checks the current linked-child list before retrieving a child's dashboard. Parent dashboard/notification projections exclude unlinked-child entries. Contact details, date of birth, raw notification metadata and unknown child fields are not forwarded. Switching children hides the prior child's response while the new request loads; unlink clears the selected child and refreshes the overview.
- Link/unlink/read dialogs reuse pending state, duplicate prevention, inline errors, preserved inputs on failure, toasts and uncertain-outcome guidance. Unlink affects the connection, not the learner's account.

## Validation

- Production build/TypeScript and targeted lint passed; all 54 contract tests passed, including code expiry/validation, family roles and child-data projections.
- Six local HTTP scenarios passed through the real frontend transport: role/unrelated-child denial; generation/link/reload and used/expired-code failures; distinct data for multiple children; notification read persistence; immediate unlink access removal; reconciliation after a persisted-but-unconfirmed link response.
- Browser checks with synthetic accounts covered learner code generation → parent linking, multiple-child overview, keyboard End/Enter and typeahead selection, correct child metrics, a 375px custom dropdown/layout, and exact-name unlink clearing the old details. DOM inspection confirmed zero native selects on the new parent page. Review screenshot: `atupa-step-16-parent.png` in the task output folder.
- Local Postman simulation request evidence was inspected. Fixtures reuse existing school/auth simulation and supplied parent/dashboard shapes. Earlier owner-mock discovery provided no reusable owner mock; this remains a local stand-in, not live backend verification. No real accounts or records were changed.

Repeat: `npm run build`, `npm run simulate:parents`, `npm run start:session-test`, then `npm run test:parents-http`. Simulation/frontend ports are 4900/3100. Synthetic `learner@example.test`, `learner2@example.test`, `parent@example.test` and `parent2@example.test` use the disposable fixture password `fixture-password` only in this local environment.

## Release gates

1. Verify code lifetime, single-use behavior, duplicate linking, multiple parents/guardians policy and re-linking after unlink with isolated real accounts. Check the backend directly, as well as the frontend proxy, rejects unrelated/unlinked parents.
2. Reconcile child summaries, achievements, certificates and time with the learner's real records. Verify cross-account isolation and out-of-band unlink behavior after refresh.
3. Verify actual parent notification delivery for learning/achievement/feedback events, parent-only read ownership, pagination, historical notifications after unlink and data freshness. The saved parent notifications demonstrate assignment and feedback updates, not all possible event types.
4. The saved child dashboard contains `teacherFeedback: []`, with no populated item example. No teacher-feedback item shape was guessed. Feedback messages already provided through authorized parent notifications are displayed; populated dashboard feedback details still need a documented contract.
5. Complete the release matrix for 320px/tablet, light theme, reduced motion and screen-reader behavior; the current browser review covered desktop and 375px dark theme.

## Brief manual test

Learner: Connect a parent → Generate parent link code. Parent: My children → Link a child → enter the code. Refresh and view courses, scores and achievements. Link a second learner and switch with the custom dropdown using mouse and keyboard; the metrics must belong to the selected child. Try the used/expired code and confirm the form retains input with an error. Mark an update read, refresh, then unlink with exact-name confirmation and confirm the child disappears. Check the same screens on mobile.
