import { index, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../helper";

export const banners = pgTable(
    "home_banners",
    {
        id: uuid("id").primaryKey().notNull().unique().defaultRandom(),
        title: text("title").notNull(),
        description: text("description").notNull(),
        imageUrl: text("image_url").notNull(),
        location: text("location"),
        ...timestamps,
    },
    (table) => ({
        bannerLocationIdx: index("banner_location_idx").on(table.location),
    })
);
