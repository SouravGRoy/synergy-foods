import { env } from "@/../env";
import {
    DEFAULT_PRODUCT_PAGINATION_LIMIT,
    DEFAULT_PRODUCT_PAGINATION_PAGE,
    ERROR_MESSAGES,
} from "@/config/const";
import { queries } from "@/lib/db/queries";
import { cache } from "@/lib/redis/methods";
import {
    AppError,
    CResponse,
    generateProductSlug,
    generateSKU,
    handleError,
} from "@/lib/utils";
// Production optimizations - import directly from utils files
import {
    sanitizeString,
    sanitizeNumber,
} from "@/lib/utils/sanitization";
import {
    withRateLimit,
    apiRateLimiter,
} from "@/lib/utils/rate-limit";
import {
    withCors,
    corsConfigs,
} from "@/lib/utils/cors";
import {
    withCache,
    cacheConfigs,
    cacheInvalidation,
} from "@/lib/utils/cache";
import { createProductSchema, Product } from "@/lib/validations";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

async function getProductsHandler(req: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(req.url);

        // Sanitize query parameters
        const limit = sanitizeNumber(searchParams.get("limit")) ?? DEFAULT_PRODUCT_PAGINATION_LIMIT;
        const page = sanitizeNumber(searchParams.get("page")) ?? DEFAULT_PRODUCT_PAGINATION_PAGE;
        const search = searchParams.get("search") ? sanitizeString(searchParams.get("search")!) : undefined;
        const minPrice = sanitizeNumber(searchParams.get("minPrice"));
        const maxPrice = sanitizeNumber(searchParams.get("maxPrice"));
        const categoryId = searchParams.get("categoryId") ? sanitizeString(searchParams.get("categoryId")!) : undefined;
        const subcategoryId = searchParams.get("subcategoryId") ? sanitizeString(searchParams.get("subcategoryId")!) : undefined;
        const productTypeId = searchParams.get("productTypeId") ? sanitizeString(searchParams.get("productTypeId")!) : undefined;
        const slug = searchParams.get("slug") ? sanitizeString(searchParams.get("slug")!) : undefined;
        
        // Boolean parameters with validation
        const isActive = searchParams.get("isActive") === "true" ? true : 
                        searchParams.get("isActive") === "false" ? false : undefined;
        const isAvailable = searchParams.get("isAvailable") === "true" ? true :
                           searchParams.get("isAvailable") === "false" ? false : undefined;
        const isPublished = searchParams.get("isPublished") === "true" ? true :
                           searchParams.get("isPublished") === "false" ? false : undefined;
        const isDeleted = searchParams.get("isDeleted") === "true" ? true :
                         searchParams.get("isDeleted") === "false" ? false : undefined;
        
        // Enum validation
        const verificationStatusParam = searchParams.get("verificationStatus");
        const validStatuses = ["pending", "approved", "rejected"];
        const verificationStatus = verificationStatusParam && validStatuses.includes(verificationStatusParam) 
            ? verificationStatusParam as Product["verificationStatus"] 
            : undefined;
            
        // Sort validation
        const sortByParam = searchParams.get("sortBy");
        
        // Map frontend sort values to backend values
        const mapSortBy = (frontendSort: string) => {
            switch (frontendSort) {
                case "popularity":
                case "newest":
                    return "createdAt";
                case "name":
                    return "createdAt"; // Since we don't have a name field, use createdAt
                case "price_asc":
                case "price_desc":
                    return "price";
                default:
                    return "createdAt";
            }
        };
        
        // Map frontend sort values to sort order
        const mapSortOrder = (frontendSort: string) => {
            switch (frontendSort) {
                case "price_asc":
                    return "asc";
                case "price_desc":
                    return "desc";
                case "name":
                    return "asc";
                case "popularity":
                case "newest":
                default:
                    return "desc";
            }
        };
        
        const validSortBy = ["price", "createdAt", "marketedAt"];
        const sortBy = sortByParam 
            ? mapSortBy(sortByParam)
            : "createdAt";
            
        const sortOrderParam = searchParams.get("sortOrder");
        const validSortOrder = ["asc", "desc"];
        const sortOrder = sortOrderParam && validSortOrder.includes(sortOrderParam)
            ? sortOrderParam as "asc" | "desc"
            : sortByParam 
                ? mapSortOrder(sortByParam)
                : "desc";

        const data = await queries.product.paginate({
            limit,
            page,
            search,
            minPrice,
            maxPrice,
            categoryId,
            subcategoryId,
            productTypeId,
            isActive,
            isAvailable,
            isPublished,
            isDeleted,
            verificationStatus,
            sortBy,
            sortOrder,
        });

        return CResponse({ data });
    } catch (err) {
        return handleError(err);
    }
}

// Apply production optimizations to GET handler
export const GET = withCors(
    withCache(
        async (req: NextRequest) => {
            // Apply rate limiting
            const rateLimitResponse = await withRateLimit(req, apiRateLimiter);
            if (rateLimitResponse) return rateLimitResponse;
            
            return getProductsHandler(req);
        },
        cacheConfigs.products
    ),
    corsConfigs.public
);

async function createProductsHandler(req: NextRequest): Promise<NextResponse> {
    try {
        if (env.IS_API_AUTHENTICATED) {
            const { userId } = await auth();
            if (!userId)
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, "UNAUTHORIZED");

            const user = await cache.user.get(userId);
            if (!user || user.role === "user")
                throw new AppError(ERROR_MESSAGES.FORBIDDEN, "FORBIDDEN");
        }

        const body = await req.json();
        const parsed = createProductSchema.array().parse(body);

        const categoryIds = [...new Set(parsed.map((p) => p.categoryId))];
        const subcategoryIds = [...new Set(parsed.map((p) => p.subcategoryId))];
        const productTypeIds = [...new Set(parsed.map((p) => p.productTypeId))];

        const [allCategories, allSubcategories, allProductTypes] =
            await Promise.all([
                cache.category.scan(),
                cache.subcategory.scan(),
                cache.productType.scan(),
            ]);

        const categoryMap = new Map(
            allCategories
                .filter((c) => categoryIds.includes(c.id))
                .map((c) => [c.id, c])
        );
        const subcategoryMap = new Map(
            allSubcategories
                .filter((s) => subcategoryIds.includes(s.id))
                .map((s) => [s.id, s])
        );
        const productTypeMap = new Map(
            allProductTypes
                .filter((pt) => productTypeIds.includes(pt.id))
                .map((pt) => [pt.id, pt])
        );

        const productsWithSkus = parsed.map((product) => {
            const category = categoryMap.get(product.categoryId);
            const subcategory = subcategoryMap.get(product.subcategoryId);
            const productType = productTypeMap.get(product.productTypeId);

            if (!category || !subcategory || !productType)
                throw new AppError(
                    "Invalid category, subcategory, or product type",
                    "BAD_REQUEST"
                );

            if (!product.productHasVariants) {
                product.nativeSku = generateSKU({
                    category: category.name,
                    subcategory: subcategory.name,
                    productType: productType.name,
                });
            } else {
                product.nativeSku = generateSKU({
                    category: category.name,
                    subcategory: subcategory.name,
                    productType: productType.name,
                });

                if (product.variants && product.variants.length > 0) {
                    for (const variant of product.variants) {
                        const optionCombinations = Object.entries(
                            variant.combinations
                        ).map(([optionId, valueId]) => {
                            const option = product.options.find(
                                (opt) => opt.id === optionId
                            );
                            const value = option?.values.find(
                                (val) => val.id === valueId
                            );
                            return {
                                name: option?.name ?? "",
                                value: value?.name ?? "",
                            };
                        });

                        variant.nativeSku = generateSKU({
                            category: category.name,
                            subcategory: subcategory.name,
                            productType: productType.name,
                            options: optionCombinations,
                        });
                    }
                }
            }

            return {
                ...product,
                slug: generateProductSlug(product.title),
            };
        });

        const data = await queries.product.batch(productsWithSkus);
        
        // Invalidate related caches
        await Promise.all([
            cacheInvalidation.products(),
            cacheInvalidation.newArrivals(),
            cacheInvalidation.categories(),
        ]);

        return CResponse({ message: "CREATED", data });
    } catch (err) {
        return handleError(err);
    }
}

// Apply production optimizations to POST handler
export const POST = withCors(
    async (req: NextRequest) => {
        // Apply rate limiting for creation operations
        const rateLimitResponse = await withRateLimit(req, apiRateLimiter);
        if (rateLimitResponse) return rateLimitResponse;
        
        return createProductsHandler(req);
    },
    corsConfigs.authenticated
);
