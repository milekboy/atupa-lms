import type {NextRequest} from 'next/server';
import {authenticated,responseJson} from '@/lib/api/server';
import {ApiError,normalizeError,object,safeUser} from '@/lib/api/contracts';
import {sessionCookie} from '@/lib/auth/session';
import {errorResponse,json} from '@/lib/api/http';
import {lessonPreview,previewRoles} from '@/lib/authoring/preview';
export async function GET(request:NextRequest,{params}:{params:Promise<{courseId:string;lessonId:string}>}){try{
 const {courseId,lessonId}=await params;if(![courseId,lessonId].every(id=>/^[-\w]{1,128}$/.test(id))||request.nextUrl.search)throw new ApiError(400,'Invalid preview request.');
 const cookie=request.cookies.get(sessionCookie)?.value;if(!cookie)throw new ApiError(401,'Please sign in again.');
 const profile=await authenticated(cookie,'/users/me'),body=await responseJson(profile);if(!profile.ok)throw normalizeError(body,profile.status);const user=safeUser(object(body).data);if(!previewRoles.includes(user.role))throw new ApiError(403,'Lesson preview requires authoring access.');
 // The existing authoring read enforces ownership and school/record permissions on the backend.
 const response=await authenticated(cookie,'/authoring/courses/'+courseId),value=await responseJson(response);if(!response.ok)throw normalizeError(value,response.status);
 return json({success:true,data:lessonPreview(object(value).data,courseId,lessonId)});
 }catch(e){return errorResponse(e);}}
