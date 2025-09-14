"use client";

import { ReactElement } from "react";
import { CheckoutStep } from "./checkout-progress";

interface CheckoutStepsProps {
    currentStep: CheckoutStep;
    children: ReactElement[];
}

export function CheckoutSteps({ currentStep, children }: CheckoutStepsProps) {
    const steps: CheckoutStep[] = [
        "shipping",
        "payment",
        "review",
        "confirmation",
    ];
    const currentStepIndex = steps.indexOf(currentStep);

    return <div className="space-y-6">{children[currentStepIndex]}</div>;
}
