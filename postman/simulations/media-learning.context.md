# Media-learning simulation context

Created 2026-10-29 from existing authoring fixtures, supplied media collection and backend handoff.

## Purpose

Exercises the production frontend against `../mocks/media-learning.js`; playback assets are documented in `tests/fixtures/media/README.md`.

## Execution

Build, then `npm run test:integration -- media-learning`. The runner prints temporary TAP/NDJSON locations and checks member request events. For browser checks use `postman simulation run postman/simulations/media-learning.sim.yaml --port 4900 --no-history --output ndjson`, then `node scripts/start-session-test.mjs` on 3100. Stop both after use; leave 3000 untouched.

## Assumptions

- 2026-10-29 (reasoned from backend handoff): remainingSeconds/serverTime are start-response fields; start resumes an open attempt; the server grades partial submissions during a 30-second grace and expires abandoned attempts afterward. The supplied media collection has no quiz example to independently confirm those shapes.
- 2026-10-29 (observed HTTP run): seeded uploaded asset IDs and question media pass through the frontend without answers; authoring/readback and wrong-kind failures are exercised. Provider upload itself is not simulated.
- 2026-10-29 (fixture design): fresh question order alternates to guarantee a difference; this does not prove production randomness. Test audio is a tone, not pronunciation content.

- 2026-10-29 (observed browser run): the fixture does not model the full saved-place API, so its unavailable-place notice is independent of media playback; the dedicated progress suite still passes.

## Observations

<!-- begin:observations -->
- 2026-10-29: browser run served authoring, learner media, fallback/Retry, resume and automatic-submit traffic through the sole member; no configured member was silent. Actual video decoded and played. The short quiz sent one partial submission; closed-tab history later showed expired.
- 2026-10-29: media-learning member served the focused production-frontend HTTP scenarios; no other members were configured or silent.
<!-- end:observations -->

## What didn't work

- 2026-10-29: direct Windows app-alias startup produced no listening event within the old runner bound; invoking the installed Postman command through a hidden PowerShell child and allowing cold startup passed.
- 2026-10-29: browser source-error bubbling initially stopped video before MP4 fallback; fixed by distinguishing source from media-element errors and preventing detached-source reloads. Browser recheck recorded in the review.

- 2026-10-29 development recheck: sole media-learning member served auth, media list/detail and binary sources; none silent. Strict Mode ref cleanup removed mounted sources before the fix. Fresh reload, library refresh, audio/video decoding, video playback and resource-details remount passed after detach-only source cleanup. Production-only checks had missed this. Live provider files remain unverified.
