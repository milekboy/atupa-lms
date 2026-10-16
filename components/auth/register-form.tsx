"use client";
import {useState,type FormEvent} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {Button,Checkbox,Input,Select} from "@/components/ui";
import {AccountShell} from "./account-shell";
import {PasswordField} from "./password-field";
import {useLanguages} from "./use-languages";
import {accountRequest} from "@/lib/api/account-client";
import {ApiError} from "@/lib/api/contracts";
type RegistrationRole="learner"|"parent"|"teacher";
export function RegisterForm({school=false}:{school?:boolean}){
 const router=useRouter();const[role,setRole]=useState<RegistrationRole>("learner");const[pending,setPending]=useState(false);const[error,setError]=useState("");const{languages,error:languageError,retry}=useLanguages(!school);
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();if(pending)return;const data=new FormData(e.currentTarget);const text=(name:string)=>String(data.get(name)??"");setError("");if(text("password")!==text("confirmPassword")){setError("Your passwords do not match.");return;}if(!school&&role==="teacher"&&!data.getAll("languageSpecializations").length){setError("Choose at least one language specialization.");return;}
  const names={firstName:text("firstName"),lastName:text("lastName"),email:text("email"),password:text("password")};
  const payload=school?{name:text("schoolName"),email:text("schoolEmail"),phone:text("phone"),address:text("address"),region:text("region"),declaredStudentCount:Number(text("declaredStudentCount")),admin:names}:{...names,role,...(role==="learner"?{dateOfBirth:text("dateOfBirth"),preferredLanguageCode:text("preferredLanguageCode")}:{phone:text("phone")}),...(role==="teacher"?{teachingExperienceYears:Number(text("teachingExperienceYears")),languageSpecializations:data.getAll("languageSpecializations")}:{} )};
  setPending(true);try{await accountRequest(school?"register-school":"register",payload);router.replace("/dashboard");router.refresh();}catch(e){setError(e instanceof ApiError?([e.message,...(e.errors??[])].filter((v,i,a)=>a.indexOf(v)===i).join(" ")):"Unable to create your account. Please try again.");}finally{setPending(false);}
 }
 return <AccountShell title={school?"Bring your school together.":"Find your connection."} eyebrow={school?"For schools and classrooms":"Start your ATUPA journey"} intro={school?"Create your school and its administrator account in one place.":"Create an account to learn, teach or support a child's journey."} wide>
 {!school&&<fieldset className="role-picker" disabled={pending}><legend>I&apos;m joining as a</legend><div>{(["learner","parent","teacher"] as const).map(value=><label key={value} className={role===value?"selected":""}><input type="radio" name="registrationRole" value={value} checked={role===value} onChange={()=>{setRole(value);setError("");}}/><span>{value[0].toUpperCase()+value.slice(1)}</span></label>)}</div></fieldset>}
 <form className="login-form" onSubmit={submit} onChange={()=>{if(error)setError("");}}>
 <fieldset className="account-fields" disabled={pending}>
 {school&&<><h2 className="account-subheading">School details</h2><Input name="schoolName" label="School name" autoComplete="organization" required/><Input name="schoolEmail" label="School email" type="email" required/><div className="account-form-grid"><Input name="phone" label="School phone" type="tel" autoComplete="tel" required/><Input name="region" label="State / region" required/></div><Input name="address" label="School address" autoComplete="street-address" required/><Input name="declaredStudentCount" label="Number of students" type="number" min={0} step={1} required/><h2 className="account-subheading">Administrator details</h2></>}
 <div className="account-form-grid"><Input name="firstName" label="First name" autoComplete="given-name" required/><Input name="lastName" label="Surname" autoComplete="family-name" required/></div>
 <Input name="email" label={school?"Administrator email":"Email address"} type="email" autoComplete="email" placeholder="you@example.com" required/>
 {!school&&role==="learner"&&<><Input name="dateOfBirth" label="Date of birth" type="date" autoComplete="bday" required/><Select name="preferredLanguageCode" label="Preferred language" defaultValue="" required disabled={!languages.length}><option value="" disabled>{languages.length?"Choose a language":"Loading languages…"}</option>{languages.map(l=><option key={l.code} value={l.code}>{l.name}</option>)}</Select></>}
 {!school&&role!=="learner"&&<Input name="phone" label="Phone number" type="tel" autoComplete="tel" placeholder="+234…" required/>}
 {!school&&role==="teacher"&&<><Input name="teachingExperienceYears" label="Teaching experience (years)" type="number" min={0} step={1} required/><fieldset className="language-choices"><legend>Language specializations</legend>{languages.map(l=><Checkbox key={l.code} name="languageSpecializations" label={l.name} value={l.code}/>)}</fieldset></>}
 {!school&&role!=="parent"&&languageError&&<div role="alert" className="login-error">{languageError}<Button variant="ghost" onClick={retry}>Retry languages</Button></div>}
 <PasswordField id="register-password" name="password" label="Password" autoComplete="new-password" required hint="Use a strong, unique password. The server checks its password rules."/>
 <PasswordField id="confirm-password" name="confirmPassword" label="Confirm password" autoComplete="new-password" required/>
 </fieldset>{error&&<p role="alert" className="login-error">{error}</p>}<Button className="login-submit" type="submit" pending={pending} disabled={!school&&role!=="parent"&&!languages.length}>{pending?"Creating your account…":school?"Create school account":"Create account"}</Button>
 </form><p className="account-switch">Already have an account? <Link href="/login">Sign in</Link></p>{!school&&<p className="account-switch">Registering a school? <Link href="/register/school">Set up your school</Link></p>}
 </AccountShell>;
}
