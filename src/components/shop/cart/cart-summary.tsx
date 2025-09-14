"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Price } from "@/components/ui/price";
import { Separator } from "@/components/ui/separator";
import { CartItem as CartItemType } from "@/types";
import { useMemo } from "react";

interface CartSummaryProps {
    items: CartItemType[];
    onCheckout: () => void;
    isLoading?: boolean;
}

export function CartSummary({
    items,
    onCheckout,
    isLoading,
}: CartSummaryProps) {
    const summary = useMemo(() => {
        const subtotal = items.reduce((acc, item) => {
            const price = item.variant?.price || item.product.price;
            return acc + (price ?? 0) * item.quantity;
        }, 0);

        const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

        // Calculate estimated tax (8.5% - this would come from your tax calculation service)
        const taxRate = 0.085;
        const tax = subtotal * taxRate;

        // Shipping calculation (free shipping over AED 50, otherwise AED 5.99)
        const shippingThreshold = 50; // AED 50
        const shippingCost = subtotal >= shippingThreshold ? 0 : 5.99; // AED 5.99

        const total = subtotal + tax + shippingCost;

        return {
            subtotal,
            tax,
            shipping: shippingCost,
            total,
            totalItems,
            isEligibleForFreeShipping: subtotal >= shippingThreshold,
            amountForFreeShipping: shippingThreshold - subtotal,
        };
    }, [items]);

    if (items.length === 0) {
        return null;
    }

    return (
        <Card className="sticky top-4">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Icons.ShoppingBag className="h-5 w-5" />
                    Order Summary
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Free Shipping Progress */}
                {!summary.isEligibleForFreeShipping &&
                    summary.amountForFreeShipping > 0 && (
                        <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                Add{" "}
                                <Price
                                    value={summary.amountForFreeShipping}
                                    className="font-semibold"
                                />{" "}
                                more to qualify for free shipping!
                            </p>
                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-blue-200 dark:bg-blue-800">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{
                                        width: `${Math.min(
                                            (summary.subtotal / 5000) * 100,
                                            100
                                        )}%`,
                                    }}
                                />
                            </div>
                        </div>
                    )}

                {/* Summary Details */}
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Items ({summary.totalItems})</span>
                        <Price value={summary.subtotal} />
                    </div>

                    <div className="flex justify-between">
                        <span>Shipping</span>
                        {summary.shipping === 0 ? (
                            <span className="text-green-600 dark:text-green-400">
                                Free
                            </span>
                        ) : (
                            <Price value={summary.shipping} />
                        )}
                    </div>

                    <div className="flex justify-between">
                        <span>Tax (estimated)</span>
                        <Price value={summary.tax} />
                    </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <Price value={summary.total} />
                </div>

                <Button
                    onClick={onCheckout}
                    disabled={isLoading || items.length === 0}
                    className="w-full"
                    size="lg"
                >
                    {isLoading ? (
                        <>
                            <Icons.Loader className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Icons.CreditCard className="mr-2 h-4 w-4" />
                            Proceed to Checkout
                        </>
                    )}
                </Button>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Icons.Shield className="h-3 w-3" />
                    <span>Secure SSL Encrypted Checkout</span>
                </div>

                {/* Continue Shopping Link */}
                <div className="pt-2 text-center">
                    <Button variant="link" size="sm" asChild>
                        <a href="/shop">
                            <Icons.ArrowLeft className="mr-1 h-3 w-3" />
                            Continue Shopping
                        </a>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
