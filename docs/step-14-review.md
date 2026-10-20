# Step 14 — Schools, classes and membership

Frontend delivered 20 October 2026. Keep the plan checkbox open until the live checks below pass.

## What to review

- **Classes** in the sidebar: teachers and school administrators can create a class, open its details, edit its description, add/remove school learners, assign/remove published courses, send announcements, rotate its code and archive it. Teacher controls appear only for the assigned teacher; school administrators can assign a teacher from the authorized school roster. Archived classes are read-only. Platform administrators also have access, subject to the backend's resource permissions.
- Learners get **Classes** with join-by-code, assigned course links and named-confirmation leave. School and class codes use their distinct documented payload names (`joinCode` and `code`). Duplicate membership and invalid codes preserve the dialog and show the actual error.
- **My school** loads the current school. Teachers/learners can join using a school code. School administrators can edit the demonstrated leaderboard privacy settings and rotate school codes. General school contact-field PATCH contracts are not demonstrated and no speculative editor was added.
- **School members** supports paginated role-filtered records, teacher/learner invitations and confirmed membership removal. It does not delete accounts or permit arbitrary privileged role invitations. Platform administrators select a school from authorized paginated records. The full platform school CRUD screen remains Step 17.
- Staff pick learners/teachers/courses from server records, with paginated choices and no free-form ID inputs. Denied roster access is shown with retry; standalone teachers can share a class code instead. No attendance register or fabricated activity metrics were added.

Mutation dialogs prevent double submission, show pending and field/server errors, retain input on recoverable errors, use toast feedback, and require exact-name confirmation for removal, archive, code rotation, teacher reassignment and announcements. An uncertain network/server result disables resubmission in the current dialog and instructs the user to check the records before repeating. This cannot replace backend idempotency or confirm email/message delivery.

## Validation

- Production build/TypeScript passed; targeted ESLint passed without warnings.
- All 46 unit/contract tests passed, including role navigation, code serialization, protected action boundaries and incomplete-record rejection.
- Four HTTP scenarios through the actual frontend transport passed: role/cross-school denials; settings/invite/member persistence; new-member join/conflict/leave; class creation/edit, roster, course/teacher assignment, announcements, rotation and archive restrictions.
- Browser review used synthetic teacher and school-admin accounts. Course assignment and learner addition refreshed the class; school member table, invitation fields, settings state, mobile class details and centered mobile selector dialog were checked. No live accounts were created or changed.
- Local simulation request logs were inspected to confirm these requests reached the school fixture. Fixtures reuse the existing authentication stand-in and saved collection shapes. The original shared-workspace discovery did not provide a reusable owner mock; these are local-only fixtures, not backend verification. The saved class join response is only a 409; the fixture's successful new join exercises the request path, not evidence of the live success contract.

Repeat locally: `npm run simulate:schools`, `npm run start:session-test`, then `npm run test:schools-http`. These use port 4900 for the simulation and 3100 for the production frontend; run `npm run build` first. The local fixture uses synthetic role addresses such as `teacher@example.test`, `school_admin@example.test`, `learner@example.test` and the disposable password `fixture-password`. Never configure this simulation as production API_BASE_URL.

## Live release gates

1. Confirm role grants, class ownership, same-school checks, standalone teacher rules and learner privacy on the real endpoints. Frontend role checks cannot establish backend authorization.
2. Verify teacher access to school member lists for roster selectors. The saved member list uses a school-admin token; teacher roster access is not demonstrated.
3. Verify teacher invitations, any additional teacher fields and delivered onboarding emails. Only learner invitation is demonstrated in the collection. Verify school-admin class creation/teacher assignment rules separately; saved creation uses a teacher token.
4. Verify `/schools/mine` for teacher/learner and its no-membership representation. Learner/teacher school joining is demonstrated, but the saved mine request uses a school-admin token.
5. Verify successful new class joins, rotated old-code rejection, leave/rejoin, archive visibility and the effects of school member removal on existing classes. Confirm announcements reach only authorized class members.

## Brief manual test

As a teacher: create a class → edit description → add a school learner → assign a course → refresh. Check that changes remain. Open announcement and code-rotation dialogs, verify confirmation and cancel behavior. As a school admin: open School members, filter/invite, review settings and assign a teacher. As a learner: join with a code, try it again for the conflict message, open the assigned course, then leave using confirmation. Check the screens on mobile and verify unrelated accounts cannot access or change another school's records.
