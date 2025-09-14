import { db } from "@/lib/db";
import { promotionalBanners } from "@/lib/db/schemas";
import { eq, desc, and } from "drizzle-orm";
import { PromotionalBanner, VALID_LOCATIONS } from "@/lib/validations/promotional-banner";
import { bannerCache, getCacheKey } from "@/lib/cache/banner-cache";

// Helper function to transform database result to TypeScript type
function transformBanner(banner: any): PromotionalBanner {
    return {
        ...banner,
        ctaLabel: banner.ctaLabel ?? undefined,
        ctaLink: banner.ctaLink ?? undefined,
        location: banner.location ? (VALID_LOCATIONS.includes(banner.location) ? banner.location : undefined) : undefined,
    };
}

export async function getPromotionalBannersByLocation(location?: string): Promise<PromotionalBanner[]> {
    // Try cache first
    const cacheKey = getCacheKey(undefined, location);
    const cached = bannerCache.get<PromotionalBanner[]>(cacheKey);
    if (cached) {
        console.log(`Cache hit for banners: ${cacheKey}`);
        return cached;
    }

    try {
        const conditions = [eq(promotionalBanners.isActive, true)];
        
        // If location is provided, filter by it, otherwise get all active banners
        if (location) {
            conditions.push(eq(promotionalBanners.location, location));
        }

        const banners = await db
            .select()
            .from(promotionalBanners)
            .where(and(...conditions))
            .orderBy(desc(promotionalBanners.order), desc(promotionalBanners.createdAt));

        // Transform null values to undefined for TypeScript compatibility
        const result = banners.map(transformBanner);

        // Cache the result for 5 minutes
        bannerCache.set(cacheKey, result, 5 * 60 * 1000);
        console.log(`Cached banners: ${cacheKey}`);
        
        return result;
    } catch (error) {
        console.error("Error fetching promotional banners:", error);
        return [];
    }
}

export async function getAllActivePromotionalBanners(): Promise<PromotionalBanner[]> {
    // Try cache first
    const cacheKey = getCacheKey(undefined, undefined, "all-active");
    const cached = bannerCache.get<PromotionalBanner[]>(cacheKey);
    if (cached) {
        console.log(`Cache hit for all active banners: ${cacheKey}`);
        return cached;
    }

    try {
        const banners = await db
            .select()
            .from(promotionalBanners)
            .where(eq(promotionalBanners.isActive, true))
            .orderBy(desc(promotionalBanners.order), desc(promotionalBanners.createdAt));

        // Transform null values to undefined for TypeScript compatibility
        const result = banners.map(transformBanner);

        // Cache the result for 5 minutes
        bannerCache.set(cacheKey, result, 5 * 60 * 1000);
        console.log(`Cached all active banners: ${cacheKey}`);

        return result;
    } catch (error) {
        console.error("Error fetching promotional banners:", error);
        return [];
    }
}

export async function getPromotionalBannersByType(
    type: "carousel" | "type1" | "type2" | "type3" | "type4",
    location?: string
): Promise<PromotionalBanner[]> {
    // Try cache first
    const cacheKey = getCacheKey(type, location);
    const cached = bannerCache.get<PromotionalBanner[]>(cacheKey);
    if (cached) {
        console.log(`Cache hit for banners: ${cacheKey}`);
        return cached;
    }

    try {
        const conditions = [
            eq(promotionalBanners.isActive, true),
            eq(promotionalBanners.type, type)
        ];

        if (location) {
            conditions.push(eq(promotionalBanners.location, location));
        }

        const banners = await db
            .select()
            .from(promotionalBanners)
            .where(and(...conditions))
            .orderBy(desc(promotionalBanners.order), desc(promotionalBanners.createdAt));

        // Transform null values to undefined for TypeScript compatibility
        const result = banners.map(transformBanner);

        // Cache the result for 5 minutes
        bannerCache.set(cacheKey, result, 5 * 60 * 1000);
        console.log(`Cached banners: ${cacheKey}`);

        return result;
    } catch (error) {
        console.error(`Error fetching promotional banners of type ${type}:`, error);
        return [];
    }
}

// Specific helper functions for each banner type
export async function getCarouselBanners(location?: string): Promise<PromotionalBanner[]> {
    return getPromotionalBannersByType("carousel", location);
}

export async function getType1Banners(location?: string): Promise<PromotionalBanner[]> {
    return getPromotionalBannersByType("type1", location);
}

export async function getType2Banners(location?: string): Promise<PromotionalBanner[]> {
    return getPromotionalBannersByType("type2", location);
}

export async function getType3Banners(location?: string): Promise<PromotionalBanner[]> {
    return getPromotionalBannersByType("type3", location);
}

export async function getType4Banners(location?: string): Promise<PromotionalBanner[]> {
    return getPromotionalBannersByType("type4", location);
}

// Optimized function to fetch all banner types in one query
export async function getAllPromotionalBannersByLocation(
    location?: string
): Promise<{
    carousel: PromotionalBanner[];
    type1: PromotionalBanner[];
    type2: PromotionalBanner[];
    type3: PromotionalBanner[];
    type4: PromotionalBanner[];
}> {
    // Try cache first
    const cacheKey = getCacheKey(undefined, location, "all-types");
    const cached = bannerCache.get<{
        carousel: PromotionalBanner[];
        type1: PromotionalBanner[];
        type2: PromotionalBanner[];
        type3: PromotionalBanner[];
        type4: PromotionalBanner[];
    }>(cacheKey);
    
    if (cached) {
        console.log(`Cache hit for all banner types: ${cacheKey}`);
        return cached;
    }

    try {
        const conditions = [eq(promotionalBanners.isActive, true)];
        
        if (location) {
            conditions.push(eq(promotionalBanners.location, location));
        }

        const banners = await db
            .select()
            .from(promotionalBanners)
            .where(and(...conditions))
            .orderBy(desc(promotionalBanners.order), desc(promotionalBanners.createdAt));

        // Transform null values and group by type
        const transformedBanners = banners.map(transformBanner);

        // Group banners by type
        const grouped = {
            carousel: transformedBanners.filter((b) => b.type === "carousel"),
            type1: transformedBanners.filter((b) => b.type === "type1"),
            type2: transformedBanners.filter((b) => b.type === "type2"),
            type3: transformedBanners.filter((b) => b.type === "type3"),
            type4: transformedBanners.filter((b) => b.type === "type4"),
        };

        // Cache the result for 5 minutes
        bannerCache.set(cacheKey, grouped, 5 * 60 * 1000);
        console.log(`Cached all banner types: ${cacheKey}`);

        return grouped;
    } catch (error) {
        console.error("Error fetching all promotional banners:", error);
        return {
            carousel: [],
            type1: [],
            type2: [],
            type3: [],
            type4: [],
        };
    }
}
