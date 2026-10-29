"use client";
import {useCallback,useEffect,useRef,useState} from 'react';
import {Button} from '@/components/ui';
import {playback,type Playback} from '@/lib/media';
import './playback.css';
/* eslint-disable @next/next/no-img-element -- Provider playback URLs bypass image optimization. */
function PlaybackResource({value,label,kind,onFailure,onRetry}:{value:Playback|null;label:string;kind?:string;onFailure?:(failed:boolean)=>void;onRetry?:()=>void}){
 const [revision,setRevision]=useState(0),[failed,setFailed]=useState(false);const lastReported=useRef<boolean|null>(null);
 const media=playback(value),missing=!media||(kind&&media.kind!==kind);const signature=JSON.stringify(media);
 const report=useCallback((next:boolean)=>{setFailed(next);},[]);
 useEffect(()=>{const next=!!missing||failed;if(lastReported.current!==next){lastReported.current=next;onFailure?.(next);}},[failed,missing,onFailure]);
 const sources=media?.sources.length?media.sources:media?.optimizedUrl?[{src:media.optimizedUrl,type:''}]:[];
 // Individual <source> failures are normal during format fallback; fail only after all candidates fail.
 const failedSources=useRef(new Set<number>());
 function sourceError(index:number){failedSources.current.add(index);if(failedSources.current.size>=sources.length)report(true);}
 function retry(){if(missing)onRetry?.();failedSources.current.clear();setFailed(false);setRevision(v=>v+1);}
 const attach=useCallback((element:HTMLVideoElement|HTMLAudioElement|null)=>{if(!element)return;return ()=>{element.pause();
  // React's development ref replay keeps the same DOM node. Only a real detach
  // may discard its sources; otherwise the following setup inherits empty URLs.
  queueMicrotask(()=>{if(element.isConnected)return;element.querySelectorAll('source').forEach(source=>source.removeAttribute('src'));element.removeAttribute('src');element.load();});
 };},[]);
 return <figure className="playback-resource" key={signature}><figcaption>{label}</figcaption>{missing||failed?<div className="playback-error" role="alert"><p>We couldn’t load this {kind??media?.kind??'resource'}. The rest of your lesson is still available.</p><Button variant="secondary" onClick={retry}>Retry {kind??media?.kind??'media'}</Button></div>:media.kind==='image'?<img key={revision} src={media.optimizedUrl||media.url} alt={label} loading="lazy" referrerPolicy="no-referrer" onError={()=>report(true)} onLoad={()=>report(false)}/>:media.kind==='video'?<video key={revision} ref={attach} aria-label={label} controls playsInline preload="metadata" crossOrigin="anonymous" poster={media.thumbnailUrl||undefined} onError={e=>{if(e.target===e.currentTarget&&e.currentTarget.isConnected)report(true);}} onLoadedData={()=>report(false)}>{sources.map((s,i)=><source key={s.src} src={s.src} type={s.type||undefined} onError={e=>{if(e.currentTarget.isConnected)sourceError(i);}}/>)}Your browser cannot play this video.</video>:<audio key={revision} ref={attach} aria-label={label} controls preload="metadata" crossOrigin="anonymous" onError={e=>{if(e.target===e.currentTarget&&e.currentTarget.isConnected)report(true);}} onLoadedData={()=>report(false)}>{sources.map((s,i)=><source key={s.src} src={s.src} type={s.type||undefined} onError={e=>{if(e.currentTarget.isConnected)sourceError(i);}}/>)}Your browser cannot play this audio.</audio>}</figure>;
}

export function MediaPlayback(props:Parameters<typeof PlaybackResource>[0]){return <PlaybackResource key={JSON.stringify(props.value)+props.kind} {...props}/>;}
