import { CategoryBreadcrumb } from "@/components/globals/CategoryBreadcrumb";
import { queries } from "@/lib/db/queries";
import { generateCategoryMetaDescription } from "@/lib/utils/category";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface SubcategoryPageProps {
    params: Promise<{ slug: string; subSlug: string }>;
}

export async function generateMetadata({ params }: SubcategoryPageProps): Promise<Metadata> {
    const { slug, subSlug } = await params;
    const [category, subcategory] = await Promise.all([
        queries.category.get({ slug, activeOnly: true }),
        queries.subcategory.get({ slug: subSlug, activeOnly: true }),
    ]);

    if (!category || !subcategory) {
        return {
            title: "Category not found",
        };
    }

    return {
        title: `${subcategory.name} - ${category.name} - Synergy Foods`,
        description: generateCategoryMetaDescription(category, subcategory),
        keywords: [category.name, subcategory.name, "food", "marketplace", "synergy foods"],
    };
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
    const { slug, subSlug } = await params;
    const [category, subcategory] = await Promise.all([
        queries.category.get({ slug, activeOnly: true }),
        queries.subcategory.get({ slug: subSlug, activeOnly: true }),
    ]);

    if (!category || !subcategory || subcategory.categoryId !== category.id) {
        notFound();
    }

    // Get product types for this subcategory
    const productTypes = await queries.productType.scan({
        subcategoryId: subcategory.id,
        activeOnly: true,
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <CategoryBreadcrumb category={category} subcategory={subcategory} />
            
            <div className="mt-8">
                <div className="mb-8">
                    {subcategory.imageUrl && (
                        <div className="relative h-48 md:h-64 rounded-lg overflow-hidden mb-6">
                            <img
                                src={subcategory.imageUrl}
                                alt={subcategory.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-end">
                                <div className="p-6 text-white">
                                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                        {subcategory.name}
                                    </h1>
                                    {subcategory.description && (
                                        <p className="text-lg opacity-90">
                                            {subcategory.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {!subcategory.imageUrl && (
                        <>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                {subcategory.name}
                            </h1>
                            {subcategory.description && (
                                <p className="text-lg text-muted-foreground mb-6">
                                    {subcategory.description}
                                </p>
                            )}
                        </>
                    )}
                </div>

                {productTypes.length > 0 ? (
                    <div>
                        <h2 className="text-2xl font-semibold mb-6">
                            Product Types in {subcategory.name}
                        </h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {productTypes.map((productType) => (
                                <div
                                    key={productType.id}
                                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    {productType.imageUrl && (
                                        <div className="relative h-32 rounded-md overflow-hidden mb-3">
                                            <img
                                                src={productType.imageUrl}
                                                alt={productType.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <h3 className="font-semibold mb-2">{productType.name}</h3>
                                    {productType.description && (
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                            {productType.description}
                                        </p>
                                    )}
                                    <a
                                        href={`/shop/categories/${category.slug}/${subcategory.slug}/${productType.slug}`}
                                        className="text-primary hover:underline text-sm font-medium"
                                    >
                                        View Products →
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            No product types available in this subcategory yet.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}