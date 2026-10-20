import {Suspense} from 'react';
import {requireUser} from '@/lib/auth/session';
import {LearnerLinkCode} from '@/components/parents/link-code';
async function Workspace(){const user=await requireUser('/dashboard/family-link');return user?<LearnerLinkCode/>:<p>This family page is not available to your account.</p>;}
export default function Page(){return <Suspense fallback={<p role="status">Opening family connections…</p>}><Workspace/></Suspense>;}
