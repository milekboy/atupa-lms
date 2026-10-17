import {ApiError,object} from "@/lib/api/contracts";
export const levels=["beginner","intermediate","advanced"] as const;
export type Level=typeof levels[number];
export type Language={code:string;name:string;nativeName:string};
export type Course={id:string;title:string;description:string;languageCode:string;level:Level;isPremium:boolean;durationMinutes:number|null};
export type CourseList={items:Course[];page:number;limit:number;total:number};
export type Lesson={id:string;title:string;estimatedMinutes:number|null;order:number};
export type Quiz={id:string;title:string;questionCount:number|null;passScorePercent:number|null};
export type Outline={course:Course;modules:{id:string;title:string;order:number;lessons:Lesson[];quizzes:Quiz[]}[];courseQuizzes:Quiz[];totals:{lessons:number;quizzes:number;activities:number}};
export type SearchParams=Record<string,string|string[]|undefined>;
export type CatalogQuery={languageCode:string;level:string;page:number};
const text=(v:unknown,fallback="")=>typeof v==="string"?v:fallback;
const number=(v:unknown)=>typeof v==="number"&&Number.isFinite(v)&&v>=0?v:null;
function required(v:unknown){if(typeof v!=="string"||!v)throw new ApiError(502,"The catalog returned incomplete information. Please try again later.");return v;}
function array(v:unknown):unknown[]{if(!Array.isArray(v))throw new ApiError(502,"The catalog returned incomplete information. Please try again later.");return v;}
function count(v:unknown){const n=number(v);if(n===null||!Number.isInteger(n))throw new ApiError(502,"The catalog returned invalid pagination or totals.");return n;}
export function parseLanguages(value:unknown):Language[]{return array(value).filter(v=>object(v).isActive===true).map(v=>{const l=object(v);return {code:required(l.code),name:required(l.name),nativeName:text(l.nativeName)};});}
export function parseCourse(value:unknown):Course{const c=object(value);if(c.status!=="published"||!levels.includes(c.level as Level)||typeof c.isPremium!=="boolean")throw new ApiError(502,"This course is not available in the public catalog.");return {id:required(c.id),title:required(c.title),description:text(c.description),languageCode:required(c.languageCode),level:c.level as Level,isPremium:c.isPremium,durationMinutes:number(c.durationMinutes)};}
export function parseCourseList(value:unknown):CourseList{const c=object(value);const result={items:array(c.items).map(parseCourse),page:count(c.page),limit:count(c.limit),total:count(c.total)};if(!result.page||!result.limit||result.items.length>result.limit||result.items.length>result.total)throw new ApiError(502,"The catalog returned invalid pagination.");return result;}
function parseQuiz(v:unknown):Quiz{const q=object(v);return {id:required(q.id),title:required(q.title),questionCount:number(q.questionCount),passScorePercent:number(q.passScorePercent)};}
export function parseOutline(value:unknown):Outline{const o=object(value),totals=object(o.totals);return {course:parseCourse(o.course),modules:array(o.modules).map(v=>{const m=object(v);return {id:required(m.id),title:required(m.title),order:number(m.order)??0,lessons:array(m.lessons).map(v=>{const l=object(v);return {id:required(l.id),title:required(l.title),estimatedMinutes:number(l.estimatedMinutes),order:number(l.order)??0};}).sort((a,b)=>a.order-b.order),quizzes:array(m.quizzes).map(parseQuiz)};}).sort((a,b)=>a.order-b.order),courseQuizzes:array(o.courseQuizzes).map(parseQuiz),totals:{lessons:count(totals.lessons),quizzes:count(totals.quizzes),activities:count(totals.activities)}};}
export function catalogQuery(params:SearchParams):CatalogQuery{if(["languageCode","level","page"].some(key=>Array.isArray(params[key])))throw new ApiError(400,"Use a single value for each filter.");const single=(key:string)=>typeof params[key]==="string"?params[key] as string:"";const languageCode=single("languageCode"),level=single("level"),page=single("page");if(languageCode&&!/^[a-z0-9_-]{1,40}$/.test(languageCode))throw new ApiError(400,"Choose a valid language.");if(level&&!levels.includes(level as Level))throw new ApiError(400,"Choose Beginner, Intermediate or Advanced.");if(page&&(!/^[1-9]\d{0,5}$/.test(page)))throw new ApiError(400,"Choose a valid page number.");return {languageCode,level,page:page?Number(page):1};}
export function catalogPath(query:CatalogQuery){const p=new URLSearchParams();if(query.languageCode)p.set("languageCode",query.languageCode);if(query.level)p.set("level",query.level);if(query.page!==1)p.set("page",String(query.page));return "/courses"+(p.size?"?"+p:"");}
export function languageName(code:string,languages:Language[]=[]){return languages.find(l=>l.code===code)?.name??({yoruba:"Yorùbá",igbo:"Igbo",hausa:"Hausa"}[code]??code);}
export function levelName(level:string){return level.charAt(0).toUpperCase()+level.slice(1);}
