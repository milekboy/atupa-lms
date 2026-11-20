import 'server-only';
import type {NextRequest} from 'next/server';
import {authenticated,responseJson} from '../api/server';
import {ApiError,normalizeError,object,safeUser} from '../api/contracts';
import {json} from '../api/http';
import {activityPage,alertInput,alertPage,alertRecord,moderationInput,moderationPage,moderationReport,trustFilters} from './trust';
export async function boundedBody(request:NextRequest,max=16384){if(!request.headers.get('content-type')?.startsWith('application/json'))throw new ApiError(400,'Send details as JSON.');const reader=request.body?.getReader(),chunks:Uint8Array[]=[];let size=0;if(reader)for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>max){await reader.cancel();throw new ApiError(413,'This request is too large.');}chunks.push(value);}const bytes=new Uint8Array(size);let pos=0;for(const c of chunks){bytes.set(c,pos);pos+=c.length;}try{return JSON.parse(new TextDecoder().decode(bytes));}catch{throw new ApiError(400,'Invalid request details.');}}
export async function trustRequest(request:NextRequest,path:string[],cookie:string,actorId:string){const kind=path[1] as 'safety-reports'|'alerts'|'activity-log',key='/'+path.join('/');
 async function read(endpoint:string){const r=await authenticated(cookie,endpoint),v=await responseJson(r);if(!r.ok)throw normalizeError(v,r.status);if(object(v).success!==true)throw new ApiError(502,'The service result could not be verified.');return object(v).data;}
 if(request.method==='GET'){
  if(path.length===3){if(request.nextUrl.search)throw new ApiError(400,'Detail filters are not supported.');const data=moderationReport(await read(key),actorId,true);if(data.id!==path[2])throw new ApiError(502,'The report does not match your selection.');return json({success:true,data});}
  const q=trustFilters(request.nextUrl.searchParams,kind),raw=await read(key+'?'+q);return json({success:true,data:kind==='safety-reports'?moderationPage(raw,actorId):kind==='alerts'?alertPage(raw):activityPage(raw)});
 }
 if(request.nextUrl.search)throw new ApiError(400,'Mutation filters are not supported.');const input=await boundedBody(request);let payload:unknown,prior:ReturnType<typeof moderationReport>|undefined;
 if(kind==='safety-reports'){
  prior=moderationReport(await read('/admin/safety-reports/'+path[2]),actorId,true);if(prior.id!==path[2])throw new ApiError(502,'The report does not match your selection.');if(prior.status==='resolved')throw new ApiError(409,'This report is already resolved. Refresh the queue.');
  payload=moderationInput(path[3],input,prior.allowedOutcomes);
  if(path[3]==='assign'){const assigneeRaw=object(object(await read('/admin/users/'+object(payload).assigneeId+'/overview')).user),assignee=safeUser(assigneeRaw);if(assigneeRaw.isActive!==true||assignee.id!==object(payload).assigneeId||!['super_admin','support_admin'].includes(assignee.role))throw new ApiError(400,'Choose a currently authorized admin assignee.');}
 }else{
  payload=alertInput(input);
  // No GET alert-by-ID is documented. PATCH remains backend-authorized; do not infer state from only the first page.
 }
 const r=await authenticated(cookie,key,{method:request.method,headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}),envelope=await responseJson(r);if(!r.ok)throw normalizeError(envelope,r.status);if(object(envelope).success!==true)throw new ApiError(502,'The change is unconfirmed. Refresh records before repeating it.');
 if(kind==='alerts'){const saved=alertRecord(object(envelope).data),expected=alertInput(input);if(saved.id!==path[2]||saved.status!==expected.status||saved.note!==expected.note||saved.handledByUserId!==actorId)throw new ApiError(502,'Alert acknowledgement could not be confirmed. Refresh records.');return json({success:true,data:saved},r.status);}
 const written=object(object(envelope).data);if(written.id!==prior!.id)throw new ApiError(502,'The response belongs to a different report. Reconcile records before trying again.');const saved=moderationReport(await read('/admin/safety-reports/'+prior!.id),actorId,true),p=object(payload);
 if(saved.reference!==prior!.reference||saved.targetId!==prior!.targetId||saved.targetType!==prior!.targetType||path[3]==='assign'&&saved.assigneeId!==p.assigneeId||path[3]==='comments'&&!saved.comments.some(c=>c.authorId===actorId&&c.body===p.body&&(saved.comments.length>prior!.comments.length||!prior!.comments.some(old=>old.authorId===c.authorId&&old.body===c.body&&old.at===c.at)))||path[3]==='resolve'&&(saved.status!=='resolved'||saved.outcome!==p.outcome||saved.outcomeNote!==p.note||saved.resolvedByUserId!==actorId||!saved.resolvedAt))throw new ApiError(502,'The saved moderation result could not be confirmed. Refresh records before repeating it.');return json({success:true,data:saved},r.status);
}
