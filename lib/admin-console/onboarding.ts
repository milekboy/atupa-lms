import {ApiError,object} from '../api/contracts';
import {identifier} from '../school/contracts';
export const bulkLimit=512*1024;
export type BulkInput={csv:string;dryRun:boolean;classId:string};
export type BulkResult={dryRun:boolean;total:number;valid:number;failed:number;created:number;addedToClass:number;saved:boolean;rows:{row:number;email:string;firstName:string;lastName:string;status:string;errors:string[];userId?:string}[]};
export function bulkInput(form:FormData):BulkInput{
 if([...form.keys()].some(k=>!['csv','file','dryRun','classId'].includes(k))||[...form.keys()].some(k=>form.getAll(k).length!==1))throw new ApiError(400,'Unsupported or repeated import field.');
 const csv=form.get('csv'),dry=form.get('dryRun')??'true',target=form.get('classId')??'';
 if(typeof csv!=='string'||!csv.trim()||new TextEncoder().encode(csv).length>bulkLimit)throw new ApiError(400,'Provide CSV text up to 512 KB.');
 if(!['true','false'].includes(String(dry))||typeof target!=='string'||target&&!/^[-\w]{1,128}$/.test(target))throw new ApiError(400,'Invalid import options.');
 return {csv,dryRun:dry==='true',classId:target};
}
export function bulkResult(value:unknown,expectedDryRun:boolean):BulkResult{
 const x=object(value);const invalid=()=>{throw new ApiError(502,'The import result could not be confirmed. Check the learner and class records before repeating a save.');};
 for(const key of ['total','valid','failed','created','addedToClass'])if(!Number.isSafeInteger(x[key])||Number(x[key])<0)invalid();
 if(x.dryRun!==expectedDryRun||typeof x.saved!=='boolean'||!Array.isArray(x.rows)||Number(x.total)>10000||x.rows.length!==x.total||Number(x.valid)+Number(x.failed)!==x.total||Number(x.created)>Number(x.valid)||Number(x.addedToClass)>Number(x.created))invalid();
 if((expectedDryRun||x.saved===false)&&(x.created!==0||x.addedToClass!==0||x.saved!==false)||x.saved===true&&(x.failed!==0||x.created!==x.total))invalid();
 const seen=new Set<number>();let failures=0;
 const rows=(x.rows as unknown[]).map(v=>{const row=object(v);if(!Number.isSafeInteger(row.row)||Number(row.row)<2||seen.has(Number(row.row))||!['ok','error','created'].includes(String(row.status))||!Array.isArray(row.errors)||!row.errors.every(e=>typeof e==='string')||['email','firstName','lastName'].some(k=>typeof row[k]!=='string')||x.saved!==true&&row.status==='created'||row.status==='error'&&!row.errors.length||row.status!=='error'&&row.errors.length||x.saved===true&&row.status!=='created')invalid();seen.add(Number(row.row));if(row.status==='error')failures++;return {row:Number(row.row),email:String(row.email),firstName:String(row.firstName),lastName:String(row.lastName),status:String(row.status),errors:row.errors as string[],...(row.userId?{userId:identifier(row.userId)}:{})};});
 if(failures!==x.failed)invalid();
 return {dryRun:expectedDryRun,total:Number(x.total),valid:Number(x.valid),failed:Number(x.failed),created:Number(x.created),addedToClass:Number(x.addedToClass),saved:x.saved as boolean,rows};
}
export function classCreate(value:unknown){const x=object(value);if(typeof x.name!=='string'||!x.name.trim()||x.name.trim().length>150||typeof x.languageCode!=='string'||!/^[-a-z0-9]{1,40}$/.test(x.languageCode)||typeof x.teacherUserId!=='string'||!/^[-\w]{1,128}$/.test(x.teacherUserId))throw new ApiError(400,'Choose a class name, language and teacher.');return {name:x.name.trim(),languageCode:x.languageCode,teacherUserId:x.teacherUserId};}
