import {Suspense} from 'react';
import {requireUser} from '@/lib/auth/session';
import {SchoolWorkspace} from '@/components/school/school';
async function Workspace(){const user=await requireUser('/dashboard/school');return user?<SchoolWorkspace user={user}/>:<p>This workspace is not available to your account.</p>;}
export default function Page(){return <Suspense fallback={<p role="status">Opening your workspace…</p>}><Workspace/></Suspense>;}
