import { CategoryManagement } from "@/components/dashboard/categories/category-management";
import { cache } from "@/lib/redis/methods";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Categories Management - Dashboard",
    description:
        "Manage categories, subcategories, and product types for your marketplace.",
};

export default async function CategoriesPage() {
    const { userId } = await auth();
    if (!userId) redirect("/auth/signin");

    const user = await cache.user.get(userId);
    if (!user || user.role !== "admin") {
        redirect("/dashboard");
    }

    const [categories, subcategories, productTypes] = await Promise.all([
        cache.category.scan(),
        cache.subcategory.scan(),
        cache.productType.scan(),
    ]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Categories Management</h1>
                <p className="mt-2 text-muted-foreground">
                    Manage your marketplace categories, subcategories, and
                    product types.
                </p>
            </div>

            <CategoryManagement
                initialCategories={categories}
                initialSubcategories={subcategories}
                initialProductTypes={productTypes}
            />
        </div>
    );
}
