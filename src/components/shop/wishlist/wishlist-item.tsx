"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Price } from "@/components/ui/price";
import { WishlistItem as WishlistItemType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface WishlistItemProps {
    item: WishlistItemType;
    onRemove: (itemId: string) => Promise<void>;
    onMoveToCart: (itemId: string) => Promise<void>;
}

export function WishlistItem({
    item,
    onRemove,
    onMoveToCart,
}: WishlistItemProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleRemove = async () => {
        setIsUpdating(true);
        try {
            await onRemove(item.id);
            toast.success("Item removed from wishlist");
        } catch {
            toast.error("Failed to remove item");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleMoveToCart = async () => {
        setIsUpdating(true);
        try {
            await onMoveToCart(item.id);
            toast.success("Item added to cart");
        } catch {
            toast.error("Failed to add item to cart");
        } finally {
            setIsUpdating(false);
        }
    };

    const productAny = item.product as any;
    const possibleImagePaths = [
        item.product.images?.[0],
        productAny.media?.[0]?.mediaItem?.url,
        productAny.media?.[0]?.url,
        productAny.imageUrl,
        productAny.image,
    ];
    const imageUrl =
        possibleImagePaths.find(
            (url) => url && typeof url === "string" && url.length > 0
        ) || null;

    const isOutOfStock = (item.product.quantity ?? 0) <= 0;
    const isUnavailable =
        !item.product.isAvailable ||
        !item.product.isActive ||
        item.product.isDeleted ||
        item.product.verificationStatus !== "approved" ||
        !item.product.isPublished;

    return (
        <Card className="overflow-hidden rounded-xl border border-gray-200 shadow-sm transition hover:shadow-md">
            <CardContent className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                    {/* Product Image */}
                    <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {imageError || !imageUrl ? (
                            <div className="flex h-full w-full items-center justify-center">
                                <Icons.Image className="h-8 w-8 text-gray-400" />
                            </div>
                        ) : (
                            <Image
                                height={128}
                                width={128}
                                src={imageUrl}
                                alt={item.product.name || "Product image"}
                                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                onError={() => setImageError(true)}
                            />
                        )}
                        {(isOutOfStock || isUnavailable) && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                <span className="text-xs font-medium text-white">
                                    {isUnavailable
                                        ? "Unavailable"
                                        : "Out of Stock"}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col justify-between">
                        <div className="flex flex-col gap-3">
                            <div className="flex-1">
                                <Link
                                    href={`/shop/products/${item.product.slug}`}
                                    className="line-clamp-2 font-semibold text-gray-900 hover:text-primary"
                                >
                                    {item.product.name}
                                </Link>

                                <p className="mt-1 text-xs text-gray-500">
                                    Added{" "}
                                    {new Date(
                                        item.createdAt
                                    ).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Price and Actions Column */}
                            <div className="flex flex-col gap-3">
                                {/* Price */}
                                <div className="flex items-center gap-2">
                                    {item.product.price !== null ? (
                                        <Price
                                            value={item.product.price}
                                            className="text-lg font-semibold text-gray-900"
                                        />
                                    ) : (
                                        <span className="text-lg font-semibold text-muted-foreground">
                                            Price not available
                                        </span>
                                    )}
                                    {item.product.compareAtPrice &&
                                        item.product.price !== null &&
                                        item.product.compareAtPrice >
                                            item.product.price && (
                                            <Price
                                                value={
                                                    item.product.compareAtPrice
                                                }
                                                className="text-sm text-muted-foreground line-through"
                                            />
                                        )}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2">
                                    {!isUnavailable && (
                                        <Button
                                            onClick={handleMoveToCart}
                                            disabled={
                                                isUpdating || isOutOfStock
                                            }
                                            className="w-full"
                                        >
                                            {isUpdating ? (
                                                <>
                                                    <Icons.Loader className="mr-2 h-4 w-4 animate-spin" />
                                                    Adding...
                                                </>
                                            ) : isOutOfStock ? (
                                                "Out of Stock"
                                            ) : (
                                                <>
                                                    <Icons.ShoppingBag className="mr-2 h-4 w-4" />
                                                    Add to Cart
                                                </>
                                            )}
                                        </Button>
                                    )}

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleRemove}
                                        disabled={isUpdating}
                                        className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                                    >
                                        <Icons.Trash2 className="mr-1 h-4 w-4" />
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
