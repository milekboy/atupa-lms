"use client";
import { Button } from "./controls";
export function Pagination({ page, pageSize, total, onPageChange }: { page: number; pageSize: number; total: number; onPageChange: (page: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  return <nav aria-label="Pagination" className="pagination"><span className="muted small" aria-live="polite">{total === 0 ? "No results" : `Page ${page} of ${pages} · ${total} results`}</span><div className="button-row"><Button variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</Button><Button variant="secondary" disabled={page >= pages || total === 0} onClick={() => onPageChange(page + 1)}>Next</Button></div></nav>;
}
