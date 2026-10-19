import {Suspense} from "react";
import {requireUser} from "@/lib/auth/session";
import {AuthoringWorkspace} from "@/components/authoring/workspace";
async function ProtectedContent(){const user=await requireUser("/dashboard/content");if(!user)return <p>You do not have access to course authoring.</p>;return <AuthoringWorkspace/>;}
export default function ContentPage(){return <Suspense fallback={<p role="status">Checking your publishing access…</p>}><ProtectedContent/></Suspense>;}
