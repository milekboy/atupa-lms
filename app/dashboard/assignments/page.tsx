import {Suspense} from 'react';
import {requireUser} from '@/lib/auth/session';
import {AssignmentWorkspace} from '@/components/assignments/workspace';
async function Workspace(){const user=await requireUser('/dashboard/assignments');return user?<AssignmentWorkspace user={user}/>:<p>This workspace is not available to your account.</p>;}
export default function Page(){return <Suspense fallback={<p role="status">Opening assignments…</p>}><Workspace/></Suspense>;}
