import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../helper";
import { products } from "./product";
import { users } from "./user";

export const categories = pgTable("categories", {
    id: uuid("id").primaryKey().notNull().unique().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    commissionRate: integer("commission_rate").default(0), // in basis points (e.g., 500 = 5%)
    imageUrl: text("image_url"),
    isActive: boolean("is_active").default(true).notNull(),
    ...timestamps,
});

export const subcategories = pgTable("subcategories", {
    id: uuid("id").primaryKey().notNull().unique().defaultRandom(),
    categoryId: uuid("category_id")
        .notNull()
        .references(() => categories.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    isActive: boolean("is_active").default(true).notNull(),
    ...timestamps,
});

export const productTypes = pgTable("product_types", {
    id: uuid("id").primaryKey().notNull().unique().defaultRandom(),
    categoryId: uuid("category_id")
        .notNull()
        .references(() => categories.id, { onDelete: "cascade" }),
    subcategoryId: uuid("subcategory_id")
        .notNull()
        .references(() => subcategories.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    isActive: boolean("is_active").default(true).notNull(),
    ...timestamps,
});

export const categoryRequests = pgTable("category_requests", {
    id: uuid("id").primaryKey().notNull().unique().defaultRandom(),
    requesterId: text("requester_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    type: text("type", { enum: ["category", "subcategory", "product_type"] }).notNull(),
    name: text("name").notNull(),
    description: text("description"),
    parentCategoryId: uuid("parent_category_id").references(() => categories.id, { onDelete: "cascade" }),
    parentSubcategoryId: uuid("parent_subcategory_id").references(() => subcategories.id, { onDelete: "cascade" }),
    status: text("status", { enum: ["pending", "approved", "rejected"] }).default("pending").notNull(),
    reviewerId: text("reviewer_id").references(() => users.id, { onDelete: "set null" }),
    reviewedAt: text("reviewed_at"),
    reviewNote: text("review_note"),
    ...timestamps,
});

export const categoriesRelations = relations(categories, ({ many }) => ({
    subcategories: many(subcategories),
    productTypes: many(productTypes),
}));

export const subcategoriesRelations = relations(
    subcategories,
    ({ one, many }) => ({
        category: one(categories, {
            fields: [subcategories.categoryId],
            references: [categories.id],
        }),
        productTypes: many(productTypes),
    })
);

export const productTypesRelations = relations(
    productTypes,
    ({ one, many }) => ({
        subcategory: one(subcategories, {
            fields: [productTypes.subcategoryId],
            references: [subcategories.id],
        }),
        category: one(categories, {
            fields: [productTypes.categoryId],
            references: [categories.id],
        }),
        products: many(products),
    })
);

export const categoryRequestsRelations = relations(
    categoryRequests,
    ({ one }) => ({
        requester: one(users, {
            fields: [categoryRequests.requesterId],
            references: [users.id],
        }),
        reviewer: one(users, {
            fields: [categoryRequests.reviewerId],
            references: [users.id],
        }),
        parentCategory: one(categories, {
            fields: [categoryRequests.parentCategoryId],
            references: [categories.id],
        }),
        parentSubcategory: one(subcategories, {
            fields: [categoryRequests.parentSubcategoryId],
            references: [subcategories.id],
        }),
    })
);
