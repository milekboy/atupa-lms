import {Suspense} from 'react';
import {requireUser} from '@/lib/auth/session';
import {adminAccess} from '@/lib/admin-console/server';
import {VerificationQueue} from '@/components/admin-console/verifications';
async function Protected(){const user=await requireUser('/admin/verifications');if(!user)return <p>Access restricted</p>;const access=await adminAccess(user.role);return access.permissions.includes('users.manage')?<VerificationQueue/>:<p>Access restricted</p>;}
export default function VerificationsPage(){return <Suspense fallback={<p role="status">Loading verification queue…</p>}><Protected/></Suspense>;}
