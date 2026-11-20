import {Suspense} from 'react';
import {requireUser} from '@/lib/auth/session';
import {adminAccess} from '@/lib/admin-console/server';
import {OnboardingWorkspace} from '@/components/admin-console/onboarding';
async function Protected(){const user=await requireUser('/admin/onboarding');if(!user)return <p>Access restricted</p>;const access=await adminAccess(user.role);return access.permissions.includes('users.manage')?<OnboardingWorkspace canViewUsers={access.permissions.includes('users.view')}/>:<p>Access restricted</p>;}
export default function OnboardingPage(){return <Suspense fallback={<p role="status">Loading school onboarding…</p>}><Protected/></Suspense>;}
