export function getSiteUrl() {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";
  const normalized = url.startsWith("http") ? url : `https://${url}`;

  return normalized.replace(/\/+$/, "");
}
