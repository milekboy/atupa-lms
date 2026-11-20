import {ApiError} from '../api/contracts';
import type {Role} from '../../types/auth';
export function exportSpec(path:string[],query:URLSearchParams,role:Role){
 const key=path.join('/'),superAdmin=role==='super_admin';let kind='',format='csv',id='',allowed:string[]=[];
 if(['users.csv','payments.csv','subscriptions.csv','safety-reports.csv','activity-log.csv'].includes(key)){
  if(!superAdmin&&!(role==='support_admin'&&key==='safety-reports.csv'))throw new ApiError(403,'This export is outside your access.');
  kind=key.slice(0,-4);allowed=kind==='users'?['q','role','isActive']:kind==='payments'?['status','from','to']:[];
 }else if(path.length===3&&['classes','schools'].includes(path[0])&&path[2]==='report'&&/^[-\w]{1,128}$/.test(path[1])){
  kind=path[0];id=path[1];allowed=['format'];format=query.get('format')||'pdf';
  if(kind==='schools'?!['super_admin','school_admin'].includes(role):!['super_admin','support_admin','teacher','school_admin'].includes(role))throw new ApiError(403,'This report is outside your access.');
  if(!['csv','pdf'].includes(format)||kind==='schools'&&format!=='pdf')throw new ApiError(400,'Unsupported report format.');
 }else throw new ApiError(404,'This export is unavailable.');
 for(const k of query.keys())if(!allowed.includes(k)||query.getAll(k).length!==1)throw new ApiError(400,'Unsupported or repeated export filter.');
 const clean=new URLSearchParams();for(const [k,v]of query){if(!v||v.length>200||/[\u0000-\u001f]/.test(v))throw new ApiError(400,'Invalid export filter.');clean.set(k,v);}
 if(clean.has('role')&&!['learner','parent','teacher','school_admin','super_admin','support_admin','content_creator'].includes(clean.get('role')!))throw new ApiError(400,'Invalid account role.');
 if(clean.has('isActive')&&!['true','false'].includes(clean.get('isActive')!))throw new ApiError(400,'Invalid account status.');
 if(clean.has('status')&&!/^[-a-z_]{1,40}$/.test(clean.get('status')!))throw new ApiError(400,'Invalid payment status.');
 for(const k of ['from','to'])if(clean.has(k)){const v=clean.get(k)!;if(!/^\d{4}-\d{2}-\d{2}$/.test(v)||!Number.isFinite(Date.parse(v))||new Date(v).toISOString().slice(0,10)!==v)throw new ApiError(400,'Invalid export date.');}
 if(clean.has('from')&&clean.has('to')&&clean.get('from')!>clean.get('to')!)throw new ApiError(400,'The end date must follow the start date.');
 if(id)clean.set('format',format);
 return {kind,format,id,endpoint:'/admin/exports/'+key+(clean.size?'?'+clean:''),filename:'atupa-'+kind+(id?'-'+id:'')+'.'+format};
}
export async function exportBytes(response:Response,format:string){
 const max=32*1024*1024;if(Number(response.headers.get('content-length'))>max){await response.body?.cancel();throw new ApiError(413,'This export exceeds the current 32 MB download limit.');}
 const chunks:Uint8Array[]=[];let size=0;const reader=response.body?.getReader();if(!reader)throw new ApiError(502,'The export file is empty.');
 try{for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>max)throw new ApiError(413,'This export exceeds the current 32 MB download limit.');chunks.push(value);}}finally{await reader.cancel().catch(()=>{});}
 const bytes=new Uint8Array(size);let pos=0;for(const chunk of chunks){bytes.set(chunk,pos);pos+=chunk.length;}
 const mime=(response.headers.get('content-type')||'').split(';')[0].trim().toLowerCase();let text='';try{text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);}catch{if(format==='csv')throw new ApiError(502,'The CSV file is not readable UTF-8.');}
 // Even a 200 JSON response is an error, never a downloadable file.
 if(mime.includes('json')||/^[\s\ufeff]*[\[{]/.test(text))throw new ApiError(response.status===401?401:response.status===409?409:502,'The service returned JSON instead of an export file.');
 if(!response.ok)throw new ApiError([401,403,404,409,413].includes(response.status)?response.status:502,'The export could not be downloaded.');
 if(!size||!/^attachment(?:;|$)/i.test(response.headers.get('content-disposition')||''))throw new ApiError(502,'The service did not return an attached export file.');
 if(format==='pdf'){if(mime!=='application/pdf'||new TextDecoder().decode(bytes.slice(0,5))!=='%PDF-')throw new ApiError(502,'The PDF export could not be verified.');}
 else if(!['text/csv','application/csv','text/plain','application/octet-stream'].includes(mime)||text.includes('\0')||/^\s*</.test(text)||!text.trim())throw new ApiError(502,'The CSV export could not be verified.');
 return bytes;
}
