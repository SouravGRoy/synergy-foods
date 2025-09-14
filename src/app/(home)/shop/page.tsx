import { CategoryBreadcrumb } from "@/components/globals/CategoryBreadcrumb";
import { ProductListing } from "@/components/shop/products/product-listing";
import { queries } from "@/lib/db/queries";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shop - B2C Marketplace",
    description:
        "Browse all categories and find the best products at B2C Marketplace.",
};

interface PageProps {
    searchParams: Promise<{
        search?: string;
        categoryId?: string;
        subcategoryId?: string;
        minPrice?: string;
        maxPrice?: string;
        inStock?: string;
        sortBy?: string;
        page?: string;
        limit?: string;
    }>;
}

export default async function ShopPage({ searchParams }: PageProps) {
    const params = await searchParams;

    // Parse search parameters
    const page = parseInt(params.page || "1");
    const limit = parseInt(params.limit || "12");
    const search = params.search || "";
    const categoryId = params.categoryId;
    const subcategoryId = params.subcategoryId;
    const minPrice = params.minPrice ? parseInt(params.minPrice) : undefined;
    const maxPrice = params.maxPrice ? parseInt(params.maxPrice) : undefined;
    const inStock = params.inStock === "true";
    const sortByParam = params.sortBy || "popularity";

    // Map frontend sort values to backend values (same as API)
    const mapSortBy = (frontendSort: string) => {
        switch (frontendSort) {
            case "popularity":
            case "newest":
                return "createdAt";
            case "name":
                return "createdAt";
            case "price_asc":
            case "price_desc":
                return "price";
            default:
                return "createdAt";
        }
    };

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

    const sortBy = mapSortBy(sortByParam);
    const sortOrder = mapSortOrder(sortByParam);

    // Fetch data in parallel
    const [productsData, categories, subcategories] = await Promise.all([
        queries.product.paginate({
            page,
            limit,
            search,
            categoryId,
            subcategoryId,
            minPrice,
            maxPrice,
            isAvailable: inStock ? true : undefined,
            isPublished: true, // Only show published products in shop
            isActive: true, // Only show active products
            isDeleted: false, // Exclude deleted products
            verificationStatus: "approved", // Only show approved products
            sortBy,
            sortOrder,
        }),
        queries.category.scanActive(),
        queries.subcategory.scanActive(),
    ]);

    return (
        <div>
            <div className="container mx-auto px-4 py-2">
                <CategoryBreadcrumb currentPage="Shop" />
            </div>

            <ProductListing
                initialProducts={
                    productsData.data.map((product) => ({
                        ...product,
                        name: product.title, // Map title to name for UI consistency
                        images:
                            product.media
                                ?.map((m) => m.mediaItem?.url)
                                .filter((url): url is string => Boolean(url)) ||
                            [],
                    })) || []
                }
                initialCategories={categories}
                initialSubcategories={subcategories}
                totalCount={productsData.items || 0}
                currentPage={page}
                pageSize={limit}
            />
        </div>
    );
}
