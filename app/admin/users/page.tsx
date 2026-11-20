import {Suspense} from 'react';
import {requireUser} from '@/lib/auth/session';
import {adminAccess} from '@/lib/admin-console/server';
import {UsersWorkspace} from '@/components/admin-console/users';
async function Protected(){const user=await requireUser('/admin/users');if(!user)return <p>Access restricted</p>;const access=await adminAccess(user.role);return access.permissions.includes('users.view')?<UsersWorkspace user={user} canManage={access.permissions.includes('users.manage')}/>:<p>Access restricted</p>;}
export default function UsersPage(){return <Suspense fallback={<p role="status">Loading user administration…</p>}><Protected/></Suspense>;}
