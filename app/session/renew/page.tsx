"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {safeReturnTo} from "@/lib/auth/roles";
import {sessionFetch} from "@/lib/auth/session-fetch";
export default function RenewSession(){const[error,setError]=useState("");useEffect(()=>{let active=true;const target=safeReturnTo(new URLSearchParams(location.search).get("returnTo"));if(!navigator.locks){location.replace("/login?returnTo="+encodeURIComponent(target));return;}sessionFetch("/api/auth/refresh",{method:"POST"},false).then(async r=>{if(!active)return;if(r.ok)location.replace(target);else if(r.status===401)location.replace("/login?returnTo="+encodeURIComponent(target));else setError("Your session couldn't be renewed. Please try signing in again.");}).catch(()=>{if(active)setError("Unable to connect. Please try signing in again.");});return()=>{active=false;};},[]);return <main id="main-content" className="preview-main"><div className="panel"><h1>{error?"Let's reconnect.":"Welcome back."}</h1><p role="status">{error||"Renewing your session…"}</p>{error&&<Link href="/login" className="button button-primary">Sign in</Link>}</div></main>;}
