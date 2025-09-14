import { boolean, index, integer, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../helper";

export const promotionalBanners = pgTable(
    "promotional_banners",
    {
        id: uuid("id").primaryKey().notNull().unique().defaultRandom(),
        title: text("title").notNull(),
        description: text("description").notNull(),
        type: text("type", { enum: ["carousel", "type1", "type2", "type3", "type4"] }).notNull().default("carousel"),
        media: jsonb("media").$type<{ url: string; altText?: string }[]>().notNull().default([]),
        ctaLabel: text("cta_label"),
        ctaLink: text("cta_link"),
        location: text("location"), // Made optional - banners can work without specific location
        isActive: boolean("is_active").notNull().default(true),
        order: integer("order").notNull().default(0),
        ...timestamps,
    },
    (table) => ({
        promotionalBannerLocationIdx: index("promotional_banner_location_idx").on(table.location),
        promotionalBannerTypeIdx: index("promotional_banner_type_idx").on(table.type),
        promotionalBannerOrderIdx: index("promotional_banner_order_idx").on(table.order),
    })
);
