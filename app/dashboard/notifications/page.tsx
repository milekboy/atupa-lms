import {Suspense} from 'react';
import {requireUser} from '@/lib/auth/session';
import {Inbox} from '@/components/insights/inbox';
async function Workspace(){const user=await requireUser('/dashboard/notifications');return user?<Inbox user={user}/>:<main id="main-content"><p>This workspace is not available to your account.</p></main>;}
export default function Page(){return <Suspense fallback={<p role="status">Loading workspace…</p>}><Workspace/></Suspense>;}
