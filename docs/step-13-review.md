# Step 13 — certificates and public verification

Implemented learner Certificates navigation, list/empty states, internal-ID detail links and overview certificate links. The branded certificate sheet uses backend learner/course/language/level/date/ID/status fields, the official logo and an A4 landscape print stylesheet. There is no issue form or invented PDF endpoint. Certificate issuance remains automatic backend behavior.

The print button requires valid status, an exact current-origin verification URL/code and a complete PNG QR payload. Image decode failures also prevent printing. The source example's localhost URL and truncated image correctly show a configuration/availability message. This step does not claim the saved sample is printable or scannable.

Public verification is available at /certificates/verify and /certificates/verify/:code without sign-in. A dedicated no-store route fetches the upstream public endpoint without forwarding the user's session. Its public-field allowlist omits user/account IDs, revocation reasons and internal metadata. Valid, revoked, invalid/not-found and service-unavailable states remain distinct. Submitting a new code updates the page URL.

Super admins can list and inspect certificates and revoke with a reason plus exact visible certificate-ID confirmation. The source scripts establish that API detail/revoke use the internal id. Other staff roles are not granted certificate administration without a confirmed permission contract. Ambiguous revocation errors disable resubmission and expose a GET status check; confirmed revocation updates the sheet, disables printing and reflects on public verification.

## Brief test checklist

1. As learner, open Certificates and an issued record. Check name, course, language, date and certificate ID against your account. Check the overview link and empty state where no certificates exist.
2. Open Verify current status in a signed-out/private browser. Check a valid code, revoked code and unknown code. The URL should follow the code submitted; a service failure should say verification is unavailable rather than call a valid record invalid.
3. If the backend supplies a complete QR and correctly deployed verification URL, print or save with the browser print dialog. Check layout and scan the actual printed QR from another device. Printing is deliberately unavailable for incomplete/mismatched records.
4. With an isolated super-admin account, open a disposable certificate: require a reason and exact ID before revoking, then refresh public verification and learner details. Check other staff/learners cannot access another person's private record or revocation action.

## Verification — local only

- Targeted ESLint, production build/TypeScript and all 43 unit/contract tests passed.
- Four HTTP lifecycle scenarios through the real frontend passed against local collection-shaped fixtures: learner ownership/list/details and removed issuance; anonymous/no-store/private-field-safe verification with missing/invalid/unavailable variants; administrator-only list/revoke reflected publicly; and lost-response revocation reconciliation by read. Negative fixtures model expected semantics; they do not establish the live API's exact negative response schema.
- Browser checks covered learner list/detail, expected disabled print for localhost/truncated data, branded sheet rendering, valid public verification and 375px mobile layout.
- Synthetic administrator dialog required reason and exact ID. A simulated lost revocation response disabled fields/resubmission; Check revocation status confirmed the stored revocation without a second POST. The public page then showed revoked. A missing code displayed not found, and final URL sync was verified after the build.
- Screenshot atupa-step-13-certificate.png in the task workspace shows a synthetic certificate's layout before test revocation. No live backend accounts, certificates or content were changed. The user's existing development server was untouched.

Reproduce: npm run simulate:certificates; npm run build; node scripts/start-session-test.mjs; npm run test:certificates-http. The simulation reuses existing session fixtures and derives certificate shapes from the supplied Postman collection. No owning-team published mock was available from earlier discovery; nothing was published or deployed.

## Pending — Step 13 remains unchecked

- Real qualifying course completion automatically issuing the expected certificate, and repeated completion not duplicating issuance. Local fixtures are pre-issued records, not issuance verification.
- Live ownership, super-admin revocation and any additional permitted admin-role scope; concurrent revocation/consistency/recovery behavior.
- Complete backend QR image data and verificationUrl configured for the deployed frontend, including fresh issuance and existing-record behavior after origin changes.
- Physical print legibility, long learner/course record fitting, QR decode correctness and verification from another device. No genuine complete QR response was supplied, so real print/scan was not claimed.

## Backend clarification draft — not sent

Please supply a real automatically issued certificate with complete QR data and the deployed verification URL. Confirm auto-issuance eligibility/deduplication, ownership and allowed administration roles, public revoked/invalid/not-found response shapes, and how revocation is reconciled after a lost response.

Step 14 school/class/membership work remains unstarted.

## PDF orientation fix — 2026-10-19

Added a direct Download PDF action next to browser printing. It renders the backend record, official logo and QR locally at high resolution and writes a fixed A4 landscape PDF page with no rotation metadata or browser headers/footers. The HTML certificate remains the accessible reading/printing view. Status and complete verification-asset gates still apply; no new backend endpoint or dependency was introduced.

Verified the actual browser download with a synthetic record and an explicitly labeled test image: one 841.89 × 595.28 point page, rotation 0, rendered upright with all fields inside the border. This validates export orientation, not real QR scanning. Also repaired the user's existing sideways PDF into a separate upright landscape copy without changing its certificate data. The temporary local test page was removed.
