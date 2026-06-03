export function safeReturnPath(value?: string | string[] | null) {
  const raw = Array.isArray(value) ? value[0] : value;

  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/";
  }

  if (raw.startsWith("/api/auth")) {
    return "/";
  }

  return raw;
}

export function loginPath(callbackUrl?: string | string[] | null) {
  const returnPath = safeReturnPath(callbackUrl);

  return `/auth/login?callbackUrl=${encodeURIComponent(returnPath)}`;
}

export function usernameSetupPath(callbackUrl?: string | string[] | null) {
  const params = new URLSearchParams({
    callbackUrl: safeReturnPath(callbackUrl),
  });

  return `/auth/username?${params.toString()}`;
}
