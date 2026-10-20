import {Suspense} from 'react';
import {requireUser} from '@/lib/auth/session';
import {ParentWorkspace} from '@/components/parents/workspace';
async function Workspace(){const user=await requireUser('/dashboard/children');return user?<ParentWorkspace name={user.firstName}/>:<p>This family page is not available to your account.</p>;}
export default function Page(){return <Suspense fallback={<p role="status">Opening family connections…</p>}><Workspace/></Suspense>;}
