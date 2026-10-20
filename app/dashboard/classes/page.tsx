import {Suspense} from 'react';
import {requireUser} from '@/lib/auth/session';
import {ClassesWorkspace} from '@/components/school/classes';
async function Workspace(){const user=await requireUser('/dashboard/classes');return user?<ClassesWorkspace user={user}/>:<p>This workspace is not available to your account.</p>;}
export default function Page(){return <Suspense fallback={<p role="status">Opening your workspace…</p>}><Workspace/></Suspense>;}
