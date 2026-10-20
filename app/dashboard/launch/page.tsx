import {Suspense} from 'react';
import {requireUser} from '@/lib/auth/session';
import {LaunchReview} from '@/components/launch/review';
async function Workspace(){const user=await requireUser('/dashboard/launch');return user?<LaunchReview/>:<main id="main-content"><p>This review is available to platform administrators.</p></main>;}
export default function Page(){return <Suspense fallback={<p role="status">Loading launch review…</p>}><Workspace/></Suspense>;}
