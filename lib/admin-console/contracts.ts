import {ApiError,object} from '../api/contracts';
import type {Role} from '../../types/auth';
import type {Destination} from '../dashboard/navigation';
export const consoleRoles:readonly Role[]=['super_admin','support_admin','content_creator','school_admin'];
export function isConsoleRole(role:Role){return consoleRoles.includes(role);}
export type AdminAccess={role:Role;permissions:string[];menu:{key:string;label:string;path:string}[]};
// Only implemented destinations may become links. Backend paths are never navigation URLs.
const routes:Record<string,{href:string;permission:string}>={safety:{href:'/admin/safety-reports',permission:'users.view'},alerts:{href:'/admin/alerts',permission:'users.view'},activity:{href:'/admin/activity-log',permission:'users.view'},exports:{href:'/admin/exports',permission:'users.view'},home:{href:'/admin',permission:'dashboard.view'},finance:{href:'/admin/finance',permission:'users.view'},courses:{href:'/admin/courses',permission:'users.view'},reviews:{href:'/admin/reviews',permission:'users.manage'},users:{href:'/admin/users',permission:'users.view'},onboarding:{href:'/admin/onboarding',permission:'users.manage'},verifications:{href:'/admin/verifications',permission:'users.manage'}};
export function parseAdminAccess(value:unknown,role:Role):AdminAccess{
 const x=object(value);
 if(!isConsoleRole(role)||x.role!==role||!Array.isArray(x.permissions)||!x.permissions.every(p=>typeof p==='string'&&/^[a-z][a-z0-9_.-]{0,99}$/.test(p))||!Array.isArray(x.menu))throw new ApiError(502,'Admin access could not be verified. Please try again.');
 if(x.permissions.length>500||x.menu.length>100)throw new ApiError(502,'Admin access could not be verified. Please try again.');
 const menu:AdminAccess['menu']=[];
 for(const entry of x.menu){const item=object(entry);if(typeof item.key!=='string'||typeof item.label!=='string'||typeof item.path!=='string')throw new ApiError(502,'Admin navigation could not be verified. Please try again.');
  // Require the documented exact path as well as the known key; ignore future/foreign entries.
  const route=routes[item.key];if(!route||['users','exports'].includes(item.key)&&!['super_admin','support_admin'].includes(role)||['verifications','onboarding','reviews','courses','finance','safety','alerts','activity'].includes(item.key)&&role!=='super_admin'||item.path!==route.href||!x.permissions.includes(route.permission)||menu.some(m=>m.key===item.key))continue;
  menu.push({key:item.key,label:item.key==='home'?'Console home':item.key==='users'?'Users':item.key==='onboarding'?'School onboarding':item.key==='reviews'?'Content reviews':item.key==='courses'?'Course visibility':item.key==='finance'?'Finance':item.key==='exports'?'Report downloads':item.key==='safety'?'Safety reports':item.key==='alerts'?'Alerts':item.key==='activity'?'Activity log':'Verifications',path:route.href});
 }
 return {role,permissions:[...new Set(x.permissions as string[])],menu};
}
export function adminNavigation(access:AdminAccess):Destination[]{return access.menu.map(item=>({label:item.label,href:item.path,group:'Administration',icon:item.key==='courses'?'courses':item.key==='users'?'users':item.key==='verifications'?'account':'home',roles:consoleRoles,implemented:true,keywords:['admin','console']}));}
export function isPermissionsPath(path:string[]){return path.length===3&&path.join('/')==='admin/me/permissions';}
// Step 1 introduces no support-admin business operations. Each later step must add explicit grants.
export function foundationAllowed(path:string[],method:string,role:Role){
 if(isPermissionsPath(path))return method==='GET'&&isConsoleRole(role);
 if(role!=='support_admin')return true;
 return method==='GET'&&path.join('/')==='users/me'||path[0]==='notifications';
}
