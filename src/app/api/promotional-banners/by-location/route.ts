import { NextRequest, NextResponse } from "next/server";
import { getAllPromotionalBannersByLocation } from "@/lib/db/queries/promotional-banner";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const location = searchParams.get("location");

        const banners = await getAllPromotionalBannersByLocation(location || undefined);

        return NextResponse.json(banners);
    } catch (error) {
        console.error("Error fetching promotional banners by location:", error);
        return NextResponse.json(
            { error: "Failed to fetch promotional banners" },
            { status: 500 }
        );
    }
}