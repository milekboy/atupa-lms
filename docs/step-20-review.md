# Step 20 — free MVP launch

Product decision recorded 2026-10-20: the MVP launches free. Individual Premium payments are excluded; school subscriptions remain phase 2.

## Delivered

- Checkout and payment-verification operations are denied by the frontend server transport for every role during the free launch. Existing read-only plan/subscription access and super-admin payment-history permission remain explicit; no checkout page, provider redirect or callback-based access grant was introduced. Direct backend billing configuration is outside this frontend policy.
- Super admins have **Free launch review** at `/dashboard/launch`, with custom Courses/Games and access-label dropdowns, URL state, refresh, pagination, per-page counts and warnings. Missing access labels remain unknown rather than being treated as free. This is a read-only catalog review, not an entitlement assertion.
- Backend enrollment, prerequisites, premium checks, quiz grading and completion remain authoritative. No frontend premium bypass was added.

## Validation and limits

- All 66 contract tests passed, including free-launch payment guards and unknown-label handling. Focused ESLint and production build/TypeScript passed.
- Eleven integration checks passed through the actual built frontend on port 3100 and local Postman simulation on 4900: payment initiation/forged verification rejected, premium enrollment denied, free enrollment and lessons accessible, practice/progress/quiz persistence and failure recovery preserved, and admin catalog reads work.
- Browser checks verified the admin review, custom access/content selectors, URL filtering and responsive phone/desktop layout. Fixture data is synthetic and does not establish live backend entitlements.
- Simulation adapts the existing learner fixture and collection-shaped catalog/auth responses. Earlier owner-mock discovery found no reusable published stand-in. Actual request events were inspected; checkout/verify were rejected before reaching the simulated upstream. No live records were changed.
- Read-only live catalog on 2026-10-20 returned 10 courses, including 3 premium-labelled advanced courses: **Hausa Advanced, Igbo Advanced, Yoruba Advanced**. Games returned 0 records. These labels are not proof that a specific learner is denied, but access to required launch content must be checked.
- No isolated live learner account was available. Real enrollment, lesson/practice/quiz access, completion/certificate and agreed game access remain unverified. Step 20 stays unchecked until required free content works with a real non-premium learner.
- Paid-provider IP restriction (saved checkout 503), valid-reference verification and signed webhook entitlement tests are deferred with monetization. The saved empty-reference 404 does not prove a missing verification endpoint. No provider success is claimed.

## Backend/product handoff

Confirm the required launch courses and whether the three advanced courses belong in that set. For included content, configure the approved free flags/entitlements on the backend and verify with a fresh non-premium learner. Do not solve this by ignoring premium enforcement in the frontend. Provide isolated test access for the complete learner journey. The currently empty games catalog also needs agreed launch content before game acceptance can be established.

## Brief manual review

1. As super admin, open Free launch review. Switch Courses/Games and access filters using mouse and keyboard; refresh and reload the URL. Check phone layout and warnings.
2. As learner, confirm there is no checkout flow. Enroll in an approved free course, open lessons, complete practice/quiz and reload progress.
3. Confirm learners cannot open the admin review. Required free content must not request payment; report a denied course for backend access review.

Repeat: build; run `postman simulation run postman/simulations/free-launch.sim.yaml --port 4900 --no-history --output ndjson`; start `node scripts/start-session-test.mjs`; run `node --test tests/free-launch-http.mjs tests/learning-http.mjs`. Use only synthetic local accounts for this simulation. Step 21 release QA has not been started.
