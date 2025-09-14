"use client";

import PaymentStep from "@/components/globals/forms/payment-step-minimal";
import { Card } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import { CheckoutProgress } from "./checkout-progress";
import { CheckoutSteps } from "./checkout-steps";
import { CheckoutSummary } from "./checkout-summary";
import { ConfirmationStep } from "./steps/confirmation-step";
import { ReviewStep } from "./steps/review-step";
import { ShippingStep } from "./steps/shipping-step";

export type CheckoutStep = "shipping" | "payment" | "review" | "confirmation";

export interface ShippingData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    shippingMethod: "standard" | "express" | "overnight";
}

export interface PaymentData {
    paymentMethod: "card" | "paypal" | "apple_pay";
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    cardName?: string;
    billingAddressSame: boolean;
    billingAddress?: Partial<ShippingData>;
}

export interface OrderData extends ShippingData, PaymentData {
    items: any[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    orderNotes?: string;
}

export function EnhancedCheckoutPage() {
    const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
    const [shippingData, setShippingData] = useState<Partial<ShippingData>>({});
    const [paymentData, setPaymentData] = useState<Partial<PaymentData>>({});
    const [orderNotes, setOrderNotes] = useState("");
    const [orderId, setOrderId] = useState<string | null>(null);

    const { items, subtotal } = useCart();

    const steps: CheckoutStep[] = [
        "shipping",
        "payment",
        "review",
        "confirmation",
    ];
    const currentStepIndex = steps.indexOf(currentStep);

    const handleStepComplete = (step: CheckoutStep, data: any) => {
        if (step === "shipping") {
            setShippingData(data);
            setCurrentStep("payment");
        } else if (step === "payment") {
            setPaymentData(data);
            setCurrentStep("review");
        } else if (step === "review") {
            // Process order here
            handleOrderSubmit(data);
        }
    };

    const handleOrderSubmit = async (data: any) => {
        try {
            // This would integrate with your order API
            const orderData: OrderData = {
                ...shippingData,
                ...paymentData,
                ...data,
                items,
                subtotal,
                shipping: calculateShipping(),
                tax: calculateTax(),
                total: calculateTotal(),
                orderNotes,
            };

            // Simulate API call
            console.log("Submitting order:", orderData);

            // Mock order creation
            const mockOrderId = `ORD-${Date.now()}`;
            setOrderId(mockOrderId);
            setCurrentStep("confirmation");

            // In real implementation, you'd:
            // const response = await createOrder(orderData);
            // setOrderId(response.id);
        } catch (error) {
            console.error("Order submission failed:", error);
        }
    };

    const calculateShipping = () => {
        const method = shippingData.shippingMethod;
        if (method === "overnight") return 2999;
        if (method === "express") return 1299;
        return subtotal >= 5000 ? 0 : 599;
    };

    const calculateTax = () => {
        return Math.round(subtotal * 0.085); // 8.5% tax
    };

    const calculateTotal = () => {
        return subtotal + calculateShipping() + calculateTax();
    };

    const goToStep = (step: CheckoutStep) => {
        const stepIndex = steps.indexOf(step);
        if (stepIndex <= currentStepIndex) {
            setCurrentStep(step);
        }
    };

    const goToPreviousStep = () => {
        const prevIndex = currentStepIndex - 1;
        if (prevIndex >= 0) {
            setCurrentStep(steps[prevIndex]);
        }
    };

    // Redirect if cart is empty (except on confirmation)
    if (items.length === 0 && currentStep !== "confirmation") {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="p-8 text-center">
                    <h2 className="mb-4 text-2xl font-bold">
                        Your cart is empty
                    </h2>
                    <p className="mb-6 text-muted-foreground">
                        Add some items to your cart before proceeding to
                        checkout.
                    </p>
                    <a
                        href="/shop"
                        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                    >
                        Continue Shopping
                    </a>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 p-4">
                <h1 className="mb-2 text-3xl font-bold">Checkout</h1>
                <CheckoutProgress
                    steps={steps}
                    currentStep={currentStep}
                    onStepClick={goToStep}
                />
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <CheckoutSteps currentStep={currentStep}>
                        <ShippingStep
                            data={shippingData}
                            onComplete={(data) =>
                                handleStepComplete("shipping", data)
                            }
                            onBack={() => window.history.back()}
                        />
                        <PaymentStep
                            onNext={() => setCurrentStep("review")}
                            onPrevious={goToPreviousStep}
                        />
                        <ReviewStep
                            shippingData={shippingData as ShippingData}
                            paymentData={paymentData as PaymentData}
                            items={items}
                            subtotal={subtotal}
                            shipping={calculateShipping()}
                            tax={calculateTax()}
                            total={calculateTotal()}
                            orderNotes={orderNotes}
                            onNotesChange={setOrderNotes}
                            onComplete={(data) =>
                                handleStepComplete("review", data)
                            }
                            onBack={goToPreviousStep}
                        />
                        <ConfirmationStep
                            orderId={orderId}
                            orderData={
                                {
                                    ...shippingData,
                                    ...paymentData,
                                    items,
                                    subtotal,
                                    shipping: calculateShipping(),
                                    tax: calculateTax(),
                                    total: calculateTotal(),
                                    orderNotes,
                                } as OrderData
                            }
                        />
                    </CheckoutSteps>
                </div>

                <div className="lg:col-span-1">
                    <CheckoutSummary
                        items={items}
                        subtotal={subtotal}
                        shipping={calculateShipping()}
                        tax={calculateTax()}
                        total={calculateTotal()}
                        step={currentStep}
                    />
                </div>
            </div>
        </div>
    );
}
