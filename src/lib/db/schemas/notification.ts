import { relations } from "drizzle-orm";
import { boolean, index, integer, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../helper";
import { users } from "./user";

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

export const notifications = pgTable(
    "notifications",
    {
        id: uuid("id").primaryKey().notNull().unique().defaultRandom(),
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type", { enum: NOTIFICATION_TYPES }).notNull(),
        title: text("title").notNull(),
        message: text("message").notNull(),
        priority: text("priority", { enum: NOTIFICATION_PRIORITIES }).notNull().default("medium"),
        isRead: boolean("is_read").notNull().default(false),
        metadata: jsonb("metadata"), // For storing additional data like order ID, product ID, etc.
        actionUrl: text("action_url"), // URL to navigate to when notification is clicked
        ...timestamps,
    },
    (table) => ({
        userIdIdx: index("notifications_user_id_idx").on(table.userId),
        typeIdx: index("notifications_type_idx").on(table.type),
        isReadIdx: index("notifications_is_read_idx").on(table.isRead),
        createdAtIdx: index("notifications_created_at_idx").on(table.createdAt),
    })
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
    user: one(users, {
        fields: [notifications.userId],
        references: [users.id],
    }),
}));

export type Notification = typeof notifications.$inferSelect;
export type CreateNotification = typeof notifications.$inferInsert;