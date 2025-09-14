import { auth } from "@clerk/nextjs/server";
import { queries } from "@/lib/db/queries";
import { AppError, CResponse, handleError } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new AppError("Unauthorized", "UNAUTHORIZED");
        }

        const { id } = await params;
        const { isMarketed } = await request.json();

        // Check if user owns the product or is admin
        const product = await queries.product.get({ id });
        if (!product) {
            throw new AppError("Product not found", "NOT_FOUND");
        }

        if (product.uploaderId !== userId) {
            throw new AppError("You can only update your own products", "FORBIDDEN");
        }

        // Check marketing limit (10 products max)
        if (isMarketed) {
            const currentMarketedCount = await queries.product.getMarketedCount();
            if (currentMarketedCount >= 10) {
                throw new AppError("Maximum 10 products can be marketed at once. Please unmarket a product first.", "BAD_REQUEST");
            }
        }

        const updatedProduct = await queries.product.updateMarketingStatus(id, isMarketed);

        return CResponse({ data: updatedProduct });
    } catch (error: any) {
        return handleError(error);
    }
}
