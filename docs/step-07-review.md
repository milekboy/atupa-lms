# Step 7 — media frontend review

Implemented a protected media workspace for teacher, content creator and super admin; reusable MediaLibrary/MediaPicker and MediaPreview components; paginated list, detail, named deletion, file validation, signed direct upload progress, server multipart fallback, and confirmation-only retry. Backend authorization remains authoritative. Role exposure is provisional pending isolated-role checks.

Direct uploads send the signed ticket fields and file to the validated Cloudinary upload endpoint without application cookies or Bearer tokens. Confirmation uses the provider's real public_id. Nothing is persisted in browser storage. Server fallback files are capped at 4 MB to allow multipart overhead under [Vercel's 4.5 MB function payload limit](https://vercel.com/docs/functions/limitations), despite the backend's stated 25 MB allowance.

## Review checklist

1. Sign in as a teacher or content creator and open Media library. Check empty, loading, API-error/retry and paginated states; check mobile layout and keyboard controls.
2. Upload a small PNG, MP3 and MP4. Confirm each appears after refresh and its detail preview loads or plays. Try an empty, unsupported and oversized file; check clear validation and no duplicate submission.
3. Interrupt confirmation after a direct upload. Retry confirmation; verify the file is not sent to the provider again.
4. Open resource details, type its exact name and delete an isolated unused test resource. Confirm a denied/in-use deletion preserves the dialog and typed name.
5. Sign in as learner/parent and verify the staff workspace is denied. Test backend ownership with two isolated staff accounts.

## Outstanding verification gates

Step 7 remains unchecked. No live staff credentials were supplied. The collection has no successful confirmation or media-detail record: its detail example is an empty list, confirmation uses a placeholder publicId, and multipart upload returns `property file should not exist`. This frontend cannot repair that backend DTO error. Successful records currently require id (or _id), kind, url (or secureUrl), with optional name/originalName; this adapter is provisional, not a verified backend contract. Unsupported shapes fail visibly. Page/limit query support also needs live confirmation.

Local contract tests cover validation and signed-ticket security; they do not establish real upload, persistence, ownership, or playback. No stateful upload simulation or browser playback verification has been completed. Published-lesson persistence and playback depend on Step 8 authoring and Step 10 learner integration. Profile avatars have no documented mutation field and are not wired to an invented one.

## Automated verification

TypeScript, lint on all changed TypeScript files, the production build, 21 existing regression tests, and 3 new media validation/security tests passed. Browser playback and end-to-end upload simulation remain unverified.
