"use client";
import {useEffect,useRef,useState} from "react";
import {api} from "@/lib/api/client";
import {object} from "@/lib/api/contracts";
import {ActiveClock,blockPosition} from "@/lib/learning/telemetry";
import {Button} from "@/components/ui";
type Position={lastBlockIndex:number;progressPercent:number};
export function LessonTracking({lessonId,completed,count,beforeCompleteRef}:{lessonId:string;completed:boolean;count:number;beforeCompleteRef:React.MutableRefObject<(resume?:boolean)=>Promise<void>>}){
 const [ready,setReady]=useState(false),[saved,setSaved]=useState<Position|null>(null),[message,setMessage]=useState('Checking your saved place…');const disabled=useRef(completed);
 useEffect(()=>{let live=true;api('/progress/continue').then(raw=>{const v=object(raw);if(!live)return;if(v.lessonId===lessonId&&v.completed!==true&&Number.isInteger(v.lastBlockIndex)&&Number(v.lastBlockIndex)>=0&&Number(v.lastBlockIndex)<count){setSaved({lastBlockIndex:Number(v.lastBlockIndex),progressPercent:Number(v.progressPercent)||0});setMessage('Pick up where you left off.');}else{setReady(true);setMessage('');}}).catch(()=>{if(live)setMessage('Your saved place is unavailable. You can read from the beginning.');});return()=>{live=false;};},[lessonId,count]);
 useEffect(()=>{disabled.current=completed;},[completed]);
 useEffect(()=>{if(!ready||completed||!count)return;let live=true,timer:ReturnType<typeof setTimeout>|undefined,pending:Position|null=null,flight:Promise<void>|null=null,last=-1;
 async function flush(){if(flight){await flight;return flush();}if(!pending||disabled.current)return;const value=pending;pending=null;flight=(async()=>{try{const r=object(await api(`/progress/lessons/${lessonId}/position`,{method:'PUT',body:JSON.stringify(value)}));if(r.lessonId!==lessonId)throw new Error();if(live)setMessage('Reading place saved');}catch{if(live)setMessage('Your reading place could not be saved. Keep this tab open to continue.');}})();await flight;flight=null;}
 beforeCompleteRef.current=async(resume)=>{if(resume){disabled.current=false;return;}clearTimeout(timer);await flush();disabled.current=true;};
 const observer=new IntersectionObserver(entries=>{if(disabled.current||document.visibilityState!=='visible'||!document.hasFocus())return;const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>Math.abs((a.boundingClientRect.top+a.boundingClientRect.bottom)/2-window.innerHeight/2)-Math.abs((b.boundingClientRect.top+b.boundingClientRect.bottom)/2-window.innerHeight/2))[0];if(!visible)return;const index=Number((visible.target as HTMLElement).dataset.learningBlock);if(index===last)return;last=index;pending=blockPosition(index,count);clearTimeout(timer);timer=setTimeout(()=>void flush(),1000);},{threshold:[.15,.5,.8]});document.querySelectorAll('[data-learning-block]').forEach(el=>observer.observe(el));
 return()=>{live=false;disabled.current=true;clearTimeout(timer);observer.disconnect();beforeCompleteRef.current=async()=>{};};
 },[ready,completed,count,lessonId,beforeCompleteRef]);
 useLearningTime(ready);
 function begin(resume:boolean){if(resume&&saved)document.querySelector(`[data-learning-block="${saved.lastBlockIndex}"]`)?.scrollIntoView({block:'center',behavior:'instant'});setReady(true);setSaved(null);setMessage('');}
 return <aside className="learning-position" aria-label="Reading place"><p role="status">{message}</p>{!ready&&!completed&&<div className="author-actions">{saved&&<Button variant="secondary" onClick={()=>begin(true)}>Resume saved position</Button>}<Button variant="ghost" onClick={()=>begin(false)}>Read from the beginning</Button></div>}</aside>;
}

export function useLearningTime(enabled:boolean){
 useEffect(()=>{if(!enabled)return;let cancelled=false,acquiring=false,release:(()=>void)|undefined,interval:ReturnType<typeof setInterval>|undefined;const abort=new AbortController();let lastInput=performance.now();const clock=new ActiveClock();let posting=false;
 const input=()=>{lastInput=performance.now();};const visibility=()=>{clock.tick(performance.now(),false);if(document.visibilityState!=='visible'||!document.hasFocus())release?.();};['pointerdown','keydown','scroll','touchstart'].forEach(e=>window.addEventListener(e,input,{passive:true,capture:true}));document.addEventListener('visibilitychange',visibility);window.addEventListener('blur',visibility);
 // A single owner per origin prevents parallel tabs counting the same time. Unsupported browsers skip telemetry.
 async function acquire(){if(acquiring||!navigator.locks||cancelled||document.visibilityState!=='visible'||!document.hasFocus())return;acquiring=true;await navigator.locks.request('atupa-active-learning-time',{signal:abort.signal},async()=>{if(cancelled||document.visibilityState!=='visible'||!document.hasFocus())return;lastInput=performance.now();interval=setInterval(()=>{const now=performance.now(),eligible=document.visibilityState==='visible'&&document.hasFocus()&&now-lastInput<45000;clock.tick(now,eligible);if(!eligible||posting)return;const seconds=clock.take();if(seconds<1)return;posting=true;void api('/progress/heartbeat',{method:'POST',body:JSON.stringify({seconds})}).catch(()=>{/* Ambiguous increments must never be retried. */}).finally(()=>{posting=false;});},5000);await new Promise<void>(resolve=>{release=resolve;});}).catch(()=>{});clearInterval(interval);release=undefined;acquiring=false;}
 const regain=()=>{void acquire();};window.addEventListener('focus',regain);document.addEventListener('visibilitychange',regain);void acquire();
 return()=>{cancelled=true;window.removeEventListener('focus',regain);document.removeEventListener('visibilitychange',regain);abort.abort();clearInterval(interval);release?.();['pointerdown','keydown','scroll','touchstart'].forEach(e=>window.removeEventListener(e,input,true));document.removeEventListener('visibilitychange',visibility);window.removeEventListener('blur',visibility);};
 },[enabled]);
}
