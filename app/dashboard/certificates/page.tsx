import {Suspense} from "react";
import {requireUser} from "@/lib/auth/session";
import {CertificateWorkspace} from "@/components/certificates/workspace";
async function Certificates(){const user=await requireUser('/dashboard/certificates');return user&&['learner','super_admin'].includes(user.role)?<CertificateWorkspace admin={user.role==='super_admin'}/>:<p>This certificate workspace is not available to your account.</p>;}
export default function Page(){return <Suspense fallback={<p role="status">Opening certificates…</p>}><Certificates/></Suspense>;}
