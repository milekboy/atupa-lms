import {ApiError,object} from '../api/contracts';
import {identifier,page} from '../school/contracts';
import type {Role} from '../../types/auth';
// Product decision: free MVP (user, 2026-10-20). Paid and school checkout are out of launch scope.
export const launchMode='free' as const;
export function subscriptionAllowed(path:string[],method:string,role:Role){if(path[0]!=='subscriptions')return true;if(method!=='GET')return false;if(path.length===2&&['plans','mine'].includes(path[1]))return true;return path.length===2&&path[1]==='payments'&&role==='super_admin';}
export function accessRecord(v:unknown){const x=object(v),id=identifier(x.id);if(typeof x.title!=='string')throw new ApiError(502,'The catalog record is incomplete.');return {id,title:x.title,languageCode:typeof x.languageCode==='string'?x.languageCode:Array.isArray(x.languageCodes)?x.languageCodes.filter(v=>typeof v==='string').join(', '):'',level:typeof x.level==='string'?x.level:'',isPremium:typeof x.isPremium==='boolean'?x.isPremium:null,status:typeof x.status==='string'?x.status:''};}
export const accessPage=(v:unknown)=>page(v,accessRecord);
export function accessLabel(value:boolean|null){return value===true?'Premium-labelled':value===false?'Free-labelled':'Access label unavailable';}
export function counts(items:ReturnType<typeof accessRecord>[]){return {loaded:items.length,free:items.filter(x=>x.isPremium===false).length,premium:items.filter(x=>x.isPremium===true).length,unknown:items.filter(x=>x.isPremium===null).length};}
