'use client';
import {sessionFetch} from '../auth/session-fetch';
import {ApiError,normalizeError,object} from '../api/contracts';
export async function consoleApi<T>(path:string,init:RequestInit={}):Promise<T>{if(!/^\/[\w/-]+(?:\?.*)?$/.test(path)||path.includes('..'))throw new ApiError(400,'Invalid console request.');const headers=new Headers(init.headers);if(init.body&&!(init.body instanceof FormData))headers.set('Content-Type','application/json');let r:Response;try{r=await sessionFetch('/api/console'+path,{...init,headers,signal:init.signal??AbortSignal.timeout(30000)});}catch{throw new ApiError(502,'Unable to connect. The result may be unconfirmed.');}const value=await r.json().catch(()=>null);if(!r.ok)throw normalizeError(value,r.status);return object(value).data as T;}
