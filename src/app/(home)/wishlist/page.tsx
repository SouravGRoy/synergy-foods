import { WishlistPage } from "@/components/shop/wishlist/wishlist-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Wishlist - B2C Marketplace",
    description: "View and manage your saved items.",
};

export default function Page() {
    return <WishlistPage />;
}
