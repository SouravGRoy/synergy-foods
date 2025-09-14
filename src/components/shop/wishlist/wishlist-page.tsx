"use client";

import { Icons } from "@/components/icons";
import { WishlistItem } from "@/components/shop/wishlist/wishlist-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWishlist } from "@/hooks/use-wishlist";
import Link from "next/link";

export function WishlistPage() {
    const { items, isLoading, removeItem, moveToCart } = useWishlist();

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex min-h-[400px] items-center justify-center">
                    <Icons.Loader className="h-8 w-8 animate-spin" />
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">My Wishlist</h1>
                    <p className="mt-2 text-muted-foreground">
                        Save items you love for later
                    </p>
                </div>

                <Card className="mx-auto max-w-md">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Icons.Heart className="mb-4 h-16 w-16 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-semibold">
                            Your wishlist is empty
                        </h3>
                        <p className="mb-6 text-center text-muted-foreground">
                            Start adding items you love to your wishlist so you
                            can easily find them later.
                        </p>
                        <Button asChild>
                            <Link href="/shop">
                                <Icons.Store className="mr-2 h-4 w-4" />
                                Browse Products
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">My Wishlist</h1>
                <p className="mt-2 text-muted-foreground">
                    {items.length} {items.length === 1 ? "item" : "items"} saved
                    for later
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <WishlistItem
                        key={item.id}
                        item={item}
                        onRemove={async (itemId: string) => {
                            await removeItem(itemId);
                        }}
                        onMoveToCart={async (itemId: string) => {
                            const item = items.find((i) => i.id === itemId);
                            if (item) {
                                await moveToCart({
                                    itemId,
                                    productId: item.productId,
                                });
                            }
                        }}
                    />
                ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-12 text-center">
                <Button variant="outline" asChild size="lg">
                    <Link href="/shop">
                        <Icons.ArrowLeft className="mr-2 h-4 w-4" />
                        Continue Shopping
                    </Link>
                </Button>
            </div>
        </div>
    );
}
