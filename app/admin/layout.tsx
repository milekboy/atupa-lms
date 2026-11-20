import {Suspense,type ReactNode} from 'react';
import {headers} from 'next/headers';
import Link from 'next/link';
import {requireUser} from '@/lib/auth/session';
import {sessionReturnTo} from '@/lib/auth/roles';
import {adminAccess} from '@/lib/admin-console/server';
import {adminNavigation} from '@/lib/admin-console/contracts';
import {ApiError} from '@/lib/api/contracts';
import {redirect} from 'next/navigation';
import {DashboardShell} from '@/components/dashboard/dashboard-shell';
import {AdminRetry} from '@/components/admin-console/retry';
async function Protected({children}:{children:ReactNode}){
 const incoming=await headers(),path=incoming.get('x-atupa-path')??'/admin',returnTo=sessionReturnTo(path,incoming.get('x-atupa-return-to'));
 const user=await requireUser(path);
 if(!user)return <main id="main-content" className="preview-main"><div className="panel"><h1>Access restricted</h1><p>Your account does not have permission to use this console.</p><Link href="/dashboard">Return to your workspace</Link></div></main>;
 let access;
 try{access=await adminAccess(user.role);}catch(error){
  if(error instanceof ApiError&&error.status===409)redirect('/session/renew?returnTo='+encodeURIComponent(returnTo));
  if(error instanceof ApiError&&error.status===401)redirect('/api/auth/expired?returnTo='+encodeURIComponent(returnTo));
  return <main id="main-content" className="preview-main"><div className="panel"><h1>{error instanceof ApiError&&error.status===403?'Access restricted':'Admin access unavailable'}</h1><p role="alert">{error instanceof ApiError&&error.status===403?'Your account does not have permission to use this console.':'We could not verify your admin access. Please try again.'}</p><AdminRetry/><Link href="/dashboard">Return to your workspace</Link></div></main>;
 }
 if(["/admin/safety-reports","/admin/alerts","/admin/activity-log"].includes(path)&&!access.permissions.includes("users.view")||path==="/admin/exports"&&!access.permissions.includes("users.view")||path==="/admin/finance"&&!access.permissions.includes("users.view")||path==="/admin/courses"&&!access.permissions.includes("users.view")||path==="/admin/reviews"&&!access.permissions.includes("users.manage")||path==="/admin/onboarding"&&!access.permissions.includes("users.manage")||path==="/admin/users"&&!access.permissions.includes("users.view")||path==="/admin/verifications"&&!access.permissions.includes("users.manage"))return <main id="main-content" className="preview-main"><div className="panel"><h1>Access restricted</h1><p>Your account is missing permission for this page.</p><Link href="/admin">Return to console</Link></div></main>;
 const personal=[{label:'LMS workspace',href:'/dashboard',group:'Personal',icon:'courses' as const,roles:[user.role],implemented:true,keywords:['workspace']},{label:'My account',href:'/dashboard/profile',group:'Personal',icon:'account' as const,roles:[user.role],implemented:true,keywords:['profile','password']}];
 return <DashboardShell user={user} navigation={[...adminNavigation(access),...personal]} homeHref="/admin"><main id="main-content"><div className="page-header"><div><p className="eyebrow">ATUPA administration</p><h1>Admin console</h1><p className="muted">Manage your work with the access assigned to your account.</p></div></div>{access.menu.length===0&&<div className="panel"><h2>No console pages available</h2><p>No supported console pages are currently assigned to your account. Contact your platform administrator if you need access.</p></div>}{children}</main></DashboardShell>;
}
export default function AdminLayout({children}:{children:ReactNode}){return <Suspense fallback={<main id="main-content" className="preview-main"><p role="status">Checking admin access…</p></main>}><Protected>{children}</Protected></Suspense>;}
