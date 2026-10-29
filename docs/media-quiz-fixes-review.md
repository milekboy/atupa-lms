# Lesson media and quiz fixes — 29 October 2026

Scope: TC-05-001/005 and TC-07-005/006/010/011. Source: supplied `ATUPA LMS API · Media.postman_collection.json` and the backend team's timer/question/resume handoff. Saved examples establish lesson video/audio playback objects and mediaAssetId attachment requests. The collection contains no quiz start/submit/timer examples; quiz behavior is implemented against the explicit handoff, with actual response/type verification still required.

## Implemented

- Learner response projection preserves only safe playback metadata and choice data. Author solutions, correct answers and other private fields remain excluded before submission. Sources retain backend order; URLs must be safe HTTPS (localhost HTTP is allowed for isolated fixtures).
- Shared image/audio/video player uses optimized images, ordered audio/video sources, poster thumbnails and native controls. Browser-supported MP4 fallback works when the first HLS source is unavailable. Native HLS is used where supported; no adaptive HLS library was added. HLS-only assets in browsers without native HLS still need an MP4 source or a separately agreed HLS integration.
- Per-resource load errors display a Retry button without replacing the lesson. Each source failing is distinguished from all sources failing; a bubbled source error must not prematurely stop fallback. Cleanup stops detached playback without requesting the sources again. Missing playback can reload lesson data on Retry. Unavailable media does not disable other content/practice; completion remains backend-authoritative.
- Lesson authoring adds image/audio/video blocks and saved-media pickers. Saving sends the full visible block list, with mediaAssetId for selected uploaded resources; derived playback fields are stripped. Known external mediaUrl blocks are preserved, and unknown legacy blocks remain unchanged.
- Quiz authoring adds a custom Text only / Image / Audio media control for existing multiple-choice questions and saves the uploaded mediaAssetId. This does not invent a new backend question-type enum. Existing unknown types/custom scoring remain read-only. The learner supports media-bearing choice questions using the returned choices, including structurally compatible returned media question types, and sends chosen text by question ID.
- Direct-upload confirmation now includes the provider's duration when supplied. Media-library previews use returned playback data. The picker filters choices/files to the requested kind; the backend remains responsible for asset kind, ownership and authorization.
- Start/resume calls POST `/learning/quizzes/:quizId/attempts`. The backend response is authoritative for attempt ID, remaining time and question order; no client shuffle or author-order reconstruction occurs. An open attempt no longer blocks resume. Closing/reloading does not preserve unsent answers; the UI states this clearly.
- Countdown uses remainingSeconds and monotonic elapsed time, catches background timer gaps, and never derives the deadline from the device wall clock. At zero it sends current valid answers once, including partial/empty answers, without waiting for all questions or a confirmation dialog. Ambiguous outcomes require status reconciliation rather than repeated submission. Timed-out backend results show “Time’s up” and history identifies expired attempts; automatic submissions accepted in grace also get an explicit time-ended notice.
- Quiz/lesson route identities remount their players so a previous route's timer, answers or media cannot carry into another record. Custom dropdowns are used throughout.

## Verification

- 71 contract tests passed, including safe media projection/source order, invalid URLs, ID-only attachment writes, partial answer serialization, zero/invalid remaining time, and background countdown gaps.
- 31 HTTP checks passed across media-learning, authoring/assessment, legacy learning, progress and free-launch simulations. The real production frontend forwarded requests to the local Postman member; request events were inspected. New scenarios cover lesson media, attachment persistence/kind rejection, image/audio grading, identical resume identity/order, changed fresh-attempt order, partial submission during grace and expiration after an abandoned attempt's grace window.
- Existing local simulations were reused; the new media-learning member extends the existing authoring fixture with the supplied media shapes and handoff behavior. Earlier owner-mock discovery found no reusable published mock. Neither fixtures nor the supplied collection were run destructively against a shared backend.
- Final full ESLint and production build/TypeScript passed. The browser exposed a source-error bubbling issue during verification; the corrected player loaded the MP4 fallback after the first source's 404. Actual video playback advanced, image decoded, and audio metadata loaded. The deliberately failing audio showed an inline error and loaded after Retry while other lesson content remained usable.
- Browser media questions loaded image/audio and submitted a saved 100% score. Fresh order differed from the previous attempt; reopening resumed the same order with 49 seconds remaining. A three-second timer submitted one answered question and one blank exactly once, showed the time-ended notice and saved 50%. Closing a separate unfinished quiz tab and returning later showed expired / 0% in history.
- Teacher browser checks selected a saved video through the filtered picker, saved the lesson with all five existing blocks, changed the custom question-media control and selected/saved an audio asset. Saved quiz fields retained both media attachments. At 375px the media authoring view had no horizontal document overflow and zero native selects.
- Playback proof: `atupa-media-playback.png` in the task output folder. Temporary test tabs/listeners are stopped after review, leaving the user's development server untouched.
- These checks use synthetic local media and the MDN CC0 clip, not real provider uploads. They do not establish live provider upload, live backend grading/expiry, actual ownership enforcement or deployed CDN/CORS behavior.

## Brief review with real test content

1. As teacher/content creator/admin with the relevant permission, edit a course lesson: add an uploaded video, audio and image, save, reload and verify all existing blocks remain. Publish the course/lesson and enroll an isolated learner.
2. Play video/audio and view the image as the learner. With a deliberately broken resource, verify an inline error, Retry and usable remaining content. Test mobile/desktop and the actual deployed media formats.
3. In Activities & quizzes, use the custom question media control to attach an image/audio file to multiple-choice questions. Save/reopen, answer as learner, and confirm the saved score. Wrong-kind files must not be selectable and backend 400s must remain visible.
4. Set a 30–60-second timer. Leave some answers blank and let it reach zero: it should submit once and show the time-ended result. Test server timedOut/expired results separately, including leaving the app until the backend closes the attempt.
5. Resume before submission: same attempt/order and less remaining time. Submit, then start a fresh attempt: use the new returned order. Reopening cannot restore unsent answers unless a future backend contract provides them.

## Live acceptance gates

Need real uploaded media and image/audio timed/randomized quizzes, isolated staff/learner credentials, actual quiz start/resume/submit examples (including exact type values and remainingSeconds semantics for untimed attempts), and deployed playback/CORS tests. The new collection still has placeholder confirmation 404 and multipart upload 400 examples, so successful live upload is not inferred. Confirm media attachment role/ownership and wrong-kind rejection directly against the backend. Other outstanding MVP contracts and release gates remain unchanged.

## 2026-10-29 development playback correction

Reproduced the reported image-success/audio-video-failure pattern in an isolated Next development copy against the existing media-learning Postman simulation. Ref cleanup removed source URLs during React Strict Mode ref replay. Cleanup now pauses playback but only discards sources after a real DOM detach, preserving mounted sources during replay. Strict Mode remains enabled.

After a full reload, audio decoded (2 seconds), video decoded and played (5.055 seconds), library refresh preserved playback, and reopening video resource details decoded successfully. Earlier production-only playback checks missed this development lifecycle bug. These are synthetic local media checks, not confirmation of every live provider file.

Review: fully refresh the app, open the media picker, play uploaded audio/video, refresh the library and reopen resource details. Confirm images still display and genuine failures retain Retry.
