import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "..";
import { CreateNotification, notifications } from "../schemas";

export const notificationQueries = {
    // Get all notifications for a user
    getUserNotifications: async (userId: string, limit = 50, offset = 0) => {
        return await db
            .select()
            .from(notifications)
            .where(eq(notifications.userId, userId))
            .orderBy(desc(notifications.createdAt))
            .limit(limit)
            .offset(offset);
    },

    // Get unread notifications count for a user
    getUnreadCount: async (userId: string) => {
        const result = await db
            .select({ count: sql<number>`count(*)` })
            .from(notifications)
            .where(
                and(
                    eq(notifications.userId, userId),
                    eq(notifications.isRead, false)
                )
            );
        return result[0]?.count || 0;
    },

    // Get recent unread notifications (for dropdown)
    getRecentUnread: async (userId: string, limit = 10) => {
        return await db
            .select()
            .from(notifications)
            .where(
                and(
                    eq(notifications.userId, userId),
                    eq(notifications.isRead, false)
                )
            )
            .orderBy(desc(notifications.createdAt))
            .limit(limit);
    },

    // Create a new notification
    create: async (notification: CreateNotification) => {
        const result = await db
            .insert(notifications)
            .values(notification)
            .returning();
        return result[0];
    },

    // Mark notification as read
    markAsRead: async (notificationId: string, userId: string) => {
        const result = await db
            .update(notifications)
            .set({ isRead: true, updatedAt: new Date() })
            .where(
                and(
                    eq(notifications.id, notificationId),
                    eq(notifications.userId, userId)
                )
            )
            .returning();
        return result[0];
    },

    // Mark all notifications as read for a user
    markAllAsRead: async (userId: string) => {
        const result = await db
            .update(notifications)
            .set({ isRead: true, updatedAt: new Date() })
            .where(
                and(
                    eq(notifications.userId, userId),
                    eq(notifications.isRead, false)
                )
            )
            .returning();
        return result;
    },

    // Delete a notification
    delete: async (notificationId: string, userId: string) => {
        const result = await db
            .delete(notifications)
            .where(
                and(
                    eq(notifications.id, notificationId),
                    eq(notifications.userId, userId)
                )
            )
            .returning();
        return result[0];
    },

    // Get notification by ID
    getById: async (notificationId: string, userId: string) => {
        const result = await db
            .select()
            .from(notifications)
            .where(
                and(
                    eq(notifications.id, notificationId),
                    eq(notifications.userId, userId)
                )
            );
        return result[0];
    },

    // Create multiple notifications (for broadcasting to multiple users)
    createMultiple: async (notificationData: CreateNotification[]) => {
        if (notificationData.length === 0) return [];
        
        const result = await db
            .insert(notifications)
            .values(notificationData)
            .returning();
        return result;
    },

    // Get notifications by type
    getByType: async (userId: string, type: string, limit = 20) => {
        return await db
            .select()
            .from(notifications)
            .where(
                and(
                    eq(notifications.userId, userId),
                    eq(notifications.type, type as any)
                )
            )
            .orderBy(desc(notifications.createdAt))
            .limit(limit);
    },
};