"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import {HiOutlineArrowUpTray,HiOutlinePhoto} from "react-icons/hi2";
import {toast} from "react-toastify";
import {api} from "@/lib/api/client";
import {directTicket,mediaItem,mediaPage,validateFile,type MediaItem,type MediaKind} from "@/lib/media";
import {Button,Input,Modal,PageSection} from "@/components/ui";

/* Media URLs are signed/provider-hosted and must be fetched without the Next image optimizer. */
/* eslint-disable @next/next/no-img-element */
export function MediaPreview({item}:{item:MediaItem}){return item.kind==="image"? <img className="media-preview" src={item.url} alt={item.name} loading="lazy" referrerPolicy="no-referrer"/>:item.kind==="audio"?<audio className="media-preview" src={item.url} controls preload="metadata"/>:<video className="media-preview" src={item.url} controls preload="metadata" playsInline/>;}
function FilePreview({file,onCancel,disabled}:{file:File;onCancel?:()=>void;disabled?:boolean}){
 const [failed,setFailed]=useState(false);
 const attach=useCallback((node:HTMLImageElement|HTMLAudioElement|HTMLVideoElement|null)=>{
  if(!node)return;
  const url=URL.createObjectURL(file);node.src=url;
  return ()=>{if(node instanceof HTMLMediaElement)node.pause();node.removeAttribute("src");URL.revokeObjectURL(url);};
 },[file]);
 const kind=file.type.split("/")[0];
 return <figure className="media-file-preview"><figcaption><span className="eyebrow">Preview before upload</span><strong>{file.name}</strong><span className="muted">{kind} · {(file.size/1024/1024).toFixed(2)} MB</span></figcaption>
 {failed?<p role="status">This browser cannot preview this file. You can still upload a supported format.</p>:kind==="image"?<img ref={attach} alt={file.name} onError={()=>setFailed(true)}/>:kind==="audio"?<audio ref={attach} controls preload="metadata" onError={()=>setFailed(true)}/>:<video ref={attach} controls preload="metadata" playsInline onError={()=>setFailed(true)}/>}
 {onCancel&&<div className="media-preview-actions"><Button variant="secondary" disabled={disabled} onClick={onCancel}>Cancel selection</Button></div>}
 </figure>;
}
type Props={onSelect?:(item:MediaItem)=>void;allowedKinds?:MediaKind[]};
export function MediaLibrary({onSelect,allowedKinds}:Props){
 const [items,setItems]=useState<MediaItem[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[page,setPage]=useState(1),[total,setTotal]=useState(0),[limit,setLimit]=useState(20);
 const [detail,setDetail]=useState<MediaItem|null>(null),[deleteName,setDeleteName]=useState(""),[deleting,setDeleting]=useState(false),[detailError,setDetailError]=useState("");
 const [file,setFile]=useState<File|null>(null),[uploadError,setUploadError]=useState(""),[status,setStatus]=useState(""),[busy,setBusy]=useState(false),[progress,setProgress]=useState<number|null>(null),[confirmation,setConfirmation]=useState<{publicId:string;kind:MediaKind}|null>(null);
 const [selection,setSelection]=useState(0);
 const lock=useRef(false),input=useRef<HTMLInputElement>(null); const [revision,setRevision]=useState(0);
 const reload=useCallback(()=>{setLoading(true);setError("");setRevision(v=>v+1);},[]);
 function cancelSelection(){if(lock.current||confirmation)return;setFile(null);setUploadError("");setStatus("");setProgress(null);if(input.current)input.current.value="";document.getElementById("media-choose-button")?.focus();}
 function changePage(delta:number){setLoading(true);setError("");setPage(v=>v+delta);}
 useEffect(()=>{let active=true;api<unknown>(`/media?page=${page}&limit=20`).then(value=>{const data=mediaPage(value);if(active){setItems(data.items);setTotal(data.total);setLimit(data.limit);}}).catch(e=>{if(active)setError(e.message);}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[page,revision]);
 async function open(item:MediaItem){setDetail(item);setDetailError("");setDeleteName("");setDeleting(true);try{setDetail(mediaItem(await api(`/media/${item.id}`)));}catch(e){setDetailError((e as Error).message);}finally{setDeleting(false);}}
 async function remove(){if(!detail||deleteName!==detail.name||lock.current)return;lock.current=true;setDeleting(true);setDetailError("");try{await api(`/media/${detail.id}`,{method:"DELETE"});setDetail(null);setStatus("Media deleted.");reload();}catch(e){setDetailError((e as Error).message);}finally{lock.current=false;setDeleting(false);}}
 async function upload(){if(lock.current||(!file&&!confirmation))return;lock.current=true;setBusy(true);setUploadError("");setProgress(null);
  try{let pending=confirmation;
   if(!pending&&file){const kind=validateFile(file);setStatus("Requesting upload access…");const ticket=await api<{mode:string}>("/media/uploads",{method:"POST",body:JSON.stringify({kind,purpose:"content"})});
    if(ticket.mode==="server"){if(file.size>4*1024*1024)throw new Error("Server uploads on this hosting are limited to 4 MB. Ask the backend team to enable direct uploads for larger files.");const form=new FormData();form.append("file",file);form.append("purpose","content");setStatus("Uploading file…");mediaItem(await api("/media/upload",{method:"POST",body:form}));}
    else if(ticket.mode==="direct"){const direct=directTicket(ticket);const allowed=direct.fields.allowed_formats?.split(",");if(allowed&&!allowed.includes(file.name.split(".").pop()!.toLowerCase()))throw new Error("This file format is not allowed by the upload provider.");setStatus("Uploading file…");const form=new FormData();Object.entries(direct.fields).forEach(([key,value])=>form.append(key,value));form.append("file",file);
     const result=await new Promise<{public_id?:unknown}>((resolve,reject)=>{const xhr=new XMLHttpRequest();xhr.open("POST",direct.uploadUrl);xhr.withCredentials=false;xhr.timeout=120000;xhr.upload.onprogress=e=>{if(e.lengthComputable)setProgress(Math.round(e.loaded/e.total*100));};xhr.onerror=()=>reject(new Error("Upload interrupted. Refresh the library before retrying to avoid a duplicate upload."));xhr.ontimeout=()=>reject(new Error("Upload timed out. Refresh the library before retrying."));xhr.onload=()=>{if(xhr.status<200||xhr.status>=300){reject(new Error("The upload provider rejected this file. Please retry."));return;}try{resolve(JSON.parse(xhr.responseText));}catch{reject(new Error("The upload provider returned an unsupported response."));}};xhr.send(form);});
     if(typeof result.public_id!=="string"||!result.public_id.startsWith(direct.folder+"/"))throw new Error("The uploaded file identifier does not match its ticket.");pending={publicId:result.public_id,kind};setConfirmation(pending);
    }else throw new Error("The backend returned an unsupported upload mode.");
   }
   if(pending){setStatus("Confirming uploaded media…");await api("/media/uploads/confirm",{method:"POST",body:JSON.stringify({...pending,purpose:"content"})});setConfirmation(null);}
   setConfirmation(null);setProgress(null);setFile(null);if(input.current)input.current.value="";setStatus("");toast.success("Upload saved to your media library.");reload();
  }catch(e){const message=e instanceof Error?e.message:"Upload failed. Please try again.";setUploadError(message);setStatus("");toast.error(message);}finally{lock.current=false;setBusy(false);}
 }
 const shown=items.filter(item=>!allowedKinds||allowedKinds.includes(item.kind));
 return <PageSection><header><p className="eyebrow">Your creative resources</p><h1>Media library</h1><p className="muted">Keep the images, sounds and videos that bring your lessons to life.</p></header>
 <section className="media-upload" aria-labelledby="media-upload-title"><HiOutlineArrowUpTray aria-hidden="true"/><div><h2 id="media-upload-title">Upload a resource</h2><p className="muted">Images, audio and video · up to 25 MB with direct uploads. Server uploads: 4 MB.</p><div className="media-file-chooser"><input ref={input} id="media-file" aria-label="Choose a resource file" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif,audio/mpeg,audio/wav,audio/ogg,audio/mp4,audio/aac,video/mp4,video/webm,video/quicktime" disabled={busy||!!confirmation} onChange={e=>{const chosen=e.target.files?.[0];if(!chosen)return;setSelection(v=>v+1);setStatus("");try{validateFile(chosen);setFile(chosen);setUploadError("");}catch(error){setFile(null);setUploadError((error as Error).message);toast.error((error as Error).message);e.target.value="";}}}/><Button id="media-choose-button" variant="secondary" disabled={busy||!!confirmation} onClick={()=>input.current?.click()}><HiOutlinePhoto aria-hidden="true"/>{file?"Choose another file":"Choose a file"}</Button><span className="muted">Select an image, audio clip or video</span></div>{file&&<FilePreview key={selection} file={file} disabled={busy} onCancel={file&&!confirmation?cancelSelection:undefined}/>}{uploadError&&<p role="alert" className="field-error">{uploadError}</p>}{confirmation&&<p>The file has reached the provider. Retry confirmation to save it without uploading again.</p>}<p role="status">{status}</p>{progress!==null&&busy&&<progress value={progress} max="100" aria-label="Upload progress"/>}<Button pending={busy} disabled={!file&&!confirmation} onClick={upload}>{confirmation?"Retry confirmation":"Upload resource"}</Button></div></section>
 <div className="media-toolbar"><h2>Your resources</h2><Button variant="secondary" onClick={reload} disabled={loading}>Refresh library</Button></div>
 {loading?<p role="status">Loading your media…</p>:error?<div role="alert"><p>{error}</p><Button onClick={reload}>Try again</Button></div>:shown.length===0?<div className="media-empty"><HiOutlinePhoto aria-hidden="true"/><h3>No resources here yet</h3><p>{items.length?"There are no matching media types on this page.":"Upload your first image, audio clip or video to get started."}</p></div>:<div className="media-grid">{shown.map(item=><article className="media-card" key={item.id}><MediaPreview item={item}/><div><span className="eyebrow">{item.kind}</span><h3>{item.name}</h3><Button variant="secondary" onClick={()=>open(item)}>View resource</Button></div></article>)}</div>}
 <nav className="media-toolbar" aria-label="Media pages"><Button variant="secondary" disabled={loading||page<=1} onClick={()=>changePage(-1)}>Previous</Button><span>Page {page}{!loading&&!error?` · ${total} resources`:""}</span><Button variant="secondary" disabled={loading||page*limit>=total} onClick={()=>changePage(1)}>Next</Button></nav>
 <Modal open={!!detail} title="Resource details" busy={deleting} onClose={()=>setDetail(null)}>{detail&&<><MediaPreview item={detail}/><h3>{detail.name}</h3><p className="muted">{detail.kind} · ID: {detail.id}</p>{detailError&&<p role="alert" className="field-error">{detailError}</p>}{onSelect&&<Button disabled={deleting||!!detailError} onClick={()=>onSelect(detail)}>Use this resource</Button>}<hr/><h3>Delete resource</h3><p>Type <strong>{detail.name}</strong> to confirm. The backend may refuse deletion if this resource is in use.</p><Input label="Resource name to confirm deletion" value={deleteName} onChange={e=>setDeleteName(e.target.value)} disabled={deleting}/><Button variant="danger" pending={deleting} disabled={deleteName!==detail.name||!!detailError} onClick={remove}>Delete resource</Button></>}</Modal>
 </PageSection>;
}
// Embed this picker in future authoring forms; only the backend media ID should be saved.
export function MediaPicker(props:Props&{onSelect:(item:MediaItem)=>void}){return <MediaLibrary {...props}/>;}
