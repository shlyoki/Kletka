const windowMs = 60 * 1000;
const maxRequests = 20;
const buckets = new Map<string, { count: number; expires: number }>();

export function checkRateLimit(key: string) {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || entry.expires < now) {
    buckets.set(key, { count: 1, expires: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }
  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }
  entry.count += 1;
  return { allowed: true, remaining: maxRequests - entry.count };
}
