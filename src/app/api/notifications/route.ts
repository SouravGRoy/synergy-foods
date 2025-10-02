import { queries } from "@/lib/db/queries";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/notifications - Get user notifications
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(request.url);
        const limit = parseInt(url.searchParams.get("limit") || "50");
        const offset = parseInt(url.searchParams.get("offset") || "0");
        const type = url.searchParams.get("type");
        const unreadOnly = url.searchParams.get("unreadOnly") === "true";

        let notifications;

        if (unreadOnly) {
            notifications = await queries.notification.getRecentUnread(userId, limit);
        } else if (type) {
            notifications = await queries.notification.getByType(userId, type, limit);
        } else {
            notifications = await queries.notification.getUserNotifications(userId, limit, offset);
        }

        const unreadCount = await queries.notification.getUnreadCount(userId);

        return NextResponse.json({
            notifications,
            unreadCount,
            hasMore: notifications.length === limit,
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { error: "Failed to fetch notifications" },
            { status: 500 }
        );
    }
}

// POST /api/notifications - Create a new notification (admin only)
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
        const { targetUserId, type, title, message, priority, metadata, actionUrl } = body;

        const notification = await queries.notification.create({
            userId: targetUserId || userId,
            type,
            title,
            message,
            priority: priority || "medium",
            metadata,
            actionUrl,
        });

        return NextResponse.json(notification);
    } catch (error) {
        console.error("Error creating notification:", error);
        return NextResponse.json(
            { error: "Failed to create notification" },
            { status: 500 }
        );
    }
}