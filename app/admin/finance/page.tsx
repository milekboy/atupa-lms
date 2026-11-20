import {Suspense} from 'react';
import {requireUser} from '@/lib/auth/session';
import {adminAccess} from '@/lib/admin-console/server';
import {FinanceWorkspace} from '@/components/admin-console/finance';
async function Protected(){const user=await requireUser('/admin/finance');if(!user)return <p>Access restricted</p>;const access=await adminAccess(user.role);return access.permissions.includes('users.view')?<FinanceWorkspace canManage={access.permissions.includes('users.manage')}/>:<p>Access restricted</p>;}
export default function FinancePage(){return <Suspense fallback={<p role="status">Loading finance workspace…</p>}><Protected/></Suspense>;}
