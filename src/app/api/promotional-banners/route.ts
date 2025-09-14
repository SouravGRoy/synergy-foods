import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { promotionalBanners } from "@/lib/db/schemas";
import { createPromotionalBannerSchema } from "@/lib/validations/promotional-banner";
import { bannerCache } from "@/lib/cache/banner-cache";
import { z } from "zod";

const querySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().nullable().optional().transform(val => val ?? undefined),
    location: z.string().nullable().optional().transform(val => val ?? undefined),
    type: z.enum(["carousel", "type1", "type2", "type3", "type4"]).nullable().optional().transform(val => val ?? undefined),
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const { page, limit, search, location, type } = querySchema.parse({
            page: searchParams.get("page"),
            limit: searchParams.get("limit"),
            search: searchParams.get("search"),
            location: searchParams.get("location"),
            type: searchParams.get("type"),
        });

        const offset = (page - 1) * limit;

        const whereConditions = [];
        
        if (search) {
            whereConditions.push(
                or(
                    ilike(promotionalBanners.title, `%${search}%`),
                    ilike(promotionalBanners.description, `%${search}%`)
                )
            );
        }
        
        if (location) {
            whereConditions.push(eq(promotionalBanners.location, location));
        }

        if (type) {
            whereConditions.push(eq(promotionalBanners.type, type));
        }

        const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

        const [bannersResult, totalResult] = await Promise.all([
            db
                .select()
                .from(promotionalBanners)
                .where(whereClause)
                .orderBy(desc(promotionalBanners.order), desc(promotionalBanners.createdAt))
                .limit(limit)
                .offset(offset),
            db
                .select({ count: count() })
                .from(promotionalBanners)
                .where(whereClause),
        ]);

        const total = totalResult[0]?.count || 0;
        const totalPages = Math.ceil(total / limit);

        // Transform null values to undefined for TypeScript compatibility
        const transformedBanners = bannersResult.map(banner => ({
            ...banner,
            ctaLabel: banner.ctaLabel ?? undefined,
            ctaLink: banner.ctaLink ?? undefined,
        }));

        return NextResponse.json({
            data: transformedBanners,
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        });
    } catch (error) {
        console.error("Error fetching promotional banners:", error);
        return NextResponse.json(
            { error: "Failed to fetch promotional banners" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const validatedData = createPromotionalBannerSchema.parse(body);

        // Ensure location has a default value if not provided
        const dataToInsert = {
            ...validatedData,
            location: validatedData.location || "global", // Default to "global" if no location specified
        };

        const newBanner = await db
            .insert(promotionalBanners)
            .values(dataToInsert)
            .returning();

        // Clear all banner caches since a new banner was created
        bannerCache.clear();
        console.log("Cache cleared after creating new banner");

        // Transform null values to undefined for TypeScript compatibility
        const transformedBanner = {
            ...newBanner[0],
            ctaLabel: newBanner[0].ctaLabel ?? undefined,
            ctaLink: newBanner[0].ctaLink ?? undefined,
        };

        return NextResponse.json(transformedBanner, { status: 201 });
    } catch (error) {
        console.error("Error creating promotional banner:", error);
        
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation error", details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create promotional banner" },
            { status: 500 }
        );
    }
}
