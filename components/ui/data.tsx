import type { ReactNode } from "react";
import { HiOutlineInbox, HiOutlineExclamationTriangle } from "react-icons/hi2";
import { Button } from "./controls";

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <header className="page-header"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1>{description && <p className="muted">{description}</p>}</div>{action && <div className="header-actions">{action}</div>}</header>;
}
export function StatCard({ label, value, description, icon }: { label: string; value: ReactNode; description?: string; icon?: ReactNode }) {
  return <article className="stat-card"><div className="stat-top"><span className="muted">{label}</span>{icon && <span aria-hidden="true">{icon}</span>}</div><p className="stat-value">{value}</p>{description && <p className="muted small">{description}</p>}</article>;
}
export function StatusPill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "warning" | "danger" }) { return <span className={`status-pill status-${tone}`}>{children}</span>; }
export function Skeleton({ label = "Loading content", lines = 3 }: { label?: string; lines?: number }) {
  return <div role="status" aria-label={label} className="skeleton-group">{Array.from({ length: lines }, (_, i) => <div key={i} className="skeleton" aria-hidden="true" />)}<span className="sr-only">{label}</span></div>;
}
export function EmptyState({ title = "Nothing here yet", description, action }: { title?: string; description: string; action?: ReactNode }) {
  return <div className="state-panel"><HiOutlineInbox aria-hidden="true" /><h3>{title}</h3><p className="muted">{description}</p>{action}</div>;
}
export function ErrorState({ title = "We couldn't load this", description, onRetry }: { title?: string; description: string; onRetry?: () => void }) {
  return <div className="state-panel error-state" role="alert"><HiOutlineExclamationTriangle aria-hidden="true" /><h3>{title}</h3><p className="muted">{description}</p>{onRetry && <Button variant="secondary" onClick={onRetry}>Try again</Button>}</div>;
}
export type Column<T> = { key: string; header: string; render: (row: T) => ReactNode };
export function DataTable<T>({ caption, rows, columns, rowKey, emptyMessage = "No matching records." }: { caption: string; rows: T[]; columns: Column<T>[]; rowKey: (row: T) => string; emptyMessage?: string }) {
  return <div className="table-scroll" role="region" aria-label={caption} tabIndex={0}><table><caption>{caption}</caption><thead><tr>{columns.map(c => <th key={c.key} scope="col">{c.header}</th>)}</tr></thead><tbody>{rows.length ? rows.map(row => <tr key={rowKey(row)}>{columns.map(c => <td key={c.key}>{c.render(row)}</td>)}</tr>) : <tr><td colSpan={columns.length}>{emptyMessage}</td></tr>}</tbody></table></div>;
}
