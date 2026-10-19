export type MediaKind = "image" | "audio" | "video";
export type MediaItem = {id:string; kind:MediaKind; url:string; name:string};
function record(value:unknown):Record<string,unknown>{return value!==null&&typeof value==="object"&&!Array.isArray(value)?value as Record<string,unknown>:{};}
export function mediaItem(value:unknown):MediaItem {
  const v=record(value); const id=v.id??v._id; const kind=v.kind; const url=v.url??v.secureUrl;
  if(typeof id!=="string"||!id||!/^[\w-]+$/.test(id)||!["image","audio","video"].includes(String(kind))||typeof url!=="string")throw new Error("The API returned an unsupported media record. Please request its successful response contract.");
  const parsed=new URL(url); if(parsed.protocol!=="https:"||parsed.username||parsed.password)throw new Error("The media URL is not a secure preview URL.");
  return {id,kind:kind as MediaKind,url:parsed.href,name:typeof v.originalName==="string"?v.originalName:typeof v.name==="string"?v.name:id};
}
export function mediaPage(value:unknown){const v=record(value);if(!Array.isArray(v.items)||!Number.isInteger(v.total)||!Number.isInteger(v.page)||!Number.isInteger(v.limit))throw new Error("The media list response is unsupported.");return {items:v.items.map(mediaItem),total:Number(v.total),page:Number(v.page),limit:Number(v.limit)};}
export function validateFile(file:Pick<File,"type"|"size"|"name">):MediaKind{
  const extension=file.name.split(".").pop()?.toLowerCase();
  const formats:Record<MediaKind,string[]>={image:["jpg","jpeg","png","webp","gif","avif"],audio:["mp3","wav","ogg","m4a","aac"],video:["mp4","webm","mov"]};
  const kind=file.type.split("/")[0] as MediaKind;
  if(!formats[kind]?.includes(extension??""))throw new Error("Choose a supported image, audio or video file with a matching file type.");
  if(!file.size||file.size>25*1024*1024)throw new Error("Choose a non-empty file up to 25 MB.");return kind;
}
export type DirectTicket={uploadUrl:string;fields:Record<string,string>;folder:string};
export function directTicket(value:unknown):DirectTicket{
  const v=record(value); const url=new URL(String(v.uploadUrl));
  if(url.protocol!=="https:"||url.hostname!=="api.cloudinary.com"||url.port||url.username||url.password||url.search||url.hash||!/^\/v1_1\/[\w-]+\/(image|video|raw)\/upload$/.test(url.pathname))throw new Error("The upload provider URL is unsupported.");
  if(typeof v.expiresAt!=="string"||Date.parse(v.expiresAt)<=Date.now()+5000||!Number.isFinite(Date.parse(v.expiresAt)))throw new Error("The upload ticket has expired. Please retry.");
  if(typeof v.folder!=="string"||!v.folder)throw new Error("The upload ticket has no folder.");
  const fields:Record<string,string>={};for(const [key,val]of Object.entries(record(v.fields))){if(!/^[\w]+$/.test(key)||key==="file"||!["string","number"].includes(typeof val))throw new Error("The upload fields are unsupported.");fields[key]=String(val);}
  if(!fields.signature||!fields.api_key||!fields.timestamp||fields.folder!==v.folder)throw new Error("The upload ticket is incomplete.");
  return {uploadUrl:url.href,fields,folder:v.folder};
}
