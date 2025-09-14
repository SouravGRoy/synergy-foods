"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import React from "react";
import { toast } from "sonner";

interface PaymentStepProps {
    onNext: () => void;
    onPrevious: () => void;
}

export default function PaymentStep({ onNext, onPrevious }: PaymentStepProps) {
    const { userId } = useAuth();
    const [loading, setLoading] = React.useState(false);

    const handleCheckout = async () => {
        if (!userId) {
            toast.error("Please sign in to continue");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/checkout/create-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const { url, error } = await response.json();

            if (error) {
                toast.error(error);
                return;
            }

            // Redirect to Stripe Checkout
            window.location.href = url;
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
            console.error("Checkout error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-semibold">Complete Your Order</h3>
                <p className="mt-2 text-muted-foreground">
                    Click below to proceed to secure payment with Stripe
                </p>
            </div>

            <div className="flex gap-4 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onPrevious}
                    disabled={loading}
                    className="flex-1"
                >
                    Back
                </Button>

                <Button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="flex-1"
                >
                    {loading ? "Processing..." : "Pay Now"}
                </Button>
            </div>
        </div>
    );
}
