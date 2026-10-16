"use client";
import {useState,type InputHTMLAttributes} from "react";
import { FiEye,FiEyeOff } from "react-icons/fi";
import {Input} from "@/components/ui";
export function PasswordField({label,id,hint,...props}:InputHTMLAttributes<HTMLInputElement>&{label:string;id:string;hint?:string}){const [visible,setVisible]=useState(false);return <div className="field"><div className="login-password-field"><Input {...props} id={id} label={label} aria-describedby={[props["aria-describedby"],hint?`${id}-hint`:null].filter(Boolean).join(" ")||undefined} type={visible?"text":"password"}/><button className="login-password-toggle" type="button" disabled={props.disabled} aria-label={`${visible?"Hide":"Show"} ${label.toLowerCase()}`} aria-controls={id} aria-pressed={visible} onClick={()=>setVisible(v=>!v)}>{visible?<FiEyeOff aria-hidden="true"/>:<FiEye aria-hidden="true"/>}</button></div>{hint&&<p className="field-hint" id={`${id}-hint`}>{hint}</p>}</div>;}
