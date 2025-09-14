import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitInfo {
  limit: number;
  current: number;
  remaining: number;
  resetTime: Date;
}

/**
 * Rate limiting middleware for API routes
 */
export class RateLimiter {
  private options: Required<RateLimitOptions>;

  constructor(options: RateLimitOptions) {
    this.options = {
      message: 'Too many requests, please try again later.',
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      ...options,
    };
  }

  async check(request: NextRequest, identifier?: string): Promise<RateLimitInfo> {
    const key = this.generateKey(request, identifier);
    const window = Math.floor(Date.now() / this.options.windowMs);
    const redisKey = `rate_limit:${key}:${window}`;

    try {
      const current = await redis.incr(redisKey);
      
      if (current === 1) {
        // Set expiration only on first request in window
        await redis.expire(redisKey, Math.ceil(this.options.windowMs / 1000));
      }

      const resetTime = new Date((window + 1) * this.options.windowMs);

      return {
        limit: this.options.maxRequests,
        current,
        remaining: Math.max(0, this.options.maxRequests - current),
        resetTime,
      };
    } catch (error) {
      console.error('Rate limit check failed:', error);
      // Fail open - allow request if Redis is down
      return {
        limit: this.options.maxRequests,
        current: 0,
        remaining: this.options.maxRequests,
        resetTime: new Date(Date.now() + this.options.windowMs),
      };
    }
  }

  async isAllowed(request: NextRequest, identifier?: string): Promise<boolean> {
    const info = await this.check(request, identifier);
    return info.current <= info.limit;
  }

  async middleware(
    request: NextRequest,
    identifier?: string
  ): Promise<NextResponse | null> {
    const info = await this.check(request, identifier);

    if (info.current > info.limit) {
      return NextResponse.json(
        { 
          error: this.options.message,
          retryAfter: Math.ceil((info.resetTime.getTime() - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': info.limit.toString(),
            'X-RateLimit-Remaining': info.remaining.toString(),
            'X-RateLimit-Reset': Math.floor(info.resetTime.getTime() / 1000).toString(),
            'Retry-After': Math.ceil((info.resetTime.getTime() - Date.now()) / 1000).toString(),
          }
        }
      );
    }

    return null; // Allow request to continue
  }

  private generateKey(request: NextRequest, identifier?: string): string {
    if (identifier) return identifier;

    // Try to get IP from various headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || 'unknown';

    return `ip:${ip}`;
  }
}

// Predefined rate limiters for common use cases
export const apiRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per 15 minutes
  message: 'Too many API requests, please try again later.',
});

export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 auth attempts per 15 minutes
  message: 'Too many authentication attempts, please try again later.',
});

export const uploadRateLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10, // 10 uploads per hour
  message: 'Too many upload requests, please try again later.',
});

export const searchRateLimiter = new RateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  maxRequests: 30, // 30 searches per minute
  message: 'Too many search requests, please try again later.',
});

/**
 * Helper function to apply rate limiting to API routes
 */
export async function withRateLimit(
  request: NextRequest,
  rateLimiter: RateLimiter,
  identifier?: string
): Promise<NextResponse | null> {
  return rateLimiter.middleware(request, identifier);
}
