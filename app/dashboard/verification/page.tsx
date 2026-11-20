import {Suspense} from 'react';
import {requireUser} from '@/lib/auth/session';
import {VerificationSubmission} from '@/components/admin-console/verifications';
async function Protected(){const user=await requireUser('/dashboard/verification');return user?<VerificationSubmission role={user.role}/>:<p>Access restricted</p>;}
export default function VerificationPage(){return <Suspense fallback={<p role="status">Checking your account…</p>}><Protected/></Suspense>;}
