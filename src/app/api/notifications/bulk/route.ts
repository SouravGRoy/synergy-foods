import { queries } from "@/lib/db/queries";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// POST /api/notifications/bulk - Bulk actions on notifications
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { action } = body;

        switch (action) {
            case "mark_all_read":
                const updatedNotifications = await queries.notification.markAllAsRead(userId);
                return NextResponse.json({
                    success: true,
                    updated: updatedNotifications.length,
                });

            default:
                return NextResponse.json(
                    { error: "Invalid action" },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error("Error performing bulk action:", error);
        return NextResponse.json(
            { error: "Failed to perform bulk action" },
            { status: 500 }
        );
    }
}