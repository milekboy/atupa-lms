import { upstream,responseJson } from "@/lib/api/server";
import { ApiError,object,normalizeError } from "@/lib/api/contracts";
import { errorResponse,json } from "@/lib/api/http";
export async function GET(){try{const response=await upstream("/languages");const value=await responseJson(response);if(!response.ok)throw normalizeError(value,response.status);const data=object(value).data;if(!Array.isArray(data))throw new ApiError(502,"Languages are temporarily unavailable.");return json({success:true,data:data.filter(item=>object(item).isActive===true).map(item=>{const v=object(item);return {code:v.code,name:v.name};})});}catch(error){return errorResponse(error);}}
