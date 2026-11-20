import 'server-only';
import type {NextRequest} from 'next/server';
import {authenticated,responseJson} from '../api/server';
import {ApiError,normalizeError,object} from '../api/contracts';
import {json} from '../api/http';
import type {User} from '../../types/auth';
import {reviewQueue,reviewPayload,reviewPath,reviewRestriction,reviewResult} from './reviews';
async function readQueue(cookie:string){const r=await authenticated(cookie,'/admin/reviews');const value=await responseJson(r);if(!r.ok)throw normalizeError(value,r.status);if(object(value).success!==true)throw new ApiError(502,'The review queue response could not be verified.');return reviewQueue(object(value).data);}
export async function reviewsRequest(request:NextRequest,path:string[],cookie:string,user:User){if(request.nextUrl.search)throw new ApiError(400,'Review query options are not supported.');if(request.method==='GET')return json({success:true,data:await readQueue(cookie)});
 if(!request.headers.get('content-type')?.startsWith('application/json'))throw new ApiError(400,'Send a review decision as JSON.');
 const reader=request.body?.getReader();let raw='';if(reader){const decoder=new TextDecoder();let size=0;for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>16384){await reader.cancel();throw new ApiError(413,'This review decision is too large.');}raw+=decoder.decode(value,{stream:true});}raw+=decoder.decode();}
 let input:unknown;try{input=JSON.parse(raw);}catch{throw new ApiError(400,'The review decision could not be read.');}const payload=reviewPayload(input);
 // Read pending state again before mutation: client identifiers are never permission or author evidence.
 const queue=await readQueue(cookie),key='/'+path.join('/'),matches=queue.items.filter(item=>reviewPath(item)===key);if(matches.length!==1)throw new ApiError(409,'This submission is no longer pending or its details changed. Refresh the queue before deciding.');const item=matches[0];const reason=reviewRestriction(item,user);if(reason)throw new ApiError(403,reason);if(item.submittedAt!==payload.expectedSubmittedAt)throw new ApiError(409,'A newer submission is waiting. Review it again before deciding.');
 const response=await authenticated(cookie,key,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({decision:payload.decision,...(payload.comment?{comment:payload.comment}:{})})});const value=await responseJson(response);if(!response.ok)throw normalizeError(value,response.status);if(object(value).success!==true)throw new ApiError(502,'The decision result is unconfirmed. Refresh the queue before trying again.');return json({success:true,data:reviewResult(object(value).data,item.id)},response.status);
}
