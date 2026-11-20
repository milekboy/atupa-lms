# Admin Step 5 — Content review and controlled publication

Date: 17 November 2026 (Africa/Lagos).

## Delivery status

Supported review frontend delivered with local evidence. Step 5 remains unchecked for C01/C06 and live role, self-review, audit, notification and publication/access evidence. No shared backend submissions or approvals were performed. Ordinary course approval, unsupported library kinds/GameCards and incomplete queue records remain read-only.

## Implemented

- `/admin/reviews` has the four documented groups: courses, lessons, Public visibility requests and library. It displays returned service totals, author/submission metadata, group filtering and pagination of the returned items with URL state. No undocumented query/pagination parameters are forwarded. Service totals are distinct from the number of returned rows; the UI does not claim it has downloaded the complete dataset when totals are larger.
- Super Admin can open the review workspace from console home, or from a recognized `reviews` menu entry when returned by the backend. The new server transport checks a fresh user profile and current permissions for every read/decision. It conservatively requires Super Admin plus the existing documented `users.manage` grant pending the complete C01 review permission vocabulary. Other roles and missing grants fail closed.
- Supported POST decisions are `/admin/reviews/lessons/:id`, `/admin/reviews/library/:kind/:id` for vocabulary/cultural-topics/games, and `/admin/reviews/courses/:id/visibility`. Ordinary course approval has no documented endpoint and is not inferred. Unsupported library kinds are shown without actions.
- Approve/reject dialogs require review acknowledgement and exact-title confirmation; rejection requires a comment up to 2,000 characters. Only `decision` and a nonempty optional `comment` are sent upstream. No reviewer/author/status from browser input is forwarded. The frontend does not create audit records as a substitute for backend capture.
- Before a mutation, the server fetches the pending queue again, locates the exact documented target and checks its submission timestamp against the selected version. Missing/stale items return 409. Author identity and a valid submission time are required to enable decisions. Known self-submission or known self-authorship is denied on the server and in the UI; another Super Admin must review it. This conservative restriction does not resolve backend exceptions or unknown author fields.
- Successful responses show only actual returned status, audience and review metadata. A success without an entity is displayed as an accepted request requiring readback, not an invented Published result. Wrong-entity responses fail visibly. The queue refreshes after success, permission/stale conflicts or ambiguous errors. Double-click locking, preserved comments on failure and a locked dialog after 409/403/5xx prevent blind resubmission of the same action.
- Lessons with a returned course reference can use the protected Step 4 saved-content preview. Otherwise, authorized operators use existing course/library studios to inspect evidence. No guessed detail/preview endpoint is used. The collection saves only a populated visibility queue entry; full lesson/library/course queue DTOs still need real acceptance. Unknown shapes stay unavailable for decisions until the required identity/kind/time fields are returned.
- Course/lesson publish continues to use the existing endpoint and display `in_review`/`submittedForReview` accurately. Existing library creation/edit feedback now uses the returned status too, and library Details shows returned review/rejection comments. Existing library PATCH behavior is reused; no new library resubmit endpoint is invented.

## Local verification

- 96 contract checks pass: safe queue/results projection, totals and duplicate handling, decision payload/path/method/role restrictions, comment validation, self/incomplete submission denial, unsupported kinds, safe route returns and acknowledgement-only responses.
- 135 HTTP checks across all 16 isolated admin/LMS regression groups pass. New real-frontend cases cover creator submit → reject → author feedback → resubmit → approve; reviewer readback; visibility versus publication; library review/resubmission; stale/newer submissions; missing grants; self/identity denial; CSRF; unsupported endpoints; uncertain/wrong-entity results; queue and home pages.
- Lint and production build pass. The normal build initially stopped after compilation/type-checking on the existing Next.js security advisory; its instructed retry succeeded with the warning. The framework upgrade remains a release follow-up. Browser checks used synthetic records for author submission, reviewer preview, rejection/readback/resubmission/approval, readonly ordinary courses, known self-review denial, 409 dialog locking, URL filters/reload, custom dropdowns and tablet/light/dark layouts.
- Existing learning, assessments, media, progress, account/session, parent, school/class, reporting, admin account and bulk-onboarding regressions passed. Local fixtures do not certify the actual deployment's second-person enforcement or transaction/audit semantics.

## What to test

1. Sign in as an existing Super Admin with the required grant. Open Admin console → Content review queue. Inspect all four groups, totals, author, time, group filters and refresh. Confirm other roles and a missing-grant Super Admin cannot use direct page/API requests.
2. As a Content Creator, create a course/module/lesson and request publication. It should show the actual returned `in_review` state. As a different Super Admin, preview the submitted lesson or inspect it in Course studio, then reject with a clear comment and title confirmation.
3. Refresh as the author and confirm draft status and rejection feedback. Correct/resubmit through the existing tools. Approve as the other Super Admin; verify the saved reviewer/comment/status and queue removal. Confirm the intended learner availability on the real backend.
4. Submit an eligible vocabulary/culture/game item, inspect it in Library studio and review it. Check the returned status, author feedback and actual supported edit/resubmission behavior. Unsupported kinds and ordinary course entries must not offer a guessed approval operation.
5. Review an existing Public audience request. Confirm that approving visibility changes the audience independently of publication. The ability to create new Public requests from the interface belongs to Step 6.
6. Try a known own submission, a stale decision from another tab and a newer resubmission: they must be denied or refreshed. On an interrupted/uncertain save, check the queue and saved content before repeating the action. Confirm backend self-review/role enforcement and audit capture using approved isolated records.
7. Recheck existing course/media/quiz editors, learner lessons/quizzes/progress, teacher/school tools, parent views, admin invitations and bulk onboarding. Check tablet sizing, keyboard confirmation, modal Escape/focus and light/dark themes.

## Remaining clarification / live acceptance

- C01: complete review grants/menus, authoritative reviewer/record scope and actual Super/Support/Creator capabilities. `users.manage` is a conservative compatibility gate, not a confirmed complete content-review permission contract.
- C06: ordinary course decision endpoint; complete queue/detail/success DTOs; self-review and Super Admin/private-course exceptions; publication of edited approved content; re-review/resubmission rules; GameCard/quiz coverage; authenticated draft access. Missing author/time/kind fields keep affected decisions unavailable.
- Backend must enforce pending-state/version/ownership checks atomically at mutation time; the frontend preflight cannot eliminate races between GET and POST. Verify no unapproved content becomes public, actual reviewer/comment persistence, protected audit capture and author notifications on the deployed backend.
- Preserve the known release gate for the installed Next.js framework security advisory recorded in Step 4; dependency upgrading is separate work.
