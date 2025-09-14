import { queries } from "@/lib/db/queries";
import { CResponse, handleError } from "@/lib/utils";
import { sanitizeNumber, sanitizeString } from "@/lib/utils/sanitization";
import { withCors, corsConfigs } from "@/lib/utils/cors";
import { withRateLimit, apiRateLimiter } from "@/lib/utils/rate-limit";
import { NextRequest, NextResponse } from "next/server";

async function getNewArrivalsHandler(req: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(req.url);

        // Sanitize query parameters
        const limit = sanitizeNumber(searchParams.get("limit")) ?? 10;
        const categoryId = searchParams.get("categoryId") 
            ? sanitizeString(searchParams.get("categoryId")!) 
            : undefined;
        const subcategoryId = searchParams.get("subcategoryId") 
            ? sanitizeString(searchParams.get("subcategoryId")!) 
            : undefined;
        const productTypeId = searchParams.get("productTypeId") 
            ? sanitizeString(searchParams.get("productTypeId")!) 
            : undefined;

        // Validate limit
        const validatedLimit = Math.min(Math.max(limit, 1), 50); // Max 50 items

        const data = await queries.product.getNewArrivals({
            limit: validatedLimit,
            categoryId,
            subcategoryId,
            productTypeId,
        });

        return CResponse({
            message: "OK",
            data,
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
        
        return getNewArrivalsHandler(req);
    },
    corsConfigs.public
);
