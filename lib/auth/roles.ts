import { roles, type Role } from "@/types/auth";
export function isRole(value: unknown): value is Role { return typeof value === "string" && roles.includes(value as Role); }
export function canAccess(path: string, role: Role): boolean {
  if(path==="/dashboard")return true;
  if(path==="/admin/exports")return ["super_admin","support_admin"].includes(role);
  if(path==="/admin/users")return ["super_admin","support_admin"].includes(role);
  if(["/admin/safety-reports","/admin/alerts","/admin/activity-log"].includes(path))return role==="super_admin";
  if(path==="/admin/finance")return role==="super_admin";
  if(path==="/admin/courses")return role==="super_admin";
  if(path==="/admin/reviews")return role==="super_admin";
  if(path==="/admin/onboarding")return role==="super_admin";
  if(path==="/admin/verifications")return role==="super_admin";
  if(path==="/admin")return ["super_admin","support_admin","content_creator","school_admin"].includes(role);
  if(!path.startsWith("/dashboard/"))return false;
  const section=path.split("/")[2];
  const access:Record<string,readonly Role[]>={safety:["learner","parent"],launch:["super_admin"],search:["learner"],library:["content_creator","super_admin"],media:["teacher","content_creator","super_admin"],verification:["teacher","school_admin"],profile:roles,notifications:roles,courses:["learner"],users:["super_admin"],schools:["super_admin"],school:["teacher","learner","school_admin","super_admin"],languages:["super_admin"],admin:["super_admin"],members:["school_admin","super_admin"],children:["parent"],"family-link":["learner"],content:["teacher","content_creator","super_admin"],classes:["teacher","school_admin","learner","super_admin"],assignments:["learner","teacher","school_admin","super_admin"],reports:["learner","parent","teacher","school_admin","super_admin"],learn:["learner"],quizzes:["learner"],vocabulary:["learner"],culture:["learner"],gamecards:["learner"],"card-qr":["teacher","content_creator","super_admin"],progress:["learner"],achievements:["learner"],games:["learner"],certificates:["learner","super_admin"]};
  return access[section]?.includes(role)??false;
}
// Preserve supported admin filters across sign-in/renewal without accepting redirect parameters.
const adminQueries:Record<string,readonly string[]>={
 '/admin':[], '/admin/users':['q','role','isActive','verificationStatus','page'],
 '/admin/verifications':['type','status','page'], '/admin/onboarding':[],
 '/admin/reviews':['group','page'], '/admin/courses':['ownerType','visibility','page'],
 '/admin/finance':['tab','status','from','activeOnly','page'], '/admin/exports':[],
 '/admin/safety-reports':['id','unresolved','page'], '/admin/alerts':['status','page'],
 '/admin/activity-log':['action','page'],
};
export function safeReturnTo(value:string|null|undefined):string{
 if(!value||!value.startsWith('/')||value.startsWith('//')||/[\\\r\n]/.test(value))return '/dashboard';
 try{
  const rawPath=value.split(/[?#]/,1)[0];
  if(rawPath.split('/').some(part=>{const decoded=decodeURIComponent(part);return decoded==='.'||decoded==='..'||/[\\/\r\n]/.test(decoded);}))return '/dashboard';
  const parsed=new URL(value,'https://atupa.invalid');if(parsed.origin!=='https://atupa.invalid')return '/dashboard';
  if(parsed.pathname==='/dashboard'||parsed.pathname.startsWith('/dashboard/'))return parsed.pathname+parsed.search;
  const allowed=adminQueries[parsed.pathname];if(!allowed||[...parsed.searchParams.keys()].some(key=>!allowed.includes(key)||parsed.searchParams.getAll(key).length!==1))return '/dashboard';
  return parsed.pathname+parsed.search;
 }catch{return '/dashboard';}
}

export function sessionReturnTo(path:string,requestTarget:string|null|undefined){const fallback=safeReturnTo(path),target=safeReturnTo(requestTarget),pathname=target.split('?')[0],declared=path.split('?')[0];return pathname===declared||pathname.startsWith(declared+'/')?target:fallback;}
