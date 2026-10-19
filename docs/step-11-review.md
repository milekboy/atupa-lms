# Step 11 — learner overview and progress

Implemented the learner dashboard using GET /dashboards/learner, with points, streaks, time, completion, current courses, quiz scores, earned badges, recent activity, supplied recommendations and certificate summaries. Staff overview is unchanged. Progress details use stats, badges, activity and quiz-results without duplicating the overview request. Refresh reads backend results; no rewards are awarded locally. Certificate viewing/download is Step 13.

Lesson reading position uses documented progressPercent and lastBlockIndex. A saved matching lesson offers explicit Resume or Read from beginning; a completed lesson never writes position. Intersection changes debounce for one second, serialize writes, ignore stale UI responses and flush before completion. Reading position is capped at 99%; only the completion endpoint awards completion. A failed position request shows a message. This is block resume, not video timestamp resume.

Foreground lesson/quiz time is sent with heartbeat seconds. A named Web Lock elects one tab, released when hidden/unfocused. Input/scroll renews a 45-second idle window. Suspended timers never catch up more than five seconds. Increments are never automatically retried after uncertainty. Browsers without Web Locks skip telemetry; they still support lessons and position. Small final intervals may be lost on navigation rather than replayed and counted twice.

## Brief test checklist

1. Sign in as learner: check overview against your courses, points, streak, time, badges and quiz scores. Open Progress, refresh and check earned/unearned states. Staff should retain their own overview.
2. Read part of an unfinished lesson, wait for Reading place saved, leave and return through Continue learning. Resume should bring back the saved block. Refresh or sign in elsewhere to check backend persistence.
3. Leave a lesson idle for over 45 seconds, switch to another browser tab, and open a second learning tab. Only focused active learning should add time. Return and interact to resume counting.
4. Complete a lesson and refresh: completion/rewards come from backend; rereading should not reset completion. Check empty and fully completed dashboards offer Explore courses.

## Verification and pending gates

Local fixtures derive from the supplied Postman collection; stateful position/time behavior is a synthetic model, not live backend policy proof. No owner's published mock was available from the earlier workspace discovery; nothing was published or deployed.

Keep Step 11 unchecked until live checks establish second-device resume, completed-lesson monotonicity, repeated-completion reward deduplication, multi-device heartbeat accounting and server clock/idle enforcement. No revision/ETag is documented for concurrent cross-device position writes; frontend serialization cannot settle conflicting devices. Video timestamps remain unverified. Step 10 timed quiz/recovery/media gates remain pending.

Reproduce: postman simulation run postman/simulations/progress.sim.yaml --port 4900 --no-history --output ndjson; build; node scripts/start-session-test.mjs; node --test tests/progress-http.mjs.

## Local verification — 2026-10-19

- Targeted ESLint, TypeScript via final production build, all 37 contract/unit tests and the frontend HTTP progress lifecycle passed. HTTP covered learner-only access for six reads, enrollment, saved position, fresh-login persistence, user isolation, two heartbeat increments and negative-seconds rejection. A rerun initially reused old fixture state; the test now generates an isolated identity and passed again.
- Browser verified overview, Progress navigation, earned/unearned badges, saved-block Resume control and Reading place saved feedback. A two-visible-block selection issue was fixed by choosing the intersecting block nearest viewport centre; final build and lint passed after the fix.
- Browser time requests were observed in simulation logs (4/5-second increments). Suspended/background/idle handling also has deterministic monotonic-clock tests. Full multi-tab/multi-device accounting remains a live verification gate.
- Mobile Progress checked at 320px: metrics and header controls fit. Screenshot atupa-step-11-overview.png is in the task workspace and contains synthetic data.
- No live backend records were changed. The user's existing development server was left running. Temporary test services were stopped after verification.
