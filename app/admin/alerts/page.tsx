import {Suspense} from 'react';
import {requireUser} from '@/lib/auth/session';
import {adminAccess} from '@/lib/admin-console/server';
import {TrustWorkspace} from '@/components/admin-console/trust';
async function Protected(){const user=await requireUser('/admin/alerts');if(!user)return <p>Access restricted</p>;const access=await adminAccess(user.role);return access.permissions.includes('users.view')?<TrustWorkspace kind="alerts" actorId={user.id} canManage={access.permissions.includes('users.manage')}/>:<p>Access restricted</p>;}
export default function Page(){return <Suspense fallback={<p role="status">Loading workspace…</p>}><Protected/></Suspense>;}
