import { ApiError, object } from "../api/contracts";
const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function accountPayload(action:string,value:unknown):Record<string,unknown> {
  const body=object(value);
  const text=(key:string,max=200,secret=false)=>{const v=body[key];if(typeof v!=="string" || !v.trim() || v.length>max)throw new ApiError(400,`Please enter a valid ${key.replace(/([A-Z])/g," $1").toLowerCase()}.`);return secret?v:v.trim();};
  const email=(key="email")=>{const v=text(key,320);if(!emailPattern.test(v))throw new ApiError(400,"Enter a valid email address.");return v;};
  const password=(key="password")=>text(key,1024,true);
  if(action==="forgot-password")return {email:email()};
  if(action==="reset-password"){const token=text("token",256,true);if(token.length!==64)throw new ApiError(400,"This password link is invalid. Request a new link.");return {token,newPassword:password("newPassword")};}
  if(action==="change-password")return {currentPassword:password("currentPassword"),newPassword:password("newPassword")};
  if(action==="delete-account")return {password:password()};
  if(action==="profile")return {lastName:text("lastName"),...(body.preferredLanguageCode?{preferredLanguageCode:text("preferredLanguageCode",40)}:{})};
  const integer=(key:string)=>{const v=body[key];if(typeof v!=="number" || !Number.isSafeInteger(v) || v<0)throw new ApiError(400,`Enter a valid ${key}.`);return v;};
  if(action==="register-school"){
    const admin=object(body.admin);
    const administrator=accountPayload("register",{...admin,role:"parent",phone:body.phone});
    return {name:text("name"),email:email(),phone:text("phone",40),address:text("address",500),region:text("region"),declaredStudentCount:integer("declaredStudentCount"),admin:{firstName:administrator.firstName,lastName:administrator.lastName,email:administrator.email,password:administrator.password}};
  }
  if(action!=="register")throw new ApiError(404,"Unknown account action.");
  if(!["learner","parent","teacher"].includes(String(body.role)))throw new ApiError(400,"Choose learner, parent or teacher registration.");
  const result:Record<string,unknown>={role:body.role,firstName:text("firstName"),lastName:text("lastName"),email:email(),password:password()};
  if(body.role==="learner"){
    const dob=text("dateOfBirth",10);const date=new Date(dob+"T00:00:00Z");
    if(!/^\d{4}-\d{2}-\d{2}$/.test(dob)||!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==dob||date.getTime()>Date.now())throw new ApiError(400,"Enter a valid date of birth in the past.");
    return {...result,dateOfBirth:dob,preferredLanguageCode:text("preferredLanguageCode",40)};
  }
  result.phone=text("phone",40);
  if(body.role==="teacher"){
    const codes=body.languageSpecializations;
    if(!Array.isArray(codes)||!codes.length||!codes.every(c=>typeof c==="string"&&/^[a-z0-9_-]{1,40}$/.test(c)))throw new ApiError(400,"Select at least one language specialization.");
    result.languageSpecializations=[...new Set(codes)];result.teachingExperienceYears=integer("teachingExperienceYears");
  }
  return result;
}
