# Step 18 — notifications and basic reports

Frontend implemented 2026-10-20. Live acceptance remains open. Step 19 was not started.

## Delivered

- Full paginated inbox at `/dashboard/notifications` and the header drawer share the same notification UI. Account-wide unread count, mark-one/read-all, exact-title deletion, per-loaded-page read filtering, pending/error/toast states and refresh are supported. The header count refreshes after notification mutations, opening the drawer and window focus. Shared parent-page read actions also emit the refresh event. It is not a realtime push subscription.
- Mark-all applies to the complete account inbox, while read filters apply only to the loaded page. These scopes are labelled. Existing parent privacy filtering continues to hide updates for unlinked children; account totals/counts remain the backend's account-wide values.
- Destinations are derived from known payload identifiers and role, never a supplied URL: learner assignment updates open the assignment; parent child updates open the family page. Other types remain readable without guessed links. No broadcast, scheduler or notification-creation endpoint was added.
- Reports at `/dashboard/reports` support learner self, currently linked parent children, staff class/learner selection, school-admin school reports/overview and super-admin school selection. New selectors are the shared accessible CustomSelect, including paginated class/school choices. Existing older teacher overview selectors were not migrated by this step.
- Learner reports show returned completion, minutes, points/streaks, counters, quiz scores/attempts, game engagement and recent activity. Class reports show completion, assignments and learner results. School reports show 7/30-day engagement, course completion, assessment averages and teacher activity. The school overview uses `/dashboards/school`. No fabricated time series or optional leaderboard was added.
- Report resource failures have independent loading/error/retry states, so a failed class report does not discard successful school panels. Time windows are explicit; unlabelled metrics have no invented date filter. Missing numbers show unavailable, not zero.
- Print styling covers the loaded report page and removes the dashboard chrome/controls. The action is labelled “Print loaded report”; it is not a full-dataset PDF/CSV export or a server export endpoint. Actual printer/PDF output remains a manual release check.
- Proxy method/role restrictions cover report/notification actions; learner self IDs are enforced. Parent report requests check fresh linked children first, so unlink revokes access immediately. Returned report IDs must match the request; report projections drop private/answer-bearing fields. Staff ownership/school scope and notification ownership remain authoritative in the backend.

## Validation

- Production build/TypeScript and targeted lint passed. All 61 contract tests passed, including safe links, methods/roles, learner privacy and class-report compatibility.
- Four local HTTP scenarios passed through the real built frontend and Postman simulation: notification pagination/read/delete/count persistence and ownership; learner/staff metrics and answer stripping; parent link/access/unlink revocation; school reporting scope and an independent class-report 503.
- Browser checks covered keyboard class/learner selection, school and class reports, the learner panel, header/inbox unread consistency, all-read persistence after reload, custom read filtering, a successful school report alongside a failed class report, and 375px report selectors. The phone page had zero native selects and no horizontal document overflow. Tables scroll within their own containers.
- Actual simulation request evidence was inspected, including notifications, report and school-dashboard calls and expected 403/404/503 responses. Fixtures derive from supplied saved report/notification responses and the existing synthetic school/family auth stand-in. Earlier owner-mock discovery yielded no reusable owner mock. No live accounts or records were changed. These checks establish frontend behavior against a stand-in, not live backend permission or aggregate accuracy.
- Review screenshot: `atupa-step-18-reports.png` in the task output folder. Temporary test processes are stopped after review; port 3000 is untouched.

Repeat: `npm run build`, `postman simulation run postman/simulations/insights.sim.yaml --port 4900 --no-history --output ndjson`, `npm run start:session-test`, then `node --test tests/insights-http.mjs`. Synthetic identities use `fixture-password` only in this local simulation.

## Brief manual review

1. Open the bell and full Notifications page. Mark one/all read; confirm header and inbox counts agree after reload. Change page/filter and delete an isolated test notification with its title confirmation.
2. Check a learner assignment notification opens the correct assignment. Parent updates should open only the family context supported by their payload.
3. As teacher/school admin, select a class and learner using the custom dropdowns. Check course completion, quiz scores, learning minutes and activity against known records.
4. As school admin, review the school overview/report and teacher activity; as super admin select a school. Parents should see only linked children, and learners only their own report. Retry a failing panel without losing the rest of the page.
5. Check phone layout, keyboard dropdown operation and “Print loaded report” output. Verify long tables/pagination and light/dark/reduced-motion accessibility during full release QA.

## Live release gates

- Verify the exact direct-backend report role/ownership matrix with isolated learner, linked/unlinked parent, assigned/unassigned teacher, school-admin and super-admin accounts. Collection examples do not prove every allowed role. Confirm real learner metrics agree with enrollment, progress, quiz, game and time records, including definitions of averages and recent-list limits.
- Verify notification ownership, event delivery, deleted/previously read items, account counts, pagination, historical parent updates after unlink and concurrent changes from other sessions. The app refreshes on its own mutations/focus/open; no realtime delivery contract is claimed.
- Check printed output in target browsers/printers, multipage report tables and full device/screen-reader/theme coverage. No server export or complete-dataset export has been claimed.
