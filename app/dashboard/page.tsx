import { requireUser } from "@/lib/auth/session";
import { LogoutButton } from "@/components/auth-checkpoint";
import Link from "next/link";
import { Suspense } from "react";
async function SessionCheckpoint() {
  const user=await requireUser();if(!user)return null;
  return <main id="main-content" className="preview-main"><div className="panel"><p className="eyebrow">ATUPA LMS · Session checkpoint</p><h1>You&apos;re securely signed in.</h1><p style={{margin:"20px 0"}}>Welcome, {user.firstName}. Your account role is <strong>{user.role}</strong>.</p><p className="muted" style={{marginBottom:24}}>This confirms authentication only. The dashboard shell and learning workflows are built in later steps.</p><div className="button-row"><Link href="/dashboard/profile" className="button button-primary">Manage your account</Link><LogoutButton /></div></div></main>;
}
export default function DashboardPage(){return <Suspense fallback={<main id="main-content" className="preview-main"><p role="status">Checking your account…</p></main>}><SessionCheckpoint /></Suspense>;}
