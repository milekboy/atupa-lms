import {Suspense} from 'react';
import {requireUser} from '@/lib/auth/session';
import {ManagementWorkspace} from '@/components/admin/workspace';
async function Workspace(){const user=await requireUser('/dashboard/schools');return user?<ManagementWorkspace section="schools" user={user}/>:<main id="main-content"><p>This workspace is not available to your account.</p></main>;}
export default function Page(){return <Suspense fallback={<p role="status">Loading management workspace…</p>}><Workspace/></Suspense>;}
