import {Suspense} from 'react';
import {requireUser} from '@/lib/auth/session';
import {adminAccess} from '@/lib/admin-console/server';
import {ExportsWorkspace} from '@/components/admin-console/exports';
async function Protected(){const user=await requireUser('/admin/exports');if(!user)return <p>Access restricted</p>;const access=await adminAccess(user.role);return access.permissions.includes('users.view')?<ExportsWorkspace superAdmin={user.role==='super_admin'}/>:<p>Access restricted</p>;}
export default function ExportsPage(){return <Suspense fallback={<p role="status">Loading downloads…</p>}><Protected/></Suspense>;}
