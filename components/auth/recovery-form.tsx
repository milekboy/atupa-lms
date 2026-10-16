"use client";
import {useEffect,useState,type FormEvent} from "react";
import Link from "next/link";
import {useRouter,useSearchParams} from "next/navigation";
import {Button,Input} from "@/components/ui";
import {AccountShell} from "./account-shell";
import {PasswordField} from "./password-field";
import {accountRequest} from "@/lib/api/account-client";
export function RecoveryForm({reset=false,invitation=false}:{reset?:boolean;invitation?:boolean}){
 const router=useRouter();const params=useSearchParams();const[token]=useState(()=>params.get("token")??"");const[error,setError]=useState("");const[pending,setPending]=useState(false);const[sent,setSent]=useState(false);
 useEffect(()=>{if(reset&&params.has("token")){const url=new URL(location.href);url.searchParams.delete("token");history.replaceState(null,"",url.pathname+url.search);}},[reset,params]);
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();if(pending)return;const data=new FormData(e.currentTarget);setError("");const newPassword=String(data.get("newPassword")??"");if(reset&&newPassword!==data.get("confirmPassword")){setError("Your passwords do not match.");return;}setPending(true);try{await accountRequest(reset?"reset-password":"forgot-password",reset?{token,newPassword}:{email:String(data.get("email")??"")});if(reset){router.replace("/dashboard");router.refresh();}else setSent(true);}catch(e){setError(e instanceof Error?e.message:"Unable to complete this request.");}finally{setPending(false);}}
 const invalid=reset&&token.length!==64;
 return <AccountShell title={reset?(invitation?"Make yourself at home.":"A fresh start."):"Let’s get you back in."} eyebrow={reset?(invitation?"Accept your invitation":"Reset your password"):"Account recovery"} intro={reset?"Choose a new password for your ATUPA account.":"Enter your email and we’ll send you a link to reset your password."}>
 {invalid?<div className="login-error" role="alert">This password link is missing or invalid. <Link href="/forgot-password">Request a new link</Link>.</div>:sent?<div className="account-success" role="status"><h2>Check your inbox.</h2><p>If that email is registered, a password link has been sent. Check your spam folder too.</p><Button variant="secondary" onClick={()=>setSent(false)}>Use another email</Button></div>:<form onSubmit={submit} className="login-form"><fieldset className="account-fields" disabled={pending}>{reset?<><PasswordField name="newPassword" id="new-password" label="New password" autoComplete="new-password" required/><PasswordField name="confirmPassword" id="confirm-new-password" label="Confirm password" autoComplete="new-password" required/></>:<Input name="email" label="Email address" type="email" autoComplete="email" placeholder="you@example.com" required/>}</fieldset>{error&&<p className="login-error" role="alert">{error}{reset&&<> <Link href="/forgot-password">Request a new link</Link>.</>}</p>}<Button type="submit" className="login-submit" pending={pending}>{pending?"Please wait…":reset?"Save password and sign in":"Send reset link"}</Button></form>}
 <p className="account-switch"><Link href="/login">Return to sign in</Link></p></AccountShell>;
}
