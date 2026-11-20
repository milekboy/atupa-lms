# Admin Step 7 — Payments, subscriptions and plan tiers

Date: 17 November 2026 (Africa/Lagos).

## Delivery status

Supported frontend delivered with local evidence. Step 7 remains unchecked for C01/C10 and actual authorization, cancellation/access, audit, price-history and school-entitlement acceptance. No live payment, refund, plan or subscription was changed during implementation. Learner checkout remains disabled under the existing free-launch decision.

## Implemented

- `/admin/finance` provides Payments, Subscriptions and Plans sections with URL state and links from console home/recognized finance navigation. Fresh Super Admin role and current grants are checked on every request. Conservative documented `users.view`/`users.manage` gates remain pending the complete C01 financial permission vocabulary. Other roles are denied; missing write grants produce read-only controls.
- Payments are read-only, with demonstrated `status` and `from` filters and server pagination. Status text is sent as a bounded value rather than inventing an undocumented status enum. The transport projects only reference, owner, plan, integer amount, currency, status and timestamps, excluding provider/card/token data. There is no payment editing, checkout, verification or refund action.
- Subscriptions support the documented `activeOnly` filter and pagination. Super Admin can pick a user/school, select a matching active period-based plan, enter grant days/reason and confirm the exact owner ID. Cancellation requires the owner ID and a reason, explains possible immediate access loss, and displays actual returned status/end date/manual-change evidence. Granting does not create a payment or represent a monetary refund.
- Each grant is constrained to integer days 1–366 on the server. The UI rejects a known over-732-day result when the current subscription is in the loaded page. The backend must enforce the cumulative 732-day cap atomically for every owner, including owners outside that page; no undocumented owner lookup/filter was invented. Returned grant periods beyond 732 days ahead fail as unconfirmed outcomes. Concurrent/manual retries still need C10 transaction/idempotency guarantees.
- The server refreshes available plans before grants, checks active state/owner type/period and forwards only documented fields. It verifies returned owner/plan/status/period and returned manual-change action/reason/reviewer/days when available. Wrong-owner/inconsistent responses are errors requiring reconciliation. Duplicate clicks are locked; ambiguous mutation errors freeze the current dialog and refresh records instead of automatically repeating a grant.
- Plans list real code, label, description, tier, owner type, integer kobo price, period, active state and feature descriptions. Creation uses the documented fields with exact-code confirmation. Prices format using integer arithmetic, including amounts with single-kobo precision; feature descriptions do not claim to enforce content entitlements.
- Price/active-state updates are implemented for plans with no feature descriptions. Existing fields are compared after mutation and the returned code/amount/active state must match before confirmation. Other plan fields remain read-only after creation because a broader PATCH DTO is not demonstrated.

## Newly identified contract gate: feature preservation

The supplied collection's price-update request contains only `amountKobo` and `isActive`, but its saved success response changes `features` from a populated array to `[]`. This is saved-example evidence of a possible backend default/replacement issue, not proof of the current deployment's behavior. It creates a real preservation question for this task.

The interface disables updates on feature-bearing plans, and the server independently reloads the current plan and returns 409 before PATCH when features exist. It does not guess an unsupported `features` PATCH, clear features, or silently accept loss. Creating feature-bearing plans remains supported; changing them after creation stays gated until C10 confirms a feature-preserving DTO. Local tests reproduce the unsafe default and verify the guard prevents it from changing existing plans.

## Preservation of existing LMS behavior

- Existing `launchMode=free`, checkout/payment-verification guards and learner endpoints are unchanged. New admin operations use a separately bounded `/api/console/admin/*` transport; legacy learner subscriptions do not gain mutation access.
- Plan creation/availability does not enable learner checkout. No commercial prices, refunds, content mapping or subscription policy are chosen on the user's behalf.
- Existing learning, enrollment/progress, school, parent, authoring, review, visibility and onboarding flows retain their contracts. Live entitlement consequences of real grants/cancellations require C10 evidence before release.

## Verification evidence

- 107 contract checks pass, including role/method/path/query/payload limits, integer prices/day caps, truthful date projection, safe finance records, duplicate plan codes and free-launch guards.
- 153 HTTP checks across 18 isolated admin/LMS groups pass. New real-frontend cases cover read-only payments/filters, plan creation and safe price update, unchanged historical payment amounts, protected feature plans, user/school grants, owner/plan compatibility, per-grant/cumulative caps, cancellation/readback, actual manual-change reasons/reviewer IDs, malformed/uncertain ownership results, missing grants/roles, CSRF and learner checkout denial.
- Browser checks used synthetic records for payment filters, searchable owner and matching-plan selection, grant/cancel confirmations and readback, feature-plan guard, plan creation, whole-kobo price/active-state update, unchanged payment history, custom dropdowns and tablet/light/dark layouts. No money was moved. Test services were stopped afterwards.
- Lint and production build pass. Local subscription metadata and modeled cap behavior do not independently certify deployed content entitlements, audit or school access. The existing framework security advisory remains a separate release follow-up.

## What to test

1. As an existing Super Admin, open Admin console → Payments, subscriptions & plans. Filter payments by status/start date, paginate and reload. Check amounts/references against approved test records; payments must have no edit/refund controls. Other roles must be denied; a read-only Super Admin must not see mutation controls.
2. In Subscriptions, grant an active matching plan to an isolated user and school, enter the owner ID/reason and confirm. Check returned status, period and actual backend manual-change evidence after refresh. Try 0/367 days, an inactive/wrong-owner plan and an owner near 732 days ahead; they must be refused by the appropriate frontend/backend boundary.
3. Cancel an isolated active subscription with a reason and owner confirmation. Check the actual returned end date/status and the affected account's access behavior. Confirm no payment/refund record is invented. Verify cancellation timing and school-member effects on the real backend.
4. Create a test plan with whole-kobo price, period, owner type, tier and descriptions. For a plan with an empty features list, change price/active state and read back the exact amount. Existing historical payments must retain their amounts. Feature-bearing plans must remain read-only until the preservation contract is resolved.
5. On a controlled interrupted grant/cancel/update, check refreshed records before issuing any new mutation. Confirm duplicate clicks do not send repeated pending writes and backend audit entries identify the operator and reason.
6. Recheck free learner enrollment/lesson/quiz/progress, school/parent/teacher workflows, admin account/onboarding/reviews and visibility. Checkout and forged payment verification must remain blocked. Test laptop/tablet, keyboard dialogs and light/dark themes.

## Backend clarification and live gates

- C01: complete financial read/write permissions, menu entries and deployed Super Admin/record authorization. User grants are conservative compatibility gates, not a confirmed final financial permission vocabulary.
- C10: feature-preserving plan PATCH (saved price-only update clears features), broader update DTOs, historical price invariance, effective cancellation time, plan/content entitlement mapping, school-member effects, grant extension/switching semantics and atomic cumulative caps/reconciliation.
- Refund endpoints, approvals and monetary limits remain unavailable. A manual grant is not a cash refund. Real payment charge/verification/checkout activation and commercial pricing remain separate product decisions.
- Verify actual backend audit capture, saved manual-change evidence, granted/cancelled access and real school ownership behavior using approved isolated deployment records before accepting the step.
