/* eslint-disable @typescript-eslint/no-require-imports -- Local synthetic fixtures. */
// Never deploy: stand-in to verify browser/server boundaries, not backend acceptance.
const http=require('node:http'),crypto=require('node:crypto');const sessions=new Map();let exportsCalled=0;
function send(res,status,data,message='Success'){res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify({success:status<400,data,message}));}
function profile(name){return {id:name,role:name.startsWith('super_')?'super_admin':name==='teacher2'?'teacher':name,firstName:name,lastName:'Fixture',email:name+'@example.test',isActive:true};}
function pdf(){const parts=['%PDF-1.4\n'];const offsets=[0];const objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];const text='BT /F1 18 Tf 50 740 Td (ATUPA synthetic scoped report) Tj ET';objects.push('<< /Length '+text.length+' >>\nstream\n'+text+'\nendstream');objects.forEach((o,i)=>{offsets.push(Buffer.byteLength(parts.join('')));parts.push((i+1)+' 0 obj\n'+o+'\nendobj\n');});const start=Buffer.byteLength(parts.join(''));parts.push('xref\n0 6\n0000000000 65535 f \n'+offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('')+'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n'+start+'\n%%EOF\n');return parts.join('');}
const totals={users:{total:4,byRole:{learner:2,teacher:1,super_admin:1},active7d:3,active30d:4},courses:{total:3,published:2,byLanguage:{yoruba:2}},schools:1,certificatesIssued:2,parentsLinked:1,engagement30d:{lessonsCompleted:5,quizzesAttempted:0,quizzesPassed:2,quizPassRate:0,gamesPlayed:1,gamecardScans:2},revenue30d:{amountKobo:750000,count:1,activeSubscriptionsByPlan:{free:3}},needsAttention:{contentReviews:1,teacherVerifications:2,schoolVerifications:0,openSafetyReports:1,criticalSafetyReports:0,openAlerts:1},popularCourses:[{courseId:'course-a',title:'Yoruba Greetings',enrolled:2,completed:1,completionRate:50}]};
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost'),path=url.pathname;let raw='';for await(const part of req)raw+=part;const body=JSON.parse(raw||'{}');
 if(path==='/api/v1/auth/login'){const name=String(body.email).split('@')[0];if(body.password!=='fixture-password')return send(res,401,null,'Invalid credentials');const user=profile(name),accessToken=crypto.randomUUID();sessions.set(accessToken,user);return send(res,200,{user,accessToken,refreshToken:'refresh-'+accessToken,expiresIn:3600});}
 const user=sessions.get(req.headers.authorization?.replace('Bearer ',''));if(!user)return send(res,401,null,'Sign in required');
 if(path==='/api/v1/users/me')return send(res,200,user);
 if(path==='/api/v1/notifications')return send(res,200,{items:[],page:1,limit:20,total:0});
 if(path==='/api/v1/admin/me/permissions')return send(res,200,{role:user.role,permissions:user.id==='super_nogrants'?[]:['dashboard.view','users.view','users.manage'],menu:[{key:'home',label:'Home',path:'/admin'},{key:'exports',label:'Downloads',path:'/admin/exports'},{key:'users',label:'Users',path:'/admin/users'},{key:'finance',label:'Finance',path:'/admin/finance'}]});
 if(path==='/api/v1/admin/overview')return user.id==='super_error'?send(res,503,null,'Overview unavailable'):send(res,200,{...totals,engagement30d:user.id==='super_valid'?{...totals.engagement30d,quizzesAttempted:4,quizzesPassed:2,quizPassRate:50}:totals.engagement30d,secret:'must-not-leak'});
 if(path==='/api/v1/schools/mine')return send(res,200,{id:'school-a',name:'Fixture school'});
 if(path.startsWith('/api/v1/classes/')){const id=path.split('/').at(-1);return send(res,200,{id,name:'Fixture class',teacherUserId:id==='class-b'?'teacher2':'teacher',schoolId:id==='class-b'?'school-b':'school-a',studentUserIds:[],assignedCourseIds:[],isArchived:false,students:[],courses:[]});}
 if(path.startsWith('/api/v1/reports/classes/')){const id=path.split('/').at(-1);if(id==='denied')return send(res,403,null,'Outside scope');return send(res,200,{class:{id:id==='wrong'?'different':id,name:'Fixture class',studentCount:2},courses:[],learners:[],assignments:{completed:1,assigned:2},quizPerformance:{average:50,count:2}});}
 if(path.startsWith('/api/v1/reports/schools/'))return send(res,200,{school:{id:path.split('/').at(-1),name:'Fixture school'},courseCompletion:[],teacherActivity:[]});
 if(path==='/api/v1/admin/users')return send(res,200,{items:[{...profile('learner'),verification:{status:'not_required'}}],page:1,limit:20,total:30});
 if(path==='/api/v1/admin/payments'||path==='/api/v1/admin/subscriptions')return send(res,200,{items:[],page:1,limit:20,total:0});
 if(path==='/api/v1/admin/plans')return send(res,200,[]);
 if(path==='/api/v1/mock-export-count')return send(res,200,exportsCalled);
 if(path.startsWith('/api/v1/admin/exports/')){
  exportsCalled++;const key=path.slice('/api/v1/admin/exports/'.length),q=url.searchParams.get('q');
  if(q==='json')return send(res,200,{error:'not a file'});
  if(q==='forbidden')return send(res,403,null,'Export denied');
  if(q==='redirect'){res.writeHead(302,{Location:'https://example.invalid'});return res.end();}
  if(q==='html'){res.writeHead(200,{'Content-Type':'text/html','Content-Disposition':'attachment'});return res.end('<html>Error</html>');}
  if(q==='missing'){res.writeHead(200,{'Content-Type':'text/csv'});return res.end('id,name\n1,Ada\n');}
  if(q==='oversized'){res.writeHead(200,{'Content-Type':'text/csv','Content-Length':String(33*1024*1024),'Content-Disposition':'attachment'});return res.end('too large');}
  const isPdf=url.searchParams.get('format')==='pdf';res.writeHead(200,{'Content-Type':isPdf?'application/pdf':'text/csv','Content-Disposition':'attachment; filename="untrusted-backend-name.exe"','X-Upstream-Secret':'must-not-leak'});
  return res.end(isPdf?pdf():'id,kind,filters\n'+Array.from({length:30},(_,i)=>`${i+1},${key},"${url.searchParams.toString()}"`).join('\n')+'\n');
 }
 return send(res,404,null,'Not modeled');
 }catch{return send(res,500,null,'Fixture error');}}).listen(process.env.PORT);
