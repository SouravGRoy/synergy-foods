import { queries } from "@/lib/db/queries";
import { CResponse, handleError } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "10");
        const categoryId = searchParams.get("categoryId") || undefined;
        const subcategoryId = searchParams.get("subcategoryId") || undefined;
        const productTypeId = searchParams.get("productTypeId") || undefined;

        const data = await queries.product.getMarketedProducts({
            limit: Math.min(limit, 10), // Max 10 as per business rule
            categoryId,
            subcategoryId,
            productTypeId,
        });

        return CResponse({ data });
    } catch (error: any) {
        return handleError(error);
    }
}
