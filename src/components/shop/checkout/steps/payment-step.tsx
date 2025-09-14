"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, Lock, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PaymentData, ShippingData } from "../enhanced-checkout-page";

interface PaymentStepProps {
    shippingData: Partial<ShippingData>;
    data: Partial<PaymentData>;
    onComplete: (data: PaymentData) => void;
    onBack: () => void;
}

export function PaymentStep({
    shippingData,
    data,
    onComplete,
    onBack,
}: PaymentStepProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleStripeCheckout = async () => {
        setIsProcessing(true);

        try {
            // Validate shipping data
            if (
                !shippingData.firstName ||
                !shippingData.lastName ||
                !shippingData.address1
            ) {
                toast.error("Please complete the shipping information first");
                setIsProcessing(false);
                return;
            }

            // Create Stripe checkout session
            const response = await fetch("/api/checkout/create-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    shippingAddress: shippingData,
                    billingAddress: shippingData, // Use same address for billing
                }),
            });

            const sessionData = await response.json();

            if (!response.ok) {
                throw new Error(
                    sessionData.error || "Failed to create checkout session"
                );
            }

            // Redirect to Stripe Checkout
            if (sessionData.url) {
                window.location.href = sessionData.url;
            } else {
                throw new Error("No checkout URL received");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to proceed to payment"
            );
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onBack}
                    disabled={isProcessing}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-xl font-semibold">Payment</h2>
                    <p className="text-sm text-muted-foreground">
                        Secure payment powered by Stripe
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-6">
                    {/* Stripe Checkout Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Secure Payment
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="rounded-lg border bg-muted/50 p-4">
                                <div className="flex items-center gap-3">
                                    <Shield className="h-8 w-8 text-green-600" />
                                    <div>
                                        <h3 className="font-medium">
                                            Pay securely with Stripe
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Your payment information is
                                            encrypted and processed securely
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Lock className="h-4 w-4" />
                                    <span>256-bit SSL encryption</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Shield className="h-4 w-4" />
                                    <span>
                                        3D Secure authentication (UAE compliant)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CreditCard className="h-4 w-4" />
                                    <span>
                                        Supports all major credit and debit
                                        cards
                                    </span>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <h4 className="font-medium">
                                    What happens next?
                                </h4>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li>
                                        • You&apos;ll be redirected to
                                        Stripe&apos;s secure payment page
                                    </li>
                                    <li>
                                        • Enter your card details safely on
                                        Stripe&apos;s platform
                                    </li>
                                    <li>
                                        • Complete 3D Secure verification if
                                        required
                                    </li>
                                    <li>
                                        • Return to our site after successful
                                        payment
                                    </li>
                                </ul>
                            </div>

                            <Button
                                onClick={handleStripeCheckout}
                                disabled={isProcessing}
                                className="w-full"
                                size="lg"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="mr-2 h-4 w-4" />
                                        Proceed to Secure Payment
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Order Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>AED 299.97</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Shipping</span>
                                    <span>AED 25.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>VAT (0%)</span>
                                    <span>AED 0.00</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-medium">
                                    <span>Total</span>
                                    <span>AED 324.97</span>
                                </div>
                            </div>

                            <div className="rounded-lg bg-muted p-3 text-sm">
                                <p className="text-center text-muted-foreground">
                                    💡 Free shipping on orders over AED 200
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Address Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm">
                                <p className="font-medium">
                                    {shippingData.firstName}{" "}
                                    {shippingData.lastName}
                                </p>
                                <p>{shippingData.address1}</p>
                                {shippingData.address2 && (
                                    <p>{shippingData.address2}</p>
                                )}
                                <p>
                                    {shippingData.city}, {shippingData.state}{" "}
                                    {shippingData.postalCode}
                                </p>
                                <p>{shippingData.country}</p>
                                {shippingData.phone && (
                                    <p>{shippingData.phone}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
