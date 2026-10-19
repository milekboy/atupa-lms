# Step 8 — course studio

Staff can open **Content** → **Course studio** at `/dashboard/content` to create and manage courses, modules and lessons. Teachers, content creators and super admins receive navigation; protected routes check the session and role, and the backend remains authoritative for ownership and school policies.

Implemented:

- Paginated authored courses with loading, empty and error/retry states; editable draft trees from the authoring endpoint.
- Course title, description, language, level, course type, age group, duration, premium flag and tags.
- Module titles; lesson title/duration, text and cultural-note blocks, vocabulary, pronunciation/cultural notes and GameCard codes. Existing summaries can be edited. Accents are preserved; line-based lists omit empty entries at save.
- Canonical mutation responses update the workspace; explicit reload fetches the saved authoring tree.
- Separate named confirmations for course/lesson publication and unpublication, and course/module/lesson removal. Returned archival is shown as archival. Archived courses are read-only.
- Pending controls, duplicate-submit locks, server validation messages, recoverable errors with retained input, dirty-state indicators and discard warnings for editor navigation, links and browser unload.
- Answer-bearing activities/quizzes are excluded from the editor projection and write payloads. Unknown existing blocks preserve all their fields unchanged.

## Brief review checklist

1. Sign in as authorized staff, open Content, create a draft course, add a module and a lesson. Use Yoruba/Igbo tone marks in lesson text and vocabulary. Save, reload the saved course and reopen the lesson.
2. Edit something and switch nodes or go back to the course list. Check Keep editing preserves input; Discard changes restores saved state. A failed save should keep every field available for correction and retry.
3. Publish the lesson and course separately, confirming each by title. Check the published public outline; unpublish and reload. Test removal only on disposable records, and verify a previously published course reports archival when the backend returns `archived:true`.
4. Check phone-width layout, keyboard access and centered confirmation dialogs. Learners/parents should not see Content; backend direct API ownership and school checks still need isolated role accounts.

## Verification performed

- 27 contract/regression tests passed, including three new authoring tests for write allowlists, unknown-block preservation, diacritics, parent relationships and answer separation.
- Five local HTTP lifecycle scenarios passed through the real Next frontend/session/proxy and Postman simulation: create/reload, role and owner denials, update plus 503 recovery, publish/unpublish/public outline and child deletion/course archival. Simulation request logs confirm the authoring paths were called.
- Browser checks on the production-mode local test app created a course/module/lesson, saved accented text, retained unsaved edits via Keep editing, and preserved fields after a simulated 503 save failure. At 320px the document had no horizontal overflow. The publish dialog's center matched the viewport center exactly.
- Production build, TypeScript and targeted lint passed. Test accounts/data were synthetic and local. No live backend mutations or deployments were performed.

## Pending gates — Step 8 stays unchecked

The collection does not establish image/audio/video lesson-block write fields or order-update fields. Those controls are not enabled; uploading in the separate media library does not yet attach a resource to a lesson. Successful full course/lesson PATCH requests, actual role/ownership/school enforcement and published learner media playback require live verification. Existing blocks are preserved rather than converted to a guessed media schema. Course types beyond the available examples also need the supported enum contract. Activity and quiz authoring belongs to Step 9.

Reproduce locally: `npm run simulate:authoring`, then (after `npm run build`) `npm run start:session-test`, then `npm run test:authoring-http`. The local test frontend uses port 3100 and synthetic credentials; it does not change normal deployment configuration.
