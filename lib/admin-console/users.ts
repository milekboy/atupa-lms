import {ApiError,object,safeUser} from '../api/contracts';
import {roles,type Role,type User} from '../../types/auth';
import {identifier,page} from '../school/contracts';
export const publicInviteRoles:readonly Role[]=['learner','parent','teacher'];
export function inviteRoles(role:Role):readonly Role[]{return role==='super_admin'?roles:role==='support_admin'?publicInviteRoles:[];}
const text=(v:unknown)=>typeof v==='string'?v:'';
function field(x:Record<string,unknown>,key:string,max=200,required=true){const value=text(x[key]).trim();if(value.length>max||required&&!value)throw new ApiError(400,'Enter a valid '+key+'.');return value;}
export function userWrite(method:string,value:unknown,actor:User){const x=object(value);
 if(method==='POST'){const role=x.role as Role;if(!inviteRoles(actor.role).includes(role))throw new ApiError(403,'You cannot invite this account role.');const email=field(x,'email',320);if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new ApiError(400,'Enter a valid email address.');return {firstName:field(x,'firstName'),lastName:field(x,'lastName'),email,role};}
 if(method==='PATCH'&&actor.role==='super_admin')return {lastName:field(x,'lastName'),phone:field(x,'phone',40,false)};
 throw new ApiError(403,'This account change is not available.');
}
export function decisionPayload(value:unknown){const x=object(value);if(!['approve','reject'].includes(String(x.decision)))throw new ApiError(400,'Choose approve or reject.');return {decision:x.decision as 'approve'|'reject',...(x.decision==='reject'?{reason:field(x,'reason',2000)}:{})};}
export function documentsPayload(value:unknown){const x=object(value);if(!Array.isArray(x.documents)||x.documents.length<1||x.documents.length>5)throw new ApiError(400,'Attach between one and five verification documents.');return {documents:x.documents.map(v=>{const d=object(v);return {mediaId:identifier(d.mediaId),label:field(d,'label',200)};}),...(x.note?{note:field(x,'note',2000)}:{})};}
export function userFilters(input:URLSearchParams,role:Role){const out=new URLSearchParams();for(const key of input.keys())if(!['q','role','isActive','verificationStatus','page','limit'].includes(key))throw new ApiError(400,'Unsupported user filter.');
 const q=input.get('q')?.trim();if(q){if(q.length>200)throw new ApiError(400,'Search is too long.');out.set('q',q);}
 const selected=input.get('role')|| (role==='support_admin'?'learner':'');if(selected){if(!roles.includes(selected as Role)||role==='support_admin'&&!publicInviteRoles.includes(selected as Role))throw new ApiError(403,'This role filter is not available.');out.set('role',selected);}
 for(const [key,allowed]of [['isActive',['true','false']],['verificationStatus',['unverified','pending','verified','rejected','not_required']]] as const){const v=input.get(key);if(v){if(!(allowed as readonly string[]).includes(v))throw new ApiError(400,'Invalid '+key+' filter.');out.set(key,v);}}
 for(const [key,max,fallback]of [['page',10000,1],['limit',100,20]] as const){const raw=input.get(key);const n=raw?Number(raw):fallback;if(!Number.isInteger(n)||n<1||n>max)throw new ApiError(400,'Invalid '+key+'.');out.set(key,String(n));}return out;
}
export function consoleRule(path:string[],method:string,user:User):string|null{
 const p=path.join('/'),superAdmin=user.role==='super_admin',support=user.role==='support_admin';
 if(p==='admin/users'&&(superAdmin||support))return method==='GET'?'users.view':method==='POST'?'users.manage':null;
 if(/^admin\/users\/[\w-]+\/overview$/.test(p)&&method==='GET'&&(superAdmin||support))return 'users.view';
 if(superAdmin&&(/^admin\/users\/[\w-]+$/.test(p)&&method==='PATCH'||/^admin\/users\/[\w-]+\/(access-link|verification)$/.test(p)&&method==='POST'||p==='admin/verifications'&&method==='GET'||/^schools\/[\w-]+\/verification\/decision$/.test(p)&&method==='POST'))return 'users.manage';
 if(user.role==='teacher'&&p==='users/me/verification'&&method==='POST'||user.role==='school_admin'&&/^schools\/[\w-]+\/verification$/.test(p)&&method==='POST'||['teacher','school_admin'].includes(user.role)&&p==='media/upload'&&method==='POST'||user.role==='school_admin'&&p==='schools/mine'&&method==='GET')return 'self';
 return null;
}
export function userRecord(value:unknown){const x=object(value),user=safeUser(x);return {...user,phone:text(x.phone),schoolId:text(x.schoolId),isActive:typeof x.isActive==='boolean'?x.isActive:null,verificationStatus:text(x.verificationStatus),lastLoginAt:text(x.lastLoginAt),lastActiveAt:text(x.lastActiveAt),createdAt:text(x.createdAt)};}
export const userPage=(value:unknown)=>page(value,userRecord);
export function userOverview(value:unknown){const x=object(value),s=object(x.school),sub=object(x.subscription),p=object(x.progress);const number=(v:unknown)=>typeof v==='number'&&Number.isFinite(v)?v:null;return {user:userRecord(x.user),school:s.id?{id:identifier(s.id),name:text(s.name)}:null,subscription:{planCode:text(sub.planCode),status:text(sub.status)},lastLoginAt:text(x.lastLoginAt),lastActiveAt:text(x.lastActiveAt),safetyReportsAgainst:number(x.safetyReportsAgainst),progress:{points:number(p.points),streakDays:number(p.streakDays),learningMinutes:number(p.learningMinutes)},courses:Array.isArray(x.courses)?x.courses.map(v=>{const c=object(v);return {courseId:identifier(c.courseId),title:text(c.title),status:text(c.status),progressPercent:number(c.progressPercent)};}):[],classes:Array.isArray(x.classes)?x.classes.map(v=>{const c=object(v);return {id:identifier(c.id),name:text(c.name)};}):[]};}
export function verificationRecord(value:unknown){const x=object(value),v=object(x.verification);if(!['teacher','school'].includes(text(x.type)))throw new ApiError(502,'Verification type is unavailable.');return {id:identifier(x.id),type:text(x.type),name:text(x.name),email:text(x.email),phone:text(x.phone),region:text(x.region),verification:{status:text(v.status),note:text(v.note),submittedAt:text(v.submittedAt),documents:Array.isArray(v.documents)?v.documents.map(raw=>{const d=object(raw);return {mediaId:identifier(d.mediaId),label:text(d.label)};}):[]}};}
export const verificationPage=(value:unknown)=>page(value,verificationRecord);
