export const PRIMARY_ADMIN_EMAIL = "fenrisulfr696@gmail.com";

const fallbackAdminEmails = [PRIMARY_ADMIN_EMAIL];

export const allowedRoles = [
  "ADMIN",
  "MODERATOR",
  "GUIDE_WRITER",
  "TOP_MEMBER",
  "MEMBER",
] as const;

export type AllowedRole = (typeof allowedRoles)[number];

export function getAdminEmails() {
  const configured = process.env.ADMIN_EMAILS?.split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return configured?.length ? configured : fallbackAdminEmails;
}

export function isAdminEmail(email?: string | null) {
  return Boolean(email && getAdminEmails().includes(email.toLowerCase()));
}

export function isProtectedAdminEmail(email?: string | null) {
  return Boolean(email && email.toLowerCase() === PRIMARY_ADMIN_EMAIL);
}

export function normalizeRole(role?: string | null): AllowedRole {
  return allowedRoles.includes(role as AllowedRole)
    ? (role as AllowedRole)
    : "MEMBER";
}
