import { CategoryGrid } from "@/components/globals/CategoryGrid";
import { CategoryBreadcrumb } from "@/components/globals/CategoryBreadcrumb";
import { queries } from "@/lib/db/queries";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shop - Synergy Foods",
    description: "Browse all categories and find the best food products at Synergy Foods marketplace.",
};

export default async function ShopPage() {
    const categories = await queries.category.scanActive();

    return (
        <div className="container mx-auto px-4 py-8">
            <CategoryBreadcrumb currentPage="Shop" />
            
            <div className="mt-8">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Shop by Category
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Discover our wide range of food categories and find exactly what you need.
                    </p>
                </div>

                <CategoryGrid categories={categories} />
            </div>
        </div>
    );
}