import {
    DEFAULT_PRODUCT_PAGINATION_LIMIT,
    DEFAULT_PRODUCT_PAGINATION_PAGE,
} from "@/config/const";
import { cache } from "@/lib/redis/methods";
import { AppError } from "@/lib/utils";
import { Redis } from "@upstash/redis";
import {
    CreateProduct,
    FullProduct,
    fullProductSchema,
    Product,
    UpdateProduct,
} from "@/lib/validations";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "..";
import { productOptions, products, productVariants } from "../schemas";

class ProductQuery {
    async count({
        isActive,
        isAvailable,
        isDeleted,
        isPublished,
        verificationStatus,
    }: {
        isDeleted?: boolean;
        isAvailable?: boolean;
        isPublished?: boolean;
        isActive?: boolean;
        verificationStatus?: Product["verificationStatus"];
    }) {
        const data = await db.$count(
            products,
            and(
                isDeleted !== undefined
                    ? eq(products.isDeleted, isDeleted)
                    : undefined,
                isAvailable !== undefined
                    ? eq(products.isAvailable, isAvailable)
                    : undefined,
                isPublished !== undefined
                    ? eq(products.isPublished, isPublished)
                    : undefined,
                isActive !== undefined
                    ? eq(products.isActive, isActive)
                    : undefined,
                verificationStatus !== undefined
                    ? eq(products.verificationStatus, verificationStatus)
                    : undefined
            )
        );

        return +data || 0;
    }

    async paginate({
        limit = DEFAULT_PRODUCT_PAGINATION_LIMIT,
        page = DEFAULT_PRODUCT_PAGINATION_PAGE,
        search,
        minPrice,
        maxPrice,
        categoryId,
        subcategoryId,
        productTypeId,
        isActive,
        isAvailable,
        isPublished,
        isMarketed,
        isDeleted,
        verificationStatus,
        sortBy = "createdAt",
        sortOrder = "desc",
    }: {
        limit?: number;
        page?: number;
        search?: string;
        minPrice?: number | null;
        maxPrice?: number | null;
        categoryId?: string;
        subcategoryId?: string;
        productTypeId?: string;
        isActive?: boolean;
        isAvailable?: boolean;
        isPublished?: boolean;
        isMarketed?: boolean;
        isDeleted?: boolean;
        verificationStatus?: Product["verificationStatus"];
        sortBy?: "price" | "createdAt" | "marketedAt";
        sortOrder?: "asc" | "desc";
    }) {
        const searchQuery = !!search?.length
            ? sql`(
            setweight(to_tsvector('english', ${products.title}), 'A') ||
            setweight(to_tsvector('english', ${products.description}), 'B'))
            @@ plainto_tsquery('english', ${search})`
            : undefined;

        minPrice = !!minPrice
            ? minPrice < 0
                ? 0
                : minPrice // No conversion needed for AED
            : null;
        maxPrice = !!maxPrice
            ? maxPrice > 10000
                ? null
                : maxPrice // No conversion needed for AED
            : null;

        const filters = [
            searchQuery,
            !!minPrice
                ? sql`(
                    COALESCE(${products.price}, 0) >= ${minPrice} 
                    OR EXISTS (
                        SELECT 1 FROM ${productVariants} pv
                        WHERE pv.product_id = ${products.id}
                        AND COALESCE(pv.price, 0) >= ${minPrice}
                        AND pv.is_deleted = false
                    )
                )`
                : undefined,
            !!maxPrice
                ? sql`(
                    COALESCE(${products.price}, 0) <= ${maxPrice}
                    OR EXISTS (
                        SELECT 1 FROM ${productVariants} pv
                        WHERE pv.product_id = ${products.id}
                        AND COALESCE(pv.price, 0) <= ${maxPrice}
                        AND pv.is_deleted = false
                    )
                )`
                : undefined,
            isActive !== undefined
                ? eq(products.isActive, isActive)
                : undefined,
            isAvailable !== undefined
                ? eq(products.isAvailable, isAvailable)
                : undefined,
            isPublished !== undefined
                ? eq(products.isPublished, isPublished)
                : undefined,
            isMarketed !== undefined
                ? eq(products.isMarketed, isMarketed)
                : undefined,
            isDeleted !== undefined
                ? eq(products.isDeleted, isDeleted)
                : undefined,
            categoryId ? eq(products.categoryId, categoryId) : undefined,
            subcategoryId
                ? eq(products.subcategoryId, subcategoryId)
                : undefined,
            productTypeId
                ? eq(products.productTypeId, productTypeId)
                : undefined,
            verificationStatus
                ? eq(products.verificationStatus, verificationStatus)
                : undefined,
        ];

        // Map sortBy values to actual column references
        const getSortColumn = (sortBy: string) => {
            switch (sortBy) {
                case "price":
                    return products.price;
                case "createdAt":
                    return products.createdAt;
                case "marketedAt":
                    return products.marketedAt;
                default:
                    return products.createdAt;
            }
        };

        const data = await db.query.products.findMany({
            with: {
                uploader: true,
                variants: true,
                category: true,
                subcategory: true,
                productType: true,
                options: true,
            },
            where: and(...filters),
            limit,
            offset: (page - 1) * limit,
            orderBy: searchQuery
                ? [
                      sortOrder === "asc"
                          ? asc(getSortColumn(sortBy))
                          : desc(getSortColumn(sortBy)),
                      desc(sql`ts_rank(
                        setweight(to_tsvector('english', ${products.title}), 'A') ||
                        setweight(to_tsvector('english', ${products.description}), 'B'),
                        plainto_tsquery('english', ${search})
                      )`),
                  ]
                : [
                      sortOrder === "asc"
                          ? asc(getSortColumn(sortBy))
                          : desc(getSortColumn(sortBy)),
                  ],
            extras: {
                count: db
                    .$count(products, and(...filters))
                    .as("products_count"),
            },
        });

        const mediaIds = new Set<string>();
        for (const product of data) {
            product.media.forEach((media) => mediaIds.add(media.id));
            product.variants.forEach((variant) => {
                if (variant.image) mediaIds.add(variant.image);
            });
        }

        const mediaItems = await cache.mediaItem.scan(Array.from(mediaIds));
        const mediaMap = new Map(mediaItems.map((item) => [item.id, item]));

        const enhanced = data.map((product) => ({
            ...product,
            media: product.media.map((media) => ({
                ...media,
                mediaItem: mediaMap.get(media.id),
            })),
            variants: product.variants.map((variant) => ({
                ...variant,
                mediaItem: variant.image ? mediaMap.get(variant.image) : null,
            })),
        }));

        const items = +data?.[0]?.count || 0;
        const pages = Math.ceil(items / limit);

        const parsed: FullProduct[] = fullProductSchema.array().parse(enhanced);

        return {
            data: parsed,
            items,
            pages,
        };
    }

    async get({
        id,
        isActive,
        isAvailable,
        isPublished,
        isDeleted,
        verificationStatus,
        sku,
        slug,
    }: {
        id?: string;
        sku?: string;
        slug?: string;
        isDeleted?: boolean;
        isAvailable?: boolean;
        isPublished?: boolean;
        isActive?: boolean;
        verificationStatus?: Product["verificationStatus"];
    }) {
        if (!id && !sku && !slug)
            throw new Error("Must provide id, sku or slug");

        const data = await db.query.products.findFirst({
            with: {
                uploader: true,
                variants: true,
                category: true,
                subcategory: true,
                productType: true,
                options: true,
            },
            where: (f, o) =>
                o.and(
                    o.or(
                        id ? o.eq(products.id, id) : undefined,
                        sku ? o.eq(products.sku, sku) : undefined,
                        slug ? o.eq(products.slug, slug) : undefined
                    ),
                    isDeleted !== undefined
                        ? o.eq(products.isDeleted, isDeleted)
                        : undefined,
                    isAvailable !== undefined
                        ? o.eq(products.isAvailable, isAvailable)
                        : undefined,
                    isPublished !== undefined
                        ? o.eq(products.isPublished, isPublished)
                        : undefined,
                    isActive !== undefined
                        ? o.eq(products.isActive, isActive)
                        : undefined,
                    verificationStatus !== undefined
                        ? o.eq(products.verificationStatus, verificationStatus)
                        : undefined
                ),
        });
        if (!data) return null;

        const mediaIds = new Set<string>();
        data.media.forEach((media) => mediaIds.add(media.id));
        data.variants.forEach((variant) => {
            if (variant.image) mediaIds.add(variant.image);
        });

        const mediaItems = await cache.mediaItem.scan(Array.from(mediaIds));
        const mediaMap = new Map(mediaItems.map((item) => [item.id, item]));

        const enhanced = {
            ...data,
            media: data.media.map((media) => ({
                ...media,
                mediaItem: mediaMap.get(media.id),
            })),
            variants: data.variants.map((variant) => ({
                ...variant,
                mediaItem: variant.image ? mediaMap.get(variant.image) : null,
            })),
        };

        return enhanced;
    }

    async batch(values: (CreateProduct & { slug: string })[]) {
        const data = await db.transaction(async (tx) => {
            // Convert numeric fields to strings for database storage
            const processedProducts = values.map((value) => ({
                ...value,
                price: value.price?.toString() ?? null,
                compareAtPrice: value.compareAtPrice?.toString() ?? null,
                costPerItem: value.costPerItem?.toString() ?? null,
            }));

            const newProducts = await tx
                .insert(products)
                .values(processedProducts)
                .returning()
                .then((res) => res);

            const optionsToInsert = values.flatMap((value, index) =>
                value.options.map((option) => ({
                    ...option,
                    productId: newProducts[index].id,
                }))
            );
            const variantsToInsert = values.flatMap((value, index) =>
                value.variants.map((variant) => ({
                    ...variant,
                    productId: newProducts[index].id,
                    price: variant.price?.toString() ?? null,
                    compareAtPrice: variant.compareAtPrice?.toString() ?? null,
                    costPerItem: variant.costPerItem?.toString() ?? null,
                }))
            );

            const [newOptions, newVariants] = await Promise.all([
                !!optionsToInsert.length
                    ? tx
                          .insert(productOptions)
                          .values(optionsToInsert)
                          .returning()
                    : [],
                !!variantsToInsert.length
                    ? tx
                          .insert(productVariants)
                          .values(variantsToInsert)
                          .returning()
                    : [],
            ]);

            return newProducts.map((product) => ({
                ...product,
                options: newOptions.filter((o) => o.productId === product.id),
                variants: newVariants.filter((v) => v.productId === product.id),
            }));
        });

        return data;
    }

    async update(id: string, values: UpdateProduct) {
        const data = await db.transaction(async (tx) => {
            // Convert numeric fields to strings for database storage
            const processedValues = {
                ...values,
                updatedAt: new Date(),
                price: values.price !== undefined ? (values.price?.toString() ?? null) : undefined,
                compareAtPrice: values.compareAtPrice !== undefined ? (values.compareAtPrice?.toString() ?? null) : undefined,
                costPerItem: values.costPerItem !== undefined ? (values.costPerItem?.toString() ?? null) : undefined,
            };

            const updatedProduct = await tx
                .update(products)
                .set(processedValues)
                .where(eq(products.id, id))
                .returning()
                .then((res) => res[0]);

            const [existingOptions, existingVariants] = await Promise.all([
                tx.query.productOptions.findMany({
                    where: eq(productOptions.productId, id),
                }),
                tx.query.productVariants.findMany({
                    where: eq(productVariants.productId, id),
                }),
            ]);

            const optionsToBeAdded =
                values.options?.filter(
                    (option) => !existingOptions.find((o) => o.id === option.id)
                ) || [];
            const optionsToBeUpdated =
                values.options?.filter((option) => {
                    const existing = existingOptions.find(
                        (o) => o.id === option.id
                    );
                    return (
                        existing &&
                        JSON.stringify(option) !== JSON.stringify(existing)
                    );
                }) || [];
            const optionsToBeDeleted =
                existingOptions.filter(
                    (option) => !values.options?.find((o) => o.id === option.id)
                ) || [];

            const variantsToBeAdded =
                values.variants?.filter(
                    (variant) =>
                        !existingVariants.find((v) => v.id === variant.id)
                ) || [];
            const variantsToBeUpdated =
                values.variants?.filter((variant) => {
                    const existing = existingVariants.find(
                        (v) => v.id === variant.id
                    );
                    return (
                        existing &&
                        JSON.stringify(variant) !== JSON.stringify(existing)
                    );
                }) || [];
            const variantsToBeDeleted =
                existingVariants.filter(
                    (variant) =>
                        !values.variants?.find((v) => v.id === variant.id)
                ) || [];

            await Promise.all([
                optionsToBeAdded.length &&
                    tx.insert(productOptions).values(optionsToBeAdded),
                variantsToBeAdded.length &&
                    tx
                        .insert(productVariants)
                        .values(variantsToBeAdded.map((variant) => ({
                            ...variant,
                            price: variant.price?.toString() ?? null,
                            compareAtPrice: variant.compareAtPrice?.toString() ?? null,
                            costPerItem: variant.costPerItem?.toString() ?? null,
                        })))
                        .returning(),
                ...optionsToBeUpdated.map((option) =>
                    tx
                        .update(productOptions)
                        .set(option)
                        .where(
                            and(
                                eq(productOptions.productId, id),
                                eq(productOptions.id, option.id)
                            )
                        )
                ),
                ...variantsToBeUpdated.map((variant) =>
                    tx
                        .update(productVariants)
                        .set({
                            ...variant,
                            price: variant.price?.toString() ?? null,
                            compareAtPrice: variant.compareAtPrice?.toString() ?? null,
                            costPerItem: variant.costPerItem?.toString() ?? null,
                        })
                        .where(
                            and(
                                eq(productVariants.productId, id),
                                eq(productVariants.id, variant.id)
                            )
                        )
                ),
            ]);

            await Promise.all([
                tx
                    .update(productOptions)
                    .set({
                        isDeleted: true,
                        deletedAt: new Date(),
                        updatedAt: new Date(),
                    })
                    .where(
                        and(
                            eq(productOptions.productId, id),
                            inArray(
                                productOptions.id,
                                optionsToBeDeleted.map((o) => o.id)
                            )
                        )
                    ),
                tx
                    .update(productVariants)
                    .set({
                        isDeleted: true,
                        deletedAt: new Date(),
                        updatedAt: new Date(),
                    })
                    .where(
                        and(
                            eq(productVariants.productId, id),
                            inArray(
                                productVariants.id,
                                variantsToBeDeleted.map((v) => v.id)
                            )
                        )
                    ),
            ]);

            const [updatedOptions, updatedVariants] = await Promise.all([
                tx.query.productOptions.findMany({
                    where: eq(productOptions.productId, id),
                }),
                tx.query.productVariants.findMany({
                    where: eq(productVariants.productId, id),
                }),
            ]);

            return {
                ...updatedProduct,
                options: updatedOptions,
                variants: updatedVariants,
            };
        });

        return data;
    }

    // Update marketing status with business logic
    async updateMarketingStatus(id: string, isMarketed: boolean) {
        const data = await db.transaction(async (tx) => {
            // Get current product status
            const currentProduct = await tx.query.products.findFirst({
                where: eq(products.id, id),
            });

            if (!currentProduct) {
                throw new AppError("Product not found", "NOT_FOUND");
            }

            // Business rule: Auto-publish when marketing
            const updateData: any = {
                isMarketed,
                updatedAt: new Date(),
            };

            if (isMarketed) {
                // Auto-publish when marketing
                if (!currentProduct.isPublished) {
                    updateData.isPublished = true;
                    updateData.publishedAt = new Date();
                }
                updateData.marketedAt = new Date();
            } else {
                // When unmarking, set marketedAt to null
                updateData.marketedAt = null;
            }

            const updatedProduct = await tx
                .update(products)
                .set(updateData)
                .where(eq(products.id, id))
                .returning()
                .then((res) => res[0]);

            return updatedProduct;
        });

        return data;
    }

    // Get count of currently marketed products (for 10 product limit)
    async getMarketedCount() {
        const data = await db.$count(
            products,
            and(
                eq(products.isMarketed, true),
                eq(products.isDeleted, false),
                eq(products.isActive, true)
            )
        );

        return +data || 0;
    }

    async stock(
        values: {
            productId: string;
            variantId?: string;
            stock: number;
        }[]
    ) {
        const data = await db.transaction(async (tx) => {
            const updated = await Promise.all(
                values.map(async (item) => {
                    if (item.variantId) {
                        const res = await tx
                            .update(productVariants)
                            .set({
                                quantity: item.stock,
                                updatedAt: new Date(),
                            })
                            .where(
                                and(
                                    eq(
                                        productVariants.productId,
                                        item.productId
                                    ),
                                    eq(productVariants.id, item.variantId)
                                )
                            )
                            .returning();
                        return res[0];
                    }

                    const res = await tx
                        .update(products)
                        .set({
                            quantity: item.stock,
                            updatedAt: new Date(),
                        })
                        .where(eq(products.id, item.productId))
                        .returning();
                    return res[0];
                })
            );

            return updated;
        });

        return data;
    }

    // New Arrivals - Get latest products with optimized query
    async getNewArrivals({
        limit = 10,
        categoryId,
        subcategoryId,
        productTypeId,
    }: {
        limit?: number;
        categoryId?: string;
        subcategoryId?: string;
        productTypeId?: string;
    } = {}) {
        // Use optimized query but return proper FullProduct structure
        const conditions = [
            eq(products.isActive, true),
            eq(products.isPublished, true),
            eq(products.isAvailable, true),
            eq(products.isDeleted, false),
            eq(products.verificationStatus, "approved"),
        ];

        if (categoryId) conditions.push(eq(products.categoryId, categoryId));
        if (subcategoryId) conditions.push(eq(products.subcategoryId, subcategoryId));
        if (productTypeId) conditions.push(eq(products.productTypeId, productTypeId));

        const data = await db.query.products.findMany({
            with: {
                uploader: true,
                variants: {
                    limit: 1, // Only get first variant for performance
                },
                category: true,
                subcategory: true,
                productType: true,
                options: {
                    limit: 3, // Limit options for performance
                },
            },
            where: and(...conditions),
            limit,
            orderBy: desc(products.createdAt),
        });

        // Get media items efficiently
        const mediaIds = new Set<string>();
        for (const product of data) {
            // Only get first 2 media items for homepage cards
            product.media.slice(0, 2).forEach((media) => mediaIds.add(media.id));
            product.variants.forEach((variant) => {
                if (variant.image) mediaIds.add(variant.image);
            });
        }

        const mediaItems = await cache.mediaItem.scan(Array.from(mediaIds));
        const mediaMap = new Map(mediaItems.map((item) => [item.id, item]));

        const enhanced = data.map((product) => ({
            ...product,
            media: product.media.slice(0, 2).map((media) => ({
                ...media,
                mediaItem: mediaMap.get(media.id),
            })),
            variants: product.variants.map((variant) => ({
                ...variant,
                mediaItem: variant.image ? mediaMap.get(variant.image) : null,
            })),
        }));

        const parsed = fullProductSchema.array().parse(enhanced);

        return {
            data: parsed,
            items: data.length,
            pages: 1,
        };
    }

    // Marketed Products - Get products marked for marketing with optimized query
    async getMarketedProducts({
        limit = 10,
        categoryId,
        subcategoryId,
        productTypeId,
    }: {
        limit?: number;
        categoryId?: string;
        subcategoryId?: string;
        productTypeId?: string;
    } = {}) {
        // Use optimized query but return proper FullProduct structure
        const conditions = [
            eq(products.isActive, true),
            eq(products.isPublished, true),
            eq(products.isAvailable, true),
            eq(products.isDeleted, false),
            eq(products.verificationStatus, "approved"),
            eq(products.isMarketed, true),
        ];

        if (categoryId) conditions.push(eq(products.categoryId, categoryId));
        if (subcategoryId) conditions.push(eq(products.subcategoryId, subcategoryId));
        if (productTypeId) conditions.push(eq(products.productTypeId, productTypeId));

        const data = await db.query.products.findMany({
            with: {
                uploader: true,
                variants: {
                    limit: 1, // Only get first variant for performance
                },
                category: true,
                subcategory: true,
                productType: true,
                options: {
                    limit: 3, // Limit options for performance
                },
            },
            where: and(...conditions),
            limit,
            orderBy: desc(products.marketedAt),
        });

        // Get media items efficiently
        const mediaIds = new Set<string>();
        for (const product of data) {
            // Only get first 2 media items for homepage cards
            product.media.slice(0, 2).forEach((media) => mediaIds.add(media.id));
            product.variants.forEach((variant) => {
                if (variant.image) mediaIds.add(variant.image);
            });
        }

        const mediaItems = await cache.mediaItem.scan(Array.from(mediaIds));
        const mediaMap = new Map(mediaItems.map((item) => [item.id, item]));

        const enhanced = data.map((product) => ({
            ...product,
            media: product.media.slice(0, 2).map((media) => ({
                ...media,
                mediaItem: mediaMap.get(media.id),
            })),
            variants: product.variants.map((variant) => ({
                ...variant,
                mediaItem: variant.image ? mediaMap.get(variant.image) : null,
            })),
        }));

        const parsed = fullProductSchema.array().parse(enhanced);

        return {
            data: parsed,
            items: data.length,
            pages: 1,
        };
    }

    async delete(id: string) {
        // Hard delete - completely remove from database
        const result = await db
            .delete(products)
            .where(eq(products.id, id));

        return { success: true, deletedId: id };
    }
}

export const productQueries = new ProductQuery();