import {NextRequest} from 'next/server';
import {authenticated,responseJson} from '@/lib/api/server';
import {ApiError,normalizeError,object,safeUser} from '@/lib/api/contracts';
import {sessionCookie} from '@/lib/auth/session';
import {errorResponse} from '@/lib/api/http';
import {parseAdminAccess} from '@/lib/admin-console/contracts';
import {exportSpec,exportBytes} from '@/lib/admin-console/exports';
export async function GET(request:NextRequest,{params}:{params:Promise<{path:string[]}>}){try{
 const cookie=request.cookies.get(sessionCookie)?.value;if(!cookie)throw new ApiError(401,'Please sign in again.');
 async function read(path:string){const r=await authenticated(cookie!,path);const v=await responseJson(r);if(!r.ok)throw normalizeError(v,r.status);return object(v).data;}
 const user=safeUser(await read('/users/me'));const spec=exportSpec((await params).path,request.nextUrl.searchParams,user.role);
 if(['super_admin','support_admin'].includes(user.role)){const access=parseAdminAccess(await read('/admin/me/permissions'),user.role);if(!access.permissions.includes('users.view'))throw new ApiError(403,'Your account is missing permission for this export.');}
 if(spec.kind==='schools'){
  if(user.role==='school_admin'&&object(await read('/schools/mine')).id!==spec.id)throw new ApiError(403,'This school is outside your access.');
  if(object(object(await read('/reports/schools/'+spec.id)).school).id!==spec.id)throw new ApiError(502,'The returned school report does not match.');
 }
 if(spec.kind==='classes'){
  if(['teacher','school_admin'].includes(user.role)){
   const room=object(await read('/classes/'+spec.id));if(room.id!==spec.id)throw new ApiError(502,'The returned class does not match.');
   if(user.role==='teacher'&&room.teacherUserId!==user.id)throw new ApiError(403,'This class is outside your access.');
   if(user.role==='school_admin'&&room.schoolId!==object(await read('/schools/mine')).id)throw new ApiError(403,'This class is outside your school.');
  }
  // The report endpoint must also authorize current membership/ownership before any file is requested.
  if(object(object(await read('/reports/classes/'+spec.id)).class).id!==spec.id)throw new ApiError(502,'The returned class report does not match.');
 }
 const upstream=await authenticated(cookie,spec.endpoint,{headers:{Accept:spec.format==='pdf'?'application/pdf':'text/csv'}});
 // Preserve session-renewal errors before consuming binary bytes.
 if(!upstream.ok&&(upstream.headers.get('content-type')||'').includes('json'))throw normalizeError(await responseJson(upstream),upstream.status);
 const bytes=await exportBytes(upstream,spec.format);
 return new Response(bytes,{headers:{'Content-Type':spec.format==='pdf'?'application/pdf':'text/csv; charset=utf-8','Content-Disposition':`attachment; filename="${spec.filename}"`,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"sandbox; default-src 'none'"}});
 }catch(error){return errorResponse(error);}}
