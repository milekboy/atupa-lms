import { roles, type Role } from "@/types/auth";
export function isRole(value: unknown): value is Role { return typeof value === "string" && roles.includes(value as Role); }
export function canAccess(path: string, role: Role): boolean {
  const section = path.split("/")[2];
  if (["users", "schools", "languages", "admin"].includes(section)) return role === "super_admin";
  if (section === "children") return role === "parent";
  if (section === "content") return ["teacher", "content_creator", "super_admin"].includes(role);
  if (section === "classes") return ["teacher", "school_admin", "learner", "super_admin"].includes(role);
  if (["learn", "quizzes", "progress", "achievements", "games"].includes(section)) return role === "learner";
  return true;
}
export function safeReturnTo(value: string | null | undefined): string {
  if (!value || !value.startsWith("/dashboard") || /[\\\r\n]/.test(value)) return "/dashboard";
  try { const parsed = new URL(value, "https://atupa.invalid"); return parsed.origin === "https://atupa.invalid" && (parsed.pathname === "/dashboard" || parsed.pathname.startsWith("/dashboard/")) ? parsed.pathname + parsed.search : "/dashboard"; } catch { return "/dashboard"; }
}
