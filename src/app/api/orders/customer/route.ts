import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrdersByCustomerId } from "@/lib/db/queries/orders";

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "20");
        const page = parseInt(searchParams.get("page") || "1");
        const status = searchParams.get("status");

        const orders = await getOrdersByCustomerId(userId, {
            limit,
            page,
            status: status as any
        });

        return NextResponse.json({
            success: true,
            data: orders,
            message: "Orders fetched successfully"
        });

    } catch (error) {
        console.error("Error in customer orders API:", error);
        return NextResponse.json(
            { 
                success: false, 
                error: "Internal server error",
                message: "Failed to fetch orders"
            },
            { status: 500 }
        );
    }
}
