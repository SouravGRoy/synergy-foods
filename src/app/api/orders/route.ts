import { NextRequest, NextResponse } from "next/server";
import { getOrders, getOrderById } from "@/lib/db/queries/orders";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get("id");
        const limit = parseInt(searchParams.get("limit") || "10");

        if (orderId) {
            const order = await getOrderById(orderId);
            if (!order) {
                return NextResponse.json(
                    { error: "Order not found" },
                    { status: 404 }
                );
            }
            return NextResponse.json(order);
        }

        const orders = await getOrders(limit);
        return NextResponse.json(orders);

    } catch (error) {
        console.error("Error in orders API:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
