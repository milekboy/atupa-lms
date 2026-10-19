# Step 10 — learner lessons and quiz attempts

Learner accounts now have **My courses** and **Quiz attempts** in the sidebar. From a public course outline, **Open in your learning space** leads to enrollment or the enrolled course. Staff authoring remains separate.

Implemented:

- Enrollment, saved enrollment list, course outline and canonical course progress. Active in-progress enrollments can be removed with course-name confirmation; the backend can deny removal.
- Focused lesson reader for documented text/cultural-note blocks, vocabulary, pronunciation/cultural notes and GameCard references. Published learner lessons come from `/learning/lessons/:id`, not authoring endpoints.
- Multiple-choice practice submission and returned grading/solution, plus explicit backend-confirmed lesson completion. Prerequisites, enrollment and premium denials are surfaced without bypassing them.
- Explicit quiz start, multiple-choice/true-false/translation responses, submit confirmation, returned pass/fail score, saved attempt history and permission-controlled answer review. Retaking is an explicit action and the backend enforces limits.
- A server response allowlist removes solutions, correct answers, accepted answers and author explanations from lesson/start payloads before they reach the browser. Answer review is projected only when `reviewAvailable` is true. Direct learner API actions also require a learner session; backend ownership remains authoritative.
- Submission/start locks, cross-tab Web Locks when available, fresh attempt-history checks, no automatic POST retries after timeouts/5xx, and uncertain-outcome reconciliation via saved attempt metadata. Answers remain in memory during recoverable errors; the UI warns before leaving an active attempt.

## Brief test checklist

1. Sign in as a **learner**. Browse a published course, open its learning space and enroll. Verify it appears in My courses after refresh.
2. Open a lesson, answer practice, complete it and reopen the course. Check saved completion/progress and backend prerequisite messages.
3. Start a quiz, answer all supported question types, confirm submission and check the saved score. Open Quiz attempts, refresh and review answers only where allowed. Check explicit retake and maximum-attempt handling.
4. Test phone layout, premium denial and leaving an active course using its exact title. Keep the quiz tab open until submission; reload/resume is a known contract gap below.

## Pending gates — Step 10 stays unchecked

- **Timed deadline and reload:** the saved start response contains `startedAt` and questions, but no authoritative deadline/remaining-time/server-clock metadata. It does not prove how a configured timed quiz behaves. No consequential client countdown or auto-submission is invented.
- **Attempt resume:** the collection documents attempt-list metadata and review after submission, but no read endpoint restoring an unsubmitted attempt's questions/answers. The UI blocks another start when history reports an unresolved attempt and asks the learner to return to the original tab. A closed/reloaded attempt may require support until a resume contract is supplied.
- **Ambiguous outcomes:** after an uncertain start/submission, safe GET status checks remain available; no duplicate attempt/submission is automatically dispatched. If the backend still reports unresolved state, it is held for reconciliation rather than silently retried. Backend idempotency and recovery semantics need confirmation.
- **Media and additional P1 formats:** image/audio/video lesson block schemas and the additional activity/question contracts remain pending from Steps 8/9. Unknown resources show an explicit unavailable state and pause lesson completion. Existing uploads alone do not establish learner attachment/rendering fields.
- **Live checks:** no isolated live learner/role accounts were supplied. Entitlements, school/ownership boundaries, timed behavior, prerequisite enforcement, expiry/status enums and scoring need live validation. Local failure variants model these rules and are not evidence of backend implementation.

## Backend clarification draft — not sent

Please provide a configured timed-quiz start response, authoritative deadline/clock semantics, and the supported way to reload an active attempt without creating another. Confirm the open/expired attempt statuses, how to reconcile uncertain start/submission outcomes, and any idempotency keys. Please also provide the remaining media and type-specific learner response/grading examples referenced in the Step 9 matrix.

## Local verification

Use `npm run simulate:learning`, then (after `npm run build`) `npm run start:session-test`, then `npm run test:learning-http`. Fixture IDs conform to the public catalog's 24-character ID format; all test identities/content are synthetic. The existing signed-out workspace limitation remains: no owner mock was discovered or published. Normal deployment configuration is unchanged and no live content was created, enrolled, submitted or removed.

Step 11 tracking, resume position, heartbeats, achievements and learner overview are not included in this step.

## Verification results — 2026-10-19

- Production build, targeted ESLint, TypeScript and all 35 contract/unit tests passed. Eight local HTTP lifecycle scenarios passed against the learning simulation.
- Browser verification covered public discovery to enrollment, practice feedback, both lesson completions, three supported quiz formats, saved 100% grade/review/history and canonical course completion.
- Simulated lost submission response retained answers; GET status recovered the saved 67% result without another submit POST. Explicit retake then respected the backend's two-attempt limit, with exactly two saved attempts.
- At 320px, content fit and mobile account/menu controls remained inside the viewport.
- Screenshot: atupa-step-10-learning.png in the task workspace (synthetic course). Temporary simulation/frontend ports 4900/3100 were stopped after review; the user's port 3000 app was untouched.

All lifecycle checks used synthetic local data. Live grading, roles and timed/recovery behavior remain unverified.
