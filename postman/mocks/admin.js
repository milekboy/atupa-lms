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
const people=new Map(['teacher','learner','school_admin','teacher2','learner2','parent','super_admin','content_creator','support_admin'].map(name=>[name,{id:name,firstName:name==='teacher'?'Tunde':name==='learner'?'Ada':name==='school_admin'?'Bola':name,lastName:'Test',email:name+'@example.test',role:name.endsWith('2')?name.slice(0,-1):name,schoolId:name==='teacher2'?'school-b':'school-a',isActive:true}]));
const schoolCourses=[{id:'course-1',title:'Yoruba Greetings',languageCode:'yoruba'},{id:'course-2',title:'Igbo Introductions',languageCode:'igbo'}];
const classrooms=new Map([['class-1',{id:'class-1',name:'Primary 5 Yoruba',description:'Learn and practise together.',schoolId:'school-a',languageCode:'yoruba',teacherUserId:'teacher',studentUserIds:['learner'],assignedCourseIds:['course-1'],joinCode:'CLASS26',isArchived:false}]]);let nextClass=2;

const adminRecords={users:[...people.values()],schools:[schoolA,schoolB],languages:[{id:'language-1',code:'yoruba',name:'Yoruba',nativeName:'Èdè Yorùbá',isActive:true,order:1}],vocabulary:[{id:'word-1',languageCode:'yoruba',term:'Erin',meaning:'Elephant',conceptKey:'elephant',category:'animals',level:'beginner',status:'published'}],'cultural-topics':[{id:'topic-1',title:'Naming ceremonies',summary:'Names and belonging',category:'names',languageCode:'yoruba',status:'published',blocks:[{type:'text',content:'A family tradition.'}]}],games:[{id:'game-1',title:'Animal match',gameType:'web',languageCodes:['yoruba'],conceptKeys:['lion'],status:'published'}],gamecards:[{id:'card-1',code:'YOR-LION',title:'Lion',conceptKey:'lion',languageCode:'yoruba',isActive:true,challenge:{prompt:'Choose lion',choices:['Lion','Dog'],answer:'Lion'}}]};let adminSerial=10;
function adminResponse(req,res,url,body,bearer){
 const parts=url.pathname.replace('/api/v1/','').split('/'),root=parts[0],kind=root==='admin'?parts[1]:root==='authoring'?parts[1]:root,id=parts[root==='admin'||root==='authoring'?2:1],u=schoolProfile(bearer);
 const ok=(data,status=200)=>send(res,status,{success:true,data});const bad=(status,message)=>send(res,status,{success:false,message});
 if(!bearer)return bad(401,'Sign in required');
 if(root==='dashboards')return u.role==='super_admin'?ok({users:{total:33,byRole:{learner:15,parent:5,teacher:5,school_admin:5,content_creator:2,super_admin:1},active7d:26,active30d:26},courses:{total:14,published:10,byLanguage:{yoruba:4}},languages:adminRecords.languages,schools:6,certificatesIssued:3,parentsLinked:2,completionRate:80,engagement30d:{lessonsCompleted:9,quizzesPassed:4,gamesPlayed:7,gamecardScans:5},popularCourses:[{courseId:'course-1',title:'Yoruba Greetings',enrolled:4,completed:4,completionRate:100}]}):bad(403,'Administrator only');
 if((root==='admin'||root==='schools'||root==='languages')&&u.role!=='super_admin'&&!(root==='admin'&&kind==='users'&&u.role==='support_admin'&&!id))return bad(403,'Administrator only');
 if(root==='authoring'&&!['super_admin','content_creator'].includes(u.role))return bad(403,'Publisher only');
 const items=adminRecords[kind];if(!items)return bad(501,'Endpoint not modeled');
 if(req.method==='GET'&&!id){if(kind==='languages')return ok(items);let filtered=items;if(kind==='users'){const q=(url.searchParams.get('q')||'').toLowerCase(),role=url.searchParams.get('role'),active=url.searchParams.get('isActive'),verification=url.searchParams.get('verificationStatus');filtered=items.filter(v=>(!role||v.role===role)&&(!active||String(v.isActive)===active)&&(!verification||v.verificationStatus===verification)&&(!q||[v.firstName,v.lastName,v.email].join(' ').toLowerCase().includes(q)));}const page=Number(url.searchParams.get('page'))||1,limit=Number(url.searchParams.get('limit'))||20;return ok({items:filtered.slice((page-1)*limit,page*limit),page,limit,total:filtered.length});}
 if(req.method==='POST'&&!id){if(items.some(v=>v.code&&v.code===body.code||v.email&&v.email===body.email))return bad(409,'This record already exists');const item={...body,id:'new-'+adminSerial++,...(['users','schools','languages','gamecards'].includes(kind)?{isActive:true}:{}),...(kind==='schools'?{settings:{leaderboardsEnabled:true,showLearnerNamesOnLeaderboards:false}}:{}),...(kind==='vocabulary'?{status:'published'}:{})};items.push(item);if(body.firstName==='Lost')return bad(503,'Response unavailable');return ok(item,201);}
 const i=items.findIndex(v=>(['gamecards','languages'].includes(kind)?v.code:v.id)===id);if(i<0)return bad(404,'Record not found');
 if(req.method==='GET')return ok(items[i]);
 if(req.method==='PATCH'){Object.assign(items[i],body);return ok(items[i]);}
 if(req.method==='DELETE'){if(kind==='languages')return bad(501,'Language deletion is not supported');if(kind==='schools'&&id==='school-a')return bad(409,'This school still has members. Remove them first or deactivate the school (isActive=false).');items.splice(i,1);return ok(null);}
 return bad(501,'Endpoint not modeled');
}
function schoolProfile(bearer){const name=(bearer??'').replace(/^access-/,'').replace(/^rotated-\d+-/,'');return people.get(name)??people.get('learner');}
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
 if(!id){if(req.method==='GET')return list([...classrooms.values()].filter(visible));if(!staff)return bad(403,'Staff only');if(!body.name?.trim()||!body.languageCode)return bad(422,'Enter a class name and language');const selected=body.teacherUserId?people.get(body.teacherUserId):null;if(body.teacherUserId&&(!selected||selected.role!=='teacher'||selected.isActive===false||u.role!=='super_admin'&&selected.schoolId!==u.schoolId))return bad(403,'Choose an authorized teacher');const c={id:'class-'+nextClass++,name:body.name,schoolId:selected?.schoolId||u.schoolId,languageCode:body.languageCode,teacherUserId:selected?.id||(u.role==='teacher'?u.id:''),studentUserIds:[],assignedCourseIds:[],joinCode:'NEWCLASS'+nextClass,isArchived:false};classrooms.set(c.id,c);return good(detail(c),201);}
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

http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');let raw='';for await(const chunk of req)raw+=chunk;
  let body={};try{body=JSON.parse(raw||'{}');}catch{/* Multipart is intentionally not parsed as JSON. */}
  const bearer=req.headers.authorization?.replace('Bearer ','');
  const current=accessProfiles.get(bearer);
  const actor=schoolProfile(bearer);
  const adminOk=(data,status=200)=>send(res,status,{success:true,data});
  const adminBad=(status,message)=>send(res,status,{success:false,message});
  if(url.pathname==='/api/v1/admin/learners/bulk/template'){
   if(actor.role!=='super_admin')return adminBad(403,'Super admin only');res.writeHead(200,{'Content-Type':'text/csv','Content-Disposition':'attachment; filename="learners.csv"'});return res.end('firstName,lastName,email,dateOfBirth,preferredLanguageCode\n');
  }
  if(url.pathname==='/api/v1/admin/learners/bulk'){
   if(actor.role!=='super_admin')return adminBad(403,'Super admin only');
   const form=await new Request('http://localhost',{method:'POST',headers:{'Content-Type':req.headers['content-type']},body:raw}).formData();
   const dryRun=form.get('dryRun')!=='false',target=form.get('classId');
   const c=target?classrooms.get(target):null;if(target&&(!c||c.isArchived))return adminBad(403,'Class unavailable');
   const lines=String(form.get('csv')||'').trim().split(/\r?\n/);if(lines[0]!=='firstName,lastName,email,dateOfBirth,preferredLanguageCode')return adminBad(422,'CSV columns do not match');
   const seen=new Set();const rows=lines.slice(1).map((line,index)=>{const [firstName='',lastName='',email='',dateOfBirth='',preferredLanguageCode='']=line.split(',');const errors=[];if(!firstName)errors.push('First name is required');if(!/^[^@ ]+@[^@ ]+\.[^@ ]+$/.test(email))errors.push('Email is not valid');if(seen.has(email)||adminRecords.users.some(p=>p.email===email))errors.push('Email already exists');seen.add(email);if(dateOfBirth>'2026-11-17')errors.push('Date of birth cannot be in the future');if(!['yoruba','igbo','hausa'].includes(preferredLanguageCode))errors.push('Unknown language');return {row:index+2,email,firstName,lastName,status:errors.length?'error':'ok',errors};});
   const failed=rows.filter(r=>r.errors.length).length;let created=0;
   if(!dryRun&&!failed)for(const row of rows){row.status='created';row.userId='bulk-'+adminSerial++;const person={id:row.userId,email:row.email,firstName:row.firstName,lastName:row.lastName,role:'learner',isActive:true,schoolId:c?.schoolId||''};adminRecords.users.push(person);people.set(person.id,person);if(c)c.studentUserIds.push(person.id);created++;}
   if(!dryRun&&rows.some(r=>r.firstName==='Uncertain'))return adminBad(503,'Outcome unavailable');
   const data={dryRun,total:rows.length,valid:rows.length-failed,failed,created,addedToClass:c?created:0,saved:!dryRun&&!failed,rows,accessToken:'must-not-leak'};
   if(rows.some(r=>r.firstName==='Malformed'))data.total=999;
   return adminOk(data,201);
  }
  if(url.pathname==='/api/v1/schools/mine'&&req.method==='GET')return adminOk({id:actor.schoolId||'school-a',name:'Heritage Learning School'});
  if(url.pathname==='/api/v1/media/upload'&&raw.includes('verification'))return ['teacher','school_admin'].includes(actor.role)?adminOk({id:'verification-image',kind:'image',purpose:'verification',url:'https://private.invalid/do-not-render',passwordHash:'must-not-leak'},201):adminBad(403,'Verification upload denied');
  if(url.pathname==='/api/v1/media/upload'&&raw.includes('verification'))return adminOk({id:'verification-image',kind:'image',purpose:'verification'},201);
  if(url.pathname==='/api/v1/users/me/verification'&&req.method==='POST'){
   if(actor.role!=='teacher')return adminBad(403,'Teacher only');actor.verificationStatus='pending';actor.verificationDocuments=body.documents;actor.verificationNote=body.note;return adminOk(actor,201);
  }
  if(url.pathname==='/api/v1/admin/verifications'&&req.method==='GET'){
   if(actor.role!=='super_admin')return adminBad(403,'Super admin only');
   const type=url.searchParams.get('type'),status=url.searchParams.get('status');
   const all=type==='school'?[{type:'school',id:schoolA.id,name:schoolA.name,email:schoolA.email,verification:schoolA.verification||{status:'pending',documents:[]}}]:[...people.values()].filter(p=>p.role==='teacher').map(p=>({type:'teacher',id:p.id,name:p.firstName+' '+p.lastName,email:p.email,verification:{status:p.verificationStatus||'pending',documents:p.verificationDocuments||[{mediaId:'verification-image',label:'TRCN certificate',url:'https://private.invalid/secret'}],note:p.verificationNote||''}}));
   const items=all.filter(p=>p.verification.status===status);return adminOk({items,page:1,limit:20,total:items.length});
  }
  if(url.pathname==='/api/v1/schools/mine'&&actor.role==='school_admin')return adminOk(schoolA);
  const userAction=url.pathname.match(/^\/api\/v1\/admin\/users\/([\w-]+)\/(overview|access-link|verification)$/);
  if(userAction){const [,id,action]=userAction,person=adminRecords.users.find(u=>u.id===id)||people.get(id);if(!person)return adminBad(404,'User not found');
   if(action==='overview'&&req.method==='GET')return ['super_admin','support_admin'].includes(actor.role)?adminOk({user:{...person,passwordHash:'must-not-leak'},school:{id:'school-a',name:'Heritage Learning School'},subscription:{planCode:'free',status:'active'},progress:{points:20,learningMinutes:5,streakDays:1},courses:[],classes:[],lastLoginAt:null}):adminBad(403,'Not allowed');
   if(actor.role!=='super_admin')return adminBad(403,'Super admin only');
   if(action==='access-link')return adminOk({sent:person.lastLoginAt?'password_reset':'invite'});
   if(action==='verification'){person.verificationStatus=body.decision==='approve'?'verified':'rejected';if(body.decision==='reject')person.isActive=false;return adminOk(person);}
  }
  const schoolAction=url.pathname.match(/^\/api\/v1\/schools\/([\w-]+)\/verification(?:\/(decision))?$/);
  if(schoolAction){const [,id,decision]=schoolAction;if(id!==schoolA.id)return adminBad(403,'Other school');if(decision){if(actor.role!=='super_admin')return adminBad(403,'Super admin only');schoolA.verification={...schoolA.verification,status:body.decision==='approve'?'verified':'rejected'};}else {if(actor.role!=='school_admin')return adminBad(403,'School admin only');schoolA.verification={status:'pending',documents:body.documents};}return adminOk(schoolA);}
  if(url.pathname==='/api/v1/admin/me/permissions'){
    const profile=schoolProfile(bearer);
    if(!['super_admin','support_admin','content_creator','school_admin'].includes(profile.role))return send(res,403,{success:false,message:'Console access denied'});
    const mode=(bearer||'').replace('access-','');
    if(mode==='support_denied')return send(res,403,{success:false,message:'Console access denied'});
    if(mode==='support_error')return send(res,503,{success:false,message:'Temporarily unavailable'});
    if(mode==='support_expired')return send(res,401,{success:false,message:'Session ended'});
    if(mode==='support_malformed')return send(res,200,{success:true,data:{role:'support_admin',permissions:'*',menu:[]}});
    if(mode==='support_empty')return send(res,200,{success:true,data:{role:profile.role,permissions:[],menu:[]}});
    return send(res,200,{success:true,data:{role:profile.role,permissions:profile.role==='super_admin'&&mode!=='super_readonly'||profile.role==='support_admin'?['dashboard.view','users.view','users.manage']:profile.role==='super_admin'?['dashboard.view','users.view']:['dashboard.view'],menu:[{key:'verifications',label:'Verifications',path:'/admin/verifications'},{key:'home',label:'Overview',path:'/admin'},{key:'users',label:'Future users',path:'/admin/users'},{key:'home',label:'Unsafe',path:'https://unrelated.invalid'}],accessToken:'must-not-leak'}});
  }
  if(/^\/api\/v1\/(admin|schools|languages|authoring|dashboards)(\/|$)/.test(url.pathname))return adminResponse(req,res,url,body,bearer);
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
    const name=body.email.split('@')[0];if(name.startsWith('support_')||['super_readonly','super_renew'].includes(name))people.set(name,{id:name,role:name.startsWith('super_')?'super_admin':'support_admin',firstName:'Fixture',lastName:'Test'});const role=name==='admin'?'super_admin':['parent','teacher','school_admin','content_creator','super_admin','support_admin'].includes(name)?name:'learner';
    const token=`access-${name}`;revoked.delete(token);const refresh=`refresh-${name}`;sessions.set(refresh,{name,role});
    return send(res,200,{success:true,data:{user:schoolProfile(token),accessToken:token,refreshToken:refresh,expiresIn:['rotate','failrefresh','refreshslow','super_renew'].includes(name)?1:900}});
  }
  if(url.pathname==='/api/v1/auth/refresh'){
    const old=sessions.get(body.refreshToken);if(!old)return send(res,401,{success:false,message:'Invalid refresh'});
    sessions.delete(body.refreshToken);rotates++;
    if(old.name==='failrefresh')return send(res,401,{success:false,message:'Refresh expired'});
    await new Promise(r=>setTimeout(r,old.name==='refreshslow'?1000:150));
    const token=`rotated-${rotates}-${old.name}`;sessions.set(token,old);return send(res,200,{success:true,data:{user:old.name==='super_renew'?schoolProfile('access-'+old.name):{...user,role:old.role},accessToken:token,refreshToken:token,expiresIn:900}});
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
