import { CategoryBreadcrumb } from "@/components/globals/CategoryBreadcrumb";
import { queries } from "@/lib/db/queries";
import { generateCategoryMetaDescription } from "@/lib/utils/category";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

interface SubcategoryPageProps {
    params: Promise<{ slug: string; subSlug: string }>;
}

export async function generateMetadata({
    params,
}: SubcategoryPageProps): Promise<Metadata> {
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
        keywords: [
            category.name,
            subcategory.name,
            "food",
            "marketplace",
            "synergy foods",
        ],
    };
}

export default async function SubcategoryPage({
    params,
}: SubcategoryPageProps) {
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
        <>
            {/* Hero background image covering full width */}
            {subcategory.imageUrl && (
                <div
                    className="relative h-60 overflow-hidden md:h-72"
                    style={{
                        backgroundImage: `url(${subcategory.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        opacity: 0.8, // Reduced opacity for subtle background
                    }}
                >
                    {/* Light overlay for better readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-black/5" />

                    {/* Subtle pattern overlay for texture */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/3 to-transparent" />

                    {/* Content overlay - breadcrumb, title, and description on top of image */}
                    <div className="absolute inset-0 z-10">
                        <div className="container mx-auto flex h-full flex-col justify-between px-4 py-8">
                            {/* Breadcrumb at top */}
                            <div className="text-white [&_*]:!text-white [&_a]:!text-white/90 [&_a:hover]:!text-white">
                                <CategoryBreadcrumb
                                    category={category}
                                    subcategory={subcategory}
                                />
                            </div>

                            {/* Title and description at bottom */}
                            <div className="max-w-2xl">
                                <h1 className="mb-3 text-3xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
                                    {subcategory.name}
                                </h1>
                                {subcategory.description && (
                                    <p className="text-lg font-medium text-white/90 drop-shadow-md md:text-xl">
                                        {subcategory.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Content container */}
            <div className="container mx-auto px-4">
                {/* Fallback breadcrumb when no image */}
                {!subcategory.imageUrl && (
                    <div className="py-8">
                        <CategoryBreadcrumb
                            category={category}
                            subcategory={subcategory}
                        />
                    </div>
                )}

                <div className={subcategory.imageUrl ? "pt-8" : "mt-8"}>
                    {/* Fallback layout when no image */}
                    {!subcategory.imageUrl && (
                        <div className="mb-8">
                            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
                                {subcategory.name}
                            </h1>
                            {subcategory.description && (
                                <p className="mb-6 text-lg text-muted-foreground">
                                    {subcategory.description}
                                </p>
                            )}
                        </div>
                    )}
                    <div className="py-8">
                        {productTypes.length > 0 ? (
                            <div>
                                <h2 className="mb-6 text-2xl font-semibold">
                                    Product Types in {subcategory.name}
                                </h2>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {productTypes.map((productType) => (
                                        <div
                                            key={productType.id}
                                            className="rounded-lg border p-4 transition-shadow hover:shadow-md"
                                        >
                                            {productType.imageUrl && (
                                                <div className="relative mb-3 h-32 overflow-hidden rounded-md">
                                                    <Image
                                                        width={800}
                                                        height={600}
                                                        src={
                                                            productType.imageUrl
                                                        }
                                                        alt={productType.name}
                                                        className="object-cover"
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    />
                                                </div>
                                            )}
                                            <h3 className="mb-2 font-semibold">
                                                {productType.name}
                                            </h3>
                                            {productType.description && (
                                                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                                                    {productType.description}
                                                </p>
                                            )}
                                            <a
                                                href={`/shop/categories/${category.slug}/${subcategory.slug}/${productType.slug}`}
                                                className="text-sm font-medium text-primary hover:underline"
                                            >
                                                View Products →
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <p className="text-muted-foreground">
                                    No product types available in this
                                    subcategory yet.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
