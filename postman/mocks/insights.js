/* eslint-disable @typescript-eslint/no-require-imports -- Postman mock handlers require CommonJS. */
// Local-only contract stand-in. Never deploy. Fixture values are synthetic.
const http=require('node:http');
const crypto=require('node:crypto');
const revoked=new Set();const profiles=new Map();const accessProfiles=new Map();const consumedTokens=new Set();
function issue(profile,nested=false){const token=crypto.randomUUID();accessProfiles.set(token,profile);const data={user:{...profile,password:undefined},accessToken:token,refreshToken:'refresh-'+token,expiresIn:900};return {success:true,data:nested?{school:{id:'fixture-school'},session:data}:data};}
let rotates=0; const sessions=new Map();
function send(res,status,data){res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(data));}
const user={id:'fixture-learner',role:'learner',firstName:'Ada',lastName:'Test',email:'learner@example.test'};
const schoolA={id:'school-a',name:'Heritage Learning School',region:'Lagos',email:'office@example.test',phone:'',address:'',joinCode:'SCHOOL26',settings:{leaderboardsEnabled:true,showLearnerNamesOnLeaderboards:false},isActive:true};
const schoolB={...schoolA,id:'school-b',name:'Other School',joinCode:'OTHER26'};
const people=new Map(['teacher','learner','school_admin','teacher2','learner2','parent','parent2','expiring','super_admin','content_creator'].map(name=>[name,{id:name,firstName:name==='teacher'?'Tunde':name==='learner'?'Ada':name==='school_admin'?'Bola':name,lastName:'Test',email:name+'@example.test',role:name==='expiring'?'learner':name.endsWith('2')?name.slice(0,-1):name,schoolId:name==='teacher2'?'school-b':'school-a',isActive:true}]));
const schoolCourses=[{id:'course-1',title:'Yoruba Greetings',languageCode:'yoruba'},{id:'course-2',title:'Igbo Introductions',languageCode:'igbo'}];
const classrooms=new Map([['class-1',{id:'class-1',name:'Primary 5 Yoruba',description:'Learn and practise together.',schoolId:'school-a',languageCode:'yoruba',teacherUserId:'teacher',studentUserIds:['learner'],assignedCourseIds:['course-1'],joinCode:'CLASS26',isArchived:false}]]);let nextClass=2;

const insightFixtures={"dashboard": {"school": {"id": "school-a", "name": "Heritage Learning School", "settings": {"leaderboardsEnabled": true, "showLearnerNamesOnLeaderboards": false}}, "hasActiveSchoolPlan": false, "totalStudents": 2, "teachers": 1, "classes": 1, "courses": {"schoolAuthored": 1, "assignedToClasses": 1}, "activeLearners7d": 1, "performance": {"averageQuizScorePercent": 100, "quizzesTaken": 1}, "certificatesIssued": 1, "courseCompletion": [{"courseId": "6ad20e19ef26c6008e65f48a", "enrolled": 1, "completed": 1, "title": "Yoruba Beginner", "completionRate": 100}]}, "learner": {"learner": {"id": "learner", "firstName": "Ada", "lastName": "Test", "preferredLanguageCode": "yoruba"}, "points": 230, "streakDays": 1, "longestStreakDays": 1, "learningMinutes": 5, "counters": {"lessonsCompleted": 2, "activitiesCompleted": 1, "quizzesPassed": 1, "gamesPlayed": 2, "gamecardScans": 1, "culturalTopicsCompleted": 1, "coursesCompleted": 1}, "badges": [{"code": "first_lesson", "earnedAt": "2026-10-16T12:50:00.510Z", "name": "First Lesson"}, {"code": "course_graduate", "earnedAt": "2026-10-16T12:50:10.641Z", "name": "Course Graduate"}], "courses": [{"courseId": "6ad20e19ef26c6008e65f48a", "title": "Yoruba Beginner", "languageCode": "yoruba", "level": "beginner", "status": "completed", "progressPercent": 100, "lastAccessedAt": "2026-10-16T12:50:08.567Z"}], "continueLearning": {"courseId": "6ad20e19ef26c6008e65f48a", "courseTitle": "Yoruba Beginner", "lessonId": "6ad20e1cef26c6008e65f48f", "lessonTitle": "Animal vocabulary", "lessonProgressPercent": 100, "courseProgressPercent": 100}, "quizScores": [{"quizId": "6ad20e1eef26c6008e65f491", "quizTitle": "Greetings quiz", "bestScorePercent": 100, "lastScorePercent": 100, "passed": true, "attempts": 1}], "certificates": [{"id": "6ad21d8315c86abc8ad65e22", "certificateId": "ATUPA-CHEMH8W5", "courseTitle": "Yoruba Beginner", "completedAt": "2026-10-16T12:50:11.749Z", "status": "valid"}], "recentActivities": [{"id": "6ad21d9915c86abc8ad65e2a", "userId": "6ad21d1715c86abc8ad65df6", "type": "game_played", "points": 15, "refId": "6ad21d5a15c86abc8ad65e0c", "meta": {"scorePercent": 80}, "at": "2026-10-16T12:50:33.020Z"}, {"id": "6ad21d9715c86abc8ad65e28", "userId": "6ad21d1715c86abc8ad65df6", "type": "game_played", "points": 15, "refId": "card:YOR-LION", "meta": {"scorePercent": 100}, "at": "2026-10-16T12:50:31.458Z"}, {"id": "6ad21d9615c86abc8ad65e26", "userId": "6ad21d1715c86abc8ad65df6", "type": "gamecard_scanned", "points": 5, "refId": "YOR-LION", "at": "2026-10-16T12:50:30.056Z"}], "courseProgress": [{"courseId": "6ad20e19ef26c6008e65f48a", "title": "Yoruba Beginner", "percent": 100, "lessons": {"completed": 2, "total": 2}, "quizzes": {"passed": 1, "total": 1}, "activitiesCompleted": 1, "complete": true}], "quizPerformance": {"attempts": 1, "passed": 1, "averageScorePercent": 100, "recentAttempts": [{"id": "6ad21d7e15c86abc8ad65e1b", "userId": "6ad21d1715c86abc8ad65df6", "quizId": "6ad20e1eef26c6008e65f491", "courseId": "6ad20e19ef26c6008e65f48a", "status": "submitted", "startedAt": "2026-10-16T12:50:06.775Z", "submittedAt": "2026-10-16T12:50:08.248Z", "scorePercent": 100, "passed": true, "answers": [{"correctAnswer": "must-not-leak"}]}]}, "gamePerformance": {"gamesPlayed": 2, "gamecardScans": 1, "totalGameEvents": 3}, "privateNotes": "must-not-leak"}, "class": {"class": {"id": "class-1", "name": "Primary 5 Yoruba", "studentCount": 1}, "courses": [{"courseId": "6ad20e19ef26c6008e65f48a", "title": "Yoruba Beginner", "averagePercent": 100, "completed": 1}], "quizPerformance": {"average": 100, "count": 1}, "assignments": {"completed": 1, "assigned": 1}, "learners": [{"learnerId": "learner", "name": "Ada Test", "points": 230, "streakDays": 1, "learningMinutes": 5, "lessonsCompleted": 2, "averageQuizScorePercent": 100, "courses": [{"courseId": "6ad20e19ef26c6008e65f48a", "percent": 100, "complete": true}]}]}, "school": {"school": {"id": "school-a", "name": "Heritage Learning School"}, "studentEngagement": {"students": 2, "active7d": 1, "active30d": 1, "engagementRate7d": 50}, "courseCompletion": [{"courseId": "6ad20e19ef26c6008e65f48a", "enrolled": 1, "completed": 1, "title": "Yoruba Beginner", "completionRate": 100}], "averagePerformance": {"average": 100, "count": 1}, "teacherActivity": [{"teacherId": "teacher", "name": "Tunde Test", "classes": 1, "students": 1, "assignmentsCreated": 2, "lastActiveAt": "2026-10-16T12:48:31.264Z"}]}};

const insightNotices=new Map();function inboxFor(id){if(!insightNotices.has(id))insightNotices.set(id,Array.from({length:23},(_,i)=>({id:'notice-'+id+'-'+i,userId:id,type:'assignment_feedback',title:'Learning update '+(i+1),body:'Your teacher has reviewed your work. Ó dára púpọ̀!',data:{assignmentId:'assignment-1',...(id.startsWith('parent')?{childId:'learner'}:{})},readAt:null,createdAt:'2026-10-20T10:00:00.000Z'})));return insightNotices.get(id);}
function insightResponse(req,res,url,body,bearer){const u=schoolProfile(bearer),p=url.pathname.replace('/api/v1/','').split('/'),[root,kind,id]=p;const ok=(data,status=200)=>send(res,status,{success:true,data}),bad=(status,message)=>send(res,status,{success:false,message});if(!bearer)return bad(401,'Sign in required');
 if(root==='notifications'){const items=inboxFor(u.id),target=items.find(n=>n.id===kind);if(kind==='unread-count')return ok({count:items.filter(n=>!n.readAt).length});if(kind==='read-all'&&req.method==='PATCH'){let updated=0;for(const n of items)if(!n.readAt){n.readAt=new Date().toISOString();updated++;}return ok({updated});}if(req.method==='GET'&&p.length===1){const page=Number(url.searchParams.get('page'))||1,limit=Number(url.searchParams.get('limit'))||20;return ok({items:items.slice((page-1)*limit,page*limit),page,limit,total:items.length});}if(!target)return bad(404,'Notification not found');if(req.method==='PATCH'&&id==='read'){target.readAt=new Date().toISOString();return ok(null);}if(req.method==='DELETE'){items.splice(items.indexOf(target),1);return ok(null);}return bad(501,'Notification operation not modeled');}
 if(root==='dashboards'&&kind==='school')return u.role==='school_admin'?ok(insightFixtures.dashboard):bad(403,'School administrator only');
 if(root==='reports'){
  if(kind==='learners'){if(u.role==='learner'&&u.id!==id||u.role==='teacher'&&u.id!=='teacher'||u.role==='parent'&&!(parentLinks.get(u.id)||new Set()).has(id)||id!=='learner')return bad(403,'You cannot view this learner');return ok(insightFixtures.learner);}
  if(kind==='classes'){if(id==='failure')return bad(503,'Class report temporarily unavailable');if(id!=='class-1'||!['teacher','school_admin','super_admin'].includes(u.role)||u.id==='teacher2')return bad(403,'You cannot view this class');return ok(insightFixtures.class);}
  if(kind==='schools'){if(id!=='school-a'||!['school_admin','super_admin'].includes(u.role))return bad(403,'You cannot view this school');return ok(insightFixtures.school);}
 }
 return bad(501,'Endpoint not modeled');
}
function schoolProfile(bearer){const name=(bearer??'').replace(/^access-/,'');return people.get(name)??people.get('learner');}
function schoolResponse(req,res,url,body,bearer){
 const u=schoolProfile(bearer),p=url.pathname.replace('/api/v1/','').split('/'),[root,id,action,sub]=p;
 const good=(data,status=200)=>send(res,status,{success:true,data});const bad=(status,message)=>send(res,status,{success:false,message});
 const list=items=>{const page=Math.max(1,Number(url.searchParams.get('page'))||1),limit=Number(url.searchParams.get('limit'))||20;return good({items:items.slice((page-1)*limit,page*limit),page,limit,total:items.length});};
 if(!bearer)return bad(401,'Sign in required');
 if(root==='courses')return list(schoolCourses);
 const admin=['school_admin','super_admin'].includes(u.role),staff=admin||u.role==='teacher';
 if(root==='schools'){
  if(id==='join'){if(!['teacher','learner'].includes(u.role))return bad(403,'Join not allowed');const s=[schoolA,schoolB].find(s=>s.joinCode===body.joinCode);if(!s)return bad(404,'This school code is invalid');u.schoolId=s.id;return good({...s,joinCode:''});}
  if(id==='mine')return good({...u.schoolId==='school-b'?schoolB:schoolA,joinCode:admin?schoolA.joinCode:''});
  if(!id)return u.role==='super_admin'?list([schoolA,schoolB]):bad(403,'Administrators only');
  if(id!==u.schoolId&&u.role!=='super_admin')return bad(403,'This school is outside your access');const s=id==='school-a'?schoolA:id==='school-b'?schoolB:null;if(!s)return bad(404,'School not found');
  if(action==='members'){
   if(!staff)return bad(403,'School roster is restricted');
   if(req.method==='GET')return list([...people.values()].filter(m=>m.schoolId===id&&(!url.searchParams.get('role')||m.role===url.searchParams.get('role'))));
   if(!admin)return bad(403,'Only a school administrator can change membership');
   if(req.method==='POST'){if([...people.values()].some(m=>m.email===body.email))return bad(409,'This email is already a member');if(!['teacher','learner'].includes(body.role))return bad(422,'Choose teacher or learner');const m={...body,id:'invited-'+people.size,schoolId:id,isActive:true};people.set(m.id,m);return good(m,201);}
   const m=people.get(sub);if(!m||m.schoolId!==id)return bad(404,'Member not found');m.schoolId='';return good(null);
  }
  if(req.method==='GET')return good({...s,joinCode:admin?s.joinCode:''});if(!admin)return bad(403,'Only a school administrator can change settings');
  if(action==='join-code'){s.joinCode='NEW-SCHOOL26';return good(s);}if(req.method==='PATCH'){s.settings={...s.settings,...body.settings};return good(s);}return bad(501,'School operation not modeled');
 }
 if(root!=='classes')return bad(501,'Endpoint not modeled');
 const visible=c=>u.role==='super_admin'||c.schoolId===u.schoolId&&(admin||u.role==='teacher'&&c.teacherUserId===u.id||u.role==='learner'&&c.studentUserIds.includes(u.id));
 const detail=c=>({...c,teacher:people.get(c.teacherUserId),students:c.studentUserIds.map(id=>people.get(id)).filter(Boolean),courses:schoolCourses.filter(x=>c.assignedCourseIds.includes(x.id))});
 if(id==='join'){if(u.role!=='learner')return bad(403,'Learners only');const c=[...classrooms.values()].find(c=>!c.isArchived&&c.joinCode===body.code);if(!c)return bad(404,'This class code is invalid');if(c.schoolId!==u.schoolId)return bad(403,'Join your school first');if(c.studentUserIds.includes(u.id))return bad(409,'You are already in this class');c.studentUserIds.push(u.id);return good(detail(c),201);}
 if(!id){if(req.method==='GET')return list([...classrooms.values()].filter(visible));if(!staff)return bad(403,'Staff only');if(!body.name?.trim()||!body.languageCode)return bad(422,'Enter a class name and language');const c={id:'class-'+nextClass++,name:body.name,schoolId:u.schoolId,languageCode:body.languageCode,teacherUserId:u.role==='teacher'?u.id:'',studentUserIds:[],assignedCourseIds:[],joinCode:'NEWCLASS'+nextClass,isArchived:false};classrooms.set(c.id,c);return good(detail(c),201);}
 const c=classrooms.get(id);if(!c)return bad(404,'Class not found');if(!visible(c))return bad(403,'This class is outside your access');
 if(req.method==='GET')return good(detail(c));
 if(action==='membership'){if(u.role!=='learner')return bad(403,'Learners only');c.studentUserIds=c.studentUserIds.filter(id=>id!==u.id);return good(null);}
 if(!staff||c.isArchived)return bad(403,'You cannot manage this class');
 if(action==='students'){if(req.method==='POST'){for(const id of body.studentIds??[]){const m=people.get(id);if(!m||m.role!=='learner'||m.schoolId!==c.schoolId)return bad(403,'Choose a learner from this school');}c.studentUserIds=[...new Set([...c.studentUserIds,...body.studentIds])];}else c.studentUserIds=c.studentUserIds.filter(id=>id!==sub);return good(detail(c));}
 if(action==='courses'){if(!schoolCourses.some(x=>x.id===sub))return bad(404,'Course not found');c.assignedCourseIds=req.method==='POST'?[...new Set([...c.assignedCourseIds,sub])]:c.assignedCourseIds.filter(id=>id!==sub);return good(detail(c));}
 if(action==='teacher'){if(!admin)return bad(403,'Administrator required');const m=people.get(body.teacherUserId);if(!m||m.role!=='teacher'||m.schoolId!==c.schoolId)return bad(403,'Choose a teacher from this school');c.teacherUserId=m.id;return good(detail(c));}
 if(action==='announcements')return body.title==='FAIL'?bad(503,'Delivery outcome unconfirmed'):good({delivered:c.studentUserIds.length},201);
 if(action==='join-code'){c.joinCode='NEW-CLASS26';return good(detail(c));}
 if(req.method==='PATCH'){c.description=body.description;return good(detail(c));}if(req.method==='DELETE'){c.isArchived=true;return good(null);}return bad(501,'Class operation not modeled');
}

const childFixture={"learner": {"id": "6ad21d1715c86abc8ad65df6", "firstName": "Ada", "lastName": "Obi", "preferredLanguageCode": "yoruba"}, "points": 230, "streakDays": 1, "longestStreakDays": 1, "learningMinutes": 5, "counters": {"lessonsCompleted": 2, "activitiesCompleted": 1, "quizzesPassed": 1, "gamesPlayed": 2, "gamecardScans": 1, "culturalTopicsCompleted": 1, "coursesCompleted": 1}, "badges": [{"code": "first_lesson", "earnedAt": "2026-10-16T12:50:00.510Z", "name": "First Lesson"}, {"code": "course_graduate", "earnedAt": "2026-10-16T12:50:10.641Z", "name": "Course Graduate"}], "courses": [{"courseId": "6ad20e19ef26c6008e65f48a", "title": "Yoruba Beginner", "languageCode": "yoruba", "level": "beginner", "status": "completed", "progressPercent": 100, "lastAccessedAt": "2026-10-16T12:50:08.567Z"}], "continueLearning": {"courseId": "6ad20e19ef26c6008e65f48a", "courseTitle": "Yoruba Beginner", "lessonId": "6ad20e1cef26c6008e65f48f", "lessonTitle": "Animal vocabulary", "lessonProgressPercent": 100, "courseProgressPercent": 100}, "quizScores": [{"quizId": "6ad20e1eef26c6008e65f491", "quizTitle": "Greetings quiz", "bestScorePercent": 100, "lastScorePercent": 100, "passed": true, "attempts": 1}], "certificates": [{"id": "6ad21d8315c86abc8ad65e22", "certificateId": "ATUPA-CHEMH8W5", "courseTitle": "Yoruba Beginner", "completedAt": "2026-10-16T12:50:11.749Z", "status": "valid"}], "recentActivities": [{"id": "6ad21d9915c86abc8ad65e2a", "userId": "6ad21d1715c86abc8ad65df6", "type": "game_played", "points": 15, "refId": "6ad21d5a15c86abc8ad65e0c", "meta": {"scorePercent": 80}, "at": "2026-10-16T12:50:33.020Z"}, {"id": "6ad21d9715c86abc8ad65e28", "userId": "6ad21d1715c86abc8ad65df6", "type": "game_played", "points": 15, "refId": "card:YOR-LION", "meta": {"scorePercent": 100}, "at": "2026-10-16T12:50:31.458Z"}, {"id": "6ad21d9615c86abc8ad65e26", "userId": "6ad21d1715c86abc8ad65df6", "type": "gamecard_scanned", "points": 5, "refId": "YOR-LION", "at": "2026-10-16T12:50:30.056Z"}], "teacherFeedback": []};
const parentLinks=new Map([['parent',new Set()],['parent2',new Set()]]),familyCodes=new Map([['EXPIRED',{learnerId:'learner2',expiresAt:0,used:false}],['LOST-LINK',{learnerId:'learner2',expiresAt:Date.now()+3600000,used:false}]]),readFamilyNotices=new Set();
function familyResponse(req,res,url,body,bearer){const u=schoolProfile(bearer),p=url.pathname.replace('/api/v1/','').split('/'),[root,id,childId]=p;const good=(data,status=200)=>send(res,status,{success:true,data}),bad=(status,message)=>send(res,status,{success:false,message});if(!bearer)return bad(401,'Sign in required');
 if(root==='parents'&&id==='link-codes'){if(u.role!=='learner')return bad(403,'Learner account required');const code=crypto.randomBytes(4).toString('hex').toUpperCase(),expiresAt=Date.now()+(u.id==='expiring'?2500:1800000);familyCodes.set(code,{learnerId:u.id,expiresAt,used:false});return good({code,expiresAt:new Date(expiresAt).toISOString()},201);}
 if(u.role!=='parent')return bad(403,'Parent account required');const links=parentLinks.get(u.id)??new Set();parentLinks.set(u.id,links);
 const dashboard=id=>{const person=people.get(id),d=JSON.parse(JSON.stringify(childFixture));d.learner={id:person.id,firstName:person.firstName,lastName:person.lastName,preferredLanguageCode:id==='learner2'?'igbo':'yoruba',dateOfBirth:'private',email:'private@example.test'};if(id==='learner2'){d.points=40;d.streakDays=2;d.longestStreakDays=3;d.learningMinutes=12;d.badges=[];d.certificates=[];d.counters.lessonsCompleted=1;d.courses=d.courses.map(c=>({...c,title:'Igbo Introductions',languageCode:'igbo',status:'in_progress',progressPercent:25}));}d.privateNotes='must-not-leak';return d;};
 if(root==='parents'){
  if(id!=='children')return bad(501,'Family operation not modeled');
  if(req.method==='GET')return good([...links].map(id=>({...people.get(id),dateOfBirth:'private',passwordHash:'must-not-leak'})));
  if(req.method==='POST'){const entry=familyCodes.get(body.code);if(!entry||entry.used||entry.expiresAt<=Date.now())return bad(400,'This code is invalid or has expired');if(links.has(entry.learnerId))return bad(409,'This child is already linked');entry.used=true;links.add(entry.learnerId);return body.code==='LOST-LINK'?bad(503,'The linking result could not be confirmed'):good({...people.get(entry.learnerId),dateOfBirth:'private'},201);}
  if(req.method==='DELETE'){if(!links.has(childId))return bad(404,'Child is not linked');links.delete(childId);return good(null);}
 }
 if(root==='dashboards'){if(id==='parent')return good({children:[...links].map(dashboard)});if(id==='children'){if(!links.has(childId))return bad(403,'This child is not linked to your account');return good(dashboard(childId));}}
 if(root==='notifications'){
  if(req.method==='PATCH'&&p[2]==='read'){readFamilyNotices.add(u.id+':'+id);return good(null);}
  const items=[...links].map(id=>({id:'family-note-'+id,userId:u.id,title:'A new learning milestone',type:'child_achievement',body:`${people.get(id).firstName} completed a lesson.`,data:{childId:id},createdAt:'2026-10-20T10:00:00.000Z',readAt:readFamilyNotices.has(u.id+':family-note-'+id)?'2026-10-20T10:05:00.000Z':null}));const page=Number(url.searchParams.get('page'))||1,limit=Number(url.searchParams.get('limit'))||10;return good({items:items.slice((page-1)*limit,page*limit),page,limit,total:items.length});
 }
 return bad(501,'Family endpoint not modeled');
}

http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');let raw='';for await(const chunk of req)raw+=chunk;
  let body={};try{body=JSON.parse(raw||'{}');}catch{/* Multipart is intentionally not parsed as JSON. */}
  const bearer=req.headers.authorization?.replace('Bearer ','');
  const current=accessProfiles.get(bearer);
  if(url.pathname.startsWith('/api/v1/notifications')||url.pathname.startsWith('/api/v1/reports/')||url.pathname==='/api/v1/dashboards/school')return insightResponse(req,res,url,body,bearer);
  if(url.pathname.startsWith('/api/v1/parents')||url.pathname==='/api/v1/dashboards/parent'||url.pathname.startsWith('/api/v1/dashboards/children/')||url.pathname.startsWith('/api/v1/notifications')&&schoolProfile(bearer).role==='parent')return familyResponse(req,res,url,body,bearer);
  if(url.pathname.startsWith('/api/v1/schools')||url.pathname.startsWith('/api/v1/classes')||url.pathname==='/api/v1/courses')return schoolResponse(req,res,url,body,bearer);
  if(revoked.has(bearer)&&url.pathname!=='/api/v1/auth/login')return send(res,401,{success:false,message:'Session revoked'});
  if(url.pathname==='/api/v1/languages')return send(res,200,{success:true,data:['yoruba','igbo','hausa'].map(code=>({code,name:code[0].toUpperCase()+code.slice(1),isActive:true}))});
  if(['/api/v1/auth/register','/api/v1/schools/register'].includes(url.pathname)){
    const school=url.pathname.includes('/schools/');const account=school?body.admin:body;
    if(profiles.has(account.email))return send(res,409,{success:false,message:'This email is already registered'});
    const profile={...account,id:crypto.randomUUID(),role:school?'school_admin':body.role,phone:body.phone??'',preferredLanguageCode:body.preferredLanguageCode??''};profiles.set(profile.email,profile);return send(res,201,issue(profile,school));
  }
  if(url.pathname==='/api/v1/auth/password/forgot')return send(res,200,{success:true,message:'If registered, a reset link has been sent',data:null});
  if(url.pathname==='/api/v1/auth/password/reset'){
    if(!['r'.repeat(64),'i'.repeat(64)].includes(body.token)||consumedTokens.has(body.token))return send(res,400,{success:false,message:'This link is invalid or has expired'});
    consumedTokens.add(body.token);const profile={...user,password:body.newPassword,preferredLanguageCode:'yoruba',phone:'',role:body.token[0]==='i'?'content_creator':'learner'};return send(res,200,issue(profile));
  }
  if(url.pathname==='/api/v1/users/me'&&current){
    if(req.method==='PATCH'){Object.assign(current,body);return send(res,200,{success:true,data:{...current,password:undefined}});}
    if(req.method==='DELETE'){if(body.password!==current.password)return send(res,400,{success:false,message:'Incorrect password'});profiles.delete(current.email);accessProfiles.delete(bearer);revoked.add(bearer);return send(res,200,{success:true,data:null});}
    return send(res,200,{success:true,data:{...current,password:undefined}});
  }
  if(url.pathname==='/api/v1/auth/password/change'){
    if(!current||body.currentPassword!==current.password)return send(res,400,{success:false,message:'Current password is incorrect'});
    current.password=body.newPassword;revoked.add(bearer);return send(res,200,{success:true,message:'Password changed',data:null});
  }
  if(url.pathname==='/api/v1/auth/login'){
    if(body.password!=='fixture-password')return send(res,401,{success:false,message:'Invalid credentials'});
    const name=body.email.split('@')[0];const role=name==='admin'?'super_admin':['parent','teacher','school_admin','content_creator','super_admin'].includes(name)?name:'learner';
    const token=`access-${name}`;revoked.delete(token);const refresh=`refresh-${name}`;sessions.set(refresh,{name,role});
    return send(res,200,{success:true,data:{user:schoolProfile(token),accessToken:token,refreshToken:refresh,expiresIn:['rotate','failrefresh','refreshslow'].includes(name)?1:900}});
  }
  if(url.pathname==='/api/v1/auth/refresh'){
    const old=sessions.get(body.refreshToken);if(!old)return send(res,401,{success:false,message:'Invalid refresh'});
    sessions.delete(body.refreshToken);rotates++;
    if(old.name==='failrefresh')return send(res,401,{success:false,message:'Refresh expired'});
    await new Promise(r=>setTimeout(r,old.name==='refreshslow'?1000:150));
    const token=`rotated-${rotates}-${old.name}`;sessions.set(token,old);return send(res,200,{success:true,data:{user:{...user,role:old.role},accessToken:token,refreshToken:token,expiresIn:900}});
  }
  if(url.pathname==='/api/v1/auth/logout'){revoked.add(bearer);return send(res,200,{success:true,data:null});}
  if(url.pathname==='/api/v1/users/me')return send(res,200,{success:true,data:schoolProfile(bearer)});
  if(url.pathname==='/api/v1/notifications')return send(res,200,{success:true,data:{items:[],page:1,limit:10,total:0}});
  if(url.pathname==='/api/v1/admin/users')return send(res,403,{success:false,message:'Insufficient permissions'});
  if(url.pathname==='/api/v1/progress/timeout'){await new Promise(r=>setTimeout(r,2200));return send(res,200,{success:true,data:{}});}
  if(url.pathname==='/api/v1/progress/bad-json'){res.writeHead(500,{'Content-Type':'text/html'});return res.end('<h1>upstream error</h1>');}
  if(url.pathname==='/api/v1/progress/validation')return send(res,422,{success:false,message:'Invalid details',errors:['A field is required']});
  if(url.pathname==='/api/v1/progress/stats')return send(res,200,{success:true,data:{rotates,authorizationWasReplaced:!req.headers.authorization?.includes('forged'),accessToken:'must-not-leak',items:[],page:1,limit:20,total:0}});
  if(url.pathname==='/api/v1/media/upload')return send(res,201,{success:true,data:{multipart:req.headers['content-type']?.includes('multipart/form-data'),fileReceived:raw.includes('fixture.txt'),fieldReceived:raw.includes('content')}});
  return send(res,501,{success:false,message:'Endpoint not modeled in this local auth contract stand-in'});
}).listen(process.env.PORT);
