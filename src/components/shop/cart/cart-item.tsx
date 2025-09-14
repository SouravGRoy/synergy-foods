"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Price } from "@/components/ui/price";
import { getImageUrl } from "@/lib/utils";
import { CartItem as CartItemType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface CartItemProps {
    item: CartItemType;
    onQuantityChange: (itemId: string, newQuantity: number) => Promise<void>;
    onRemove: (itemId: string) => Promise<void>;
    onMoveToWishlist: (itemId: string) => Promise<void>;
}

export function CartItem({
    item,
    onQuantityChange,
    onRemove,
    onMoveToWishlist,
}: CartItemProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [quantity, setQuantity] = useState(item.quantity);
    const [imageError, setImageError] = useState(false);

    const handleQuantityChange = async (newQuantity: number) => {
        if (newQuantity < 1) return;

        const maxQuantity =
            item.variant?.quantity || item.product.quantity || 0;
        if (newQuantity > maxQuantity) {
            toast.error(`Only ${maxQuantity} items available in stock`);
            return;
        }

        setIsUpdating(true);
        try {
            await onQuantityChange(item.id, newQuantity);
            setQuantity(newQuantity);
            toast.success("Cart updated successfully");
        } catch (error) {
            toast.error("Failed to update cart");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRemove = async () => {
        setIsUpdating(true);
        try {
            await onRemove(item.id);
            toast.success("Item removed from cart");
        } catch (error) {
            toast.error("Failed to remove item");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleMoveToWishlist = async () => {
        setIsUpdating(true);
        try {
            await onMoveToWishlist(item.id);
            toast.success("Item moved to wishlist");
        } catch (error) {
            toast.error("Failed to move item to wishlist");
        } finally {
            setIsUpdating(false);
        }
    };

    const totalPrice = item.variant?.price || item.product.price;

    // Debug the complete cart item structure
    console.log("Complete cart item:", item);
    console.log("Product structure:", item.product);

    // Try different possible image paths with type safety
    const productAny = item.product as any; // Type assertion to explore structure
    const possibleImagePaths = [
        item.product.images?.[0], // Original attempt
        productAny.media?.[0]?.mediaItem?.url, // Like new-arrivals
        productAny.media?.[0]?.url, // Alternative structure
        productAny.imageUrl, // Direct property
        productAny.image, // Single image property
    ];

    console.log("Possible image paths:", possibleImagePaths);

    // Find the first valid image URL
    const validImageUrl = possibleImagePaths.find(
        (url) => url && typeof url === "string" && url.length > 0
    );

    // Use a simple fallback that won't cause loading errors
    const imageUrl = validImageUrl || null;

    console.log("Cart item final image URL:", imageUrl);

    return (
        <Card className="p-4">
            <CardContent className="p-0">
                <div className="flex flex-col gap-4 sm:flex-row">
                    {/* Product Image */}
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border bg-gray-100">
                        {imageError || !imageUrl ? (
                            <div className="flex h-full w-full items-center justify-center">
                                <Icons.Image className="h-8 w-8 text-gray-400" />
                            </div>
                        ) : (
                            <Image
                                width={96}
                                height={96}
                                src={imageUrl}
                                alt={item.product.name || "Product image"}
                                className="object-cover"
                                onError={() => {
                                    console.error(
                                        "Image failed to load:",
                                        imageUrl
                                    );
                                    if (!imageError) {
                                        setImageError(true);
                                    }
                                }}
                            />
                        )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                            <div className="flex-1">
                                <Link
                                    href={`/shop/products/${item.product.slug}`}
                                    className="font-semibold text-foreground hover:text-primary"
                                >
                                    {item.product.name}
                                </Link>

                                {item.variant && (
                                    <p className="text-sm text-muted-foreground">
                                        {Object.entries(
                                            item.variant.combination
                                        ).map(([key, value]) => (
                                            <span key={key} className="mr-2">
                                                {key}: {value}
                                            </span>
                                        ))}
                                    </p>
                                )}

                                <div className="mt-1 flex items-center gap-2">
                                    {totalPrice !== null ? (
                                        <Price
                                            value={totalPrice}
                                            className="text-lg font-semibold"
                                        />
                                    ) : (
                                        <span className="text-lg font-semibold text-muted-foreground">
                                            Price not available
                                        </span>
                                    )}
                                    {item.product.compareAtPrice &&
                                        totalPrice !== null &&
                                        item.product.compareAtPrice >
                                            totalPrice && (
                                            <Price
                                                value={
                                                    item.product.compareAtPrice
                                                }
                                                className="text-sm text-muted-foreground line-through"
                                            />
                                        )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:flex-col sm:items-end">
                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() =>
                                            handleQuantityChange(quantity - 1)
                                        }
                                        disabled={isUpdating || quantity <= 1}
                                    >
                                        <Icons.Minus className="h-4 w-4" />
                                    </Button>

                                    <span className="w-8 text-center font-medium">
                                        {quantity}
                                    </span>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() =>
                                            handleQuantityChange(quantity + 1)
                                        }
                                        disabled={isUpdating}
                                    >
                                        <Icons.Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 sm:mt-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleMoveToWishlist}
                                        disabled={isUpdating}
                                        className="text-xs"
                                    >
                                        <Icons.Heart className="mr-1 h-3 w-3" />
                                        Save
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleRemove}
                                        disabled={isUpdating}
                                        className="text-xs text-destructive hover:text-destructive"
                                    >
                                        <Icons.Trash className="mr-1 h-3 w-3" />
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
