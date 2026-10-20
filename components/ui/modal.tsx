"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { HiOutlineXMark } from "react-icons/hi2";
import { Button, IconButton } from "./controls";

export function Modal({ open, onClose, title, description, children, footer, busy = false }: { open: boolean; onClose: () => void; title: string; description?: string; children?: ReactNode; footer?: ReactNode; busy?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null); const titleId = useId(); const descriptionId = useId(); const reduce = useReducedMotion();
  useEffect(() => {
    const dialog = ref.current; if (!dialog || !open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    dialog.showModal(); document.body.style.overflow = "hidden";
    return () => { dialog.close(); document.body.style.overflow = overflow; if (previous?.isConnected) previous.focus(); };
  }, [open]);
  return <dialog ref={ref} className="modal" style={{position:"fixed",inset:"50% auto auto 50%",transform:"translate(-50%, -50%)",margin:0}} aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} aria-busy={busy || undefined} onKeyDown={e => {
    if (e.key !== "Tab") return;
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled):not([type="hidden"]):not([tabindex="-1"]), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]')).filter(item => item.getClientRects().length > 0);
    const first = items[0]; const last = items[items.length - 1];
    if (!first) { e.preventDefault(); e.currentTarget.focus(); }
    else if (e.shiftKey && (document.activeElement === first || !e.currentTarget.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }} onCancel={e => { e.preventDefault(); if (!busy) onClose(); }} onClick={e => { if (e.target !== e.currentTarget || busy) return; const r = e.currentTarget.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) onClose(); }}>
    {open && <motion.div initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .18 }} className="modal-inner"><div className="modal-heading"><h2 id={titleId}>{title}</h2><IconButton label="Close dialog" onClick={onClose} disabled={busy}><HiOutlineXMark /></IconButton></div>{description && <p id={descriptionId} className="muted">{description}</p>}<div className="modal-body">{children}</div>{footer && <div className="modal-footer">{footer}</div>}</motion.div>}
  </dialog>;
}
export function ConfirmModal({ open, onClose, onConfirm, title, description, pending = false, confirmLabel = "Confirm" }: { open: boolean; onClose: () => void; onConfirm: () => void; title: string; description: string; pending?: boolean; confirmLabel?: string }) {
  return <Modal open={open} onClose={onClose} busy={pending} title={title} description={description} footer={<><Button variant="secondary" onClick={onClose} disabled={pending}>Cancel</Button><Button variant="danger" onClick={onConfirm} pending={pending}>{pending ? "Please wait…" : confirmLabel}</Button></>} />;
}
