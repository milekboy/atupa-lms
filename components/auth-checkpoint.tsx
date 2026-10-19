"use client";
import {BrandLogo} from "@/components/brand-logo";
import {sessionFetch} from "@/lib/auth/session-fetch";
import { useState,type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button,Input,IconButton } from "./ui";
import { FiEye, FiEyeOff, FiArrowRight, FiSun, FiMoon, FiLock, FiArrowLeft } from "react-icons/fi";
import { useTheme } from "./providers";
import { safeReturnTo } from "@/lib/auth/roles";
export function LoginCheckpoint() {
  const {dark,toggle}=useTheme(); const [showPassword,setShowPassword]=useState(false);
  const router=useRouter(); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");const [pending,setPending]=useState(false);const [error,setError]=useState("");
  async function submit(event:FormEvent) {event.preventDefault();if(pending)return;setPending(true);setError("");try{const response=await sessionFetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password}),signal:AbortSignal.timeout(30000)});const value=await response.json();if(!response.ok){setError(value.message??"Unable to log in.");return;}setPassword("");router.replace(safeReturnTo(new URLSearchParams(location.search).get("returnTo")));router.refresh();}catch{setError("Unable to connect. Please try again.");}finally{setPending(false);}}
  return <main id="main-content" className="login-page">
    <section className="login-shell" aria-label="Sign in to ATUPA LMS">
      <div className="login-form-panel">
        <div className="login-topbar">
          <Link href="/" className="wordmark" aria-label="ATUPA LMS home"><BrandLogo tagline="Learning management system"/></Link>
          <IconButton label={dark ? "Switch to light theme" : "Switch to dark theme"} onClick={toggle}>{dark ? <FiSun /> : <FiMoon />}</IconButton>
        </div>
        <div className="login-form-content">
          <p className="eyebrow">Your next chapter starts here</p>
          <h1>Welcome back.</h1>
          <p className="login-intro">A little learning. A deeper connection.<br />Sign in to continue your ATUPA journey.</p>
          <form className="login-form" onSubmit={submit}>
            <Input label="Email address" id="login-email" name="email" type="email" autoComplete="username" placeholder="you@example.com" required disabled={pending} value={email} onChange={e=>{setEmail(e.target.value);setError("");}} aria-describedby={error ? "login-error" : undefined} />
            <div className="login-password-field">
              <Input label="Password" id="login-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" required disabled={pending} value={password} onChange={e=>{setPassword(e.target.value);setError("");}} aria-describedby={error ? "login-error" : undefined} />
              <button type="button" className="login-password-toggle" disabled={pending} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} aria-controls="login-password" onClick={()=>setShowPassword(value=>!value)}>{showPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}</button>
            </div>
            {error && <p className="login-error" id="login-error" role="alert">{error}</p>}
            <div className="login-recovery"><Link href="/forgot-password">Forgot your password?</Link></div>
            <Button type="submit" className="login-submit" pending={pending}>{pending ? "Signing in…" : <>Sign in <FiArrowRight aria-hidden="true" /></>}</Button>
          </form>
          <p className="account-switch">New to ATUPA? <Link href="/register">Create an account</Link></p>
          <p className="login-security"><FiLock aria-hidden="true" /> Your learning, safely in your hands.</p>
        </div>
        <div className="login-bottom"><Link href="/"><FiArrowLeft aria-hidden="true" /> Back to ATUPA</Link><span>Language. Culture. Connection.</span></div>
      </div>
      <aside className="login-story" aria-label="Learn Nigerian languages and culture">
        <div className="login-story-pattern" aria-hidden="true" /><div className="login-orbit login-orbit-large" aria-hidden="true" /><div className="login-orbit login-orbit-small" aria-hidden="true" />
        <div className="login-story-top"><span className="login-edition">WAZOBIA EDITION</span><span className="login-story-index">01 — 03</span></div>
        <div className="login-story-heading"><h2>Learn your<br /><span>roots.</span><br />Find your<br />connection.</h2><p>Discover the words, stories and traditions<br className="login-story-break" /> that make us who we are.</p></div>
        <div className="login-story-footer"><p>One home. Many stories.</p><div className="login-languages"><span>Yorùbá</span><span>Igbo</span><span>Hausa</span></div></div>
      </aside>
    </section>
  </main>;
}
export function LogoutButton() {
  const router=useRouter();const [pending,setPending]=useState(false);const [error,setError]=useState("");
  return <div><Button variant="secondary" pending={pending} onClick={async()=>{setPending(true);setError("");try{const response=await sessionFetch("/api/auth/logout",{method:"POST"});if(!response.ok)throw new Error();router.replace("/login");router.refresh();}catch{setError("Unable to log out. Please try again.");}finally{setPending(false);}}}>Log out</Button>{error&&<p role="alert" className="field-error">{error}</p>}</div>;
}
