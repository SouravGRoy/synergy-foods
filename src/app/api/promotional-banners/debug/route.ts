import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { promotionalBanners } from "@/lib/db/schemas";

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get all promotional banners to inspect
        const banners = await db
            .select()
            .from(promotionalBanners)
            .orderBy(promotionalBanners.createdAt);

        console.log("Current promotional banners:", banners);

        return NextResponse.json({
            message: "Promotional banners data",
            count: banners.length,
            banners: banners.map(banner => ({
                id: banner.id,
                title: banner.title,
                type: banner.type,
                media: banner.media,
                mediaCount: Array.isArray(banner.media) ? banner.media.length : 0,
                location: banner.location,
                isActive: banner.isActive,
                createdAt: banner.createdAt
            }))
        });
    } catch (error) {
        console.error("Error fetching promotional banners:", error);
        return NextResponse.json(
            { error: "Failed to fetch promotional banners" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Delete all promotional banners (for cleanup)
        await db.delete(promotionalBanners);

        return NextResponse.json({
            message: "All promotional banners deleted"
        });
    } catch (error) {
        console.error("Error deleting promotional banners:", error);
        return NextResponse.json(
            { error: "Failed to delete promotional banners" },
            { status: 500 }
        );
    }
}
