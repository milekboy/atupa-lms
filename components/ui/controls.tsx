"use client";

import { Children, isValidElement, useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import {CustomSelect, type Choice} from "./custom-select";
import { HiOutlineMagnifyingGlass, HiOutlineArrowPath } from "react-icons/hi2";

export function Button({ children, variant = "primary", pending = false, disabled, className = "", type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger"; pending?: boolean }) {
  return <button type={type} {...props} disabled={disabled || pending} aria-busy={pending || undefined} className={`button button-${variant} ${className}`}>{pending && <HiOutlineArrowPath className="spinner" aria-hidden="true" />}{children}</button>;
}
export function IconButton({ label, children, ...props }: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> & { label: string }) {
  return <Button {...props} variant="ghost" className={`icon-button ${props.className ?? ""}`} aria-label={label} title={label}>{children}</Button>;
}
type Field = { label: string; hint?: string; error?: string };
function FieldFrame({ id, label, hint, error, children }: Field & { id: string; children: ReactNode }) {
  return <div className="field"><label htmlFor={id}>{label}</label>{children}{hint && <p id={`${id}-hint`} className="field-hint">{hint}</p>}{error && <p id={`${id}-error`} className="field-error" role="alert">{error}</p>}</div>;
}
function describedBy(id: string, hint?: string, error?: string, existing?: string) { return [hint && `${id}-hint`, error && `${id}-error`, existing].filter(Boolean).join(" ") || undefined; }
export function Input({ label, hint, error, id, ...props }: InputHTMLAttributes<HTMLInputElement> & Field) {
  const generated = useId(); const fieldId = id ?? generated;
  return <FieldFrame id={fieldId} label={label} hint={hint} error={error}><input {...props} id={fieldId} className={`input ${props.className ?? ""}`} aria-invalid={!!error || undefined} aria-describedby={describedBy(fieldId, hint, error, props["aria-describedby"])} /></FieldFrame>;
}
// Retains the established option/form API while rendering the shared custom control.
function optionChoices(children:ReactNode):Choice[]{return Children.toArray(children).flatMap(child=>{if(!isValidElement<{value?:string|number;disabled?:boolean;children?:ReactNode}>(child))return [];if(child.type==='option')return [{value:String(child.props.value??Children.toArray(child.props.children).join('')),label:Children.toArray(child.props.children).join(''),disabled:child.props.disabled}];return optionChoices(child.props.children);});}
export function Select({label,hint,error,children,value,defaultValue,name,disabled,required,onChange}:{label:string;hint?:string;error?:string;children:ReactNode;value?:string|number;defaultValue?:string|number;name?:string;disabled?:boolean;required?:boolean;onChange?:(event:{target:{value:string}})=>void}){
 const choices=optionChoices(children),initial=String(defaultValue??choices[0]?.value??''),[local,setLocal]=useState({initial,value:initial}),root=useRef<HTMLDivElement>(null);
 useEffect(()=>{const form=root.current?.closest('form');const reset=()=>setLocal({initial,value:initial});form?.addEventListener('reset',reset);return()=>form?.removeEventListener('reset',reset);},[initial]);
 return <div ref={root}><CustomSelect label={label} hint={hint} error={error} name={name} value={String(value??(local.initial===initial?local.value:initial))} disabled={disabled} required={required} options={choices} onValueChange={next=>{setLocal({initial,value:next});onChange?.({target:{value:next}});}}/></div>;
}
export function Textarea({ label, hint, error, id, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & Field) {
  const generated = useId(); const fieldId = id ?? generated;
  return <FieldFrame id={fieldId} label={label} hint={hint} error={error}><textarea rows={4} {...props} id={fieldId} className={`input ${props.className ?? ""}`} aria-invalid={!!error || undefined} aria-describedby={describedBy(fieldId, hint, error, props["aria-describedby"])} /></FieldFrame>;
}
export function Checkbox({ label, id, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label: string }) {
  const generated = useId(); return <label className="check-label" htmlFor={id ?? generated}><input {...props} id={id ?? generated} type="checkbox" /> <span>{label}</span></label>;
}
export function Switch({ label, checked, onChange, disabled }: { label: string; checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }) {
  return <button className="switch-label" type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} disabled={disabled}><span className="switch-track" data-checked={checked}><span /></span><span>{label}</span></button>;
}
export function SearchField({ label = "Search", ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label?: string }) {
  return <div className="search-field"><HiOutlineMagnifyingGlass aria-hidden="true" /><Input {...props} label={label} type="search" /></div>;
}
export function FilterBar({ children, label = "Filters" }: { children: ReactNode; label?: string }) { return <div role="group" aria-label={label} className="filter-bar">{children}</div>; }
