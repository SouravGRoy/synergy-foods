import { relations } from "drizzle-orm";
import {
    boolean,
    index,
    integer,
    numeric,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";
import { timestamps } from "../helper";
import { addresses } from "./address";
import { products, productVariants } from "./product";
import { users } from "./user";

// Order statuses enum
export const ORDER_STATUSES = [
    "pending",
    "confirmed", 
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded"
] as const;

export const PAYMENT_STATUSES = [
    "pending",
    "paid",
    "failed",
    "refunded",
    "partially_refunded"
] as const;

export const orders = pgTable(
    "orders",
    {
        id: uuid("id").primaryKey().notNull().unique().defaultRandom(),
        orderNumber: text("order_number").notNull().unique(), // Auto-generated order number like ORD-001
        
        // User information
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        customerEmail: text("customer_email").notNull(),
        
        // Order status
        status: text("status", { enum: ORDER_STATUSES })
            .notNull()
            .default("pending"),
        
        // Payment information
        paymentStatus: text("payment_status", { enum: PAYMENT_STATUSES })
            .notNull()
            .default("pending"),
        paymentMethod: text("payment_method"), // 'stripe', 'paypal', etc.
        stripeSessionId: text("stripe_session_id"),
        stripePaymentIntentId: text("stripe_payment_intent_id"),
        
        // Pricing
        subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
        shippingCost: numeric("shipping_cost", { precision: 10, scale: 2 }).notNull().default("0"),
        taxAmount: numeric("tax_amount", { precision: 10, scale: 2 }).notNull().default("0"),
        discountAmount: numeric("discount_amount", { precision: 10, scale: 2 }).notNull().default("0"),
        total: numeric("total", { precision: 10, scale: 2 }).notNull(),
        currency: text("currency").notNull().default("AED"),
        
        // Addresses
        shippingAddressId: uuid("shipping_address_id")
            .references(() => addresses.id, { onDelete: "set null" }),
        billingAddressId: uuid("billing_address_id")
            .references(() => addresses.id, { onDelete: "set null" }),
            
        // Additional information
        orderNotes: text("order_notes"),
        customerNotes: text("customer_notes"),
        
        // Shipping information
        shippingMethod: text("shipping_method"), // 'standard', 'express', etc.
        trackingNumber: text("tracking_number"),
        deliveryProvider: text("delivery_provider"), // 'mock', 'fedex', 'aramex', etc.
        estimatedDelivery: timestamp("estimated_delivery"),
        shippedAt: timestamp("shipped_at"),
        deliveredAt: timestamp("delivered_at"),
        
        // Timestamps
        ...timestamps,
        
        // Soft delete
        isDeleted: boolean("is_deleted").notNull().default(false),
        deletedAt: timestamp("deleted_at"),
    },
    (table) => ({
        userIdIdx: index("orders_user_id_idx").on(table.userId),
        statusIdx: index("orders_status_idx").on(table.status),
        paymentStatusIdx: index("orders_payment_status_idx").on(table.paymentStatus),
        orderNumberIdx: index("orders_order_number_idx").on(table.orderNumber),
        stripeSessionIdx: index("orders_stripe_session_idx").on(table.stripeSessionId),
        createdAtIdx: index("orders_created_at_idx").on(table.createdAt),
    })
);

export const orderItems = pgTable(
    "order_items",
    {
        id: uuid("id").primaryKey().notNull().unique().defaultRandom(),
        
        // Relations
        orderId: uuid("order_id")
            .notNull()
            .references(() => orders.id, { onDelete: "cascade" }),
        productId: uuid("product_id")
            .notNull()
            .references(() => products.id, { onDelete: "restrict" }),
        variantId: uuid("variant_id")
            .references(() => productVariants.id, { onDelete: "restrict" }),
            
        // Product snapshot (store product details at time of order)
        productTitle: text("product_title").notNull(),
        productSlug: text("product_slug").notNull(),
        variantName: text("variant_name"), // Store variant details if applicable
        productImage: text("product_image"), // Main product image URL
        
        // Pricing and quantity
        quantity: integer("quantity").notNull(),
        unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
        totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
        
        // Product details at time of order (for historical accuracy)
        productSku: text("product_sku"),
        productWeight: integer("product_weight"),
        
        // Timestamps
        ...timestamps,
    },
    (table) => ({
        orderIdIdx: index("order_items_order_id_idx").on(table.orderId),
        productIdIdx: index("order_items_product_id_idx").on(table.productId),
        variantIdIdx: index("order_items_variant_id_idx").on(table.variantId),
    })
);

// Order status history table (optional but useful for tracking)
export const orderStatusHistory = pgTable(
    "order_status_history",
    {
        id: uuid("id").primaryKey().notNull().unique().defaultRandom(),
        
        orderId: uuid("order_id")
            .notNull()
            .references(() => orders.id, { onDelete: "cascade" }),
            
        previousStatus: text("previous_status", { enum: ORDER_STATUSES }),
        newStatus: text("new_status", { enum: ORDER_STATUSES }).notNull(),
        
        // Who made the change
        changedBy: text("changed_by")
            .references(() => users.id, { onDelete: "set null" }),
        changeReason: text("change_reason"),
        notes: text("notes"),
        
        // Timestamps
        ...timestamps,
    },
    (table) => ({
        orderIdIdx: index("order_status_history_order_id_idx").on(table.orderId),
        statusIdx: index("order_status_history_status_idx").on(table.newStatus),
        createdAtIdx: index("order_status_history_created_at_idx").on(table.createdAt),
    })
);

// Relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
    user: one(users, {
        fields: [orders.userId],
        references: [users.id],
    }),
    shippingAddress: one(addresses, {
        fields: [orders.shippingAddressId],
        references: [addresses.id],
        relationName: "shippingAddress",
    }),
    billingAddress: one(addresses, {
        fields: [orders.billingAddressId],
        references: [addresses.id],
        relationName: "billingAddress",
    }),
    items: many(orderItems),
    statusHistory: many(orderStatusHistory),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    product: one(products, {
        fields: [orderItems.productId],
        references: [products.id],
    }),
    variant: one(productVariants, {
        fields: [orderItems.variantId],
        references: [productVariants.id],
    }),
}));

export const orderStatusHistoryRelations = relations(orderStatusHistory, ({ one }) => ({
    order: one(orders, {
        fields: [orderStatusHistory.orderId],
        references: [orders.id],
    }),
    changedByUser: one(users, {
        fields: [orderStatusHistory.changedBy],
        references: [users.id],
    }),
}));
