import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { promotionalBanners } from "@/lib/db/schemas";
import { updatePromotionalBannerSchema } from "@/lib/validations/promotional-banner";
import { bannerCache } from "@/lib/cache/banner-cache";
import { z } from "zod";

interface Context {
    params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: Context) {
    try {
        const { id } = await context.params;
        
        const banner = await db
            .select()
            .from(promotionalBanners)
            .where(eq(promotionalBanners.id, id))
            .limit(1);

        if (!banner[0]) {
            return NextResponse.json(
                { error: "Promotional banner not found" },
                { status: 404 }
            );
        }

        // Transform null values to undefined for TypeScript compatibility
        const transformedBanner = {
            ...banner[0],
            ctaLabel: banner[0].ctaLabel ?? undefined,
            ctaLink: banner[0].ctaLink ?? undefined,
        };

        return NextResponse.json(transformedBanner);
    } catch (error) {
        console.error("Error fetching promotional banner:", error);
        return NextResponse.json(
            { error: "Failed to fetch promotional banner" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest, context: Context) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;
        const body = await request.json();
        const validatedData = updatePromotionalBannerSchema.parse(body);

        const updatedBanner = await db
            .update(promotionalBanners)
            .set(validatedData)
            .where(eq(promotionalBanners.id, id))
            .returning();

        if (!updatedBanner[0]) {
            return NextResponse.json(
                { error: "Promotional banner not found" },
                { status: 404 }
            );
        }

        // Clear all banner caches since a banner was updated
        bannerCache.clear();
        console.log("Cache cleared after updating banner");

        // Transform null values to undefined for TypeScript compatibility
        const transformedBanner = {
            ...updatedBanner[0],
            ctaLabel: updatedBanner[0].ctaLabel ?? undefined,
            ctaLink: updatedBanner[0].ctaLink ?? undefined,
        };

        return NextResponse.json(transformedBanner);
    } catch (error) {
        console.error("Error updating promotional banner:", error);
        
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation error", details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to update promotional banner" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, context: Context) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;

        const deletedBanner = await db
            .delete(promotionalBanners)
            .where(eq(promotionalBanners.id, id))
            .returning();

        if (!deletedBanner[0]) {
            return NextResponse.json(
                { error: "Promotional banner not found" },
                { status: 404 }
            );
        }

        // Clear all banner caches since a banner was deleted
        bannerCache.clear();
        console.log("Cache cleared after deleting banner");

        return NextResponse.json({ message: "Promotional banner deleted successfully" });
    } catch (error) {
        console.error("Error deleting promotional banner:", error);
        return NextResponse.json(
            { error: "Failed to delete promotional banner" },
            { status: 500 }
        );
    }
}
