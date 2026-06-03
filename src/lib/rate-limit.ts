import { headers } from "next/headers";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  identity: string;
  limit: number;
  scope: string;
  windowMs: number;
};

declare global {
  var __skiaRateLimits: Map<string, RateLimitBucket> | undefined;
}

const buckets = globalThis.__skiaRateLimits ?? new Map<string, RateLimitBucket>();
globalThis.__skiaRateLimits = buckets;

export class RateLimitError extends Error {
  constructor(message = "Terlalu banyak aksi. Coba lagi sebentar.") {
    super(message);
    this.name = "RateLimitError";
  }
}

function getClientIp(requestHeaders: Headers) {
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0];
  return (
    forwardedFor?.trim() ||
    requestHeaders.get("x-real-ip")?.trim() ||
    requestHeaders.get("cf-connecting-ip")?.trim() ||
    "unknown"
  );
}

function pruneExpiredBuckets(now: number) {
  if (buckets.size < 500) {
    return;
  }

  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export async function enforceRateLimit({
  identity,
  limit,
  scope,
  windowMs,
}: RateLimitOptions) {
  const requestHeaders = await headers();
  const now = Date.now();
  const key = `${scope}:${identity}:${getClientIp(requestHeaders)}`;
  const bucket = buckets.get(key);

  pruneExpiredBuckets(now);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (bucket.count >= limit) {
    throw new RateLimitError();
  }

  bucket.count += 1;
}
