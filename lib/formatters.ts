export function formatNumber(value: number, options?: Intl.NumberFormatOptions) {
  return Number.isFinite(value) ? new Intl.NumberFormat("en-NG", options).format(value) : "—";
}
export function formatDate(value: string | Date, options?: Intl.DateTimeFormatOptions) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-NG", { timeZone: "Africa/Lagos", ...(options ?? { dateStyle: "medium" }) }).format(date);
}
export function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "—";
  const minutes = Math.floor(seconds / 60); return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`;
}
