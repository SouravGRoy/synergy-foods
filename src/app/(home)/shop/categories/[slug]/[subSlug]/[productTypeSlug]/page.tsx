import { CategoryBreadcrumb } from "@/components/globals/CategoryBreadcrumb";
import { queries } from "@/lib/db/queries";
import { generateCategoryMetaDescription } from "@/lib/utils/category";
import { FullProduct } from "@/lib/validations";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Utility function to strip HTML tags and clean up text
function stripHtmlAndCleanText(html: string): string {
    if (!html) return "";

    // Remove HTML tags and decode HTML entities
    const withoutTags = html
        .replace(/<[^>]*>/g, " ") // Remove HTML tags
        .replace(/&amp;/g, "&") // Decode HTML entities
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ") // Replace multiple spaces with single space
        .trim();

    // Limit to first 150 characters for card display
    if (withoutTags.length > 150) {
        return withoutTags.substring(0, 147) + "...";
    }

    return withoutTags;
}

interface ProductTypePageProps {
    params: Promise<{ slug: string; subSlug: string; productTypeSlug: string }>;
}

export async function generateMetadata({
    params,
}: ProductTypePageProps): Promise<Metadata> {
    const { slug, subSlug, productTypeSlug } = await params;
    const [category, subcategory, productType] = await Promise.all([
        queries.category.get({ slug, activeOnly: true }),
        queries.subcategory.get({ slug: subSlug, activeOnly: true }),
        queries.productType.get({ slug: productTypeSlug, activeOnly: true }),
    ]);

    if (!category || !subcategory || !productType) {
        return {
            title: "Product type not found",
        };
    }

    return {
        title: `${productType.name} - ${subcategory.name} - ${category.name} - Synergy Foods`,
        description: generateCategoryMetaDescription(
            category,
            subcategory,
            productType
        ),
        keywords: [
            category.name,
            subcategory.name,
            productType.name,
            "food",
            "marketplace",
            "synergy foods",
        ],
    };
}

export default async function ProductTypePage({
    params,
}: ProductTypePageProps) {
    const { slug, subSlug, productTypeSlug } = await params;
    const [category, subcategory, productType] = await Promise.all([
        queries.category.get({ slug, activeOnly: true }),
        queries.subcategory.get({ slug: subSlug, activeOnly: true }),
        queries.productType.get({ slug: productTypeSlug, activeOnly: true }),
    ]);

    if (
        !category ||
        !subcategory ||
        !productType ||
        subcategory.categoryId !== category.id ||
        productType.subcategoryId !== subcategory.id
    ) {
        notFound();
    }

    // Get products for this product type
    const productsResult = await queries.product.paginate({
        productTypeId: productType.id,
        isActive: true,
        isPublished: true,
        isAvailable: true,
        limit: 100, // Get up to 100 products
    });
    const products = productsResult.data;

    return (
        <>
            {/* Hero background image covering full width */}
            {productType.imageUrl && (
                <div
                    className="relative h-60 overflow-hidden md:h-72"
                    style={{
                        backgroundImage: `url(${productType.imageUrl})`,
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
                                    productType={productType}
                                />
                            </div>

                            {/* Title and description at bottom */}
                            <div className="max-w-2xl">
                                <h1 className="mb-3 text-3xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
                                    {productType.name}
                                </h1>
                                {productType.description && (
                                    <p className="text-lg font-medium text-white/90 drop-shadow-md md:text-xl">
                                        {stripHtmlAndCleanText(
                                            productType.description
                                        )}
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
                {!productType.imageUrl && (
                    <div className="py-8">
                        <CategoryBreadcrumb
                            category={category}
                            subcategory={subcategory}
                            productType={productType}
                        />
                    </div>
                )}

                <div className={productType.imageUrl ? "pt-8" : "mt-8"}>
                    {/* Fallback layout when no image */}
                    {!productType.imageUrl && (
                        <div className="mb-8">
                            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
                                {productType.name}
                            </h1>
                            {productType.description && (
                                <p className="mb-6 text-lg text-muted-foreground">
                                    {stripHtmlAndCleanText(
                                        productType.description
                                    )}
                                </p>
                            )}
                        </div>
                    )}
                    <div className="py-8">
                        {products.length > 0 ? (
                            <div>
                                <h2 className="mb-6 text-2xl font-semibold">
                                    Products in {productType.name}
                                </h2>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {products.map((product: FullProduct) => (
                                        <div
                                            key={product.id}
                                            className="rounded-lg border p-4 transition-shadow hover:shadow-md"
                                        >
                                            {product.media?.[0]?.mediaItem
                                                ?.url && (
                                                <div className="relative mb-3 h-48 overflow-hidden rounded-md">
                                                    <Image
                                                        width={800}
                                                        height={600}
                                                        src={
                                                            product.media[0]
                                                                .mediaItem.url
                                                        }
                                                        alt={product.title}
                                                        className="h-full w-full object-cover"
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    />
                                                </div>
                                            )}
                                            <h3 className="mb-2 font-semibold">
                                                {product.title}
                                            </h3>
                                            {product.description && (
                                                <p className="mb-3 line-clamp-3 text-sm text-muted-foreground">
                                                    {stripHtmlAndCleanText(
                                                        product.description
                                                    )}
                                                </p>
                                            )}
                                            <div className="mb-3 flex items-center justify-between">
                                                <div className="text-lg font-bold text-primary">
                                                    ${product.price}
                                                </div>
                                                {product.compareAtPrice && (
                                                    <div className="text-sm text-muted-foreground line-through">
                                                        $
                                                        {product.compareAtPrice}
                                                    </div>
                                                )}
                                            </div>
                                            <Link
                                                href={`/shop/products/${product.slug}`}
                                                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                                            >
                                                View Product
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <p className="text-muted-foreground">
                                    No products available in this product type
                                    yet.
                                </p>
                                <Link
                                    href={`/shop/categories/${category.slug}/${subcategory.slug}`}
                                    className="mt-4 inline-flex items-center text-primary hover:underline"
                                >
                                    ← Back to {subcategory.name}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
