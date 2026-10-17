import "server-only";
import {cache} from "react";
import {connection} from "next/server";
import {upstream,responseJson} from "@/lib/api/server";
import {ApiError,normalizeError,object} from "@/lib/api/contracts";
import {parseCourseList,parseLanguages,parseOutline,type CatalogQuery} from "./contracts";
async function read(path:string){await connection();const response=await upstream(path);const body=await responseJson(response);if(!response.ok)throw normalizeError(body,response.status);const envelope=object(body);if(envelope.success!==true)throw new ApiError(502,"The catalog could not be loaded.");return envelope.data;}
export const getLanguages=cache(async()=>parseLanguages(await read("/languages")));
export const getCourses=cache(async(query:CatalogQuery,limit=6)=>{const params=new URLSearchParams({page:String(query.page),limit:String(limit)});if(query.languageCode)params.set("languageCode",query.languageCode);if(query.level)params.set("level",query.level);return parseCourseList(await read("/courses?"+params));});
export const getOutline=cache(async(id:string)=>{if(!/^[a-f0-9]{24}$/i.test(id))throw new ApiError(404,"This course could not be found.");return parseOutline(await read("/courses/"+encodeURIComponent(id)));});
