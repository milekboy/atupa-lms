import {ApiError,object} from '../api/contracts';
import type {Role} from '../../types/auth';
export type Member={id:string;firstName:string;lastName:string;email:string;role:string;schoolId:string;isActive:boolean};
export type School={id:string;name:string;region:string;email:string;phone:string;address:string;joinCode:string;isActive:boolean;settings:{leaderboardsEnabled:boolean;showLearnerNamesOnLeaderboards:boolean}};
export type Course={id:string;title:string;languageCode:string};
export type Classroom={id:string;name:string;description:string;schoolId:string;languageCode:string;teacherUserId:string;joinCode:string;isArchived:boolean;studentUserIds:string[];assignedCourseIds:string[];students:Member[];courses:Course[];teacher:Member|null};
export type Page<T>={items:T[];page:number;limit:number;total:number};
const text=(v:unknown)=>typeof v==='string'?v:'';
export function identifier(v:unknown){if(typeof v!=='string'||! /^[A-Za-z0-9_-]{1,128}$/.test(v))throw new ApiError(502,'An invalid record identifier was returned.');return v;}
export function member(v:unknown):Member{const x=object(v);return {id:identifier(x.id),firstName:text(x.firstName),lastName:text(x.lastName),email:text(x.email),role:text(x.role),schoolId:text(x.schoolId),isActive:x.isActive!==false};}
export const memberName=(m:Member)=>`${m.firstName} ${m.lastName}`.trim()||m.email||m.id;
export function school(v:unknown):School{const x=object(v),s=object(x.settings);if(typeof s.leaderboardsEnabled!=='boolean'||typeof s.showLearnerNamesOnLeaderboards!=='boolean')throw new ApiError(502,'School privacy settings were not returned.');return {id:identifier(x.id),name:text(x.name),region:text(x.region),email:text(x.email),phone:text(x.phone),address:text(x.address),joinCode:text(x.joinCode),isActive:x.isActive!==false,settings:{leaderboardsEnabled:s.leaderboardsEnabled,showLearnerNamesOnLeaderboards:s.showLearnerNamesOnLeaderboards}};}
export function course(v:unknown):Course{const x=object(v);return {id:identifier(x.id),title:text(x.title),languageCode:text(x.languageCode)};}
function ids(v:unknown){return Array.isArray(v)?v.map(identifier):[];}
export function classroom(v:unknown):Classroom{const x=object(v);if(!Array.isArray(x.studentUserIds)||!Array.isArray(x.assignedCourseIds)||typeof x.isArchived!=='boolean')throw new ApiError(502,'The class response is incomplete.');return {id:identifier(x.id),name:text(x.name),description:text(x.description),schoolId:text(x.schoolId),languageCode:text(x.languageCode),teacherUserId:text(x.teacherUserId),joinCode:text(x.joinCode),isArchived:x.isArchived,studentUserIds:ids(x.studentUserIds),assignedCourseIds:ids(x.assignedCourseIds),students:Array.isArray(x.students)?x.students.map(member):[],courses:Array.isArray(x.courses)?x.courses.map(course):[],teacher:x.teacher?member(x.teacher):null};}
export function page<T>(v:unknown,parse:(v:unknown)=>T):Page<T>{const x=object(v);if(!Array.isArray(x.items)||!Number.isInteger(x.page)||!Number.isInteger(x.limit)||!Number.isInteger(x.total)||Number(x.page)<1||Number(x.limit)<1||Number(x.total)<0)throw new ApiError(502,'The server returned an incomplete list.');return {items:x.items.map(parse),page:Number(x.page),limit:Number(x.limit),total:Number(x.total)};}
export function joinPayload(code:string,kind:'school'|'class'){const value=code.trim();if(!/^[A-Za-z0-9_-]{1,64}$/.test(value))throw new ApiError(400,'Enter a valid join code.');return kind==='school'?{joinCode:value}:{code:value};}
export function invitePayload(fields:Record<string,string>){const {role,email,firstName,lastName,dateOfBirth}=fields;if(!['teacher','learner'].includes(role)||!email?.trim()||!firstName?.trim()||!lastName?.trim())throw new ApiError(400,'Enter the member’s name, email and role.');return {role,email:email.trim(),firstName:firstName.trim(),lastName:lastName.trim(),...(role==='learner'&&dateOfBirth?{dateOfBirth}:{})};}
export function managesClass(c:Classroom,user:{id:string;role:Role}){return !c.isArchived&&(user.role==='school_admin'||user.role==='super_admin'||user.role==='teacher'&&c.teacherUserId===user.id);}
// Resource ownership and school membership are always checked by the upstream API.
export function schoolActionAllowed(path:string[],method:string,role:Role){
 const [root,id,action,extra]=path;
 if(root!=='schools'&&root!=='classes')return true;
 const staff=['teacher','school_admin','super_admin'].includes(role),admin=['school_admin','super_admin'].includes(role),participant=['teacher','learner','school_admin','super_admin'].includes(role);
 if(!participant)return false;
 if(root==='schools'){
  if(id==='join')return method==='POST'&&['teacher','learner'].includes(role)&&path.length===2;
  if(!id)return ['GET','POST'].includes(method)&&role==='super_admin';
  if(id==='mine')return method==='GET'&&path.length===2;
  if(!action)return path.length===2&&(method==='GET'||method==='PATCH'&&admin||method==='DELETE'&&role==='super_admin');
  if(action==='members')return method==='GET'&&staff&&path.length===3||method==='POST'&&admin&&path.length===3||method==='DELETE'&&admin&&path.length===4&&!!extra;
  return action==='join-code'&&extra==='rotate'&&path.length===4&&method==='POST'&&admin;
 }
 if(!id)return method==='GET'||method==='POST'&&staff;
 if(id==='join')return path.length===2&&method==='POST'&&role==='learner';
 if(!action)return path.length===2&&(method==='GET'||['PATCH','DELETE'].includes(method)&&staff);
 if(action==='membership')return path.length===3&&method==='DELETE'&&role==='learner';
 if(!staff)return false;
 if(action==='students')return path.length===3&&method==='POST'||path.length===4&&method==='DELETE';
 if(action==='courses')return path.length===4&&['POST','DELETE'].includes(method);
 if(action==='teacher')return path.length===3&&method==='PATCH'&&admin;
 if(action==='announcements')return path.length===3&&method==='POST';
 return action==='join-code'&&extra==='rotate'&&path.length===4&&method==='POST';
}
