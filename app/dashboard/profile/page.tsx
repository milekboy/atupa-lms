import Link from "next/link";
import {Suspense} from "react";
import {requireUser} from "@/lib/auth/session";
import {ProfileForm} from "@/components/auth/profile-form";
async function ProtectedProfile(){const user=await requireUser("/dashboard/profile");return <>{user&&["teacher","school_admin"].includes(user.role)&&<p><Link className="button button-secondary" href="/dashboard/verification">Submit verification documents</Link></p>}<ProfileForm/></>;}
export default function ProfilePage(){return <Suspense fallback={<p role="status">Checking your account…</p>}><ProtectedProfile/></Suspense>;}
