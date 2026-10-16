export const roles = ["learner", "parent", "teacher", "school_admin", "content_creator", "super_admin"] as const;
export type Role = typeof roles[number];
export type User = { id: string; role: Role; firstName: string; lastName: string; email?: string };
export type Session = { user: User; accessToken: string; refreshToken: string; accessExpiresAt: number; expiresAt: number };
