# Step 9 — practice activity and quiz authoring

Open Content, choose a saved course/module/lesson, then **Activities & quizzes**. Existing role access remains teacher, content creator and super admin. The frontend uses authenticated authoring endpoints; answer-bearing data is never substituted into the public catalog projection.

Implemented:

- Multiple-choice activity creation, editing, feedback, canonical reload and named deletion. Activity listing comes from the authored course tree; no undocumented activity-detail endpoint is invented.
- Quiz create/read/edit/delete with multiple-choice, true/false and translation questions, accepted alternatives and explanations. Explicit GET of the author quiz precedes editing an existing quiz.
- Pass score, timer seconds, randomization, attempt limit and answer-review settings. Create association is a saved lesson in the same course; existing course/module associations are preserved.
- Validation for complete prompts, distinct choices, exact answer membership, true/false string values, pass score, integer timing and attempts. Diacritics and wording are retained; no normalization guesses a different correct answer.
- Unknown types/option fields/custom point weights are read-only. Such quizzes can save settings without sending or overwriting their questions. Activity ordering fields and response-only quiz IDs/points are not generated as editable input.
- Dirty-state protection integrated with Course studio, pending and duplicate-submit locks, server error messages, retained values on failure, toasts and named deletion confirmations.

## Brief review checklist

1. Create multiple-choice practice in a lesson; save, reload and edit feedback. Check accented text and the solution survive.
2. Create a quiz with all three available question types. Set pass score, timer, attempts, randomization and review; reload and inspect all values and accepted translation answers.
3. Try duplicate choices, an answer that no longer matches a choice, empty questions and invalid numeric settings. Check failed saves and Keep editing retain input.
4. Delete disposable activities/quizzes using exact-name confirmation. Check mobile layout and that staff answer fields do not appear in the public outline.

## Remaining gates

Step 9 stays unchecked pending isolated live account tests, full activity/question PATCH and question-ID semantics, custom scoring/association/order contracts, learner-side timer/attempt/review enforcement and the additional P1 format examples in `assessment-format-matrix.md`. These formats are not silently removed from scope. No live backend mutations or external messages are authorized by this review document.

Use the existing local authoring simulation and production-mode test frontend, then `npm run test:assessments-http`. Local simulation tests establish frontend transport and modeled behavior, not live API enforcement. The owner's published mock was not searched because this task has no authenticated workspace binding; the saved collection was reused locally and nothing was published.

## Verification performed

- Production build, TypeScript, targeted lint and 31 contract/regression tests passed.
- Ten HTTP scenarios passed (five assessment and five existing authoring scenarios) through the real frontend session/proxy and local Postman simulation. Inspected logs confirmed authoring calls and modeled 403/404/503 paths.
- Browser-created practice activity and quiz with all three supported question types saved and reloaded. Translation alternatives and randomization persisted. Keep editing retained the quiz; a simulated 503 preserved answers and alternatives. At 320px document width remained 320px, with no horizontal page overflow.
- Local review screenshot: `C:/Users/User/OneDrive/Documents/ChatGPT/Software security and health 2/atupa-step-09-assessments.png`. Temporary test services were stopped after review.
