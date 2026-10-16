"use client";

import { useId, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
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
export function Select({ label, hint, error, id, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & Field) {
  const generated = useId(); const fieldId = id ?? generated;
  return <FieldFrame id={fieldId} label={label} hint={hint} error={error}><select {...props} id={fieldId} className={`input ${props.className ?? ""}`} aria-invalid={!!error || undefined} aria-describedby={describedBy(fieldId, hint, error, props["aria-describedby"])}>{children}</select></FieldFrame>;
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
