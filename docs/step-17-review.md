# Step 17 — administrator and content-creator management

Frontend implementation: 2026-10-20. Live acceptance remains open; Step 18 was not started.

## Delivered

- Super-admin Users: paginated name/email search and role filtering, fresh account details, content-creator invitation, activation changes, and confirmed deletion. Invitations lock the role to content_creator and let the recipient set a password. Own-account edit/delete controls are disabled. No promotion or permission editor was added.
- Schools: paginated list, creation, fresh details, settings/activation edits, exact-name confirmation, deletion with visible membership conflicts, and links to existing school settings/membership screens. A 409 preserves the school and explains the deactivation alternative.
- Languages: administrator list including inactive records, creation and native-name updates by code. There is no language delete action or unsupported language status editor.
- Library studio: vocabulary, cultural topics, web-game metadata and GameCard list/detail/create/update/delete using documented fields. Vocabulary updates pronunciation/exampleSentence; topics update summary; games/cards update description. Creation supports text cultural blocks and explicit card choices/answer validation. New vocabulary/card visibility is explained before submission. GameCards are updated/deleted by code, with a link to existing QR tools.
- Course studio and certificate administration are reused. The new library workspace is for content creators and super administrators; teacher course/media/QR access is preserved. Creator publishing permission is an intended product responsibility requiring live confirmation because saved library requests use the administrator token.
- Super-admin overview shows actual returned people/activity/course/language totals and breakdowns, completion, engagement, certificates, schools, linked parents and popular courses. Missing values remain unavailable, and no trend, export, audit-log or revenue workflow was invented.
- New selectors are CustomSelect controls. New screens use shared loading/empty/error states, toasts, duplicate prevention, preserved failed inputs and uncertain-write reconciliation. Newly exposed admin/library proxy paths and methods are role-bounded; upstream authorization remains authoritative.

## Validation

- Production build/TypeScript and targeted ESLint passed. All 57 contract tests passed, including invitation field restrictions, card validation/code addressing and permission boundaries. The old navigation test now recognizes the implemented administrator Users destination while checking that other roles cannot discover it.
- Six scenarios passed over real HTTP through the built frontend and local Postman simulation: wrong-role rejection; invite/search/detail/deactivation/deletion persistence; school 409/deactivation/empty deletion; language creation/update by code; all four library write/read/update/delete flows; returned dashboard totals and reconciliation of a persisted invitation with a lost response.
- Browser checks with synthetic accounts verified keyboard typeahead/End/Enter custom selection, invitation success/list refresh, account deactivation after reload, school conflict display, card details, creator-only navigation, resource creation, and a 375px creation dialog/dropdown. Native select count was zero on the new library page. Mobile tables scroll within their container to retain readable action labels.
- The simulation started successfully and its actual dependency request events were inspected, including the management routes and expected conflicts. Fixtures reuse the existing synthetic auth/school stand-in and the supplied saved management contract shapes. Earlier owner-mock discovery provided no reusable owner mock. This establishes frontend behavior against a stand-in, not live backend authorization or delivery. No live accounts or records were changed.
- Review image: `atupa-step-17-admin.png` in the task output folder. The isolated test processes are stopped after review; the user's port 3000 server is untouched.

Repeat locally: `npm run build`, `postman simulation run postman/simulations/admin.sim.yaml --port 4900 --no-history --output ndjson`, `npm run start:session-test`, and `node --test tests/admin-http.mjs`. Test-only identities `super_admin@example.test` and `content_creator@example.test` use `fixture-password` only in this simulation.

## Brief manual review

1. As super admin, search/filter Users, invite a disposable creator, open Details, change activation with name confirmation, then reload. Check invitation email/set-password completion when staging accounts are available.
2. Create an empty school and delete it with name confirmation. For a school with members, confirm deletion is blocked and deactivation works. Check existing school/member links.
3. Add a test language and edit its native name. Confirm persistence and that no delete control appears.
4. In Library studio, switch all four libraries with the custom dropdown. Create, inspect, edit and delete isolated resources. Confirm diacritics survive, invalid card answers are rejected, and saved values survive reload. Vocabulary/cards can become publicly visible immediately; use isolated staging data.
5. Compare admin totals with real records; check creator access and learner/teacher restrictions. Review desktop/phone widths and keyboard dropdown operation.

## Live release gates

- Verify the direct backend permission matrix with isolated super-admin, creator and other roles, including ownership and out-of-band deactivation. The proxy does not replace backend enforcement.
- Verify invitation delivery, duplicate email behavior, set-password completion, account deactivation/session revocation and self/last-admin safeguards against the real service.
- Reconcile actual dashboard totals, pagination, language ordering, library publication visibility, dependencies and school deletion conflicts after reload.
- Obtain fuller update DTOs before enabling edits beyond the demonstrated fields. No language deletion/activation, arbitrary roles, richer media blocks or launch-provider fields were assumed from GET payloads.
- Complete broad accessibility/device/theme release QA; this step covers targeted desktop and 375px browser checks.
