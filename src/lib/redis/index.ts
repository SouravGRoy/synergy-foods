import "server-only";

import { env } from "@/../env";
import { Redis } from "ioredis";

let isRedisAvailable = true;

// Create Redis instance with minimal retries to fail fast during builds
const redisClient = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 0, // Don't retry during builds
    enableReadyCheck: false,
    connectTimeout: 1000, // 1 second timeout
    lazyConnect: true,
    retryStrategy: () => {
        isRedisAvailable = false;
        return null;
    },
});

// Suppress error logs during builds
redisClient.on("error", () => {
    isRedisAvailable = false;
});

// Try to connect but don't block
redisClient.connect().catch(() => {
    isRedisAvailable = false;
});

// Proxy to return safe defaults when Redis is unavailable
export const redis = new Proxy(redisClient, {
    get(target, prop) {
        if (!isRedisAvailable && typeof target[prop as keyof Redis] === 'function') {
            return async (...args: any[]) => {
                if (prop === 'get' || prop === 'getex') return null;
                if (prop === 'mget') return [];
                if (prop === 'keys' || prop === 'scan') return ['0', []];
                if (prop === 'exists') return 0;
                return 'OK';
            };
        }
        return target[prop as keyof Redis];
    }
});

export async function getAllKeys(pattern: string): Promise<string[]> {
    if (!isRedisAvailable) return [];
    
    try {
        const keys: string[] = [];
        let cursor = "0";
        do {
            const [nextCursor, scanKeys] = await redis.scan(
                cursor,
                "MATCH",
                pattern,
                "COUNT",
                "1000"
            );
            cursor = nextCursor;
            keys.push(...scanKeys);
        } while (cursor !== "0");

        return keys;
    } catch (error) {
        isRedisAvailable = false;
        return [];
    }
}
