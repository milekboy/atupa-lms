"use client";
import {useEffect,useState} from "react";
import {api} from "@/lib/api/client";
import {ApiError} from "@/lib/api/contracts";
import {EmptyState,ErrorState,Modal,Skeleton} from "@/components/ui";
import {formatDate} from "@/lib/formatters";
type Notification={id:string;title:string;body:string;createdAt:string;readAt:string|null};
export function NotificationsPanel({open,onClose}:{open:boolean;onClose:()=>void}){
 const [items,setItems]=useState<Notification[]>([]);const[loading,setLoading]=useState(true);const[error,setError]=useState("");const[version,setVersion]=useState(0);const[total,setTotal]=useState(0);
 useEffect(()=>{if(!open)return;let active=true;api<{items:Notification[];total:number}>("/notifications?page=1&limit=10").then(value=>{if(!Array.isArray(value.items)||typeof value.total!=="number")throw new Error("Notifications could not be read.");if(active){setItems(value.items);setTotal(value.total);setError("");}}).catch(e=>{if(active)setError(e instanceof ApiError&&e.status===403?"Notifications are not available for this account.":e instanceof Error?e.message:"Notifications could not be loaded.");}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[open,version]);
 function retry(){setLoading(true);setVersion(v=>v+1);}
 return <Modal open={open} onClose={onClose} title="Your notifications" description="Recent updates for your account.">{loading?<Skeleton label="Loading notifications"/>:error?<ErrorState description={error} onRetry={retry}/>:items.length?<><p className="small muted">Showing {items.length} of {total} notifications.</p><ul className="shell-notifications">{items.map(item=><li key={item.id}><div><h3>{item.title}</h3>{!item.readAt&&<span className="notification-unread">Unread</span>}</div><p>{item.body}</p><time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time></li>)}</ul></>:<EmptyState title="You're all caught up" description="Your updates will appear here when there is something new."/>}</Modal>;
}
