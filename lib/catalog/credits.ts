import {object} from '../api/contracts';
export type CourseCredits={byAtupa?:boolean;author?:{id:string;name:string;isVerified:boolean}};
export function courseCredits(value:unknown):CourseCredits{const v=object(value),a=object(v.author);return {...(typeof v.byAtupa==='boolean'?{byAtupa:v.byAtupa}:{}),...(typeof a.id==='string'&&/^[-\w]{1,128}$/.test(a.id)&&typeof a.name==='string'&&typeof a.isVerified==='boolean'?{author:{id:a.id,name:a.name.slice(0,200),isVerified:a.isVerified}}:{})};}
