import { queries } from "@/lib/db/queries";
import { getAllPromotionalBannersByLocation } from "@/lib/db/queries/promotional-banner";
import { CResponse, handleError } from "@/lib/utils";
import { withCors } from "@/lib/utils/cors";
import { withRateLimit, apiRateLimiter } from "@/lib/utils/rate-limit";
import { NextRequest, NextResponse } from "next/server";

async function getHomepageDataHandler(req: NextRequest): Promise<NextResponse> {
    try {
        // Batch all homepage data in parallel for better performance
        const [newArrivals, marketedProducts, bestSellers, banners] = await Promise.all([
            queries.product.getNewArrivals({ limit: 3 }),
            queries.product.getMarketedProducts({ limit: 10 }),
            queries.product.getNewArrivals({ limit: 3 }), // Using new arrivals for best sellers for now
            getAllPromotionalBannersByLocation("homepage"),
        ]);

        return CResponse({
            message: "OK",
            data: {
                newArrivals,
                marketedProducts,
                bestSellers,
                banners,
            },
        });
    } catch (err) {
        return handleError(err);
    }
}

export const GET = withCors(
    async (req: NextRequest) => {
        // Apply rate limiting
        const rateLimitResponse = await withRateLimit(req, apiRateLimiter);
        if (rateLimitResponse) return rateLimitResponse;
        
        return getHomepageDataHandler(req);
    }
);