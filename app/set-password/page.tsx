import {Suspense} from "react";
import {RecoveryForm} from "@/components/auth/recovery-form";
export const metadata={referrer:"no-referrer" as const};
export default function SetPasswordPage(){return <Suspense fallback={<p role="status">Loading your invitation…</p>}><RecoveryForm reset invitation/></Suspense>;}
