const warningSslModes = new Set(["prefer", "require", "verify-ca"]);

export function normalizeDatabaseUrl(value: string) {
  try {
    const url = new URL(value);
    const sslMode = url.searchParams.get("sslmode");

    if (sslMode && warningSslModes.has(sslMode)) {
      url.searchParams.set("sslmode", "verify-full");
    }

    return url.toString();
  } catch {
    return value;
  }
}

export function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return normalizeDatabaseUrl(databaseUrl);
}
