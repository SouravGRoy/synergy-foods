import { CategoryBreadcrumb } from "@/components/globals/CategoryBreadcrumb";
import { queries } from "@/lib/db/queries";
import { generateCategoryMetaDescription } from "@/lib/utils/category";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({
    params,
}: CategoryPageProps): Promise<Metadata> {
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
        <>
            {/* Hero background image covering full width */}
            {category.imageUrl && (
                <div
                    className="relative h-60 overflow-hidden md:h-72"
                    style={{
                        backgroundImage: `url(${category.imageUrl})`,
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
                                <CategoryBreadcrumb category={category} />
                            </div>

                            {/* Title and description at bottom */}
                            <div className="max-w-2xl">
                                <h1 className="mb-3 text-3xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
                                    {category.name}
                                </h1>
                                {category.description && (
                                    <p className="text-lg font-medium text-white/90 drop-shadow-md md:text-xl">
                                        {category.description}
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
                {!category.imageUrl && (
                    <div className="py-8">
                        <CategoryBreadcrumb category={category} />
                    </div>
                )}

                <div className={category.imageUrl ? "pt-8" : "mt-8"}>
                    {/* Fallback layout when no image */}
                    {!category.imageUrl && (
                        <div className="mb-8">
                            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
                                {category.name}
                            </h1>
                            {category.description && (
                                <p className="mb-6 text-lg text-muted-foreground">
                                    {category.description}
                                </p>
                            )}
                        </div>
                    )}
                    <div className="py-8">
                        {categorySubcategories.length > 0 ? (
                            <div>
                                <h2 className="mb-6 text-2xl font-semibold">
                                    Subcategories in {category.name}
                                </h2>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {categorySubcategories.map(
                                        (subcategory) => (
                                            <div
                                                key={subcategory.id}
                                                className="rounded-lg border p-4 transition-shadow hover:shadow-md"
                                            >
                                                {subcategory.imageUrl && (
                                                    <div className="mb-4 h-40 w-full overflow-hidden rounded-md bg-muted">
                                                        <Image
                                                            src={
                                                                subcategory.imageUrl
                                                            }
                                                            alt={
                                                                subcategory.name
                                                            }
                                                            width={400}
                                                            height={120}
                                                            className="h-40 w-full object-cover transition-transform hover:scale-105"
                                                            objectFit="cover"
                                                        />
                                                    </div>
                                                )}
                                                <h3 className="mb-2 font-semibold">
                                                    {subcategory.name}
                                                </h3>
                                                {subcategory.description && (
                                                    <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                                                        {
                                                            subcategory.description
                                                        }
                                                    </p>
                                                )}
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">
                                                        {
                                                            subcategory.productTypes
                                                        }{" "}
                                                        product types
                                                    </span>
                                                    <a
                                                        href={`/shop/categories/${category.slug}/${subcategory.slug}`}
                                                        className="text-sm font-medium text-primary hover:underline"
                                                    >
                                                        View →
                                                    </a>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <p className="text-muted-foreground">
                                    No subcategories available in this category
                                    yet.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
