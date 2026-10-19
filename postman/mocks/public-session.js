/* eslint-disable @typescript-eslint/no-require-imports -- Postman mock handlers require CommonJS. */
// Local-only contract stand-in. Never deploy. Fixture values are synthetic.
const http=require('node:http');
const crypto=require('node:crypto');
const revoked=new Set();const profiles=new Map();const accessProfiles=new Map();const consumedTokens=new Set();
function issue(profile,nested=false){const token=crypto.randomUUID();accessProfiles.set(token,profile);const data={user:{...profile,password:undefined},accessToken:token,refreshToken:'refresh-'+token,expiresIn:900};return {success:true,data:nested?{school:{id:'fixture-school'},session:data}:data};}
let rotates=0; const sessions=new Map();
function send(res,status,data){res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(data));}
const courses=[{"id": "6ad20e19ef26c6008e65f48a", "languageCode": "yoruba", "level": "beginner", "title": "Yoruba Beginner", "description": "Learn Yoruba at beginner level through lessons, games and quizzes.", "courseType": "language", "ageGroup": "all", "durationMinutes": 120, "isPremium": false, "tags": [], "status": "published", "createdByUserId": "system-seed", "schoolId": null, "publishedAt": "2026-10-16T11:44:30.764Z", "createdAt": "2026-10-16T11:44:25.360Z", "updatedAt": "2026-10-16T11:44:30.764Z"}, {"id": "6ad20e1fef26c6008e65f492", "languageCode": "yoruba", "level": "intermediate", "title": "Yoruba Intermediate", "description": "Learn Yoruba at intermediate level through lessons, games and quizzes.", "courseType": "language", "ageGroup": "all", "durationMinutes": 120, "isPremium": false, "tags": [], "status": "published", "createdByUserId": "system-seed", "schoolId": null, "publishedAt": "2026-10-16T11:44:36.616Z", "createdAt": "2026-10-16T11:44:31.240Z", "updatedAt": "2026-10-16T11:44:36.616Z"}, {"id": "6ad20e25ef26c6008e65f49a", "languageCode": "yoruba", "level": "advanced", "title": "Yoruba Advanced", "description": "Learn Yoruba at advanced level through lessons, games and quizzes.", "courseType": "language", "ageGroup": "all", "durationMinutes": 120, "isPremium": true, "tags": [], "status": "published", "createdByUserId": "system-seed", "schoolId": null, "publishedAt": "2026-10-16T11:44:42.468Z", "createdAt": "2026-10-16T11:44:37.090Z", "updatedAt": "2026-10-16T11:44:42.468Z"}, {"id": "6ad20e2cef26c6008e65f4a8", "languageCode": "igbo", "level": "beginner", "title": "Igbo Beginner", "description": "Learn Igbo at beginner level through lessons, games and quizzes.", "courseType": "language", "ageGroup": "all", "durationMinutes": 120, "isPremium": false, "tags": [], "status": "published", "createdByUserId": "system-seed", "schoolId": null, "publishedAt": "2026-10-16T11:44:49.443Z", "createdAt": "2026-10-16T11:44:44.060Z", "updatedAt": "2026-10-16T11:44:49.443Z"}, {"id": "6ad20e31ef26c6008e65f4b0", "languageCode": "igbo", "level": "intermediate", "title": "Igbo Intermediate", "description": "Learn Igbo at intermediate level through lessons, games and quizzes.", "courseType": "language", "ageGroup": "all", "durationMinutes": 120, "isPremium": false, "tags": [], "status": "published", "createdByUserId": "system-seed", "schoolId": null, "publishedAt": "2026-10-16T11:44:55.321Z", "createdAt": "2026-10-16T11:44:49.916Z", "updatedAt": "2026-10-16T11:44:55.321Z"}, {"id": "6ad20e37ef26c6008e65f4b8", "languageCode": "igbo", "level": "advanced", "title": "Igbo Advanced", "description": "Learn Igbo at advanced level through lessons, games and quizzes.", "courseType": "language", "ageGroup": "all", "durationMinutes": 120, "isPremium": true, "tags": [], "status": "published", "createdByUserId": "system-seed", "schoolId": null, "publishedAt": "2026-10-16T11:45:01.186Z", "createdAt": "2026-10-16T11:44:55.799Z", "updatedAt": "2026-10-16T11:45:01.186Z"}, {"id": "6ad20e3eef26c6008e65f4c6", "languageCode": "hausa", "level": "beginner", "title": "Hausa Beginner", "description": "Learn Hausa at beginner level through lessons, games and quizzes.", "courseType": "language", "ageGroup": "all", "durationMinutes": 120, "isPremium": false, "tags": [], "status": "published", "createdByUserId": "system-seed", "schoolId": null, "publishedAt": "2026-10-16T11:45:08.387Z", "createdAt": "2026-10-16T11:45:02.789Z", "updatedAt": "2026-10-16T11:45:08.387Z"}, {"id": "6ad20e44ef26c6008e65f4ce", "languageCode": "hausa", "level": "intermediate", "title": "Hausa Intermediate", "description": "Learn Hausa at intermediate level through lessons, games and quizzes.", "courseType": "language", "ageGroup": "all", "durationMinutes": 120, "isPremium": false, "tags": [], "status": "published", "createdByUserId": "system-seed", "schoolId": null, "publishedAt": "2026-10-16T11:45:14.235Z", "createdAt": "2026-10-16T11:45:08.864Z", "updatedAt": "2026-10-16T11:45:14.235Z"}, {"id": "6ad20e4aef26c6008e65f4d6", "languageCode": "hausa", "level": "advanced", "title": "Hausa Advanced", "description": "Learn Hausa at advanced level through lessons, games and quizzes.", "courseType": "language", "ageGroup": "all", "durationMinutes": 120, "isPremium": true, "tags": [], "status": "published", "createdByUserId": "system-seed", "schoolId": null, "publishedAt": "2026-10-16T11:45:20.103Z", "createdAt": "2026-10-16T11:45:14.711Z", "updatedAt": "2026-10-16T11:45:20.103Z"}];
const outline={"course": {"id": "6ad20e4aef26c6008e65f4d6", "languageCode": "hausa", "level": "advanced", "title": "Hausa Advanced", "description": "Learn Hausa at advanced level through lessons, games and quizzes.", "courseType": "language", "ageGroup": "all", "durationMinutes": 120, "isPremium": true, "tags": [], "status": "published", "createdByUserId": "system-seed", "schoolId": null, "publishedAt": "2026-10-16T11:45:20.103Z", "createdAt": "2026-10-16T11:45:14.711Z", "updatedAt": "2026-10-16T11:45:20.103Z"}, "modules": [{"id": "6ad20e4bef26c6008e65f4d7", "courseId": "6ad20e4aef26c6008e65f4d6", "title": "Module 1: Greetings", "order": 1, "createdAt": "2026-10-16T11:45:15.189Z", "updatedAt": "2026-10-16T11:45:15.189Z", "lessons": [{"id": "6ad20e4bef26c6008e65f4d8", "courseId": "6ad20e4aef26c6008e65f4d6", "moduleId": "6ad20e4bef26c6008e65f4d7", "title": "Basic Greetings", "estimatedMinutes": 10, "order": 1}], "quizzes": [{"id": "6ad20e4fef26c6008e65f4dd", "courseId": "6ad20e4aef26c6008e65f4d6", "moduleId": "6ad20e4bef26c6008e65f4d7", "title": "Greetings quiz", "questionCount": 2, "passScorePercent": 70}]}, {"id": "6ad20e4def26c6008e65f4da", "courseId": "6ad20e4aef26c6008e65f4d6", "title": "Module 2: Animals", "order": 2, "createdAt": "2026-10-16T11:45:17.409Z", "updatedAt": "2026-10-16T11:45:17.409Z", "lessons": [{"id": "6ad20e4eef26c6008e65f4db", "courseId": "6ad20e4aef26c6008e65f4d6", "moduleId": "6ad20e4def26c6008e65f4da", "title": "Animal vocabulary", "estimatedMinutes": 10, "order": 1}], "quizzes": []}], "courseQuizzes": [], "totals": {"lessons": 2, "quizzes": 1, "activities": 2}};

const user={id:'fixture-learner',role:'learner',firstName:'Ada',lastName:'Test',email:'learner@example.test'};
http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');let raw='';for await(const chunk of req)raw+=chunk;
  let body={};try{body=JSON.parse(raw||'{}');}catch{/* Multipart is intentionally not parsed as JSON. */}
  if(url.pathname.startsWith('/api/v1/courses')){const language=url.searchParams.get('languageCode');
 if(url.pathname==='/api/v1/courses'){
  if(language==='error')return send(res,503,{success:false,message:'Catalog temporarily unavailable'});
  if(language==='denied')return send(res,403,{success:false,message:'Restricted catalog'});
  if(language==='slow')return setTimeout(()=>send(res,200,{success:true,data:{items:[],page:1,limit:6,total:0}}),2200);
  const page=Number(url.searchParams.get('page')||1),limit=Number(url.searchParams.get('limit')||6),level=url.searchParams.get('level');const selected=courses.filter(c=>(!language||c.languageCode===language)&&(!level||c.level===level));
  return send(res,200,{success:true,data:{items:selected.slice((page-1)*limit,page*limit),total:selected.length,page,limit}});
 }
 if(url.pathname==='/api/v1/courses/'+outline.course.id)return send(res,200,{success:true,data:outline});
 if(/^\/api\/v1\/courses\/[a-f0-9]{24}$/.test(url.pathname))return send(res,404,{success:false,message:'Course not found'});

  }
  const bearer=req.headers.authorization?.replace('Bearer ','');
  const current=accessProfiles.get(bearer);
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
    return send(res,200,{success:true,data:{user:{...user,role},accessToken:token,refreshToken:refresh,expiresIn:['rotate','failrefresh','refreshslow'].includes(name)?1:900}});
  }
  if(url.pathname==='/api/v1/auth/refresh'){
    const old=sessions.get(body.refreshToken);if(!old)return send(res,401,{success:false,message:'Invalid refresh'});
    sessions.delete(body.refreshToken);rotates++;
    if(old.name==='failrefresh')return send(res,401,{success:false,message:'Refresh expired'});
    await new Promise(r=>setTimeout(r,old.name==='refreshslow'?1000:150));
    const token=`rotated-${rotates}-${old.name}`;sessions.set(token,old);return send(res,200,{success:true,data:{user:{...user,role:old.role},accessToken:token,refreshToken:token,expiresIn:900}});
  }
  if(url.pathname==='/api/v1/auth/logout'){revoked.add(bearer);return send(res,200,{success:true,data:null});}
  if(url.pathname==='/api/v1/users/me'&&bearer?.endsWith('sessionunavailable'))return send(res,503,{success:false,message:'Profile unavailable'});
  if(url.pathname==='/api/v1/users/me')return send(res,200,{success:true,data:{...user,role:[...sessions.values()].find(s=>bearer?.endsWith(s.name))?.role??'learner',passwordHash:'must-not-leak'}});
  if(url.pathname==='/api/v1/notifications')return send(res,200,{success:true,data:{items:[],page:1,limit:10,total:0}});
  if(url.pathname==='/api/v1/admin/users')return send(res,403,{success:false,message:'Insufficient permissions'});
  if(url.pathname==='/api/v1/progress/timeout'){await new Promise(r=>setTimeout(r,2200));return send(res,200,{success:true,data:{}});}
  if(url.pathname==='/api/v1/progress/bad-json'){res.writeHead(500,{'Content-Type':'text/html'});return res.end('<h1>upstream error</h1>');}
  if(url.pathname==='/api/v1/progress/validation')return send(res,422,{success:false,message:'Invalid details',errors:['A field is required']});
  if(url.pathname==='/api/v1/progress/stats')return send(res,200,{success:true,data:{rotates,authorizationWasReplaced:!req.headers.authorization?.includes('forged'),accessToken:'must-not-leak',items:[],page:1,limit:20,total:0}});
  if(url.pathname==='/api/v1/media/upload')return send(res,201,{success:true,data:{multipart:req.headers['content-type']?.includes('multipart/form-data'),fileReceived:raw.includes('fixture.txt'),fieldReceived:raw.includes('content')}});
  return send(res,501,{success:false,message:'Endpoint not modeled in this local auth contract stand-in'});
}).listen(process.env.PORT);
