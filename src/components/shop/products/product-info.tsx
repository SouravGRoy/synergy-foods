"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Price } from "@/components/ui/price";
import { Separator } from "@/components/ui/separator";
import { FullProduct } from "@/lib/validations";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Minus, Plus, Share2, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ProductInfoProps {
    product: FullProduct;
}

export function ProductInfo({ product }: ProductInfoProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

    const { userId } = useAuth();
    const queryClient = useQueryClient();

    // Add to cart mutation
    const addToCartMutation = useMutation({
        mutationFn: async () => {
            const requestData: any = {
                userId,
                productId: product.id,
                quantity,
            };

            // Only include variantId if it's not null
            if (selectedVariant) {
                requestData.variantId = selectedVariant;
            }

            console.log("Attempting to add to cart:", requestData);
            console.log("Data types:", {
                userId: typeof userId,
                userIdValue: userId,
                productId: typeof product.id,
                productIdValue: product.id,
                quantity: typeof quantity,
                quantityValue: quantity,
            });

            const response = await fetch("/api/carts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Cart API Error:", {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText,
                    url: response.url,
                    headers: Object.fromEntries(response.headers.entries()),
                });

                // Try to parse the error as JSON for better error details
                try {
                    const errorJson = JSON.parse(errorText);
                    console.error("Parsed error details:", errorJson);
                } catch {
                    console.error("Error response is not JSON:", errorText);
                }

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

    const removeFromWishlistMutation = useMutation({
        mutationFn: async (productId: string) => {
            const response = await fetch("/api/wishlists", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, productId }),
            });
            if (!response.ok) throw new Error("Failed to remove from wishlist");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wishlist", userId] });
        },
    });

    const isOutOfStock = (product.quantity ?? 0) <= 0;
    const maxQuantity = product.quantity ?? 1;

    const handleAddToCart = () => {
        if (isOutOfStock) {
            toast.error("Product is out of stock");
            return;
        }

        addToCartMutation.mutate(undefined, {
            onSuccess: () => {
                toast.success("Added to cart");
            },
            onError: () => {
                toast.error("Failed to add to cart");
            },
        });
    };

    const handleWishlistToggle = () => {
        // For now, we'll assume product is not in wishlist since we don't have that field
        // In a real implementation, you'd track this state separately
        const isInWishlist = false; // placeholder

        if (isInWishlist) {
            removeFromWishlistMutation.mutate(product.id, {
                onSuccess: () => {
                    toast.success("Removed from wishlist");
                },
                onError: () => {
                    toast.error("Failed to remove from wishlist");
                },
            });
        } else {
            addToWishlistMutation.mutate(product.id, {
                onSuccess: () => {
                    toast.success("Added to wishlist");
                },
                onError: () => {
                    toast.error("Failed to add to wishlist");
                },
            });
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.title,
                    text: product.description || `Check out ${product.title}`,
                    url: window.location.href,
                });
            } catch (error) {
                // User cancelled sharing
            }
        } else {
            // Fallback to copying URL
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard");
        }
    };

    const increaseQuantity = () => {
        if (quantity < maxQuantity) {
            setQuantity(quantity + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    return (
        <div className="space-y-6">
            {/* Product Title and Rating */}
            <div>
                <h1 className="text-3xl font-bold">{product.title}</h1>
                {product.subcategory && (
                    <p className="mt-1 text-muted-foreground">
                        {product.category?.name}
                        {product.subcategory && (
                            <> • {product.subcategory.name}</>
                        )}
                    </p>
                )}

                {/* Rating placeholder */}
                <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-4 w-4 ${
                                    i < 4
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                }`}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                        (12 reviews)
                    </span>
                </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <Price
                        value={product.price ?? 0}
                        className="text-2xl font-bold"
                    />
                    {product.compareAtPrice &&
                        product.compareAtPrice > (product.price ?? 0) && (
                            <Price
                                value={product.compareAtPrice}
                                className="text-lg text-muted-foreground line-through"
                            />
                        )}
                </div>
                {product.compareAtPrice &&
                    product.compareAtPrice > (product.price ?? 0) && (
                        <Badge variant="destructive">
                            Save{" "}
                            {Math.round(
                                ((product.compareAtPrice -
                                    (product.price ?? 0)) /
                                    product.compareAtPrice) *
                                    100
                            )}
                            %
                        </Badge>
                    )}
            </div>

            {/* Stock Status */}
            <div className="space-y-2">
                {isOutOfStock ? (
                    <Badge variant="destructive">Out of Stock</Badge>
                ) : (product.quantity ?? 0) <= 5 ? (
                    <Badge
                        variant="outline"
                        className="border-orange-500 text-orange-600"
                    >
                        Only {product.quantity} left in stock
                    </Badge>
                ) : (
                    <Badge
                        variant="outline"
                        className="border-green-500 text-green-600"
                    >
                        In Stock
                    </Badge>
                )}
            </div>

            {/* Description */}
            {product.description && (
                <div>
                    <div
                        className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ol:text-muted-foreground prose-ul:text-muted-foreground prose-li:text-muted-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                        dangerouslySetInnerHTML={{
                            __html: product.description,
                        }}
                    />
                </div>
            )}

            <Separator />

            {/* Product Variants - Placeholder for future implementation */}
            {/* This would be expanded based on your variant schema */}

            {/* Quantity Selector */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Quantity</label>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-md border">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={decreaseQuantity}
                                disabled={quantity <= 1}
                                className="h-9 w-9 p-0"
                            >
                                <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-12 text-center text-sm font-medium">
                                {quantity}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={increaseQuantity}
                                disabled={quantity >= maxQuantity}
                                className="h-9 w-9 p-0"
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {maxQuantity} available
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Button
                        size="lg"
                        className="flex-1"
                        onClick={handleAddToCart}
                        disabled={isOutOfStock || addToCartMutation.isPending}
                    >
                        {addToCartMutation.isPending
                            ? "Adding..."
                            : "Add to Cart"}
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleWishlistToggle}
                        disabled={
                            addToWishlistMutation.isPending ||
                            removeFromWishlistMutation.isPending
                        }
                    >
                        <Heart
                            className={`h-4 w-4 ${
                                false // placeholder for isInWishlist
                                    ? "fill-current text-red-500"
                                    : ""
                            }`}
                        />
                    </Button>
                    <Button variant="outline" size="lg" onClick={handleShare}>
                        <Share2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Product Features */}
            <Card className="p-4">
                <div className="space-y-3">
                    <h3 className="font-medium">Product Features</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            Free shipping on orders over $50
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            30-day return policy
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            Secure payment
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            Customer support 24/7
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
