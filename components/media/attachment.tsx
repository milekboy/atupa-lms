"use client";
import {useState} from 'react';
import {Button,Modal} from '@/components/ui';
import {MediaPicker} from './media-library';
import {MediaPlayback} from './playback';
import {attachmentPayload,playback,type MediaKind} from '@/lib/media';
export function MediaAttachment({kind,assetId,existing,label,onSelect,disabled=false}:{kind:MediaKind;assetId?:string;existing?:unknown;label:string;onSelect:(id:string,preview:unknown)=>void;disabled?:boolean}){
 const [open,setOpen]=useState(false),[error,setError]=useState('');
 const media=playback(existing);return <section className="author-block"><p>{label}</p>{assetId&&<p className="muted small">Saved resource: {assetId}</p>}{media&&<MediaPlayback value={media} kind={kind} label={label}/>}<Button variant="secondary" disabled={disabled} onClick={()=>setOpen(true)}>{assetId||media?'Replace':'Choose or upload'} {kind}</Button>{error&&<p role="alert" className="field-error">{error}</p>}<Modal open={open} onClose={()=>setOpen(false)} title={`Choose ${kind}`}><MediaPicker allowedKinds={[kind]} onSelect={item=>{try{if(item.kind!==kind)throw new Error(`Choose an ${kind} resource.`);attachmentPayload(kind,item.id);onSelect(item.id,item.playback??item);setError('');setOpen(false);}catch(e){setError((e as Error).message);}}}/></Modal></section>;
}
