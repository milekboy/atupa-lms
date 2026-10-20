# Step 19 — library search and discovery

Frontend implemented 2026-10-20. The user's instruction to proceed with Step 19 is recorded as including US-17 search in MVP. Step 20 was not started; monetization scope remains undecided.

## Delivered

- Learner navigation now includes Search library at `/dashboard/search`. It searches courses, lessons, vocabulary, cultural topics and games, using the supplied public/no-auth GET `/search` contract through the protected frontend transport. The backend search request and course-outline checks are anonymous. This initial UI lives in the learner workspace because its vocabulary/culture/game readers are learner routes. Existing public course browsing remains available.
- A debounced search field (350ms) and custom content/language/level dropdowns retain URL state across reload and Back. Language choices come from active backend languages. The content control exposes demonstrated type tokens and their saved combined value. No age-group, course-type or duration filter was inferred from response metadata.
- Superseded frontend requests are aborted and stale data is hidden immediately while input/query changes. Empty queries do not call search; invalid, too-short and oversized queries are bounded. Loading, empty, retry, API failure and partial-verification states are explicit.
- Results are grouped and labelled with the number shown, without claiming a complete global count or inventing pagination. Returned language search hits have no populated saved example, so an additional language-hit group/DTO is not guessed; language filtering and course language browsing are available.
- Search responses are projected server-side: drafts, malformed IDs, private metadata, arbitrary destinations and answer-bearing fields do not pass through. Course and lesson matches must also appear in an anonymously accessible published course outline. Lesson names come from that outline, and their link opens the course/access page rather than bypassing enrollment. Other links use the existing learner readers.
- Outline verification is bounded to 12 unique courses per request and displayed groups to 40 candidate items each. Omitted/unavailable course or lesson matches produce a partial-result notice and retry, while other groups remain usable. Backend publication/access enforcement remains authoritative.

## Validation

- Production build/TypeScript and targeted lint passed. All 64 contract tests passed, including query/filter constraints, metadata/draft stripping, safe destinations and malformed response rejection.
- Four HTTP scenarios passed through the actual built frontend and local Postman simulation: grouped results with public-outline verification; documented filters/Unicode and metadata stripping; draft/unverified lesson exclusion; empty/error/malformed/timeout/invalid-filter/method/role cases.
- Browser checks covered learner navigation, grouped results, rapid slow→lion typing without old-result replacement, keyboard content/language/level filtering, reload and Back state, empty/error recovery and phone layout. The 375px page had zero native selects and no horizontal document overflow.
- Actual simulation request events were inspected for `/search` and anonymous `/courses/:id` verification. Fixtures adapt the supplied saved search shapes and existing synthetic auth/school stand-in; earlier owner-mock discovery yielded no reusable published mock. No live records were changed.
- Live anonymous search availability was attempted separately with bounded read-only requests; timeouts do not establish a backend defect or a successful live search check. Live availability and publication/entitlement behavior remain release gates.
- Review screenshot: `atupa-step-19-search.png` in the task output folder. Temporary test processes are stopped after review; the user's port 3000 server is untouched.

Repeat locally: `npm run build`, `postman simulation run postman/simulations/search.sim.yaml --port 4900 --no-history --output ndjson`, `npm run start:session-test`, then `node --test tests/search-http.mjs`. Only the synthetic learner identity and `fixture-password` are used in this test environment.

## Brief manual review

1. As a learner, open Search library. Try a known word such as greetings/lion and check grouped results and their destinations.
2. Change content, language and level with the custom dropdowns. Reload, use Back and clear filters; the search state should remain consistent.
3. Type different queries quickly. Old results should disappear while searching and must not replace newer results.
4. Try an unmatched term and a failed request; check empty/retry states. Check phone width and keyboard selection.
5. Open a lesson result: it should lead to the published course/access page. Verify draft content stays hidden and premium content still follows backend access checks.

## Release gates

- Verify live search availability, ranking, language/level/type semantics, Unicode handling and result limits against seeded real records. Recheck anonymous course outlines, draft/unpublished lessons, school-private courses and premium access. Anonymous outline verification is a publication/access safety check, not a grant of learner entitlement.
- Obtain verified request filters before adding age group, course type or duration. Obtain populated language-hit examples before adding that result group. This step does not claim all optional P2 filter criteria.
- Complete broader device/theme/screen-reader QA and search performance checks with realistic result volumes. Public/staff search UI expansion is separate from this learner-workspace integration.
