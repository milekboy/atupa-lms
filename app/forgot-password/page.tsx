import {Suspense} from "react";
import {RecoveryForm} from "@/components/auth/recovery-form";
export default function ForgotPasswordPage(){return <Suspense fallback={<p role="status">Loading account recovery…</p>}><RecoveryForm/></Suspense>;}
