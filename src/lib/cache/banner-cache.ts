// Simple in-memory cache for promotional banners
// Prevents database queries on every page load

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
}

class SimpleCache {
    private cache = new Map<string, CacheEntry<any>>();
    private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes default

    set<T>(key: string, data: T, ttl?: number): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttl || this.defaultTTL,
        });
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        
        if (!entry) {
            return null;
        }

        // Check if cache entry has expired
        if (Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    clear(): void {
        this.cache.clear();
    }

    // Clean up expired entries
    cleanup(): void {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > entry.ttl) {
                this.cache.delete(key);
            }
        }
    }

    // Get cache stats
    getStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
        };
    }
}

// Singleton cache instance
export const bannerCache = new SimpleCache();

// Auto cleanup every 10 minutes
setInterval(() => {
    bannerCache.cleanup();
}, 10 * 60 * 1000);

// Helper function to generate cache keys
export const getCacheKey = (type?: string, location?: string, suffix?: string) => {
    const parts = ['banners'];
    if (type) parts.push(`type:${type}`);
    if (location) parts.push(`location:${location}`);
    if (suffix) parts.push(suffix);
    return parts.join(':');
};
