# Admin collection endpoint inventory

Read-only inventory, 16 November 2026. Saved examples are not deployed verification. 73 requests, including setup and repeated methods/paths.

| Folder | Request | Method | URL | Saved status |
|---|---|---|---|---|
| 00 Setup (run first) | Health | GET | {{baseUrl}}/health | 200 |
| 00 Setup (run first) | Register learner | POST | {{baseUrl}}/auth/register | 201 |
| 00 Setup (run first) | Register second learner | POST | {{baseUrl}}/auth/register | 201 |
| 00 Setup (run first) | Register teacher | POST | {{baseUrl}}/auth/register | 201 |
| 00 Setup (run first) | Login super admin | POST | {{baseUrl}}/auth/login | 200 |
| 00 Setup (run first) | Register school (public) | POST | {{baseUrl}}/schools/register | 201 |
| 00 Setup (run first) | Create course (teacher) | POST | {{baseUrl}}/authoring/courses | 201 |
| 00 Setup (run first) | Create module | POST | {{baseUrl}}/authoring/courses/{{myCourseId}}/modules | 201 |
| 00 Setup (run first) | Create lesson | POST | {{baseUrl}}/authoring/modules/{{myModuleId}}/lessons | 201 |
| 00 Setup (run first) | Publish lesson | POST | {{baseUrl}}/authoring/lessons/{{myLessonId}}/publish | 200 |
| 00 Setup (run first) | Publish course | POST | {{baseUrl}}/authoring/courses/{{myCourseId}}/publish | 200 |
| 00 Setup (run first) | Create vocabulary | POST | {{baseUrl}}/authoring/vocabulary | 201 |
| 01 Access & home | My admin permissions & menu (M-02) | GET | {{baseUrl}}/admin/me/permissions | 200 |
| 01 Access & home | Admin home overview (M-01) | GET | {{baseUrl}}/admin/overview | 200 |
| 02 Users | Invite support admin (M-05) | POST | {{baseUrl}}/admin/users | 201 |
| 02 Users | Find users by role and status (M-03) | GET | {{baseUrl}}/admin/users?role=teacher&isActive=true&verificationStatus=unverified&q=Tunde | 200 |
| 02 Users | User overview page (M-04) | GET | {{baseUrl}}/admin/users/{{learnerId}}/overview | 200 |
| 02 Users | Edit user details (super admin) | PATCH | {{baseUrl}}/admin/users/{{learner2Id}} | 200 |
| 02 Users | Send access link (M-07) | POST | {{baseUrl}}/admin/users/{{learner2Id}}/access-link | 200 |
| 03 Verification | Teacher uploads ID / certificate scan | POST | {{baseUrl}}/media/upload | 201 |
| 03 Verification | Teacher submits verification | POST | {{baseUrl}}/users/me/verification | 201 |
| 03 Verification | Verification queue: teachers | GET | {{baseUrl}}/admin/verifications?type=teacher&status=pending | 200 |
| 03 Verification | Approve teacher | POST | {{baseUrl}}/admin/users/{{teacherId}}/verification | 200 |
| 03 Verification | School admin uploads registration certificate | POST | {{baseUrl}}/media/upload | 201 |
| 03 Verification | School submits verification | POST | {{baseUrl}}/schools/{{schoolId}}/verification | 201 |
| 03 Verification | Verification queue: schools | GET | {{baseUrl}}/admin/verifications?type=school&status=pending | 200 |
| 03 Verification | Approve school | POST | {{baseUrl}}/schools/{{schoolId}}/verification/decision | 200 |
| 04 Content review & visibility | Teacher asks to make course Public (M-25) | PATCH | {{baseUrl}}/authoring/courses/{{myCourseId}}/visibility | 200 |
| 04 Content review & visibility | Review queue (M-19) | GET | {{baseUrl}}/admin/reviews | 200 |
| 04 Content review & visibility | Approve Public request | POST | {{baseUrl}}/admin/reviews/courses/{{myCourseId}}/visibility | 200 |
| 04 Content review & visibility | Browse shows author and Verified badge | GET | {{baseUrl}}/courses?q=Primary | 200 |
| 04 Content review & visibility | Teacher adds a lesson to the Public course | POST | {{baseUrl}}/authoring/modules/{{myModuleId}}/lessons | 201 |
| 04 Content review & visibility | Publish lesson → sent for review | POST | {{baseUrl}}/authoring/lessons/{{reviewLessonId}}/publish | 200 |
| 04 Content review & visibility | Approve lesson | POST | {{baseUrl}}/admin/reviews/lessons/{{reviewLessonId}} | 200 |
| 04 Content review & visibility | All courses (admin) | GET | {{baseUrl}}/admin/courses?visibility=public&ownerType=teacher | 200 |
| 04 Content review & visibility | Make course Private again (super admin) | PATCH | {{baseUrl}}/admin/courses/{{myCourseId}}/visibility | 200 |
| 04 Content review & visibility | Private course → 403 for learners outside the class | GET | {{baseUrl}}/learning/lessons/{{myLessonId}} | 403 |
| 04 Content review & visibility | Library review (vocabulary) | POST | {{baseUrl}}/admin/reviews/library/vocabulary/{{vocabId}} | 409 |
| 05 Classes, bulk upload & reports | Admin creates class for a teacher (M-12) | POST | {{baseUrl}}/classes | 201 |
| 05 Classes, bulk upload & reports | Bulk upload template (CSV) | GET | {{baseUrl}}/admin/learners/bulk/template | None saved |
| 05 Classes, bulk upload & reports | Bulk add learners: check a file with errors (M-11) | POST | {{baseUrl}}/admin/learners/bulk | 201 |
| 05 Classes, bulk upload & reports | Bulk add learners: check a clean file | POST | {{baseUrl}}/admin/learners/bulk | 201 |
| 05 Classes, bulk upload & reports | Bulk add learners: save and add to class | POST | {{baseUrl}}/admin/learners/bulk | 201 |
| 05 Classes, bulk upload & reports | Learners report for a class (M-22) | GET | {{baseUrl}}/reports/classes/{{adminClassId}} | 200 |
| 06 Exports | Export class report (CSV) | GET | {{baseUrl}}/admin/exports/classes/{{adminClassId}}/report?format=csv | None saved |
| 06 Exports | Export class report (PDF) | GET | {{baseUrl}}/admin/exports/classes/{{adminClassId}}/report?format=pdf | None saved |
| 06 Exports | Export school report (PDF) | GET | {{baseUrl}}/admin/exports/schools/{{schoolId}}/report?format=pdf | None saved |
| 06 Exports | Export users (CSV) | GET | {{baseUrl}}/admin/exports/users.csv?role=learner | None saved |
| 06 Exports | Export payments (CSV) | GET | {{baseUrl}}/admin/exports/payments.csv?status=success | None saved |
| 06 Exports | Export subscriptions (CSV) | GET | {{baseUrl}}/admin/exports/subscriptions.csv | None saved |
| 06 Exports | Export safety reports (CSV) | GET | {{baseUrl}}/admin/exports/safety-reports.csv | None saved |
| 06 Exports | Export activity log (CSV) | GET | {{baseUrl}}/admin/exports/activity-log.csv | None saved |
| 07 Plans, subscriptions & payments | All plans incl. inactive (S-01) | GET | {{baseUrl}}/admin/plans | 200 |
| 07 Plans, subscriptions & payments | Create plan tier | POST | {{baseUrl}}/admin/plans | 201 |
| 07 Plans, subscriptions & payments | Update plan price | PATCH | {{baseUrl}}/admin/plans/{{planCode}} | 200 |
| 07 Plans, subscriptions & payments | Grant plan by hand (M-21) | POST | {{baseUrl}}/admin/subscriptions/grant | 200 |
| 07 Plans, subscriptions & payments | Grant too long → 400 | POST | {{baseUrl}}/admin/subscriptions/grant | 400 |
| 07 Plans, subscriptions & payments | Subscriptions (who is on which plan) | GET | {{baseUrl}}/admin/subscriptions?activeOnly=true | 200 |
| 07 Plans, subscriptions & payments | Cancel subscription | POST | {{baseUrl}}/admin/subscriptions/cancel | 200 |
| 07 Plans, subscriptions & payments | Payments (M-20) | GET | {{baseUrl}}/admin/payments?status=pending&from=2026-01-01 | 200 |
| 08 Safety reports & alerts | Learner uploads a screenshot | POST | {{baseUrl}}/media/upload | 201 |
| 08 Safety reports & alerts | Learner reports a teacher (M-26) | POST | {{baseUrl}}/safety-reports | 201 |
| 08 Safety reports & alerts | My reports | GET | {{baseUrl}}/safety-reports/mine | 200 |
| 08 Safety reports & alerts | Reports queue (M-27) | GET | {{baseUrl}}/admin/safety-reports?unresolved=true | 200 |
| 08 Safety reports & alerts | Report detail | GET | {{baseUrl}}/admin/safety-reports/{{safetyReportId}} | 200 |
| 08 Safety reports & alerts | Assign report | POST | {{baseUrl}}/admin/safety-reports/{{safetyReportId}}/assign | 200 |
| 08 Safety reports & alerts | Comment on report | POST | {{baseUrl}}/admin/safety-reports/{{safetyReportId}}/comments | 201 |
| 08 Safety reports & alerts | Resolve with a warning | POST | {{baseUrl}}/admin/safety-reports/{{safetyReportId}}/resolve | 200 |
| 08 Safety reports & alerts | Teacher writes a phone number in a lesson | PATCH | {{baseUrl}}/authoring/lessons/{{myLessonId}} | 200 |
| 08 Safety reports & alerts | Alerts (M-29) | GET | {{baseUrl}}/admin/alerts?status=open | 200 |
| 08 Safety reports & alerts | Acknowledge alert | PATCH | {{baseUrl}}/admin/alerts/{{alertId}} | 200 |
| 09 Activity log | Activity log (M-24) | GET | {{baseUrl}}/admin/activity-log?limit=10 | 200 |
| 09 Activity log | Activity log: verification decisions | GET | {{baseUrl}}/admin/activity-log?action=verification | 200 |
