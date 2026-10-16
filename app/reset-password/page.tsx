import {Suspense} from "react";
import {RecoveryForm} from "@/components/auth/recovery-form";
export const metadata={referrer:"no-referrer" as const};
export default function ResetPasswordPage(){return <Suspense fallback={<p role="status">Loading password reset…</p>}><RecoveryForm reset/></Suspense>;}
