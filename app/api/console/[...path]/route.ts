import {trustRule} from '@/lib/admin-console/trust';
import {trustRequest} from '@/lib/admin-console/trust-server';
import {overview} from '@/lib/admin-console/overview';
import {financeRule} from '@/lib/admin-console/finance';
import {financeRequest} from '@/lib/admin-console/finance-server';
import {visibilityRule} from '@/lib/admin-console/visibility';
import {visibilityRequest} from '@/lib/admin-console/visibility-server';
import {reviewRule} from '@/lib/admin-console/reviews';
import {reviewsRequest} from '@/lib/admin-console/reviews-server';
import {onboardingRule,onboardingRequest} from '@/lib/admin-console/onboarding-server';
import {NextRequest} from 'next/server';
import {authenticated,responseJson} from '@/lib/api/server';
import {ApiError,normalizeError,object,safeUser} from '@/lib/api/contracts';
import {sessionCookie} from '@/lib/auth/session';
import {checkOrigin,errorResponse,json} from '@/lib/api/http';
import {parseAdminAccess} from '@/lib/admin-console/contracts';
import {consoleRule,userWrite,decisionPayload,documentsPayload,userFilters,userRecord,userPage,userOverview,verificationPage,publicInviteRoles} from '@/lib/admin-console/users';
type Context={params:Promise<{path:string[]}>};
async function handle(request:NextRequest,context:Context){try{
 const {path}=await context.params;if(path.some(p=>!/^[-\w]{1,128}$/.test(p)))throw new ApiError(400,'Invalid console path.');
 const mutation=request.method!=='GET';if(mutation)checkOrigin(request);
 const cookie=request.cookies.get(sessionCookie)?.value;if(!cookie)throw new ApiError(401,'Please sign in again.');
 async function read(endpoint:string){const r=await authenticated(cookie!,endpoint);const v=await responseJson(r);if(!r.ok)throw normalizeError(v,r.status);return object(v).data;}
 const profile=await read('/users/me');const user=safeUser(profile);const onboarding=onboardingRule(path,request.method,user.role);const review=reviewRule(path,request.method,user.role);const visibility=visibilityRule(path,request.method,user.role);const finance=financeRule(path,request.method,user.role);const overviewRequest=path.join('/')==='admin/overview'&&request.method==='GET'&&user.role==='super_admin';const trust=trustRule(path,request.method,user.role);const required=overviewRequest?'dashboard.view':trust??finance??visibility??review??onboarding??consoleRule(path,request.method,user);if(!required)throw new ApiError(403,'This console action is not available to your account.');
 if(required!=='self'){const access=parseAdminAccess(await read('/admin/me/permissions'),user.role);if(!access.permissions.includes(required))throw new ApiError(403,'Your account is missing permission for this action.');}
 if(overviewRequest){if(request.nextUrl.search)throw new ApiError(400,'Overview query options are not supported.');return json({success:true,data:overview(await read('/admin/overview'))});}
 if(trust)return await trustRequest(request,path,cookie,user.id);
 if(finance)return await financeRequest(request,path,cookie,user.id);
 if(visibility)return await visibilityRequest(request,path,cookie,profile);
 if(review)return await reviewsRequest(request,path,cookie,user);
 if(onboarding)return await onboardingRequest(request,path,cookie);
 const key=path.join('/');let query='';
 if(request.method==='GET'&&key==='admin/users')query='?'+userFilters(request.nextUrl.searchParams,user.role);
 if(key==='admin/verifications'){const q=request.nextUrl.searchParams,type=q.get('type')||'teacher',status=q.get('status')||'pending';if([...q.keys()].some(k=>!['type','status','page','limit'].includes(k))||!['teacher','school'].includes(type)||!['pending','verified','rejected','unverified'].includes(status))throw new ApiError(400,'Invalid verification filter.');const pagination=userFilters(new URLSearchParams({page:q.get('page')||'1',limit:q.get('limit')||'20'}),'super_admin');pagination.set('type',type);pagination.set('status',status);query='?'+pagination;}
 if(path[0]==='schools'&&required==='self'&&path[1]!=='mine'){const school=object(await read('/schools/mine'));if(school.id!==path[1])throw new ApiError(403,'This school is outside your access.');}
 let body:BodyInit|undefined;const headers=new Headers({Accept:'application/json'});
 if(mutation){
  if(key==='media/upload'){if(Number(request.headers.get('content-length'))>4*1024*1024+65536)throw new ApiError(413,'Verification uploads currently support files up to 4 MB.');const raw=await request.arrayBuffer();if(raw.byteLength>4*1024*1024+65536)throw new ApiError(413,'Verification uploads currently support files up to 4 MB.');const form=await new Request('http://localhost',{method:'POST',headers:{'Content-Type':request.headers.get('content-type')||''},body:raw}).formData();const file=form.get('file');if(!(file instanceof File)||!file.size||file.size>4*1024*1024||!['image/png','image/jpeg','image/webp'].includes(file.type))throw new ApiError(400,'Choose a PNG, JPEG or WebP image up to 4 MB.');const clean=new FormData();clean.set('file',file);clean.set('purpose','verification');body=clean;
  }else{const raw=await request.text();if(raw.length>16384)throw new ApiError(413,'This request is too large.');let input:unknown={};if(raw){try{input=JSON.parse(raw);}catch{throw new ApiError(400,'Invalid request details.');}}
   let payload:unknown={};if(key==='admin/users'||path[0]==='admin'&&path[1]==='users'&&path.length===3)payload=userWrite(request.method,input,user);else if(key.endsWith('/decision')||key.endsWith('/verification')&&path[0]==='admin')payload=decisionPayload(input);else if(key.endsWith('/verification'))payload=documentsPayload(input);
   body=JSON.stringify(payload);headers.set('Content-Type','application/json');
  }
 }
 const response=await authenticated(cookie,'/'+key+query,{method:request.method,headers,body});const envelope=await responseJson(response);if(!response.ok)throw normalizeError(envelope,response.status);const data=object(envelope).data;let safe:unknown;
 if(key==='admin/users'&&request.method==='GET'){const list=userPage(data);if(user.role==='support_admin'&&list.items.some(p=>!publicInviteRoles.includes(p.role)))throw new ApiError(403,'The returned accounts exceed your support access.');safe=list;}else if(key.endsWith('/overview')){safe=userOverview(data);if(user.role==='support_admin'&&!publicInviteRoles.includes(userOverview(data).user.role))throw new ApiError(403,'This account is outside your support access.');}
 else if(key==='admin/verifications')safe=verificationPage(data);
 else if(key.endsWith('/access-link')){const sent=object(data).sent;if(!['invite','invitation','password_reset'].includes(String(sent)))throw new ApiError(502,'The access-link result could not be confirmed.');safe={sent};}
 else if(key==='media/upload'){const media=object(data);if(media.kind!=='image'||media.purpose!=='verification'||typeof media.id!=='string'||!/^[-\w]{1,128}$/.test(media.id))throw new ApiError(502,'The uploaded verification document could not be confirmed.');safe={id:media.id,kind:'image',purpose:'verification'};}
 else if(path[0]==='schools'){const school=object(data);safe={id:school.id,name:typeof school.name==='string'?school.name:'',verification:{status:typeof object(school.verification).status==='string'?object(school.verification).status:''}};}
 else safe=userRecord(data);
 return json({success:true,data:safe},response.status);
 }catch(error){return errorResponse(error);}}
export const GET=handle;export const POST=handle;export const PATCH=handle;export const DELETE=handle;
