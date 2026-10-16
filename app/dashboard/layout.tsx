import { Suspense,type ReactNode } from "react";
import { headers } from "next/headers";
import { requireUser } from "@/lib/auth/session";
async function Protected({children}:{children:ReactNode}) {
  const path=(await headers()).get("x-atupa-path")??"/dashboard";
  const user=await requireUser(path);
  if(!user)return <main id="main-content" className="preview-main"><div className="panel"><h1>Access restricted</h1><p>Your account does not have permission to view this area.</p><a href="/dashboard">Return to your overview</a></div></main>;
  return children;
}
export default function DashboardLayout({children}:{children:ReactNode}) {return <Suspense fallback={<main id="main-content" className="preview-main"><p role="status">Checking your session…</p></main>}><Protected>{children}</Protected></Suspense>;}
