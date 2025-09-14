import { EnhancedCheckoutPage } from "@/components/shop/checkout/enhanced-checkout-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Checkout - B2C Marketplace",
    description: "Complete your purchase securely.",
};

export default function Page() {
    return <EnhancedCheckoutPage />;
}
