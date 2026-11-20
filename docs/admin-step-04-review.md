# Admin Step 4 — Content studio and course structure

Date: 17 November 2026 (Africa/Lagos).

## Delivery status

Supported frontend work delivered with local evidence. Step 4 remains unchecked: complete curriculum/assessment formats, hierarchy reordering, production upload limits/private delivery and review policy still require C04/C05/C06 answers and live acceptance. C01 also gates extending Support Admin authoring. No real content was created, published or made Public during implementation.

## Implemented

- Retained the existing Course → Module → Lesson → Activity/Assessment structure and existing language/level, vocabulary, culture, game, GameCard, media and QR tools. The admin home links Super Admin/Content Creator to these existing protected tools; teachers keep their LMS Course studio. No new permission keys or Support Admin write access were invented.
- Course/lesson normalization now retains documented optional audience, owner type, author/school references, review/public-request fields and publication/submission flags. Missing legacy metadata stays absent rather than defaulting to a made-up audience. Read-only panels distinguish publication from audience, show returned review decisions, and use the course audience/owner context for its lessons.
- Editing sends the established editable fields, excluding governance/ownership/review fields. Returned optional metadata is retained when a mutation omits it. `vocabularyIds` supplied by the backend survives lesson edits. Unknown lesson blocks remain read-only and retained; media replacement and caption saves retain extra block properties while replacing the old resource reference and omitting hydrated playback data from writes.
- Authors can move lesson blocks up/down within the existing full `blocks` array save contract. Module/lesson hierarchy reorder and drag ordering remain unavailable pending C04; these controls do not imply a new hierarchy endpoint.
- Saved lessons have a protected preview. The frontend GET `/api/author-preview/:courseId/:lessonId` checks a fresh account role, calls the existing backend authoring course read for ownership/record authorization and verifies course/module/lesson association. It returns an explicit content-only projection, not the answer-bearing author tree. Known verification/report assets are suppressed. It does not change the published-only learner endpoint.
- Preview shares the learner lesson-content projection and renderer for text, cultural notes, image/audio/video playback and supplementary notes/GameCard codes. It clearly previews saved content only; unsaved changes disable preview. Activities/quiz answers, author/reviewer identities and raw extra block fields are excluded from preview responses. Preview does not submit practice, create attempts, track time, update progress, complete lessons or generate rewards. Unsupported block types show the same unavailable-format message as the learner reader.
- Basic publication feedback reflects returned `in_review`/`submittedForReview` rather than announcing success as Published. Pending-review publication is disabled. Review decisions/queue tooling belong to Step 5; audience mutations belong to Step 6. Private/school courses are not labeled as public outlines; legacy courses without new audience metadata retain the course-outline link.
- Existing supported assessment editors remain in place. Unknown assessment shapes stay protected against destructive rewrites. No grading schema, activity format or larger upload capability was fabricated.

## Verification evidence

- 91 contract checks pass, including optional metadata/read-only payload boundaries, linked vocabulary, media extension preservation, draft preview privacy/parentage, known private-asset suppression and accurate publication messages.
- 126 HTTP checks across all 16 local admin/LMS regression groups pass. New real-frontend checks cover author-only preview, other-owner/learner/anonymous denial, forbidden mutation/query requests, missing lessons, drafts absent publicly, rich lesson roundtrip and creator `in_review` responses. Existing assessment, media/learning, progress, school, family, authentication and admin onboarding suites passed.
- Lint and production build pass. The normal Turbopack build initially compiled and type-checked successfully, then exited on an installed-framework security advisory for Next.js 16.4.2. Its instructed retry succeeded with the advisory warning. Dependency upgrading was not part of this step; resolve that advisory before release. A browser check used synthetic content to verify Course studio, read-only audience context, saved text/image preview, native image loading from the local test app, escape/focus restoration, no progress/learning calls, dirty-state preview restriction, block movement, preserved unknown metadata and vocabulary references, review messaging, tablet width and light/dark layouts. Test services were stopped afterwards.
- Local mocks and a local image do not certify real media upload/delivery, permission matrices, browser audio/video playback from the deployed provider or curriculum completeness.

## What to test

1. Sign in as Super Admin or Content Creator. From Admin console home open Course studio; teachers should continue opening it from their LMS workspace. Confirm existing media, library and GameCard QR tools remain available only to their authorized roles.
2. Create/open a course with modules and lessons. Inspect Publication, Audience, Owner type and available author/review information. Edit course/lesson text and refresh; verify audience, ownership, review state and existing vocabulary/GameCard links remain intact.
3. Add text, cultural notes and image/audio/video resources using the media picker. Edit captions, move lesson blocks, save and reload. Confirm ordering, media and supplementary notes persist; unknown block formats must remain intact and read-only.
4. Open a saved lesson and select Preview saved lesson. Check tone marks, text, captions, media, notes and related GameCard codes against the learner reader. Preview should be disabled while edits are unsaved, close with Escape and return focus to its trigger. It must not award progress or start attempts. Test another author and a learner against the direct preview URL: access must be denied by the appropriate frontend/backend boundary.
5. On isolated content, request publication. If the backend returns `in_review`, the studio must show the review state rather than Published. Verify any returned approval/rejection feedback survives reload. Confirm audience is unchanged by saving or publishing.
6. Recheck the supported quiz/practice editors, learner enrollment/lessons/media/quizzes/progress, teacher classes, parent views, school tools and the new admin invitations/onboarding. Check laptop/tablet light/dark layouts and failed-media retry.

## Still needs backend clarification / live evidence

- C01: complete Super/Content/Support/School grants, menus and authoring scope. Existing authoring reads remain backend-authorized; Support Admin authoring is not enabled using guessed grants.
- C04: module/lesson reorder contracts, all eight quiz types and required practice serialization/grading, faithful preview of unsupported formats, draft authorization and full create-field PATCH DTO acceptance. The new collection explicitly shows a cultural-note block in a create request but omits it from the saved create response: verify whether the backend drops that block before accepting faithful rich-content roundtrips.
- C05: verify upload → attach → save → reload → authorized preview → learner playback for actual images/audio/video. Confirm 10 MB image / 20 MB audio / 300 MB video handling, private verification/report delivery and unused-asset deletion. Existing 25 MB direct / 4 MB fallback limits remain; this step does not claim the new limits.
- C06: complete library/GameCard review coverage, course-review decisions, second-person policy, Super Admin/private-course exceptions and published-edit re-review. Reading returned review metadata does not close those policy gates.
- Record real role/ownership denials, provider playback, preserved unknown fields, audit evidence, deployed QR behavior and curriculum acceptance before checking the step complete.
