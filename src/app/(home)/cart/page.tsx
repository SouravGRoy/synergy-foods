import { CartPage } from "@/components/shop/cart/cart-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shopping Cart - B2C Marketplace",
    description: "Review and manage items in your shopping cart.",
};

export default function Page() {
    return <CartPage />;
}
