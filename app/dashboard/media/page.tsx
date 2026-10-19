import {Suspense} from "react";
import {requireUser} from "@/lib/auth/session";
import {MediaLibrary} from "@/components/media/media-library";
async function ProtectedMedia(){const user=await requireUser("/dashboard/media");if(!user)return <p>You do not have access to this media library.</p>;return <MediaLibrary/>;}
export default function MediaPage(){return <Suspense fallback={<p role="status">Checking media access…</p>}><ProtectedMedia/></Suspense>;}
