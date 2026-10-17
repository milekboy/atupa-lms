# Step 6 review — public website and course discovery

Implemented 2026-10-17 (Africa/Lagos). Step 7 is not started.

## Delivered

- Public homepage at `/`, replacing the foundation preview. Cream, forest green, terracotta and mustard follow the supplied reference; card artwork and patterns use HTML/CSS rather than unapproved stock photos. Includes three language introductions, actual beginner courses, how it works, GameCard introduction, family/school benefits and registration links. No testimonials or invented learning metrics.
- `/courses` reads the anonymous catalog through the shared server-only upstream transport. Language, level and page live in the URL; applying filters resets pagination. Only documented query parameters are sent. Language options come from active backend records; duplicate Edo names are distinguished by their codes.
- `/courses/[courseId]` displays published course metadata, module order, lesson titles/durations, module/course quizzes and returned totals. Curriculum disclosures support native keyboard interaction.
- Premium flags are displayed accurately; public outlines do not unlock lessons. No checkout, enrollment or lesson-start behavior is implied by a successful public catalog response. Enrollment and learning remain later steps.
- Loading skeletons, empty selections, invalid filters, restricted access, missing courses, service errors and retry controls. Language-list failure does not discard a successful course result. The static homepage remains usable while featured courses load or fail.
- Responsive public menu, theme support, visible focus and reduced-motion support.

## Verification

- Twelve read-only anonymous live GETs returned 200: active languages, paginated catalog, all nine language/level combinations and one premium course outline. See `step-06-live-checks.json`.
- Live Hausa is active. All three languages have published Beginner, Intermediate and Advanced courses. Advanced courses are premium; this does not resolve payment scope or prove premium lesson entitlement. Live data also includes two test-like Edo entries; they are not fabricated frontend records.
- `npm run test:contracts`: 19 tests passed (five catalog tests plus prior account/session/navigation tests). Checks include published-only projection, minimal public fields, outline ordering, active languages and URL validation.
- `npm run test:catalog-http`: passed against Next.js with the live backend. Checks homepage, six-card first page, one-course language/level filter, three-card second page, real premium outline, empty filter, invalid level and missing course.
- `npm run test:catalog-failures`: passed against a local Postman simulation, not the live backend. Checks 503 and retry, 403 permission copy, transport timeout, a failed language list alongside successful course data, missing detail and homepage resilience. Simulation request events confirmed the configured upstream paths were called.
- ESLint, TypeScript and production build passed. No backend writes, real logins, enrollment, payments or account creation were performed.
- Browser: public homepage and catalog at desktop, 320px mobile layout, filter submission, opening an outline and expanding the Animals module. Checked mobile menu closure and light/dark themes. Narrow hero clipping found during review was corrected. Existing dev CSS occasionally remained stale until server restart; the served stylesheet and computed styles were checked after restart.

## Brief review checklist

1. Open `/`: review the colors, copy, language cards, GameCard section and school/family links.
2. Follow Find your language. Try each language and level, Apply filters and Clear filters. Reload and confirm selections persist in the URL.
3. With all filters cleared, use Next/Previous and check that the results change.
4. Open a course. Expand modules and check lessons, quizzes and duration. Advanced courses should say Premium and explain access.
5. On mobile, check menu opening/closing, readable headings, filters and cards. Try the theme toggle.
6. Try either live Edo entry to check a real empty selection. Sign-in, learner/parent registration and school registration links should open their existing flows.

## Continuing setup

Normal development: `npm run dev` on port 3000 with the configured real backend. Tests do not override `.env`.

For repeatable local failure checks, stop the normal dev server first; only one Next dev process may use the checkout. Run `npm run simulate:catalog`, then `npm run dev:auth-test` (the existing test-server launcher points to the simulation at port 4900 and exposes the frontend at 3100), then `npm run test:catalog-failures`. Stop both test processes and restore `npm run dev` afterward. The simulation deliberately fails the language list and uses special fixture selections for errors; it is never the normal backend.

Educational content quality, premium entitlement and monetization scope remain release checks. New public marketing copy is available for product-owner review with this step.
