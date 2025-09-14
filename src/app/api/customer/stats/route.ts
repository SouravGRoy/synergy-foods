import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schemas";
import { eq, count, sum, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get order stats
        const [orderStats] = await db
            .select({
                totalOrders: count(),
                totalSpent: sum(orders.total),
            })
            .from(orders)
            .where(eq(orders.userId, userId));

        // Get recent orders
        const recentOrders = await db
            .select()
            .from(orders)
            .where(eq(orders.userId, userId))
            .orderBy(desc(orders.createdAt))
            .limit(5);

        // Get order status counts
        const statusCounts = await db
            .select({
                status: orders.status,
                count: count(),
            })
            .from(orders)
            .where(eq(orders.userId, userId))
            .groupBy(orders.status);

        const stats = {
            totalOrders: orderStats.totalOrders || 0,
            totalSpent: parseFloat(orderStats.totalSpent || "0"),
            recentOrders,
            statusCounts: statusCounts.reduce((acc, curr) => {
                acc[curr.status] = curr.count;
                return acc;
            }, {} as Record<string, number>),
        };

        return NextResponse.json({
            success: true,
            data: stats,
            message: "Customer stats fetched successfully"
        });

    } catch (error) {
        console.error("Error in customer stats API:", error);
        return NextResponse.json(
            { 
                success: false, 
                error: "Internal server error",
                message: "Failed to fetch customer stats"
            },
            { status: 500 }
        );
    }
}
