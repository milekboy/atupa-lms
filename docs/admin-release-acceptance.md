# Admin release acceptance — 18 November 2026

**Production release: not approved.** The supported frontend work and local QA are recorded separately from live deployment acceptance. All M-01–M-29 records are mapped in the [dated matrix](admin-implementation-matrix.md); no owner waiver or scope change is assumed. This document is the remaining executable human/backend checklist, not a request to approve an incomplete release.

## Environment record to complete before live testing

Use an approved staging/deployment with isolated Super, read-only/revoked Super, Support, Content Creator, School A/B admins, Teacher A/B, learner A/B and linked/unlinked parent accounts. Record deployment/build ID, origins, API version, test-data ownership, session/role setup, notification inboxes, upload provider and dated redacted evidence. Do not copy reusable credentials or personal child records into this repository. Do not run synthetic mock endpoints against a real deployment.

| Gate | Concrete scenario / expected evidence | Responsible acceptance | Current status |
|---|---|---|---|
| C01 permissions | Visit each implemented page and its direct APIs as each role; revoke a grant after login and retry; use School B IDs from School A accounts. All unauthorized reads/writes/files must fail. Confirm exact permission/menu vocabulary and allowed Support operations. | Backend + product | Not run live |
| C02 lifecycle | On isolated accounts, verify role/deactivation/delete semantics, session invalidation in another tab/device and protection against removing/demoting/deactivating the last Super Admin. Demonstrate the promised 30-day content retention/restoration using documented endpoints. | Backend + product | DTOs/recovery policy unresolved; no new destructive controls invented |
| C03 approval/verification | Distinguish registration/account approval from teacher/school credential verification; show actual active/verified/rejected states, badges and publication eligibility before and after each decision. | Backend + product | Pending live reconciliation |
| C04 full curriculum | Demonstrate required course hierarchy/order, all eight question types and required practice formats, with save/reload/learner behavior and unknown-block preservation. Supply missing DTOs/reorder APIs before enabling unsupported edits. | Backend + learning/content owner | Supported subset local; missing contracts remain gated |
| C05 private media | Test real image/audio/video size/progress/provider behavior; unused-only deletion; verification/report asset direct URL denial and authorized read/expiry. Ensure filenames/paths/CSV/legacy/direct API channels cannot reveal the reporter. | Backend + media/privacy owner | Private report screenshots off by default; private preview missing |
| C06 review/visibility | Review and reject/resubmit lessons/library and Public requests; deny self-review and unverified publication. Verify ordinary-course approval DTO, atomic scope changes, publication notifications and retained enrolled access/progress after teacher/school changes. | Backend + content/product owner | Full policy/ordinary-course contract and live effects pending |
| C07 safety/SLA | Submit each report reason, verify severity mapping and deadline; demonstrate actual critical escalation, delivered admin/reporter notifications, target-specific hide/suspend/remove effects, own-target confidentiality and a maximum 24h response. Exercise every promised alert detector and threshold. | Backend + safety/product owner | Saved high/48h example contradicts critical/24h description; live jobs/effects unverified |
| C08 metrics | Independently reconcile overview, reports and exports against controlled counts; define active users versus learners, windows/timezone, quiz attempt/pass counts, overall completion denominator and language coverage. | Backend + reporting owner | Undefined/inconsistent metrics remain unavailable |
| C09 files | Open real CSV/PDFs, Unicode and empty results; match supported applied filters, authorized columns and complete row counts beyond page 1. Check JSON/HTML failures, names/MIME, formula safety, oversize behavior and reporter privacy. Supply missing learner/school formats if required. | Backend + reporting/privacy owner | No saved file examples; live files/complete coverage unaccepted |
| C10 finance | On isolated test owners, verify grant/cancel extension/caps, effective cancellation timing, real access and school-member effects. Demonstrate feature-preserving plan edits, historical payment invariance and actual audit. Refund/checkout activation needs its own contract/product decision. | Backend + payments/product owner | Feature-bearing edits blocked; checkout remains disabled |
| C11 audit | For each account/content/publish/visibility/verification/finance/safety action, show protected backend actor/target/outcome records, failed/denied capture where required, redaction, search, tamper protection and explicit retention. | Backend + product/security owner | Local UI reads records; essential backend capture not certified |
| C12 bulk | Validate malformed/duplicate/raced rows before committing; test exact transaction/max-size limits, response-loss reconciliation, actual learner accounts/class membership and delivered invites/secure access setup. | Backend + onboarding owner | 100-row fixture passes; live transaction/delivery pending |

## Framework security release gate

**FW-01 remains unresolved.** The normal build reported a `SecurityFatalError` for the installed Next.js 16.4.2 after compilation. The instructed retry can finish local verification; it does not establish that the vulnerability is fixed. Framework dependencies are unchanged in Step 10. Review and apply an appropriate security update, then repeat compatibility/build/regression checks before production approval. This gate is additional to C01–C12.

## Product and deployment acceptance measurements

| Target | Measurement to record | Current evidence |
|---|---|---|
| 100 learners in under 30 minutes | On staging, time a school operator from prepared import file through validation, committed membership and usable learner access. Include corrections/delivery, environment and timestamps. | 100-row synthetic transport check only; no human/product timing claimed |
| Lists under two seconds with 10,000 users | Record dataset, indexed query, pagination, deployment/network/device, repetitions and agreed latency percentile; include success/error behavior and any separately agreed export/report limits. | Not benchmarked live; local mock latency is not acceptance |
| No developer dependency within one month | A designated operator independently completes every must-have operation using approved runbooks/contracts; record assistance, failures, missing operations and dated owner sign-off. | Not observed; no automatic acceptance or scope waiver |
| Deployment configuration | Validate production APP_ORIGIN, API origin, HTTPS cookies, refresh/logout/revocation, email/reset/invite URLs, permitted upload origins and direct asset denial. Test multi-tab/device behavior on the deployed build. | Local cookie/origin/renewal and token-handling checks pass only |
| Accessibility/devices/languages | Repeat keyboard/focus/Escape/validation/error recovery on real laptop/tablet/mobile, light/dark/reduced motion, diacritics and representative long/empty data. Confirm real camera/QR/media/print/export behavior on target devices. | Local Chrome fixtures and screenshots recorded; real-device/media acceptance pending |

## Release decision record

Each pending row needs a dated result, deployed environment, redacted evidence, responsible reviewer and explicit acceptance or an owner-approved scope change. Essential authorization, private asset, review/safety and audit gates block release. Passing local QA must never auto-set production approval. Source/build evidence may be regenerated with `npm run test:admin-release`; it remains explicitly local.
