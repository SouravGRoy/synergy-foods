"use client";

import { Icons } from "@/components/icons";
import { CartItem } from "@/components/shop/cart/cart-item";
import { CartSummary } from "@/components/shop/cart/cart-summary";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function CartPage() {
    const router = useRouter();
    const { items, isLoading, updateQuantity, removeItem, moveToWishlist } =
        useCart();

    const handleCheckout = () => {
        // Navigate to checkout page (to be implemented)
        router.push("/checkout");
    };

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
                    <h1 className="text-3xl font-bold">Shopping Cart</h1>
                    <p className="mt-2 text-muted-foreground">
                        Your cart is currently empty
                    </p>
                </div>

                <Card className="mx-auto max-w-md">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Icons.ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-semibold">
                            Your cart is empty
                        </h3>
                        <p className="mb-6 text-center text-muted-foreground">
                            Looks like you haven&apos;t added any items to your
                            cart yet.
                        </p>
                        <Button asChild>
                            <Link href="/shop">
                                <Icons.Store className="mr-2 h-4 w-4" />
                                Continue Shopping
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
                <h1 className="text-3xl font-bold">Shopping Cart</h1>
                <p className="mt-2 text-muted-foreground">
                    {items.length} {items.length === 1 ? "item" : "items"} in
                    your cart
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Cart Items */}
                <div className="space-y-4 lg:col-span-2">
                    {items.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onQuantityChange={async (
                                itemId: string,
                                quantity: number
                            ) => {
                                await updateQuantity({ itemId, quantity });
                            }}
                            onRemove={async (itemId: string) => {
                                await removeItem(itemId);
                            }}
                            onMoveToWishlist={async (itemId: string) => {
                                const item = items.find((i) => i.id === itemId);
                                if (item) {
                                    await moveToWishlist({
                                        itemId,
                                        productId: item.productId,
                                    });
                                }
                            }}
                        />
                    ))}
                </div>

                {/* Cart Summary */}
                <div className="lg:col-span-1">
                    <CartSummary items={items} onCheckout={handleCheckout} />
                </div>
            </div>
        </div>
    );
}
