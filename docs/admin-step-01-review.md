# Admin Step 1 - Console foundation review

Date: 16 November 2026 (Africa/Lagos).

## Delivery status

Frontend foundation implemented. Step 1 remains unchecked for live acceptance: C01 (complete grants/menu contract) and real isolated-role/cross-school verification are still open. No shared backend setup, test account creation, deployment or payment activation was performed.

## Changes

- Added `support_admin` to safe user/session parsing, role labels, personal navigation and contract tests. Public registration still accepts only learner/parent/teacher.
- Added `/admin`, protected by the existing encrypted cookie/session checks and a fresh server-side GET `/admin/me/permissions` request. Learner/parent/teacher console access is denied.
- Reused the existing dashboard shell with an optional navigation override. Existing LMS routes, business operation guards and fixed role menus remain the compatibility baseline. Staff get an Admin console entry and can return to their LMS workspace.
- Console menu mapping currently activates only the implemented `/admin` home when `dashboard.view` is explicitly returned. Unknown keys, future pages, foreign URLs, mismatched key/path pairs and duplicates are not followed. Missing permission never grants access. Personal account/workspace links are independently protected by existing authorization.
- Permission responses require a matching account role and well-formed bounded arrays. Error/denied/empty/retry states are explicit; expired sessions use the existing renewal/sign-in flow. No backend-provided permissions or tokens are embedded as unrestricted page data.
- The new permissions transport supports GET only for Super/Support/Content/School Admin. A separate foundation gate blocks Support Admin from all business endpoints at this step, retaining only current-user read and existing bounded notification tools. Later steps must add explicit contracts rather than granting whole namespaces.
- Existing staff business routes are not newly governed by an incomplete dynamic permission example. Their established role and backend ownership checks remain in force; complete permission integration for their admin replacements belongs to subsequent steps after C01.

## Local verification

Run `npm run test:contracts`, `npm run lint`, `npm run typecheck` and `npm run build`.

Run `npm run test:admin-foundation` after a production build for new permissions/console checks plus existing admin lifecycle and six-role shell HTTP regressions. `npm run test:admin-foundation -- --regression` also exercises the existing learning, authoring, family, school, media, search and other HTTP suites.

The runner executes existing Postman mock source files directly in Node because Postman CLI is unavailable on this machine. It checks ports 3100/4900 are free, uses synthetic credentials/data, and stops its child processes. It never uses the configured live backend or port 3000. Logs are written to a printed temporary folder. This is local HTTP evidence, not a Postman CLI run or live backend authorization evidence.

Verification result: **75 contract tests, 102 HTTP tests across 16 local mock groups, full ESLint, TypeScript and production compilation passed.** The isolated copy used `next build --webpack` because its dependency symlink is outside Turbopack’s workspace root. The normal project `npm run build` (Turbopack) also passed in the actual Desktop checkout; its standard `npm run test:contracts` passed all 75 tests.

## What to test manually

1. Start the normal app and sign in with an existing Super Admin. Open **Admin console** from the sidebar or `/admin`. Confirm the existing theme/sidebar/account/logout controls work. Only currently implemented and explicitly permitted console links should appear; future modules must not be linked yet.
2. Repeat with authorized Content Creator, School Admin and Support Admin accounts. An empty permission list should show **No console pages available**; denied permissions should show **Access restricted**; an unavailable/malformed response should show **Admin access unavailable**, Retry and a return link.
3. As learner, parent or teacher, type `/admin` directly. Confirm access is restricted and the normal LMS workspace still works. Logged-out `/admin` should go to login and return safely after an eligible sign-in.
4. With Support Admin, try existing `/dashboard/users`, `/dashboard/content` and `/dashboard/classes` directly. They must stay restricted at this foundation stage. Profile and logout must remain usable. Do not expect Support Admin business modules until their planned steps are implemented.
5. Regression check existing learner courses/lesson/quiz/progress, parent child view, teacher classes/assignments/content, and school management using approved records. The existing workflows should retain their prior role access and saved data.
6. Check laptop/tablet layouts, keyboard navigation, search, menu pinning, light/dark themes and session expiry. Browser-specific visual acceptance remains manual until recorded.

## Backend questions before full Step 1 acceptance

Provide full real permissions/menu responses for all four console roles, including permission identifiers, canonical menu keys/paths, scoped grants and expected empty/denied behavior. Supply approved isolated role accounts and two school fixtures through the existing secure process. Confirm Support Admin school boundaries. Synthetic denials do not prove deployed enforcement.
