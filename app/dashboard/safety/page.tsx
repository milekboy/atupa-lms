import {Suspense} from 'react';
import {requireUser} from '@/lib/auth/session';
import {SafetyWorkspace} from '@/components/safety/workspace';
async function Protected(){const user=await requireUser('/dashboard/safety');return user?<SafetyWorkspace attachmentsEnabled={process.env.SAFETY_REPORT_PRIVATE_ATTACHMENTS==='true'}/>:<p>Reporting is available to learner and parent accounts.</p>;}
export default function Page(){return <Suspense fallback={<p role="status">Loading your reports…</p>}><Protected/></Suspense>;}
