# Step 4 account workflows review

Implementation date: 2026-10-16. Frontend implementation is ready for review. Step 4 remains unchecked until real email-delivered reset/invitation links are verified against staging and its frontend URL configuration is confirmed.

## Screens and behavior

- `/register`: learner, parent and teacher registration. No public administrator/content-creator role selector. Role-specific fields follow the supplied collection.
- `/register/school`: school information plus nested administrator details; the nested session response creates the same protected local session as ordinary registration.
- `/forgot-password`: neutral account-existence feedback, pending state, recoverable failures and another-email action.
- `/reset-password?token=...`: password confirmation and invalid/expired/reused link handling. A successful reset establishes a fresh server session as documented by the collection. The token is retained in component memory and removed from the visible URL after loading; revisiting the original email link is required if the page is reloaded afterwards. The page sets no-referrer metadata.
- `/set-password?token=...`: invitation entry screen using the documented reset-token mechanism. The actual backend invitation URL/token mechanism still requires confirmation; this route does not prove email integration.
- `/dashboard/profile`: protected account details, surname/preferred-language editing, password change, and a named account-deletion dialog requiring the current password. Failed mutations retain input and display errors. Successful password change/deletion invalidates the local server session, clears its cookie and returns to login.
- Login links now expose registration and recovery. The authenticated checkpoint links to profile settings. Role dashboards remain Step 5 and later.

## Contract boundaries

- Email/password sign-in is the established contract. Phone numbers are registration/profile contact data; no phone-login or OTP flow is invented.
- Profile PATCH intentionally permits the demonstrated `lastName` and `preferredLanguageCode` fields. Email/first name are displayed read-only until further editable-field contracts are verified.
- Registration payloads explicitly select fields and reject privileged public roles. School payloads select only administrator name/email/password fields rather than forwarding nested role or privilege flags.
- The backend owns password complexity rules. Client validation checks required values and matching confirmation without inventing a different password policy.
- Active language options come from the public backend language catalog. Failures/empty catalogs offer a retry rather than fake successful options; school registration does not request unused language data.
- Avatar changes are deferred to Step 7's verified media workflow. No placeholder upload is presented as working.
- Account deletion calls the documented DELETE /users/me with a password. The UI describes loss of account access; it does not claim a verified backend data-retention/deletion policy.

## Verification

- Ten authentication/account contract tests passed. These cover public-role restriction, privilege-field stripping, date/experience validation, nested school payloads, reset-token shape, session shapes, return URLs and role rules.
- Seven account HTTP scenarios passed through the running Next.js app to a local Postman simulation: three public registration roles, privileged-registration rejection, school registration and duplicate email, persistent profile changes, neutral recovery and invalid/reused reset/invitation tokens, current-password rejection/successful change, and deletion/password/session behavior.
- The existing eight session HTTP regression scenarios also passed. Node reports seventeen tests across both suites when counting their parent suites; the meaningful scenario count is fifteen.
- Postman request events confirmed the actual app called registration, school registration, profile GET/PATCH, password forgot/reset/change and account deletion. No real mail, staging account creation, credential change or deletion was performed by the agent.
- The existing local stand-in was extended from collection request/response shapes. Successful reset and invitation behavior follows the collection's written description but remains a provisional simulated contract until staging is verified. The owner workspace/mock search was skipped because no trusted owner resource or workspace was supplied; nothing was published or deployed to Postman.
- Browser checks: teacher/parent role fields, password mismatch error, local-only parent registration reaching a parent session, profile persistence after reload, deletion cancellation, neutral recovery confirmation and missing-token state.
- School registration was inspected at 320px: document width equals viewport width with no horizontal overflow. Shared password visibility controls retain accessible labels.
- Lint and production build/TypeScript checks are run after the final changes.

## Development stability correction

The recurring form-reset/recompilation problem returned during browser checks. A filesystem watcher observed only `.next/dev/logs/next-development.log` changing repeatedly. The documented `experimental.mcpServer: false` setting disables the local Next.js MCP diagnostics endpoint/logger; the page then remained stable while typing and submitting. The underlying framework cause is not proven. Ordinary browser developer tools and application authentication remain available. Do not describe the earlier Tailwind-source restriction alone as a confirmed cure. No external framework report was submitted.

## Repeat tests

Stop the normal development server before using the isolated checkout test instance.

1. `npm run simulate:auth`
2. In another terminal: `npm run dev:auth-test`
3. In another terminal: `npm run test:contracts`, `npm run test:account-http`, then `npm run test:session-http`.

Restart the simulation before rerunning token-reuse tests because its fixture tokens are intentionally single-use. All synthetic identities exist only in the local stand-in. Stop it and the test server after testing, then run `npm run dev` for the normal staging-backed site on port 3000.

## What to test in review

1. Switch Learner/Parent/Teacher on registration. Check the correct fields, password eye icons, mismatch messages and mobile layout. Use disposable staging details if submitting.
2. Register a school with distinct school and administrator emails. Verify the signed-in role is school_admin and duplicate emails display an error.
3. Sign in and open Manage your account. Save surname/language, refresh and confirm persistence.
4. Use your own controlled test mailbox for Forgot password. Verify actual receipt, destination host/path, successful reset and rejection when reusing the link. Perform the equivalent invited-account check once an authorized invitation exists.
5. On a disposable account, change password and confirm re-authentication. Inspect and cancel deletion first; execute it only on an account you intend to remove.

## Outstanding sign-off requirements

- Backend owner must confirm the configured frontend origin and reset/invitation URL/token format. No mailbox or invitation fixture was supplied for real delivery verification.
- Real password-reset completion and invited-user password setup must pass; saved collection errors and local simulation successes are insufficient evidence of delivery.
- Actual staging role/field validation and ownership policies remain part of the six-role verification baseline. Existing production session-secret configuration/HTTPS verification dependencies still apply.
- Avatar/media verification belongs to Step 7. Step 5 has not started.
