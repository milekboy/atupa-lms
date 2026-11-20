import 'server-only';
import {cookies} from 'next/headers';
import {sessionCookie} from '../auth/session';
import {authenticated,responseJson} from '../api/server';
import {ApiError,normalizeError,object} from '../api/contracts';
import {parseAdminAccess} from './contracts';
import type {Role} from '../../types/auth';
export async function adminAccess(role:Role){
 const cookie=(await cookies()).get(sessionCookie)?.value;
 if(!cookie)throw new ApiError(401,'Please sign in again.');
 const response=await authenticated(cookie,'/admin/me/permissions');
 const value=await responseJson(response);
 if(!response.ok)throw normalizeError(value,response.status);
 return parseAdminAccess(object(value).data,role);
}
