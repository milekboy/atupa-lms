import {ApiError,object} from '../api/contracts';
import {identifier,page} from '../school/contracts';
import type {Role} from '../../types/auth';
export const kinds=['users','schools','languages','vocabulary','cultural-topics','games','gamecards'] as const;
export type Kind=typeof kinds[number];
export type RecordItem={id:string;key:string;title:string;subtitle:string;state:string;data:Record<string,unknown>};
export const text=(v:unknown)=>typeof v==='string'?v:'';
export function record(v:unknown):RecordItem{const x=object(v),id=identifier(x.id);return {id,key:text(x.code)||id,title:text(x.title)||text(x.term)||text(x.name)||[text(x.firstName),text(x.lastName)].join(' ').trim()||id,subtitle:text(x.email)||text(x.languageCode)||text(x.region)||text(x.code),state:typeof x.isActive==='boolean'?(x.isActive?'Active':'Inactive'):text(x.status),data:x};}
export const records=(v:unknown)=>page(v,record);
export function languages(v:unknown){if(!Array.isArray(v))throw new ApiError(502,'The language list is incomplete.');return v.map(record);}
export function endpoint(kind:Kind){return kind==='users'?'/admin/users':kind==='languages'?'/languages':kind==='schools'?'/schools':'/authoring/'+kind;}
export function listEndpoint(kind:Kind){return kind==='languages'?'/admin/languages':endpoint(kind);}
export function recordPath(kind:Kind,item:RecordItem){return endpoint(kind)+'/'+encodeURIComponent(['languages','gamecards'].includes(kind)?identifier(item.key):item.id);}
export function managementAllowed(path:string[],method:string,role:Role){
 const [root,kind]=path;
 if(root==='admin')return role==='super_admin'&&(kind==='users'&&(path.length===2&&['GET','POST'].includes(method)||path.length===3&&['GET','PATCH','DELETE'].includes(method))||kind==='languages'&&path.length===2&&method==='GET');
 if(root==='languages'&&method!=='GET')return role==='super_admin'&&(path.length===1&&method==='POST'||path.length===2&&method==='PATCH');
 if(root==='dashboards'&&kind==='admin')return role==='super_admin'&&path.length===2&&method==='GET';
 if(root==='authoring'&&['vocabulary','cultural-topics','games','gamecards'].includes(kind)){
  if(kind==='gamecards'&&path.length===4&&path[3]==='qr')return ['super_admin','content_creator','teacher'].includes(role)&&method==='GET';
  return ['super_admin','content_creator'].includes(role)&&(path.length===2&&['GET','POST'].includes(method)||path.length===3&&['PATCH','DELETE'].includes(method));
 }
 return true;
}
export type Field={name:string;label:string;type?:'textarea'|'email';options?:string[];required?:boolean};
const f=(name:string,label:string,required=true):Field=>({name,label,required});
const language=f('languageCode','Language code');
export function fields(kind:Kind,editing=false):Field[]{
 if(editing){if(kind==='users')return [{...f('isActive','Account status'),options:['true','false']}];if(kind==='schools')return [{...f('isActive','School status'),options:['true','false']},{...f('leaderboardsEnabled','Leaderboards enabled'),options:['true','false']},{...f('showLearnerNamesOnLeaderboards','Show learner names'),options:['true','false']}];if(kind==='languages')return [f('nativeName','Native name')];if(kind==='vocabulary')return [f('pronunciation','Pronunciation',false),f('exampleSentence','Example sentence',false)];return [f(kind==='cultural-topics'?'summary':'description',kind==='cultural-topics'?'Summary':'Description',false)];}
 switch(kind){
 case 'users':return [{...f('email','Email address'),type:'email'},f('firstName','First name'),f('lastName','Last name')];
 case 'schools':return [f('name','School name'),f('region','Region')];
 case 'languages':return [f('code','Language code'),f('name','Language name'),f('nativeName','Native name')];
 case 'vocabulary':return [language,f('term','Term'),f('meaning','Meaning'),f('conceptKey','Concept key'),f('category','Category'),{...f('level','Level'),options:['beginner','intermediate','advanced']}];
 case 'cultural-topics':return [f('title','Title'),f('category','Category'),language,f('summary','Summary'),{...f('content','Text content'),type:'textarea'},{...f('status','Publication status'),options:['draft','published']}];
 case 'games':return [f('title','Title'),{...f('gameType','Game type'),options:['web']},f('languageCodes','Language codes (comma separated)'),f('conceptKeys','Concept keys (comma separated)'),{...f('status','Publication status'),options:['draft','published']}];
 case 'gamecards':return [f('code','Card code'),f('conceptKey','Concept key'),language,f('title','Title'),f('prompt','Challenge prompt'),{...f('choices','Choices (one per line)'),type:'textarea'},f('answer','Correct answer')];
 }
}
export function payload(kind:Kind,editing:boolean,input:Record<string,string>){
 const result:Record<string,unknown>={};for(const field of fields(kind,editing)){const value=(input[field.name]??'').trim();if(field.required&&!value)throw new Error('Enter '+field.label.toLowerCase()+'.');if(field.options&&!field.options.includes(value))throw new Error('Choose a valid '+field.label.toLowerCase()+'.');result[field.name]=value;}
 if(editing&&['users','schools'].includes(kind))result.isActive=result.isActive==='true';
 if(kind==='schools'&&editing){result.settings={leaderboardsEnabled:input.leaderboardsEnabled==='true',showLearnerNamesOnLeaderboards:input.showLearnerNamesOnLeaderboards==='true'};delete result.leaderboardsEnabled;delete result.showLearnerNamesOnLeaderboards;}
 if(!editing&&kind==='users')result.role='content_creator';
 if(!editing&&kind==='games')for(const key of ['languageCodes','conceptKeys']){const values=String(result[key]).split(',').map(v=>v.trim()).filter(Boolean);if(!values.length)throw new Error('Enter at least one '+key+'.');result[key]=[...new Set(values)];}
 if(!editing&&kind==='cultural-topics'){result.blocks=[{type:'text',content:result.content}];delete result.content;}
 if(!editing&&kind==='gamecards'){const choices=String(result.choices).split(/\r?\n/).map(v=>v.trim()).filter(Boolean);if(choices.length<2||new Set(choices).size!==choices.length||!choices.includes(String(result.answer)))throw new Error('Provide at least two unique choices and an answer matching one choice exactly.');result.challenge={prompt:result.prompt,choices,answer:result.answer};delete result.prompt;delete result.choices;delete result.answer;}
 if(!editing&&['languages','gamecards'].includes(kind)&&!/^[A-Za-z0-9_-]{1,128}$/.test(String(result.code)))throw new Error('Use letters, numbers, hyphens or underscores for the code.');
 return result;
}
export function dashboard(v:unknown){const x=object(v);if(!x.users||!x.courses)throw new ApiError(502,'The administrator dashboard is incomplete.');return x;}
