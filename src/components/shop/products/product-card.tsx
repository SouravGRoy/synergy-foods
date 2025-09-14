"use client";

import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Price } from "@/components/ui/price";
import { generateUploadThingUrl, getImageUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface Product {
    id: string;
    name?: string;
    title?: string;
    slug: string;
    description?: string | null;
    price: number | null;
    compareAtPrice?: number | null;
    images?: string[];
    quantity?: number | null;
    isAvailable?: boolean;
    isActive?: boolean;
    category?: {
        name: string;
        slug: string;
    };
    subcategory?: {
        name: string;
        slug: string;
    };
}

interface ProductCardProps {
    product: Product;
    onAddToCart?: (productId: string) => Promise<void>;
    onAddToWishlist?: (productId: string) => Promise<void>;
}

export function ProductCard({
    product,
    onAddToCart,
    onAddToWishlist,
}: ProductCardProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [isWishlisting, setIsWishlisting] = useState(false);

    const imageUrl = getImageUrl(product.images?.[0]);
    const productName = product.name || product.title || "Product";

    // Function to strip HTML tags from description (server-safe)
    const stripHtmlTags = (html: string) => {
        // Remove HTML tags using regex
        return html.replace(/<[^>]*>/g, "").trim();
    };

    const isOutOfStock = (product.quantity ?? 0) <= 0;
    const isUnavailable = !product.isAvailable || !product.isActive;

    const discount =
        product.compareAtPrice &&
        product.price !== null &&
        product.compareAtPrice > product.price
            ? Math.round(
                  ((product.compareAtPrice - product.price) /
                      product.compareAtPrice) *
                      100
              )
            : null;

    const handleAddToCart = async () => {
        if (!onAddToCart) return;

        setIsAdding(true);
        try {
            await onAddToCart(product.id);
            toast.success("Added to cart");
        } catch (error) {
            toast.error("Failed to add to cart");
        } finally {
            setIsAdding(false);
        }
    };

    const handleAddToWishlist = async () => {
        if (!onAddToWishlist) return;

        setIsWishlisting(true);
        try {
            await onAddToWishlist(product.id);
            toast.success("Added to wishlist");
        } catch (error) {
            toast.error("Failed to add to wishlist");
        } finally {
            setIsWishlisting(false);
        }
    };

    return (
        <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg">
            <div className="relative aspect-square overflow-hidden">
                <Link href={`/shop/products/${product.slug}`}>
                    <Image
                        src={imageUrl}
                        alt={productName}
                        fill
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                </Link>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {discount && (
                        <Badge variant="destructive" className="text-xs">
                            -{discount}%
                        </Badge>
                    )}
                    {isOutOfStock && (
                        <Badge variant="secondary" className="text-xs">
                            Out of Stock
                        </Badge>
                    )}
                    {isUnavailable && (
                        <Badge variant="secondary" className="text-xs">
                            Unavailable
                        </Badge>
                    )}
                </div>

                {/* Wishlist Button */}
                <div className="absolute top-2 right-2">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 bg-white/80 hover:bg-white"
                        onClick={handleAddToWishlist}
                        disabled={isWishlisting || isUnavailable}
                    >
                        {isWishlisting ? (
                            <Icons.Loader className="h-4 w-4 animate-spin" />
                        ) : (
                            <Icons.Heart className="h-4 w-4" />
                        )}
                    </Button>
                </div>

                {/* Quick Add to Cart on Hover */}
                <div className="absolute inset-x-2 bottom-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <Button
                        className="w-full"
                        onClick={handleAddToCart}
                        disabled={isAdding || isOutOfStock || isUnavailable}
                        size="sm"
                    >
                        {isAdding ? (
                            <>
                                <Icons.Loader className="mr-2 h-4 w-4 animate-spin" />
                                Adding...
                            </>
                        ) : isOutOfStock ? (
                            "Out of Stock"
                        ) : isUnavailable ? (
                            "Unavailable"
                        ) : (
                            <>
                                <Icons.ShoppingBag className="mr-2 h-4 w-4" />
                                Add to Cart
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <CardContent className="">
                {/* Category */}
                {product.category && (
                    <div className="mb-2">
                        <Link
                            href={`/shop/categories/${product.category.slug}`}
                            className="text-xs text-muted-foreground hover:text-primary"
                        >
                            {product.category.name}
                            {product.subcategory &&
                                ` / ${product.subcategory.name}`}
                        </Link>
                    </div>
                )}

                {/* Product Name */}
                <Link href={`/shop/products/${product.slug}`}>
                    <h3 className="line-clamp-2 text-sm font-semibold transition-colors hover:text-primary">
                        {productName}
                    </h3>
                </Link>

                {/* Description */}
                {product.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {stripHtmlTags(product.description)}
                    </p>
                )}
            </CardContent>

            <CardFooter className="p- pt-0">
                <div className="flex w-full flex-wrap items-center justify-between">
                    <div className="flex items-center gap-2">
                        {product.price !== null ? (
                            <Price
                                value={product.price}
                                className="text-sm font-semibold md:text-base"
                            />
                        ) : (
                            <span className="text-lg font-bold text-muted-foreground">
                                Price not available
                            </span>
                        )}
                        {product.compareAtPrice &&
                            product.price !== null &&
                            product.compareAtPrice > product.price && (
                                <Price
                                    value={product.compareAtPrice}
                                    className="text-sm text-muted-foreground line-through"
                                />
                            )}
                    </div>

                    {/* Stock indicator */}
                    {!isOutOfStock &&
                        !isUnavailable &&
                        product.quantity &&
                        product.quantity <= 10 && (
                            <Badge variant="outline" className="text-xs">
                                {product.quantity} left
                            </Badge>
                        )}
                </div>
            </CardFooter>
        </Card>
    );
}
