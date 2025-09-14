import { relations } from "drizzle-orm";
import {
    index,
    jsonb,
    numeric,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";
import { timestamps } from "../helper";
import { orders } from "./order";

// Delivery shipments table
export const deliveryShipments = pgTable(
    "delivery_shipments",
    {
        id: uuid("id").primaryKey().notNull().unique().defaultRandom(),
        orderId: uuid("order_id")
            .notNull()
            .references(() => orders.id, { onDelete: "cascade" }),
        trackingNumber: text("tracking_number").notNull().unique(),
        deliveryProvider: text("delivery_provider").notNull(),
        
        // Origin address (store)
        originName: text("origin_name").notNull(),
        originPhone: text("origin_phone").notNull(),
        originStreet: text("origin_street").notNull(),
        originCity: text("origin_city").notNull(),
        originState: text("origin_state").notNull(),
        originCountry: text("origin_country").notNull(),
        originPostalCode: text("origin_postal_code").notNull(),
        
        // Destination address (customer)
        destinationName: text("destination_name").notNull(),
        destinationPhone: text("destination_phone").notNull(),
        destinationStreet: text("destination_street").notNull(),
        destinationCity: text("destination_city").notNull(),
        destinationState: text("destination_state").notNull(),
        destinationCountry: text("destination_country").notNull(),
        destinationPostalCode: text("destination_postal_code").notNull(),
        
        // Package details
        packageWeight: numeric("package_weight", { precision: 10, scale: 2 }).notNull(),
        packageLength: numeric("package_length", { precision: 10, scale: 2 }).notNull(),
        packageWidth: numeric("package_width", { precision: 10, scale: 2 }).notNull(),
        packageHeight: numeric("package_height", { precision: 10, scale: 2 }).notNull(),
        packageDescription: text("package_description"),
        
        // Shipment status and tracking
        status: text("status").notNull().default("pending"),
        estimatedDelivery: timestamp("estimated_delivery"),
        actualDelivery: timestamp("actual_delivery"),
        shippingCost: numeric("shipping_cost", { precision: 10, scale: 2 }),
        currency: text("currency").notNull().default("AED"),
        
        // Provider specific data
        providerResponse: jsonb("provider_response"),
        
        // Timestamps
        ...timestamps,
    },
    (table) => ({
        orderIdIdx: index("delivery_shipments_order_id_idx").on(table.orderId),
        trackingNumberIdx: index("delivery_shipments_tracking_number_idx").on(table.trackingNumber),
        statusIdx: index("delivery_shipments_status_idx").on(table.status),
        providerIdx: index("delivery_shipments_provider_idx").on(table.deliveryProvider),
        createdAtIdx: index("delivery_shipments_created_at_idx").on(table.createdAt),
    })
);

// Delivery tracking updates table
export const deliveryTrackingUpdates = pgTable(
    "delivery_tracking_updates",
    {
        id: uuid("id").primaryKey().notNull().unique().defaultRandom(),
        shipmentId: uuid("shipment_id")
            .notNull()
            .references(() => deliveryShipments.id, { onDelete: "cascade" }),
        trackingNumber: text("tracking_number").notNull(),
        
        status: text("status").notNull(),
        location: text("location"),
        description: text("description").notNull(),
        timestamp: timestamp("timestamp").notNull(),
        
        // Provider specific data
        providerData: jsonb("provider_data"),
        
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (table) => ({
        shipmentIdIdx: index("delivery_tracking_updates_shipment_id_idx").on(table.shipmentId),
        trackingNumberIdx: index("delivery_tracking_updates_tracking_number_idx").on(table.trackingNumber),
        timestampIdx: index("delivery_tracking_updates_timestamp_idx").on(table.timestamp),
    })
);

// Delivery rates cache table
export const deliveryRates = pgTable(
    "delivery_rates",
    {
        id: uuid("id").primaryKey().notNull().unique().defaultRandom(),
        
        // Origin and destination for rate calculation
        originCity: text("origin_city").notNull(),
        originCountry: text("origin_country").notNull(),
        destinationCity: text("destination_city").notNull(),
        destinationCountry: text("destination_country").notNull(),
        
        // Package details for rate calculation
        weight: numeric("weight", { precision: 10, scale: 2 }).notNull(),
        length: numeric("length", { precision: 10, scale: 2 }).notNull(),
        width: numeric("width", { precision: 10, scale: 2 }).notNull(),
        height: numeric("height", { precision: 10, scale: 2 }).notNull(),
        
        // Rate details
        deliveryProvider: text("delivery_provider").notNull(),
        serviceName: text("service_name").notNull(),
        cost: numeric("cost", { precision: 10, scale: 2 }).notNull(),
        currency: text("currency").notNull().default("AED"),
        estimatedDays: text("estimated_days").notNull(),
        description: text("description"),
        
        // Cache expiry
        expiresAt: timestamp("expires_at").notNull(),
        
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (table) => ({
        routeIdx: index("delivery_rates_route_idx").on(
            table.originCity, 
            table.originCountry, 
            table.destinationCity, 
            table.destinationCountry
        ),
        providerIdx: index("delivery_rates_provider_idx").on(table.deliveryProvider),
        expiresAtIdx: index("delivery_rates_expires_at_idx").on(table.expiresAt),
    })
);

// Relations
export const deliveryShipmentsRelations = relations(deliveryShipments, ({ one, many }) => ({
    order: one(orders, {
        fields: [deliveryShipments.orderId],
        references: [orders.id],
    }),
    trackingUpdates: many(deliveryTrackingUpdates),
}));

export const deliveryTrackingUpdatesRelations = relations(deliveryTrackingUpdates, ({ one }) => ({
    shipment: one(deliveryShipments, {
        fields: [deliveryTrackingUpdates.shipmentId],
        references: [deliveryShipments.id],
    }),
}));
