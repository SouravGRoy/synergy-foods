import { REDIS_RETENTIONS } from "@/config/const";
import { queries } from "@/lib/db/queries";
import { generateCustomCacheKey, parseToJSON } from "@/lib/utils";
import { CachedBanner, cachedBannerSchema } from "@/lib/validations";
import { getAllKeys, redis } from "..";

class BannerCache {
    async scan(location?: string) {
        const [count, keys] = await Promise.all([
            queries.banner.count({ location }),
            getAllKeys(generateCustomCacheKey([undefined, location], "banner")),
        ]);

        if (count !== keys.length) {
            await this.drop();

            const dbData = await queries.banner.scan({ location });
            if (!dbData) return [];

            const cached = cachedBannerSchema
                .array()
                .parse(dbData)
                .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

            await this.batch(cached);
            return cached;
        }
        if (!keys.length) return [];

        const cached = await redis.mget(...keys);
        return cachedBannerSchema
            .array()
            .parse(
                cached
                    .map((c) => parseToJSON(c))
                    .filter((c): c is CachedBanner => c !== null)
            );
    }

    async get(id: string) {
        const key = generateCustomCacheKey([id, undefined], "banner");

        const cachedRaw = await redis.get(key);
        let cached = cachedBannerSchema
            .nullable()
            .parse(parseToJSON(cachedRaw));

        if (!cached) {
            const dbData = await queries.banner.get(id);
            if (!dbData) return null;

            cached = cachedBannerSchema.parse(dbData);
            await this.add(cached);
        }

        return cached;
    }

    async add(values: CachedBanner) {
        const key = generateCustomCacheKey(
            [values.id, values.location],
            "banner"
        );
        return await redis.set(
            key,
            JSON.stringify(values),
            "EX",
            REDIS_RETENTIONS["1w"]
        );
    }

    async batch(values: CachedBanner[]) {
        const multi = redis.multi();

        for (const value of values) {
            const key = generateCustomCacheKey(
                [value.id, value.location],
                "banner"
            );
            multi.set(key, JSON.stringify(value), "EX", REDIS_RETENTIONS["1w"]);
        }

        return await multi.exec();
    }

    async remove(id: string) {
        const key = generateCustomCacheKey([id, undefined], "banner");
        return await redis.del(key);
    }

    async drop() {
        const keys = await getAllKeys(
            generateCustomCacheKey([undefined, undefined], "banner")
        );
        if (!keys.length) return 0;
        return await redis.del(...keys);
    }
}

export const bannerCache = new BannerCache();