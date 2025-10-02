import { z } from "zod";

export const NOTIFICATION_TYPES = [
    "new_order",
    "low_stock",
    "customer_inquiry",
    "product_review",
    "payment_received",
    "order_cancelled",
    "inventory_alert",
    "system_alert",
] as const;

export const NOTIFICATION_PRIORITIES = ["low", "medium", "high", "urgent"] as const;

export const notificationSchema = z.object({
    id: z.string(),
    userId: z.string(),
    type: z.enum(NOTIFICATION_TYPES),
    title: z.string(),
    message: z.string(),
    priority: z.enum(NOTIFICATION_PRIORITIES),
    isRead: z.boolean(),
    metadata: z.any().optional(),
    actionUrl: z.string().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const createNotificationSchema = z.object({
    userId: z.string(),
    type: z.enum(NOTIFICATION_TYPES),
    title: z.string().min(1, "Title is required"),
    message: z.string().min(1, "Message is required"),
    priority: z.enum(NOTIFICATION_PRIORITIES).default("medium"),
    metadata: z.any().optional(),
    actionUrl: z.string().url().optional(),
});

export type Notification = z.infer<typeof notificationSchema>;
export type CreateNotification = z.infer<typeof createNotificationSchema>;