"use client";
import {useRef,useState} from 'react';
import {Button} from '@/components/ui';
import {sessionFetch} from '@/lib/auth/session-fetch';
export function ExportButton({path,label='Download CSV',disabled=false,reason}:{path:string;label?:string;disabled?:boolean;reason?:string}){const lock=useRef(false),[pending,setPending]=useState(false),[error,setError]=useState('');async function download(){if(lock.current)return;lock.current=true;setPending(true);setError('');try{
 const r=await sessionFetch('/api/admin-export'+path,{credentials:'same-origin',signal:AbortSignal.timeout(60000)});if(!r.ok){const v=await r.json().catch(()=>null);throw Error(v?.message||'The export could not be downloaded.');}
 const mime=r.headers.get('content-type')||'';if(!/^(text\/csv|application\/pdf)(;|$)/.test(mime))throw Error('The service did not return a supported file.');
 const blob=await r.blob();if(!blob.size)throw Error('The export file is empty.');const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=/filename="([\w.-]+)"/.exec(r.headers.get('content-disposition')||'')?.[1]||'atupa-export.'+(mime.startsWith('application/pdf')?'pdf':'csv');document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }catch(e){setError(e instanceof Error?e.message:'Download unavailable.');}finally{lock.current=false;setPending(false);}}return <span className="insights-controls"><Button variant="secondary" disabled={disabled||pending} onClick={download}>{pending?'Preparing download…':label}</Button>{disabled&&reason&&<span className="small muted"> {reason}</span>}{error&&<span role="alert"> {error}</span>}</span>;}
