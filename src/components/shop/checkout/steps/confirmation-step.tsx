"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Price } from "@/components/ui/price";
import { Separator } from "@/components/ui/separator";
import {
    ArrowRight,
    CheckCircle2,
    Download,
    Mail,
    Package,
} from "lucide-react";
import Link from "next/link";
import { OrderData } from "../enhanced-checkout-page";

interface ConfirmationStepProps {
    orderId: string | null;
    orderData: OrderData;
}

export function ConfirmationStep({
    orderId,
    orderData,
}: ConfirmationStepProps) {
    if (!orderId) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <div className="animate-pulse">
                        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-200"></div>
                        <div className="mx-auto mb-2 h-4 w-32 rounded bg-gray-200"></div>
                        <div className="mx-auto h-4 w-24 rounded bg-gray-200"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const estimatedDelivery = () => {
        const today = new Date();
        const delivery = new Date(today);

        switch (orderData.shippingMethod) {
            case "overnight":
                delivery.setDate(today.getDate() + 1);
                break;
            case "express":
                delivery.setDate(today.getDate() + 3);
                break;
            default:
                delivery.setDate(today.getDate() + 7);
        }

        return delivery.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <Card>
            <CardHeader className="text-center">
                <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                </div>
                <CardTitle className="text-2xl text-green-600">
                    Order Confirmed!
                </CardTitle>
                <p className="text-muted-foreground">
                    Thank you for your order. We&apos;ve received your order and
                    will begin processing it shortly.
                </p>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Order Details */}
                <div className="rounded-lg bg-green-50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium">Order Number</span>
                        <span className="font-mono text-lg">{orderId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-medium">Total Amount</span>
                        <Price
                            value={orderData.total}
                            className="text-lg font-bold"
                        />
                    </div>
                </div>

                <Separator />

                {/* What's Next */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">What&apos;s Next?</h3>

                    <div className="space-y-3">
                        <div className="flex items-start gap-3 rounded-lg border p-3">
                            <Mail className="mt-0.5 h-5 w-5 text-blue-600" />
                            <div>
                                <h4 className="font-medium">
                                    Order Confirmation Email
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    We&apos;ve sent a confirmation email to{" "}
                                    {orderData.email} with your order details.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-lg border p-3">
                            <Package className="mt-0.5 h-5 w-5 text-orange-600" />
                            <div>
                                <h4 className="font-medium">
                                    Processing & Packaging
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Your order will be processed and packaged
                                    within 1-2 business days.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-lg border p-3">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                            <div>
                                <h4 className="font-medium">
                                    Estimated Delivery
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Your order should arrive by{" "}
                                    <strong>{estimatedDelivery()}</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Order Summary */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Order Summary</h3>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Items ({orderData.items.length})</span>
                            <Price value={orderData.subtotal} />
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <Price value={orderData.shipping} />
                        </div>
                        <div className="flex justify-between">
                            <span>Tax</span>
                            <Price value={orderData.tax} />
                        </div>
                        <Separator />
                        <div className="flex justify-between font-medium">
                            <span>Total</span>
                            <Price value={orderData.total} />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Shipping Address */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Shipping Address</h3>
                    <div className="rounded-lg bg-gray-50 p-3 text-sm">
                        <p className="font-medium">
                            {orderData.firstName} {orderData.lastName}
                        </p>
                        <p>{orderData.address1}</p>
                        {orderData.address2 && <p>{orderData.address2}</p>}
                        <p>
                            {orderData.city}, {orderData.state}{" "}
                            {orderData.postalCode}
                        </p>
                        <p>{orderData.country}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 pt-6 sm:flex-row">
                    <Button variant="outline" className="flex-1" asChild>
                        <Link href="/account">
                            <Package className="mr-2 h-4 w-4" />
                            View Order History
                        </Link>
                    </Button>

                    <Button variant="outline" className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Download Invoice
                    </Button>

                    <Button className="flex-1" asChild>
                        <Link href="/shop">
                            Continue Shopping
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Support Info */}
                <div className="border-t pt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Need help with your order?
                        <Link
                            href="/contact"
                            className="ml-1 text-primary hover:underline"
                        >
                            Contact our support team
                        </Link>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
