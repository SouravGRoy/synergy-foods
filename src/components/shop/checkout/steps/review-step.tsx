"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Price } from "@/components/ui/price";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getImageUrl } from "@/lib/utils/image-utils";
import { ArrowLeft, CreditCard, Edit3, Package, Truck } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { PaymentData, ShippingData } from "../enhanced-checkout-page";

interface ReviewStepProps {
    shippingData: ShippingData;
    paymentData: PaymentData;
    items: any[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    orderNotes: string;
    onNotesChange: (notes: string) => void;
    onComplete: (data: any) => void;
    onBack: () => void;
}

export function ReviewStep({
    shippingData,
    paymentData,
    items,
    subtotal,
    shipping,
    tax,
    total,
    orderNotes,
    onNotesChange,
    onComplete,
    onBack,
}: ReviewStepProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        try {
            // Add a small delay to simulate processing
            await new Promise((resolve) => setTimeout(resolve, 1500));
            onComplete({ orderNotes });
        } catch (error) {
            console.error("Order processing failed:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const getPaymentMethodDisplay = () => {
        switch (paymentData.paymentMethod) {
            case "card":
                return `Card ending in ${paymentData.cardNumber?.slice(-4) || "****"}`;
            case "paypal":
                return "PayPal";
            case "apple_pay":
                return "Apple Pay";
            default:
                return "Unknown";
        }
    };

    const getShippingMethodDisplay = () => {
        switch (shippingData.shippingMethod) {
            case "standard":
                return "Standard Shipping (5-7 business days)";
            case "express":
                return "Express Shipping (2-3 business days)";
            case "overnight":
                return "Overnight Shipping (Next business day)";
            default:
                return "Standard Shipping";
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="h-auto p-1"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    Review Your Order
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Order Items */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                            <Package className="h-5 w-5" />
                            Order Items ({items.length})
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-4 rounded-lg border p-4"
                            >
                                <div className="relative h-16 w-16 overflow-hidden rounded-md bg-gray-100">
                                    <Image
                                        height={64}
                                        width={64}
                                        src={getImageUrl(
                                            item.product.media?.[0]?.mediaItem
                                                ?.url
                                        )}
                                        alt={item.product.title}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium">
                                        {item.product.title}
                                    </h4>
                                    {item.variant && (
                                        <p className="text-sm text-muted-foreground">
                                            Variant: {item.variant.sku}
                                        </p>
                                    )}
                                    <p className="text-sm text-muted-foreground">
                                        Quantity: {item.quantity}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <Price
                                        value={
                                            (item.variant?.price ||
                                                item.product.price ||
                                                0) * item.quantity
                                        }
                                        className="font-medium"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        <Price
                                            value={
                                                item.variant?.price ||
                                                item.product.price ||
                                                0
                                            }
                                        />{" "}
                                        each
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Shipping Information */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                            <Truck className="h-5 w-5" />
                            Shipping Information
                        </h3>
                        <Button variant="outline" size="sm" onClick={onBack}>
                            <Edit3 className="mr-1 h-3 w-3" />
                            Edit
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-lg bg-gray-50 p-4">
                            <h4 className="mb-2 font-medium">
                                Delivery Address
                            </h4>
                            <p className="text-sm">
                                {shippingData.firstName} {shippingData.lastName}
                            </p>
                            <p className="text-sm">{shippingData.address1}</p>
                            {shippingData.address2 && (
                                <p className="text-sm">
                                    {shippingData.address2}
                                </p>
                            )}
                            <p className="text-sm">
                                {shippingData.city}, {shippingData.state}{" "}
                                {shippingData.postalCode}
                            </p>
                            <p className="text-sm">{shippingData.country}</p>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4">
                            <h4 className="mb-2 font-medium">
                                Contact & Shipping
                            </h4>
                            <p className="text-sm">{shippingData.email}</p>
                            <p className="text-sm">{shippingData.phone}</p>
                            <p className="mt-2 text-sm font-medium">
                                {getShippingMethodDisplay()}
                            </p>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Payment Information */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                            <CreditCard className="h-5 w-5" />
                            Payment Information
                        </h3>
                        <Button variant="outline" size="sm" onClick={onBack}>
                            <Edit3 className="mr-1 h-3 w-3" />
                            Edit
                        </Button>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                        <p className="font-medium">
                            {getPaymentMethodDisplay()}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Billing address:{" "}
                            {paymentData.billingAddressSame
                                ? "Same as shipping"
                                : "Different"}
                        </p>
                    </div>
                </div>

                <Separator />

                {/* Order Notes */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                        Order Notes (Optional)
                    </h3>
                    <div className="space-y-2">
                        <Label htmlFor="orderNotes">
                            Special instructions for your order
                        </Label>
                        <Textarea
                            id="orderNotes"
                            placeholder="Add any special instructions for your order..."
                            value={orderNotes}
                            onChange={(e) => onNotesChange(e.target.value)}
                            rows={3}
                        />
                    </div>
                </div>

                <Separator />

                {/* Order Summary */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Order Summary</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <Price value={subtotal} />
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <Price value={shipping} />
                        </div>
                        <div className="flex justify-between">
                            <span>Tax</span>
                            <Price value={tax} />
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-semibold">
                            <span>Total</span>
                            <Price value={total} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6">
                    <Button
                        size="lg"
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className="min-w-[200px]"
                    >
                        {isProcessing ? "Processing..." : "Place Order"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
