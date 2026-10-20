import {Suspense} from 'react';
import {requireUser} from '@/lib/auth/session';
import {SearchWorkspace} from '@/components/search/workspace';
async function Workspace(){const user=await requireUser('/dashboard/search');return user?<SearchWorkspace/>:<main id="main-content"><p>Library search is available in the learner workspace.</p></main>;}
export default function Page(){return <Suspense fallback={<p role="status">Loading library search…</p>}><Workspace/></Suspense>;}
