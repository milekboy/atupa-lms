# Activity and quiz contract matrix — Step 9

Evidence: supplied ATUPA Postman collection. “Demonstrated” means a saved example exists, not live verification. No P1 format has been removed from MVP scope.

| Format | Practice activity authoring | Quiz authoring | Learner grading evidence | Frontend status |
| --- | --- | --- | --- | --- |
| Multiple choice | Create `payload.choices`, string `solution`, correct/incorrect feedback; feedback PATCH | `options.choices`, matching string `correctAnswer`, optional explanation | Saved activity result includes `correct`, `graded`, `solution`; quiz review includes result and answer | Create/edit/delete UI; live full PATCH still to verify |
| True/false | No saved practice write example | Saved question with string `correctAnswer: "true"` | No isolated true/false learner grading example | Quiz editor available; practice pending |
| Translation | No saved practice write example | String `correctAnswer`, `acceptedAnswers[]`, optional explanation | Saved quiz review shows accepted unaccented answer for accented solution | Quiz editor available; practice pending |
| Matching | Missing type-specific payload/solution | Missing options/answer example | Missing | Pending contract |
| Fill-in-the-blank | Missing | Missing | Missing | Pending contract |
| Drag-and-drop | Missing | Missing | Missing | Pending contract |
| Word arrangement | Missing ordered response/solution | Missing | Missing | Pending contract |
| Listening | Missing media reference and response shape | Missing | Missing | Pending contract |
| Picture identification | Missing media reference and response shape | Missing | Missing | Pending contract |
| Flashcards | Missing | Missing | Missing | Pending contract |
| Image/audio questions | Missing attachment, prompt/solution relationship | Missing attachment/options/answer shape | Missing | Pending contract |
| Vocabulary questions | Missing vocabulary-reference/solution shape | Missing vocabulary-reference/options shape | Missing | Pending contract |

## Write boundaries

New quizzes use the demonstrated `lessonId` association. Existing course/module associations are displayed and preserved, but creating or moving a quiz between them is unavailable until supported write shapes are confirmed. Activity order/ordered fields have only been observed in responses and are not sent as editable write fields.

The saved quiz request omits points, and its response defaults every question to 1 point. New questions use that default. Quizzes with custom points, unknown question types or extra question/option fields allow settings edits only; their questions are omitted from PATCH and retained by the backend. Known question writes omit response-only IDs and points. Question-array replacement, nested PATCH semantics and ID handling still need live confirmation; the collection's saved PATCH changes only pass score/attempt limit. Full activity editing similarly expands on the saved feedback-only PATCH using demonstrated create fields.

Pass score, timer seconds, randomization, maximum attempts and answer review are represented by saved fields. Local validation does not establish learner-side timer/attempt/review enforcement. That remains a live integration gate for Steps 9/10. The UI does not claim that timer `0` means unlimited; this meaning is unverified.

## Request for backend team — not sent

Please provide a successful create, update and read example for each missing P1 format, including activity `type/payload/solution/feedback`, quiz `type/options/correctAnswer/acceptedAnswers`, media/vocabulary references, learner response shape and a graded result. Please also confirm:

- Whether quiz PATCH replaces the full question array; how existing question IDs and points should be handled.
- Accepted fields for full activity edits, course/lesson/module quiz association, and ordering.
- Timer-zero and attempt-limit semantics, and timer/attempt/review enforcement responses.
- Whether authoring changes to a published parent become immediately visible to learners.

Pending examples are a documentation/integration gap, not proof of absent backend support. Any MVP scope reduction needs explicit product approval.
