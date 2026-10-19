"use client";
import {createContext,useContext,useEffect,useState,type ReactNode} from "react";
import Link from "next/link";
import {ApiError,object,safeUser} from "@/lib/api/contracts";
import {sessionFetch} from "@/lib/auth/session-fetch";
import {sessionEvent,sessionSource} from "@/lib/auth/session-events";
import type {User} from "@/types/auth";
type PublicSession={status:'checking'|'authenticated'|'anonymous'|'unavailable';user:User|null};
const Context=createContext<PublicSession>({status:'checking',user:null});
export const usePublicSession=()=>useContext(Context);
export function PublicSessionProvider({children}:{children:ReactNode}){
 const [session,setSession]=useState<PublicSession>({status:'checking',user:null});
 useEffect(()=>{let live=true,generation=0;async function check(){const current=++generation;try{const response=await sessionFetch('/api/auth/session',{cache:'no-store'});if(!live||current!==generation)return;if(response.status===401){setSession({status:'anonymous',user:null});return;}if(!response.ok)throw new Error();const body=object(await response.json());if(body.success!==true)throw new Error();const user=safeUser(object(body.data).user);if(live&&current===generation)setSession({status:'authenticated',user});}catch(e){if(live&&current===generation)setSession({status:e instanceof ApiError&&e.status===401?'anonymous':'unavailable',user:null});}}
 const recheck=()=>{if(document.visibilityState==='visible')void check();};
 let channel:BroadcastChannel|null=null;try{if(typeof BroadcastChannel!=='undefined')channel=new BroadcastChannel(sessionEvent);}catch{/* Focus/session events still work when cross-tab messaging is blocked. */}if(channel)channel.onmessage=event=>{if(event.data?.source!==sessionSource())void check();};
 window.addEventListener(sessionEvent,recheck);window.addEventListener('focus',recheck);window.addEventListener('pageshow',recheck);document.addEventListener('visibilitychange',recheck);void check();
 return()=>{live=false;generation++;channel?.close();window.removeEventListener(sessionEvent,recheck);window.removeEventListener('focus',recheck);window.removeEventListener('pageshow',recheck);document.removeEventListener('visibilitychange',recheck);};
 },[]);
 return <Context.Provider value={session}>{children}</Context.Provider>;
}
export function PublicAccountActions(){const {status}=usePublicSession();if(status==='authenticated')return <><Link href="/dashboard" className="public-sign-in">Dashboard</Link><Link href="/dashboard/profile" className="button button-primary public-join">My account</Link></>;if(status==='anonymous')return <><Link href="/login" className="public-sign-in">Sign in</Link><Link href="/register" className="button button-primary public-join">Get started</Link></>;if(status==='checking')return <span className="public-account-pending" role="status" aria-label="Checking your session">Account…</span>;return <Link href="/dashboard" className="public-sign-in">Workspace</Link>;}
export function PublicFooterAccounts(){const {status}=usePublicSession();return status==='authenticated'?<><Link href="/dashboard">My dashboard</Link><Link href="/dashboard/profile">My account</Link></>:status==='anonymous'?<><Link href="/register">Join ATUPA</Link><Link href="/register/school">Register your school</Link><Link href="/login">Sign in</Link></>:<Link href="/dashboard">My workspace</Link>;}
export function CourseAccountActions({courseId}:{courseId:string}){const {status,user}=usePublicSession(),target=`/dashboard/courses/${courseId}`;if(status==='checking')return <p className="muted" role="status">Checking your learning access…</p>;if(status==='authenticated')return <><p>{user?.role==='learner'?'Continue with your signed-in learning account.':'You’re browsing the published course outline.'}</p><Link className="button button-primary" href={user?.role==='learner'?target:'/dashboard'}>{user?.role==='learner'?'Open in your learning space':'Back to dashboard'}</Link></>;if(status==='anonymous')return <><p>Create a learner account or sign in to your ATUPA workspace.</p><Link className="button button-primary" href={`/login?returnTo=${encodeURIComponent(target)}`}>Sign in to start learning</Link><Link className="button button-secondary" href="/register">Create an account</Link></>;return <Link className="button button-primary" href={target}>Open your learning space</Link>;}
