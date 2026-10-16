import {Suspense} from "react";
import {requireUser} from "@/lib/auth/session";
import {ProfileForm} from "@/components/auth/profile-form";
async function ProtectedProfile(){await requireUser("/dashboard/profile");return <ProfileForm/>;}
export default function ProfilePage(){return <Suspense fallback={<p role="status">Checking your account…</p>}><ProtectedProfile/></Suspense>;}
