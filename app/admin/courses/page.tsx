import {Suspense} from 'react';
import {requireUser} from '@/lib/auth/session';
import {adminAccess} from '@/lib/admin-console/server';
import {AdminCourses} from '@/components/admin-console/courses';
async function Protected(){const user=await requireUser('/admin/courses');if(!user)return <p>Access restricted</p>;const access=await adminAccess(user.role);return access.permissions.includes('users.view')?<AdminCourses canManage={access.permissions.includes('users.manage')}/>:<p>Access restricted</p>;}
export default function CoursesPage(){return <Suspense fallback={<p role="status">Loading course visibility…</p>}><Protected/></Suspense>;}
