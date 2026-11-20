import {createHash,createHmac,timingSafeEqual} from 'node:crypto';
import {ApiError} from '../api/contracts';
import type {BulkInput} from './onboarding';
export const receiptCookie='atupa_import_check';
export const receiptPath='/api/console/admin/learners/bulk';
function key(){const key=process.env.SESSION_SECRET;if(!key||key.length<32)throw new ApiError(503,'Import validation is not configured.');return key;}
function fingerprint(input:BulkInput,session:string){return createHash('sha256').update(JSON.stringify([session,input.csv,input.classId])).digest('hex');}
export function issueReceipt(input:BulkInput,session:string,now=Date.now()){const payload=JSON.stringify({hash:fingerprint(input,session),expires:now+600000});const encoded=Buffer.from(payload).toString('base64url');return encoded+'.'+createHmac('sha256',key()).update(encoded).digest('base64url');}
export function verifyReceipt(token:string|undefined,input:BulkInput,session:string,now=Date.now()){
 if(!token)return false;const [encoded,signature,...extra]=token.split('.');if(extra.length||!encoded||!signature)return false;
 const expected=createHmac('sha256',key()).update(encoded).digest();const actual=Buffer.from(signature,'base64url');if(actual.length!==expected.length||!timingSafeEqual(actual,expected))return false;
 try{const x=JSON.parse(Buffer.from(encoded,'base64url').toString());return Number.isSafeInteger(x.expires)&&x.expires>now&&x.expires<=now+600000&&x.hash===fingerprint(input,session);}catch{return false;}
}
