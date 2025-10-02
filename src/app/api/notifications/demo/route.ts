import { queries } from "@/lib/db/queries";
import { NotificationHelpers } from "@/lib/utils/notifications";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// POST /api/notifications/demo - Create demo notifications (admin only)
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user is admin/mod
        const user = await queries.user.get(userId);
        if (!user || !["admin", "mod"].includes(user.role)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const { type } = body;

        let result;

        switch (type) {
            case "new_order":
                result = await NotificationHelpers.newOrder(
                    "ORDER-" + Date.now(),
                    299.99,
                    "John Doe"
                );
                break;

            case "low_stock":
                result = await NotificationHelpers.lowStock(
                    "PROD-" + Date.now(),
                    "iPhone 15 Pro",
                    5,
                    10
                );
                break;

            case "customer_inquiry":
                result = await NotificationHelpers.customerInquiry(
                    "Jane Smith",
                    "Question about shipping times"
                );
                break;

            case "payment_received":
                result = await NotificationHelpers.paymentReceived(
                    "ORDER-" + Date.now(),
                    199.99,
                    "Mike Johnson"
                );
                break;

            case "order_cancelled":
                result = await NotificationHelpers.orderCancelled(
                    "ORDER-" + Date.now(),
                    "Sarah Wilson",
                    "Changed mind"
                );
                break;

            case "product_review":
                result = await NotificationHelpers.productReview(
                    "PROD-" + Date.now(),
                    "MacBook Pro",
                    5,
                    "Alex Brown"
                );
                break;

            case "system_alert":
                result = await NotificationHelpers.systemAlert(
                    "System Maintenance",
                    "Scheduled maintenance will begin in 30 minutes",
                    "high"
                );
                break;

            case "all":
                // Create one of each type for testing
                const promises = [
                    NotificationHelpers.newOrder("ORDER-" + Date.now(), 299.99, "John Doe"),
                    NotificationHelpers.lowStock("PROD-" + Date.now(), "iPhone 15 Pro", 2, 10),
                    NotificationHelpers.customerInquiry("Jane Smith", "Question about shipping"),
                    NotificationHelpers.paymentReceived("ORDER-" + Date.now(), 199.99, "Mike Johnson"),
                    NotificationHelpers.productReview("PROD-" + Date.now(), "MacBook Pro", 4, "Alex Brown"),
                ];
                
                result = await Promise.all(promises);
                break;

            default:
                return NextResponse.json(
                    { error: "Invalid notification type. Use: new_order, low_stock, customer_inquiry, payment_received, order_cancelled, product_review, system_alert, or all" },
                    { status: 400 }
                );
        }

        return NextResponse.json({
            success: true,
            message: `Demo ${type} notification(s) created`,
            result,
        });
    } catch (error) {
        console.error("Error creating demo notification:", error);
        return NextResponse.json(
            { error: "Failed to create demo notification" },
            { status: 500 }
        );
    }
}