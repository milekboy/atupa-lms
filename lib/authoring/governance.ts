import {object} from '../api/contracts';
export type ReviewState={status?:string;decision?:string;submittedAt?:string;submittedByUserId?:string;reviewedAt?:string;reviewedByUserId?:string;comment?:string;reason?:string};
export type ContentGovernance={visibility?:string|null;ownerType?:string|null;createdByUserId?:string|null;schoolId?:string|null;publishedAt?:string|null;review?:ReviewState|null;publicRequest?:ReviewState&{requestedAt?:string;requestedByUserId?:string}|null;submittedForReview?:boolean;requestedPublic?:boolean};
function fields(value:unknown,keys:readonly string[]){const v=object(value);return Object.fromEntries(keys.flatMap(key=>typeof v[key]==='string'?[[key,v[key]]]:[])) as Record<string,string>;}
export function governance(value:unknown):ContentGovernance{const v=object(value),out:ContentGovernance={};for(const key of ['visibility','ownerType','createdByUserId','schoolId','publishedAt'] as const){if(v[key]===null||typeof v[key]==='string')out[key]=v[key] as string|null;}
 for(const key of ['submittedForReview','requestedPublic'] as const)if(typeof v[key]==='boolean')out[key]=v[key] as boolean;
 for(const key of ['review','publicRequest'] as const)if(v[key]===null)out[key]=null;else if(v[key]&&typeof v[key]==='object'&&!Array.isArray(v[key]))out[key]=fields(v[key],['status','decision','submittedAt','submittedByUserId','reviewedAt','reviewedByUserId','comment','reason',...(key==='publicRequest'?['requestedAt','requestedByUserId']:[])]);
 return out;
}
export function publicationMessage(kind:string,value:{status:string;submittedForReview?:boolean}){if(value.submittedForReview===true||value.status==='in_review')return `${kind} submitted for review.`;if(value.status==='published')return `${kind} published.`;if(value.status==='draft')return `${kind} is a draft.`;return `${kind} status: ${value.status||'not provided'}.`;}
