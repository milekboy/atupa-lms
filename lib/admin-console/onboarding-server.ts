import 'server-only';
import type {NextRequest} from 'next/server';
import {authenticated,responseJson} from '../api/server';
import {ApiError,normalizeError,object} from '../api/contracts';
import {json} from '../api/http';
import {classroom,page} from '../school/contracts';
import {bulkInput,bulkLimit,bulkResult,classCreate} from './onboarding';
import {issueReceipt,verifyReceipt,receiptCookie,receiptPath} from './import-receipt';
export function onboardingRule(path:string[],method:string,role:string){const p=path.join('/');return role==='super_admin'&&(p==='admin/learners/bulk'&&method==='POST'||p==='admin/learners/bulk/template'&&method==='GET'||p==='classes'&&['GET','POST'].includes(method))?'users.manage':null;}
async function bounded(request:Request,max:number){const reader=request.body?.getReader();if(!reader)return new Uint8Array();const chunks:Uint8Array[]=[];let length=0;for(;;){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>max){await reader.cancel();throw new ApiError(413,'This upload is too large. Use CSV up to 512 KB.');}chunks.push(value);}const raw=new Uint8Array(length);let offset=0;for(const chunk of chunks){raw.set(chunk,offset);offset+=chunk.length;}return raw;}
const cookieOptions={httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict' as const,path:receiptPath};
export async function onboardingRequest(request:NextRequest,path:string[],session:string){const p=path.join('/');
 if(p==='admin/learners/bulk/template'){
  if(request.nextUrl.search)throw new ApiError(400,'Template filters are not supported.');
  const r=await authenticated(session,'/'+p);if(!r.ok)throw normalizeError(await responseJson(r),r.status);
  const mime=(r.headers.get('content-type')||'').split(';')[0];if(!['text/csv','application/csv','text/plain'].includes(mime)||!r.headers.get('content-disposition')?.includes('attachment'))throw new ApiError(502,'The service did not return a CSV template.');
  const data=await bounded(new Request('http://localhost',{method:'POST',body:r.body,duplex:'half'} as RequestInit),65536);
  if(!data.length)throw new ApiError(502,'The CSV template was empty.');
  return new Response(data,{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="atupa-learners-template.csv"','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
 }
 if(p==='classes'){
  let endpoint='/classes',body:BodyInit|undefined;
  if(request.method==='GET'){const q=request.nextUrl.searchParams;if([...q.keys()].some(k=>!['page','limit'].includes(k)))throw new ApiError(400,'Invalid class filter.');for(const [key,max,fallback]of [['page',10000,1],['limit',100,20]] as const){const n=Number(q.get(key)||fallback);if(!Number.isInteger(n)||n<1||n>max)throw new ApiError(400,'Invalid pagination.');}endpoint+='?'+q;}
  else{let x;try{x=JSON.parse(new TextDecoder().decode(await bounded(request,16384)));}catch(e){if(e instanceof ApiError)throw e;throw new ApiError(400,'Invalid class details.');}body=JSON.stringify(classCreate(x));}
  const r=await authenticated(session,endpoint,{method:request.method,headers:{'Content-Type':'application/json'},body});const v=await responseJson(r);if(!r.ok)throw normalizeError(v,r.status);return json({success:true,data:request.method==='GET'?page(object(v).data,classroom):classroom(object(v).data)},r.status);
 }
 const expire=(response:ReturnType<typeof json>)=>{response.cookies.set(receiptCookie,'',{...cookieOptions,maxAge:0});return response;};
 try{
  if(request.nextUrl.search)throw new ApiError(400,'Import query options are not supported.');
  if(!request.headers.get('content-type')?.startsWith('multipart/form-data'))throw new ApiError(400,'Send a CSV file or CSV text.');
  const raw=await bounded(request,bulkLimit+65536);let form:FormData;
  try{form=await new Request('http://localhost',{method:'POST',headers:{'Content-Type':request.headers.get('content-type')!},body:raw}).formData();}catch{throw new ApiError(400,'The CSV upload could not be read.');}
  const file=form.get('file');if(file){if(form.has('csv')||!(file instanceof File)||!file.size||file.size>bulkLimit||!file.name.toLowerCase().endsWith('.csv'))throw new ApiError(400,'Choose one CSV file up to 512 KB, or paste CSV text.');if(form.getAll('file').length!==1)throw new ApiError(400,'Choose one CSV file.');form.delete('file');form.set('csv',await file.text());}
  const input=bulkInput(form);if(!input.dryRun&&!verifyReceipt(request.cookies.get(receiptCookie)?.value,input,session))throw new ApiError(409,'Validate these exact rows and class again before saving.');
  // Forward only the documented fields; the backend validates rows and class authorization again.
  const clean=new FormData();clean.set('csv',input.csv);clean.set('dryRun',String(input.dryRun));if(input.classId)clean.set('classId',input.classId);
  const r=await authenticated(session,'/admin/learners/bulk',{method:'POST',body:clean});const v=await responseJson(r);if(!r.ok)throw normalizeError(v,r.status);const result=bulkResult(object(v).data,input.dryRun);const response=expire(json({success:true,data:result},r.status));
  if(input.dryRun&&result.total>0&&result.failed===0&&result.valid===result.total)response.cookies.set(receiptCookie,issueReceipt(input,session),{...cookieOptions,maxAge:600});return response;
 }catch(error){const e=error instanceof ApiError?error:new ApiError(503,'The import outcome is unconfirmed. Check learner records before trying again.');return expire(json({success:false,message:e.message,...(e.errors?{errors:e.errors}:{})},e.status));}
}
