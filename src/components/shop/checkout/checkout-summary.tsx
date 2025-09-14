"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Price } from "@/components/ui/price";
import { Separator } from "@/components/ui/separator";
import { getImageUrl } from "@/lib/utils/image-utils";
import { Calculator, Receipt, ShoppingBag, Truck } from "lucide-react";
import Image from "next/image";

interface CheckoutSummaryProps {
    items: any[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    step: string;
}

export function CheckoutSummary({
    items,
    subtotal,
    shipping,
    tax,
    total,
    step,
}: CheckoutSummaryProps) {
    const isConfirmationStep = step === "confirmation";

    return (
        <div className="space-y-6">
            {/* Order Summary */}
            <Card className="sticky top-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Order Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Items List */}
                    <div className="space-y-3">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-3"
                            >
                                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                                    <Image
                                        src={getImageUrl(
                                            item.product.media?.[0]?.mediaItem
                                                ?.url
                                        )}
                                        alt={item.product.title}
                                        fill
                                        className="object-cover"
                                        sizes="48px"
                                    />
                                    <Badge
                                        variant="secondary"
                                        className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                                    >
                                        {item.quantity}
                                    </Badge>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">
                                        {item.product.title}
                                    </p>
                                    {item.variant && (
                                        <p className="truncate text-xs text-muted-foreground">
                                            {item.variant.sku}
                                        </p>
                                    )}
                                </div>
                                <div className="text-sm font-medium">
                                    <Price
                                        value={
                                            (item.variant?.price ||
                                                item.product.price ||
                                                0) * item.quantity
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <Separator />

                    {/* Cost Breakdown */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1">
                                <ShoppingBag className="h-3 w-3" />
                                Subtotal
                            </span>
                            <Price value={subtotal} />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1">
                                <Truck className="h-3 w-3" />
                                Shipping
                            </span>
                            <span>
                                {shipping === 0 ? (
                                    <span className="font-medium text-green-600">
                                        Free
                                    </span>
                                ) : (
                                    <Price value={shipping} />
                                )}
                            </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1">
                                <Calculator className="h-3 w-3" />
                                Tax
                            </span>
                            <Price value={tax} />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between font-semibold">
                            <span className="flex items-center gap-1">
                                <Receipt className="h-4 w-4" />
                                Total
                            </span>
                            <Price value={total} className="text-lg" />
                        </div>
                    </div>

                    {/* Free Shipping Indicator */}
                    {subtotal < 5000 && !isConfirmationStep && (
                        <div className="rounded-lg bg-blue-50 p-3">
                            <p className="text-xs text-blue-800">
                                <strong>
                                    Add <Price value={5000 - subtotal} /> more
                                </strong>{" "}
                                for free shipping!
                            </p>
                            <div className="mt-2 h-2 w-full rounded-full bg-blue-200">
                                <div
                                    className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                                    style={{
                                        width: `${Math.min((subtotal / 5000) * 100, 100)}%`,
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Security Notice */}
                    {!isConfirmationStep && (
                        <div className="rounded-lg bg-gray-50 p-3">
                            <p className="text-center text-xs text-muted-foreground">
                                🔒 Your payment information is secure and
                                encrypted
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Customer Support */}
            {!isConfirmationStep && (
                <Card>
                    <CardContent className="p-4">
                        <div className="space-y-2 text-center">
                            <h4 className="text-sm font-medium">Need Help?</h4>
                            <p className="text-xs text-muted-foreground">
                                Our customer support team is here to help with
                                your order.
                            </p>
                            <div className="space-y-1 text-xs">
                                <p>📞 Call: 1-800-SUPPORT</p>
                                <p>💬 Chat: Available 24/7</p>
                                <p>📧 Email: support@marketplace.com</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
