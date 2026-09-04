/**
 * In-Memory Sliding Window Rate Limiter for Next.js API Routes
 * Protects against brute-force password guessing, credential stuffing, and DDoS/scraping.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Automatically prune stale entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  limit?: number; // Maximum number of requests allowed in window
  windowSeconds?: number; // Time window in seconds
}

/**
 * Checks if a request from a specific identifier/IP exceeds the rate limit.
 * @returns { success: boolean, remaining: number, resetSeconds: number }
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): {
  success: boolean;
  remaining: number;
  resetSeconds: number;
} {
  const limit = options.limit || 10;
  const windowMs = (options.windowSeconds || 60) * 1000;
  const now = Date.now();

  const key = identifier || "unknown_ip";
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // New or expired window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      remaining: limit - 1,
      resetSeconds: Math.ceil(windowMs / 1000),
    };
  }

  // Active window
  if (record.count >= limit) {
    const resetSeconds = Math.ceil((record.resetTime - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
    };
  }

  // Increment count
  record.count += 1;
  const resetSeconds = Math.ceil((record.resetTime - now) / 1000);

  return {
    success: true,
    remaining: limit - record.count,
    resetSeconds: Math.max(1, resetSeconds),
  };
}

/**
 * Extracts Client IP address from standard headers (x-forwarded-for, x-real-ip)
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();
  return "127.0.0.1";
}
