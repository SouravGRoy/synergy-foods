"use client";

import { Icons } from "@/components/icons";
import { ProductCard } from "@/components/shop/products/product-card";
import { ProductFilters } from "@/components/shop/products/product-filters";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/data-table/pagination";
import { Category, Subcategory } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    price: number | null;
    compareAtPrice?: number | null;
    images?: string[];
    quantity?: number | null;
    isAvailable: boolean;
    isActive: boolean;
    category?: {
        name: string;
        slug: string;
    };
    subcategory?: {
        name: string;
        slug: string;
    };
}

interface ProductListingProps {
    initialProducts: Product[];
    initialCategories: Category[];
    initialSubcategories: Subcategory[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
}

const fetchProducts = async (params: URLSearchParams) => {
    // Always filter for published products in shop
    params.set("isPublished", "true");
    params.set("isActive", "true");
    params.set("isDeleted", "false");
    params.set("verificationStatus", "approved");

    const response = await fetch(`/api/products?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }
    const data = await response.json();

    // The API wraps the response in { success, data: { data, items, pages } }
    const responseData = data.data || data;
    const currentPage = parseInt(params.get("page") || "1");

    // Ensure the response has the expected structure
    return {
        products: responseData.data || [],
        totalCount: responseData.items || 0,
        currentPage: currentPage,
    };
};

export function ProductListing({
    initialProducts,
    initialCategories,
    initialSubcategories,
    totalCount: initialTotalCount,
    currentPage: initialCurrentPage,
    pageSize,
}: ProductListingProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { userId } = useAuth();
    const queryClient = useQueryClient();

    const [showFilters, setShowFilters] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Add to cart mutation
    const addToCartMutation = useMutation({
        mutationFn: async (productId: string) => {
            const requestData = {
                userId,
                productId,
                quantity: 1,
            };

            console.log(
                "Product Listing - Attempting to add to cart:",
                requestData
            );

            const response = await fetch("/api/carts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Product Listing - Cart API Error:", {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText,
                });
                throw new Error(
                    `Failed to add to cart: ${response.status} ${errorText}`
                );
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart", userId] });
        },
    });

    // Add to wishlist mutation
    const addToWishlistMutation = useMutation({
        mutationFn: async (productId: string) => {
            const response = await fetch("/api/wishlists", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, productId }),
            });
            if (!response.ok) throw new Error("Failed to add to wishlist");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wishlist", userId] });
        },
    });

    useEffect(() => {
        setIsClient(true);
        // Initialize search term from URL
        setSearchTerm(searchParams.get("search") || "");
    }, [searchParams]);

    // Parse current filters from URL
    const filters = useMemo(
        () => ({
            search: searchParams.get("search") || "",
            categoryId: searchParams.get("categoryId") || undefined,
            subcategoryId: searchParams.get("subcategoryId") || undefined,
            minPrice: searchParams.get("minPrice")
                ? parseInt(searchParams.get("minPrice")!)
                : undefined,
            maxPrice: searchParams.get("maxPrice")
                ? parseInt(searchParams.get("maxPrice")!)
                : undefined,
            inStock: searchParams.get("inStock") === "true" || undefined,
            sortBy: (searchParams.get("sortBy") as any) || "popularity",
            page: parseInt(searchParams.get("page") || "1"),
            limit: parseInt(searchParams.get("limit") || pageSize.toString()),
        }),
        [searchParams, pageSize]
    );

    // Fetch products with current filters
    const {
        data: productsData = {
            products: initialProducts,
            totalCount: initialTotalCount,
            currentPage: initialCurrentPage,
        },
        isLoading,
        error,
        isFetching,
    } = useQuery({
        queryKey: ["products", filters],
        queryFn: () => {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== "" && value !== null) {
                    params.set(key, value.toString());
                }
            });

            return fetchProducts(params);
        },
        staleTime: 1000 * 60 * 10, // 10 minutes (increased from 5)
        gcTime: 1000 * 60 * 15, // 15 minutes garbage collection
        retry: 3, // Retry failed requests
        retryDelay: 1000, // 1 second delay between retries
        enabled: isClient, // Only run on client
        initialData: {
            products: initialProducts,
            totalCount: initialTotalCount,
            currentPage: initialCurrentPage,
        },
    });

    const { products, totalCount, currentPage } = productsData || {
        products: initialProducts,
        totalCount: initialTotalCount,
        currentPage: initialCurrentPage,
    };

    // Ensure products is always an array
    const safeProducts = products || initialProducts || [];

    // Debug logging for development
    useEffect(() => {
        if (process.env.NODE_ENV === "development") {
            console.log("ProductListing state:", {
                products: products?.length ?? "undefined",
                safeProducts: safeProducts.length,
                isLoading,
                isFetching,
                error: error?.message,
                totalCount,
            });
        }
    }, [products, safeProducts, isLoading, isFetching, error, totalCount]);

    // Update URL with new filters
    const updateFilters = useCallback(
        (newFilters: any) => {
            const params = new URLSearchParams();

            Object.entries(newFilters).forEach(([key, value]) => {
                if (
                    value !== undefined &&
                    value !== "" &&
                    value !== null &&
                    key !== "page" &&
                    key !== "limit"
                ) {
                    params.set(key, value.toString());
                }
            });

            // Reset to page 1 when filters change (except when only page changes)
            if (
                JSON.stringify({ ...newFilters, page: 1 }) !==
                JSON.stringify(filters)
            ) {
                params.set("page", "1");
            } else {
                params.set("page", newFilters.page?.toString() || "1");
            }

            params.set(
                "limit",
                newFilters.limit?.toString() || pageSize.toString()
            );

            router.push(`${pathname}?${params.toString()}`);
        },
        [router, pathname, filters, pageSize]
    );

    // Debounce filter updates for search with improved handling
    const debouncedUpdateFilters = useDebouncedCallback((newFilters: any) => {
        setIsSearching(false);
        updateFilters(newFilters);
    }, 500);

    // Immediate search state update for better UX
    const handleSearchChange = useCallback(
        (searchValue: string) => {
            setSearchTerm(searchValue);
            setIsSearching(true);

            const newFilters = { ...filters, search: searchValue };
            debouncedUpdateFilters(newFilters);
        },
        [filters, debouncedUpdateFilters]
    );

    const handleFiltersChange = (newFilters: any) => {
        if (newFilters.search !== filters.search) {
            // Handle search with improved UX
            handleSearchChange(newFilters.search);
        } else {
            // Immediate update for other filters
            updateFilters(newFilters);
        }
    };

    const handleClearFilters = () => {
        router.push(pathname);
    };

    const handlePageChange = (page: number) => {
        updateFilters({ ...filters, page });
    };

    const handleAddToCart = async (productId: string) => {
        if (!userId) {
            toast.error("Please sign in to add items to cart");
            return;
        }

        try {
            await addToCartMutation.mutateAsync(productId);
            toast.success("Added to cart");
        } catch (error) {
            toast.error("Failed to add to cart");
        }
    };

    const handleAddToWishlist = async (productId: string) => {
        if (!userId) {
            toast.error("Please sign in to add items to wishlist");
            return;
        }

        try {
            await addToWishlistMutation.mutateAsync(productId);
            toast.success("Added to wishlist");
        } catch (error) {
            toast.error("Failed to add to wishlist");
        }
    };

    const pageCount = Math.ceil((totalCount ?? 0) / filters.limit);

    return (
        <div className="mx-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Products</h1>
                        <p className="mt-1 text-muted-foreground">
                            {isFetching && isClient
                                ? "Loading..."
                                : `${(totalCount ?? 0).toLocaleString()} products found`}
                        </p>
                    </div>

                    {/* Mobile Filter Toggle */}
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className="md:hidden"
                    >
                        <Icons.Menu className="mr-2 h-4 w-4" />
                        Filters
                    </Button>
                </div>

                {/* Active Filters Summary */}
                {(filters.search ||
                    filters.categoryId ||
                    filters.subcategoryId ||
                    filters.minPrice ||
                    filters.maxPrice) && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Active filters:</span>
                        {filters.search && (
                            <span className="rounded bg-muted px-2 py-1">
                                Search: &quot;{filters.search}&quot;
                            </span>
                        )}
                        {filters.categoryId && (
                            <span className="rounded bg-muted px-2 py-1">
                                Category:{" "}
                                {
                                    initialCategories.find(
                                        (c) => c.id === filters.categoryId
                                    )?.name
                                }
                            </span>
                        )}
                        {(filters.minPrice || filters.maxPrice) && (
                            <span className="rounded bg-muted px-2 py-1">
                                Price: ${filters.minPrice || 0} - $
                                {filters.maxPrice || "∞"}
                            </span>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearFilters}
                            className="h-6 px-2 text-xs"
                        >
                            Clear all
                        </Button>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
                {/* Sidebar Filters */}
                <div
                    className={`md:w-80 ${showFilters ? "block" : "hidden md:block"}`}
                >
                    <ProductFilters
                        categories={initialCategories}
                        subcategories={initialSubcategories}
                        filters={{ ...filters, search: searchTerm }}
                        onFiltersChange={handleFiltersChange}
                        onClearFilters={handleClearFilters}
                    />
                </div>

                {/* Products Grid */}
                <div className="flex-1">
                    {/* Search Loading State */}
                    {isSearching && (
                        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-center text-sm text-blue-800">
                            <Icons.Search className="mr-2 inline h-4 w-4 animate-pulse" />
                            Searching for &quot;{searchTerm}&quot;...
                        </div>
                    )}

                    {/* General Loading State */}
                    {isFetching && !isLoading && !isSearching && (
                        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-center text-sm text-blue-800">
                            <Icons.Loader className="mr-2 inline h-4 w-4 animate-spin" />
                            Refreshing products...
                        </div>
                    )}

                    {error && (
                        <div className="py-12 text-center">
                            <Icons.AlertTriangle className="mx-auto mb-4 h-12 w-12 text-destructive" />
                            <h3 className="mb-2 text-lg font-semibold">
                                Error loading products
                            </h3>
                            <p className="text-muted-foreground">
                                Please try again later.
                            </p>
                        </div>
                    )}

                    {isLoading && isClient && safeProducts.length === 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="mb-4 aspect-square rounded-lg bg-muted" />
                                    <div className="mb-2 h-4 rounded bg-muted" />
                                    <div className="h-4 w-3/4 rounded bg-muted" />
                                </div>
                            ))}
                        </div>
                    ) : safeProducts.length === 0 ? (
                        <div className="py-12 text-center">
                            <Icons.Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-semibold">
                                {filters.search
                                    ? `No products found for "${filters.search}"`
                                    : "No products found"}
                            </h3>
                            <p className="mb-4 text-muted-foreground">
                                {filters.search
                                    ? "Try searching with different keywords or check your spelling."
                                    : "Try adjusting your filters or search terms."}
                            </p>
                            <div className="flex justify-center gap-2">
                                {filters.search && (
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            handleFiltersChange({
                                                ...filters,
                                                search: "",
                                            })
                                        }
                                    >
                                        Clear Search
                                    </Button>
                                )}
                                <Button onClick={handleClearFilters}>
                                    Clear All Filters
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8 grid grid-cols-1 gap-2 border-none sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {safeProducts.map((product: Product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onAddToCart={handleAddToCart}
                                        onAddToWishlist={handleAddToWishlist}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {pageCount > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    pageCount={pageCount}
                                    pageSize={filters.limit}
                                    totalItems={totalCount ?? 0}
                                    onPageChange={handlePageChange}
                                    onRowsPerPageChange={(newPageSize) =>
                                        updateFilters({
                                            ...filters,
                                            limit: newPageSize,
                                            page: 1,
                                        })
                                    }
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
