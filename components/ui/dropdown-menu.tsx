"use client";
import { useEffect, useRef } from "react";
import { HiOutlineChevronDown } from "react-icons/hi2";
export function DropdownMenu({ label, items }: { label: string; items: { label: string; onSelect: () => void; disabled?: boolean }[] }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = (event: PointerEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) ref.current.open = false; };
    document.addEventListener("pointerdown", close); return () => document.removeEventListener("pointerdown", close);
  }, []);
  return <details ref={ref} className="dropdown" onKeyDown={e => {
    const root = ref.current; if (!root) return;
    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>("button:not(:disabled)")); const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "Escape") { e.preventDefault(); root.open = false; root.querySelector("summary")?.focus(); }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) { e.preventDefault(); root.open = true; const next = e.key === "Home" ? 0 : e.key === "End" ? buttons.length - 1 : e.key === "ArrowDown" ? (index + 1) % buttons.length : (index - 1 + buttons.length) % buttons.length; buttons[next]?.focus(); }
  }} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) e.currentTarget.open = false; }}><summary className="button button-secondary">{label}<HiOutlineChevronDown aria-hidden="true" /></summary><div className="dropdown-panel">{items.map(item => <button type="button" disabled={item.disabled} key={item.label} onClick={() => { item.onSelect(); if (ref.current) { ref.current.open = false; ref.current.querySelector("summary")?.focus(); } }}>{item.label}</button>)}</div></details>;
}
