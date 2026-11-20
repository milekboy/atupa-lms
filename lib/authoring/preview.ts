import {ApiError,object} from '../api/contracts';
import {lessonContent,id as safeId,type LearnerLesson} from '../learning/contracts';
import type {Role} from '../../types/auth';
export const previewRoles:readonly Role[]=['teacher','content_creator','super_admin'];
export type LessonPreview={course:{id:string;title:string};lesson:LearnerLesson['lesson'];status:string;activities:number;quizzes:number};
export function lessonPreview(value:unknown,courseId:string,lessonId:string):LessonPreview{
 const tree=object(value),course=object(tree.course);if(course.id!==courseId||!Array.isArray(tree.modules))throw new ApiError(502,'The preview course could not be verified.');
 const matches:{lesson:Record<string,unknown>;module:Record<string,unknown>}[]=[];
 for(const raw of tree.modules){const m=object(raw);if(m.courseId!==courseId||!Array.isArray(m.lessons))throw new ApiError(502,'The preview structure could not be verified.');for(const v of m.lessons){const lesson=object(v);if(lesson.courseId!==courseId||lesson.moduleId!==m.id)throw new ApiError(502,'The preview lesson has inconsistent parent records.');if(lesson.id===lessonId)matches.push({lesson,module:m});}}
 if(matches.length===0)throw new ApiError(404,'This lesson is not in the authorized course.');if(matches.length!==1)throw new ApiError(502,'The preview contains duplicate lesson records.');
 const l=matches[0].lesson;const content={...l,blocks:Array.isArray(l.blocks)?l.blocks.map(value=>{const block=object(value),media=object(block.media);const urls=[block.mediaUrl,media.url,media.optimizedUrl,...(Array.isArray(media.sources)?media.sources.map(v=>object(v).src):[])];const privateAsset=['verification','report'].includes(String(media.purpose))||urls.some(v=>typeof v==='string'&&/\/media\/(verification|report)\//.test(v));return privateAsset?{type:block.type,content:block.content}:block;}):l.blocks};const safe={id:safeId(l.id),courseId:safeId(course.id),title:typeof l.title==='string'?l.title:'',estimatedMinutes:typeof l.estimatedMinutes==='number'&&Number.isFinite(l.estimatedMinutes)&&l.estimatedMinutes>=0?l.estimatedMinutes:null,...lessonContent(content)};
 // Whitelist before sending to the browser. Author answers, reviews and ownership never enter preview data.
 return {course:{id:courseId,title:typeof course.title==='string'?course.title:''},lesson:safe,status:typeof l.status==='string'?l.status:'',activities:Array.isArray(l.activities)?l.activities.length:0,quizzes:Array.isArray(l.quizzes)?l.quizzes.length:0};
}
