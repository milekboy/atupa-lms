import {Suspense} from 'react';
import {requireUser} from '@/lib/auth/session';
import {Reports} from '@/components/insights/reports';
async function Workspace(){const user=await requireUser('/dashboard/reports');return user?<Reports user={user}/>:<main id="main-content"><p>This workspace is not available to your account.</p></main>;}
export default function Page(){return <Suspense fallback={<p role="status">Loading workspace…</p>}><Workspace/></Suspense>;}
