import {
    CreateCategory,
    CreateCategoryRequest,
    CreateProductType,
    CreateSubcategory,
    UpdateCategory,
    UpdateCategoryRequest,
    UpdateProductType,
    UpdateSubcategory,
} from "@/lib/validations";
import { eq, or, and } from "drizzle-orm";
import { db } from "..";
import { categories, categoryRequests, productTypes, subcategories } from "../schemas";

class CategoryQuery {
    async count(activeOnly = true) {
        const data = await db.$count(
            categories,
            activeOnly ? eq(categories.isActive, true) : undefined
        );
        return +data || 0;
    }

    async scan(activeOnly = true) {
        const data = await db.query.categories.findMany({
            where: (f, o) =>
                o.and(activeOnly ? o.eq(f.isActive, true) : undefined),
            with: { subcategories: true },
            orderBy: (f, o) => [o.desc(f.createdAt)],
        });

        return data.map((d) => ({
            ...d,
            subcategories: d.subcategories.length || 0,
        }));
    }

    async scanActive() {
        return this.scan(true);
    }

    async scanAll() {
        return this.scan(false);
    }

    async get({ id, slug, activeOnly = true }: { id?: string; slug?: string; activeOnly?: boolean }) {
        if (!id && !slug) throw new Error("Either id or slug must be provided");

        const data = await db.query.categories.findFirst({
            where: (f, o) =>
                o.and(
                    o.or(
                        id ? o.eq(f.id, id) : undefined,
                        slug ? o.eq(f.slug, slug) : undefined
                    ),
                    activeOnly ? o.eq(f.isActive, true) : undefined
                ),
            with: { subcategories: true },
        });
        if (!data) return null;

        return {
            ...data,
            subcategories: data.subcategories.length || 0,
        };
    }

    async create(values: CreateCategory & { slug: string }) {
        const data = await db
            .insert(categories)
            .values(values)
            .returning()
            .then((res) => res[0]);

        return data;
    }

    async update(id: string, values: UpdateCategory & { slug?: string }) {
        const data = await db
            .update(categories)
            .set({ ...values, updatedAt: new Date() })
            .where(eq(categories.id, id))
            .returning()
            .then((res) => res[0]);

        return data;
    }

    async delete(id: string) {
        const data = await db
            .delete(categories)
            .where(eq(categories.id, id))
            .returning()
            .then((res) => res[0]);

        return data;
    }

    async toggleActive(id: string) {
        const current = await this.get({ id, activeOnly: false });
        if (!current) throw new Error("Category not found");

        return this.update(id, { isActive: !current.isActive });
    }
}

class SubcategoryQuery {
    async count(categoryId?: string, activeOnly = true) {
        const data = await db.$count(
            subcategories,
            and(
                categoryId ? eq(subcategories.categoryId, categoryId) : undefined,
                activeOnly ? eq(subcategories.isActive, true) : undefined
            )
        );
        return +data || 0;
    }

    async scan(categoryId?: string, activeOnly = true) {
        const data = await db.query.subcategories.findMany({
            where: (f, o) =>
                o.and(
                    categoryId ? o.eq(f.categoryId, categoryId) : undefined,
                    activeOnly ? o.eq(f.isActive, true) : undefined
                ),
            with: { productTypes: true },
            orderBy: (f, o) => [o.desc(f.createdAt)],
        });

        return data.map((d) => ({
            ...d,
            productTypes: d.productTypes.length || 0,
        }));
    }

    async get({
        id,
        slug,
        categoryId,
        activeOnly = true,
    }: {
        id?: string;
        slug?: string;
        categoryId?: string;
        activeOnly?: boolean;
    }) {
        if (!id && !slug) throw new Error("Either id or slug must be provided");

        const data = await db.query.subcategories.findFirst({
            where: (f, o) =>
                o.and(
                    o.or(
                        id ? o.eq(f.id, id) : undefined,
                        slug ? o.eq(f.slug, slug) : undefined
                    ),
                    categoryId ? o.eq(f.categoryId, categoryId) : undefined,
                    activeOnly ? o.eq(f.isActive, true) : undefined
                ),
            with: { productTypes: true },
        });
        if (!data) return null;

        return {
            ...data,
            productTypes: data.productTypes.length || 0,
        };
    }

    async create(values: CreateSubcategory & { slug: string }) {
        const data = await db
            .insert(subcategories)
            .values(values)
            .returning()
            .then((res) => res[0]);

        return data;
    }

    async update(id: string, values: UpdateSubcategory & { slug?: string }) {
        const data = await db
            .update(subcategories)
            .set({ ...values, updatedAt: new Date() })
            .where(eq(subcategories.id, id))
            .returning()
            .then((res) => res[0]);

        return data;
    }

    async delete(id: string) {
        const data = await db
            .delete(subcategories)
            .where(eq(subcategories.id, id))
            .returning()
            .then((res) => res[0]);

        return data;
    }

    async toggleActive(id: string) {
        const current = await this.get({ id, activeOnly: false });
        if (!current) throw new Error("Subcategory not found");

        return this.update(id, { isActive: !current.isActive });
    }
}

class ProductTypeQuery {
    async count({
        categoryId,
        subcategoryId,
        activeOnly = true,
    }: {
        categoryId?: string;
        subcategoryId?: string;
        activeOnly?: boolean;
    } = {}) {
        const data = await db.$count(
            productTypes,
            and(
                or(
                    categoryId
                        ? eq(productTypes.categoryId, categoryId)
                        : undefined,
                    subcategoryId
                        ? eq(productTypes.subcategoryId, subcategoryId)
                        : undefined
                ),
                activeOnly ? eq(productTypes.isActive, true) : undefined
            )
        );
        return +data || 0;
    }

    async scan({
        categoryId,
        subcategoryId,
        activeOnly = true,
    }: {
        categoryId?: string;
        subcategoryId?: string;
        activeOnly?: boolean;
    } = {}) {
        const data = await db.query.productTypes.findMany({
            where: (f, o) =>
                o.and(
                    or(
                        categoryId ? o.eq(f.categoryId, categoryId) : undefined,
                        subcategoryId
                            ? o.eq(f.subcategoryId, subcategoryId)
                            : undefined
                    ),
                    activeOnly ? o.eq(f.isActive, true) : undefined
                ),
            orderBy: (f, o) => [o.desc(f.createdAt)],
        });

        return data;
    }

    async get({
        id,
        slug,
        categoryId,
        subcategoryId,
        activeOnly = true,
    }: {
        id?: string;
        slug?: string;
        categoryId?: string;
        subcategoryId?: string;
        activeOnly?: boolean;
    }) {
        if (!id && !slug) throw new Error("Either id or slug must be provided");

        const data = await db.query.productTypes.findFirst({
            where: (f, o) =>
                o.and(
                    o.or(
                        id ? o.eq(f.id, id) : undefined,
                        slug ? o.eq(f.slug, slug) : undefined
                    ),
                    categoryId ? o.eq(f.categoryId, categoryId) : undefined,
                    subcategoryId
                        ? o.eq(f.subcategoryId, subcategoryId)
                        : undefined,
                    activeOnly ? o.eq(f.isActive, true) : undefined
                ),
        });
        if (!data) return null;

        return data;
    }

    async create(values: CreateProductType & { slug: string }) {
        const data = await db
            .insert(productTypes)
            .values(values)
            .returning()
            .then((res) => res[0]);

        return data;
    }

    async update(id: string, values: UpdateProductType & { slug?: string }) {
        const data = await db
            .update(productTypes)
            .set({ ...values, updatedAt: new Date() })
            .where(eq(productTypes.id, id))
            .returning()
            .then((res) => res[0]);

        return data;
    }

    async delete(id: string) {
        const data = await db
            .delete(productTypes)
            .where(eq(productTypes.id, id))
            .returning()
            .then((res) => res[0]);

        return data;
    }

    async toggleActive(id: string) {
        const current = await this.get({ id, activeOnly: false });
        if (!current) throw new Error("Product type not found");

        return this.update(id, { isActive: !current.isActive });
    }
}

class CategoryRequestQuery {
    async count(status?: "pending" | "approved" | "rejected") {
        const data = await db.$count(
            categoryRequests,
            status ? eq(categoryRequests.status, status) : undefined
        );
        return +data || 0;
    }

    async scan(status?: "pending" | "approved" | "rejected") {
        const data = await db.query.categoryRequests.findMany({
            where: (f, o) =>
                o.and(status ? o.eq(f.status, status) : undefined),
            with: {
                requester: true,
                reviewer: true,
                parentCategory: true,
                parentSubcategory: true,
            },
            orderBy: (f, o) => [o.desc(f.createdAt)],
        });

        return data;
    }

    async get(id: string) {
        const data = await db.query.categoryRequests.findFirst({
            where: (f, o) => o.eq(f.id, id),
            with: {
                requester: true,
                reviewer: true,
                parentCategory: true,
                parentSubcategory: true,
            },
        });

        return data;
    }

    async create(values: CreateCategoryRequest) {
        const data = await db
            .insert(categoryRequests)
            .values(values)
            .returning()
            .then((res) => res[0]);

        return data;
    }

    async update(id: string, values: UpdateCategoryRequest & { reviewerId?: string }) {
        const data = await db
            .update(categoryRequests)
            .set({
                ...values,
                reviewedAt: values.status !== "pending" ? new Date().toISOString() : null,
                updatedAt: new Date(),
            })
            .where(eq(categoryRequests.id, id))
            .returning()
            .then((res) => res[0]);

        return data;
    }

    async approve(id: string, reviewerId: string, reviewNote?: string) {
        return this.update(id, {
            status: "approved",
            reviewNote,
            reviewerId,
        });
    }

    async reject(id: string, reviewerId: string, reviewNote?: string) {
        return this.update(id, {
            status: "rejected",
            reviewNote,
            reviewerId,
        });
    }

    async delete(id: string) {
        const data = await db
            .delete(categoryRequests)
            .where(eq(categoryRequests.id, id))
            .returning()
            .then((res) => res[0]);

        return data;
    }
}

export const categoryQueries = new CategoryQuery();
export const subcategoryQueries = new SubcategoryQuery();
export const productTypeQueries = new ProductTypeQuery();
export const categoryRequestQueries = new CategoryRequestQuery();
