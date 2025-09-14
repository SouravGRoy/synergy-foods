"use client";

import { ProductCard } from "@/components/shop/products/product-card";
import { FullProduct } from "@/lib/validations";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";

interface RelatedProductsProps {
    products: FullProduct[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
    const { userId } = useAuth();
    const queryClient = useQueryClient();

    // Add to cart mutation
    const addToCartMutation = useMutation({
        mutationFn: async (productId: string) => {
            const requestData = {
                userId,
                productId,
                quantity: 1,
            };

            console.log(
                "Related Products - Attempting to add to cart:",
                requestData
            );

            const response = await fetch("/api/carts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Related Products - Cart API Error:", {
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

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Related Products</h2>
                <Link
                    href="/shop"
                    className="font-medium text-primary hover:underline"
                >
                    View All Products
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {products.slice(0, 4).map((product) => {
                    // Transform FullProduct to match ProductCard's expected interface
                    const transformedProduct = {
                        id: product.id,
                        title: product.title,
                        slug: product.slug,
                        description: product.description,
                        price: product.price,
                        compareAtPrice: product.compareAtPrice,
                        images:
                            product.media
                                ?.map((m) => m.mediaItem?.url)
                                .filter((url): url is string => Boolean(url)) ||
                            [],
                        isAvailable: product.isAvailable,
                        isActive: product.isActive,
                        category: product.category
                            ? {
                                  name: product.category.name,
                                  slug: product.category.slug,
                              }
                            : undefined,
                        subcategory: product.subcategory
                            ? {
                                  name: product.subcategory.name,
                                  slug: product.subcategory.slug,
                              }
                            : undefined,
                    };

                    return (
                        <ProductCard
                            key={product.id}
                            product={transformedProduct}
                            onAddToCart={handleAddToCart}
                            onAddToWishlist={handleAddToWishlist}
                        />
                    );
                })}
            </div>
        </div>
    );
}
