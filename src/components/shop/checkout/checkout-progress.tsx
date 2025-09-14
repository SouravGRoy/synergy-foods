"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

export type CheckoutStep = "shipping" | "payment" | "review" | "confirmation";

interface CheckoutProgressProps {
    steps: CheckoutStep[];
    currentStep: CheckoutStep;
    onStepClick?: (step: CheckoutStep) => void;
}

const stepLabels: Record<CheckoutStep, string> = {
    shipping: "Shipping",
    payment: "Payment",
    review: "Review",
    confirmation: "Confirmation",
};

export function CheckoutProgress({
    steps,
    currentStep,
    onStepClick,
}: CheckoutProgressProps) {
    const currentStepIndex = steps.indexOf(currentStep);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const isClickable =
                        index <= currentStepIndex && onStepClick;

                    return (
                        <div key={step} className="flex flex-1 items-center">
                            {/* Step Circle */}
                            <div
                                className={cn(
                                    "relative flex items-center justify-center",
                                    isClickable && "cursor-pointer"
                                )}
                                onClick={() => isClickable && onStepClick(step)}
                            >
                                <div
                                    className={cn(
                                        "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                                        isCompleted &&
                                            "border-primary bg-primary text-primary-foreground",
                                        isCurrent &&
                                            !isCompleted &&
                                            "border-primary bg-background text-primary",
                                        !isCurrent &&
                                            !isCompleted &&
                                            "border-muted-foreground text-muted-foreground"
                                    )}
                                >
                                    {isCompleted ? (
                                        <CheckCircle2 className="h-5 w-5" />
                                    ) : (
                                        <span className="text-sm font-medium">
                                            {index + 1}
                                        </span>
                                    )}
                                </div>

                                {/* Step Label */}
                                <div className="absolute top-12 left-1/2 -translate-x-1/2 transform whitespace-nowrap">
                                    <span
                                        className={cn(
                                            "text-sm font-medium",
                                            (isCompleted || isCurrent) &&
                                                "text-foreground",
                                            !isCompleted &&
                                                !isCurrent &&
                                                "text-muted-foreground"
                                        )}
                                    >
                                        {stepLabels[step]}
                                    </span>
                                </div>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="mx-4 h-px flex-1">
                                    <div
                                        className={cn(
                                            "h-full transition-colors",
                                            isCompleted
                                                ? "bg-primary"
                                                : "bg-muted"
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
