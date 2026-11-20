import {Suspense} from 'react';
import {requireUser} from '@/lib/auth/session';
import {adminAccess} from '@/lib/admin-console/server';
import {ReviewsWorkspace} from '@/components/admin-console/reviews';
async function Protected(){const user=await requireUser('/admin/reviews');if(!user)return <p>Access restricted</p>;const access=await adminAccess(user.role);return access.permissions.includes('users.manage')?<ReviewsWorkspace user={user}/>:<p>Access restricted</p>;}
export default function ReviewsPage(){return <Suspense fallback={<p role="status">Loading content reviews…</p>}><Protected/></Suspense>;}
