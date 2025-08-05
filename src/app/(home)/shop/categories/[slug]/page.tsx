import { CategoryGrid } from "@/components/globals/CategoryGrid";
import { CategoryBreadcrumb } from "@/components/globals/CategoryBreadcrumb";
import { queries } from "@/lib/db/queries";
import { generateCategoryMetaDescription } from "@/lib/utils/category";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { slug } = await params;
    const category = await queries.category.get({ slug, activeOnly: true });

    if (!category) {
        return {
            title: "Category not found",
        };
    }

    return {
        title: `${category.name} - Synergy Foods`,
        description: generateCategoryMetaDescription(category),
        keywords: [category.name, "food", "marketplace", "synergy foods"],
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    const [category, subcategories] = await Promise.all([
        queries.category.get({ slug, activeOnly: true }),
        queries.subcategory.scan(undefined, true),
    ]);

    if (!category) {
        notFound();
    }

    // Filter subcategories for this category
    const categorySubcategories = subcategories.filter(
        (sub) => sub.categoryId === category.id
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <CategoryBreadcrumb category={category} />
            
            <div className="mt-8">
                <div className="mb-8">
                    {category.imageUrl && (
                        <div className="relative h-48 md:h-64 rounded-lg overflow-hidden mb-6">
                            <img
                                src={category.imageUrl}
                                alt={category.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-end">
                                <div className="p-6 text-white">
                                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                        {category.name}
                                    </h1>
                                    {category.description && (
                                        <p className="text-lg opacity-90">
                                            {category.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {!category.imageUrl && (
                        <>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                {category.name}
                            </h1>
                            {category.description && (
                                <p className="text-lg text-muted-foreground mb-6">
                                    {category.description}
                                </p>
                            )}
                        </>
                    )}
                </div>

                {categorySubcategories.length > 0 ? (
                    <div>
                        <h2 className="text-2xl font-semibold mb-6">
                            Subcategories in {category.name}
                        </h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {categorySubcategories.map((subcategory) => (
                                <div
                                    key={subcategory.id}
                                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <h3 className="font-semibold mb-2">{subcategory.name}</h3>
                                    {subcategory.description && (
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                            {subcategory.description}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            {subcategory.productTypes} product types
                                        </span>
                                        <a
                                            href={`/shop/categories/${category.slug}/${subcategory.slug}`}
                                            className="text-primary hover:underline text-sm font-medium"
                                        >
                                            View →
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            No subcategories available in this category yet.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}