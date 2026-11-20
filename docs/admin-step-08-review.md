# Admin Step 8 — overview, scoped reporting and downloads

Frontend delivered 18 November 2026. The plan checkbox stays open until the deployment gates below pass. Existing learner, parent, teacher, school, content and finance flows remain in place.

## What changed

- Super Admin console home uses GET `/admin/overview`, with a fresh profile and `dashboard.view` permission. Returned safe totals, role counts, course counts, school/certificate/parent counts, engagement, revenue, popular-course rows, language configuration and needs-attention groups render independently. Failed loads have retry controls.
- Totals, pass rates and subset counts are checked for internal consistency. Contradictory groups show unavailable while valid independent metrics remain visible. Undefined active-user metrics, overall completion denominator, language-count coverage and GameCard reporting window are withheld pending C08. No missing value becomes a synthetic zero.
- Needs-attention links go to implemented review/verification workspaces when permitted. Safety/alert counts are visible but their workspaces remain Step 9; no invented links.
- `/admin/exports` provides Super Admin users, payments, subscriptions, safety-report and activity-log CSVs; Support gets safety CSV. Super Admin console home links to downloads even if the backend has not yet added the menu entry. Known menu entries are allowlisted.
- People & access exports carry q/role/isActive. Verification filters disable export with an explanation. Finance payments carry applied status/from filters; pagination is excluded. Subscription CSV requires All subscriptions because activeOnly is not documented on that endpoint. The download hub explicitly provides unfiltered files.
- Existing `/dashboard/reports` adds class CSV/PDF and school PDF actions. Teacher class ownership and School Admin school scope are checked from fresh resource reads, then the backend report authorizes the selected resource before export. Returned report IDs must match. Existing learner/parent report routes and loaded-page print behavior are unchanged. Support class export is allowed at the exact server endpoint as documented, but no new Support class directory/report-page access is inferred.
- Dedicated GET `/api/admin-export/[...path]` has exact path/filter/role allowlists, current encrypted-session profile checks and conservative fresh `users.view` grants for Super/Support. Backend resource authorization remains authoritative. It preserves session renewal/error behavior, refuses redirects and JSON/HTML masquerading as files, bounds downloads to 32 MB without truncation, checks attachment/MIME/UTF-8 CSV or PDF signature, discards arbitrary upstream headers and replaces filenames. Downloads are private/no-store with nosniff and sandbox headers. No broadening of the legacy proxy's dot-path restriction.
- Download buttons use the existing session-aware fetch transport, prevent duplicate pending requests and display errors inline. They do not invent a successful download after an error.

## Validation

- Contract suite: 112 checks pass. Full real-frontend/synthetic-backend regression: 159 checks pass across 19 mock groups, including Steps 1–7 and existing sessions, catalog, authoring, learning, telemetry, media, schools, assignments, parents, insights, search and free-launch guards.
- Lint, TypeScript and staged production build pass. The final real-project `npm run build`, lint, all 112 contract checks and six reporting HTTP checks also pass.
- Local Chrome confirms overview contradiction handling with unaffected totals; actual full 30-row filtered CSV and scoped PDF downloads; safe filenames; export hub; unsupported-filter disabled states; JSON failure without a download; preserved print control; desktop/tablet/dark layouts. Downloaded synthetic PDF was rendered with Poppler and visually inspected. These fixtures verify frontend behavior, not real backend report correctness or PDF formatting.

## What to test

1. Sign in as Super Admin and open `/admin`. Refresh Platform overview; compare totals and pending work with approved backend records. Valid zero counts should display zero. Contradictory quiz metrics should show unavailable; undefined metrics stay withheld. Open permitted review/verification links and check errors/retry.
2. In People & access, apply search, role and active-state filters, then Download CSV. Open it and compare filters, headers and full matching row count against the backend, including records beyond page 1. Apply a verification filter: export must be disabled with an explanation. Clear it to resume downloads.
3. In Finance, filter payments and download CSV; check whole-kobo values and matching full rows. In Subscriptions, active-only must disable export; All subscriptions enables it. Open `/admin/exports` and try the unfiltered platform files. Check that HTML/JSON errors never save a bogus CSV/PDF.
4. In Learning reports, select an authorized class and download CSV and PDF, then select a school and download PDF. Open both formats and check names, readable content, counts and scope. Teacher must be denied another teacher's class; School Admin must be denied another school/class. Learner/parent keep only their existing authorized reports and printing. Support gets safety CSV, but not users/payments/subscriptions/activity-log files. Missing/revoked grants must deny new downloads.
5. Recheck existing enrollment, lessons, quiz/progress, parent linking, class assignments and admin accounts/onboarding/content/reviews/visibility/finance. Test keyboard navigation, laptop/tablet and both themes. Printing still means only the loaded page.

## Backend clarification and release gates

- C01: confirm deployed report/export role and permission matrix, current profile/grants, resource ownership and safe sensitive-column selection. `users.view` is a conservative compatibility gate for global exports, not an invented reports permission. Support remains safety-export-only in the global hub.
- C08: resolve saved zero-attempt/two-pass contradiction, active users versus learners, exact windows/timezone, overall completion denominator, course language totals versus published scope and GameCard window. Mathematical consistency is not independent proof of data accuracy.
- C09: no export request has saved file examples. Confirm actual MIME/disposition/encoding/error shapes, PDF readability, authorized columns, CSV formula safety, Unicode, empty-result policy, full filtered dataset parity, max-size handling and performance. PDF signature checking is not a structural PDF validator. Unsupported learner files, school CSV, universal report-table export and undocumented filter combinations stay unavailable.
- Benchmark real paginated/search/report/export behavior under two seconds at 10,000 users in an agreed deployment. Local fixture timings do not certify this target.
- Safety/alerts/audit workspaces remain Step 9; this step only wires their documented CSV files and overview counts. No write operations or paid checkout behavior are added.
- The existing Next.js 16.4.2 security advisory remains a separate release issue; dependencies are unchanged by Step 8.
