import { roles, type Role } from "@/types/auth";
export function isRole(value: unknown): value is Role { return typeof value === "string" && roles.includes(value as Role); }
export function canAccess(path: string, role: Role): boolean {
  if(path==="/dashboard")return true;
  const section=path.split("/")[2];
  const access:Record<string,readonly Role[]>={media:["teacher","content_creator","super_admin"],profile:roles,notifications:roles,courses:["learner"],users:["super_admin"],schools:["super_admin"],languages:["super_admin"],admin:["super_admin"],members:["school_admin","super_admin"],children:["parent"],content:["teacher","content_creator","super_admin"],classes:["teacher","school_admin","learner","super_admin"],assignments:["learner","teacher","school_admin","super_admin"],reports:["teacher","school_admin","super_admin"],learn:["learner"],quizzes:["learner"],progress:["learner"],achievements:["learner"],games:["learner"],certificates:["learner","super_admin"]};
  return access[section]?.includes(role)??false;
}
export function safeReturnTo(value: string | null | undefined): string {
  if (!value || !value.startsWith("/dashboard") || /[\\\r\n]/.test(value)) return "/dashboard";
  try { const parsed = new URL(value, "https://atupa.invalid"); return parsed.origin === "https://atupa.invalid" && (parsed.pathname === "/dashboard" || parsed.pathname.startsWith("/dashboard/")) ? parsed.pathname + parsed.search : "/dashboard"; } catch { return "/dashboard"; }
}
