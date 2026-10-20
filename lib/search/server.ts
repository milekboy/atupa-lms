import 'server-only';
import {object} from '../api/contracts';
import {upstream,responseJson} from '../api/server';
import {parseOutline} from '../catalog/contracts';
import {project} from './contracts';
export async function searchBoundary(value:unknown,q:string){const e=object(value),r=project(e.success===true?e.data:value,q);const ids=[...new Set([...r.groups.courses.map(c=>c.id),...r.groups.lessons.map(l=>l.courseId)])].slice(0,12);const checked=await Promise.allSettled(ids.map(async id=>{const response=await upstream('/courses/'+id);if(!response.ok)throw new Error('Course unavailable');const data=object(await responseJson(response));const outline=parseOutline(data.data??data);if(outline.course.id!==id)throw new Error('Course mismatch');return outline;}));const outlines=checked.flatMap(x=>x.status==='fulfilled'?[x.value]:[]);const originalLessons=r.groups.lessons.length;
 r.groups.lessons=r.groups.lessons.flatMap(l=>{const o=outlines.find(o=>o.course.id===l.courseId),lesson=o?.modules.flatMap(m=>m.lessons).find(m=>m.id===l.id);return o&&lesson?[{...l,title:lesson.title,courseTitle:o.course.title,languageCode:o.course.languageCode,level:o.course.level,description:'',premium:o.course.isPremium}]:[];});
 const originalCourses=r.groups.courses.length;r.groups.courses=r.groups.courses.flatMap(c=>{const o=outlines.find(o=>o.course.id===c.id);return o?[{...c,title:o.course.title,description:o.course.description,languageCode:o.course.languageCode,level:o.course.level,premium:o.course.isPremium}]:[];});r.partial=r.groups.lessons.length<originalLessons||r.groups.courses.length<originalCourses;
 return {success:true,data:r};}
