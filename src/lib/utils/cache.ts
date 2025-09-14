import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export interface CacheOptions {
  ttl: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
  revalidate?: number; // ISR revalidation time
  vary?: string[]; // Vary headers for cache keys
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  tags?: string[];
}

/**
 * Response caching utility with Redis backend
 */
export class ResponseCache {
  private static instance: ResponseCache;
  
  private constructor() {}

  public static getInstance(): ResponseCache {
    if (!ResponseCache.instance) {
      ResponseCache.instance = new ResponseCache();
    }
    return ResponseCache.instance;
  }

  /**
   * Generate cache key from request
   */
  private generateCacheKey(request: NextRequest, customKey?: string): string {
    if (customKey) return `cache:${customKey}`;
    
    const url = new URL(request.url);
    const pathname = url.pathname;
    const searchParams = url.searchParams.toString();
    const baseKey = `${pathname}${searchParams ? `?${searchParams}` : ''}`;
    
    return `cache:${baseKey}`;
  }

  /**
   * Get cached response
   */
  async get<T = any>(
    request: NextRequest, 
    customKey?: string
  ): Promise<CacheEntry<T> | null> {
    try {
      const key = this.generateCacheKey(request, customKey);
      const cached = await redis.get<CacheEntry<T>>(key);
      
      if (!cached) return null;
      
      // Check if cache has expired
      const now = Date.now();
      if (now > cached.timestamp + (cached.ttl * 1000)) {
        await this.delete(request, customKey);
        return null;
      }
      
      return cached;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set cache entry
   */
  async set<T = any>(
    request: NextRequest,
    data: T,
    options: CacheOptions,
    customKey?: string
  ): Promise<void> {
    try {
      const key = this.generateCacheKey(request, customKey);
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl: options.ttl,
        tags: options.tags,
      };
      
      await redis.setex(key, options.ttl, JSON.stringify(entry));
      
      // Store tags for invalidation
      if (options.tags) {
        for (const tag of options.tags) {
          await redis.sadd(`cache:tags:${tag}`, key);
          await redis.expire(`cache:tags:${tag}`, options.ttl);
        }
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Delete cache entry
   */
  async delete(request: NextRequest, customKey?: string): Promise<void> {
    // If Redis is not available, do nothing
    if (!redis) return;
    
    try {
      const key = this.generateCacheKey(request, customKey);
      await redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  /**
   * Invalidate cache by tags
   */
  async invalidateByTags(tags: string[]): Promise<void> {
    // If Redis is not available, do nothing
    if (!redis) return;
    
    try {
      for (const tag of tags) {
        const keys = await redis.smembers(`cache:tags:${tag}`);
        if (keys.length > 0) {
          await redis.del(...keys);
          await redis.del(`cache:tags:${tag}`);
        }
      }
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    // If Redis is not available, do nothing
    if (!redis) return;
    
    try {
      const keys = await redis.keys('cache:*');
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }
}

// Export singleton instance
export const responseCache = ResponseCache.getInstance();

/**
 * Cache middleware wrapper
 */
export function withCache(
  handler: (request: NextRequest) => Promise<NextResponse> | NextResponse,
  options: CacheOptions,
  customKey?: string
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Skip caching for non-GET requests
    if (request.method !== 'GET') {
      return handler(request);
    }

    // Try to get from cache
    const cached = await responseCache.get(request, customKey);
    if (cached) {
      const response = NextResponse.json(cached.data);
      
      // Add cache headers
      response.headers.set('Cache-Control', `max-age=${options.ttl}, stale-while-revalidate=${options.ttl * 2}`);
      response.headers.set('X-Cache', 'HIT');
      response.headers.set('X-Cache-Date', new Date(cached.timestamp).toISOString());
      
      return response;
    }

    // Execute handler
    const response = await handler(request);
    
    // Cache successful responses
    if (response.ok) {
      try {
        const data = await response.clone().json();
        await responseCache.set(request, data, options, customKey);
        
        // Add cache headers
        response.headers.set('Cache-Control', `max-age=${options.ttl}, stale-while-revalidate=${options.ttl * 2}`);
        response.headers.set('X-Cache', 'MISS');
        
      } catch (error) {
        // If response is not JSON, don't cache
        console.warn('Response not cacheable (not JSON):', error);
      }
    }

    return response;
  };
}

/**
 * Predefined cache configurations
 */
export const cacheConfigs = {
  // Short-term cache for frequently changing data
  short: {
    ttl: 300, // 5 minutes
  },
  
  // Medium-term cache for semi-static data
  medium: {
    ttl: 1800, // 30 minutes
  },
  
  // Long-term cache for static data
  long: {
    ttl: 3600, // 1 hour
  },
  
  // Product-specific cache
  products: {
    ttl: 900, // 15 minutes
    tags: ['products'] as string[],
  },
  
  // Category-specific cache
  categories: {
    ttl: 1800, // 30 minutes
    tags: ['categories'] as string[],
  },
  
  // Banner-specific cache
  banners: {
    ttl: 3600, // 1 hour
    tags: ['banners'] as string[],
  },
  
  // User-specific cache
  users: {
    ttl: 600, // 10 minutes
    tags: ['users'] as string[],
  },
};

/**
 * Cache invalidation helpers
 */
export const cacheInvalidation = {
  products: () => responseCache.invalidateByTags(['products']),
  newArrivals: () => responseCache.invalidateByTags(['new-arrivals']),
  categories: () => responseCache.invalidateByTags(['categories']),
  banners: () => responseCache.invalidateByTags(['banners']),
  users: () => responseCache.invalidateByTags(['users']),
  all: () => responseCache.clear(),
};
