import { ProductDetail } from "@/components/shop/products/product-detail";
import { queries } from "@/lib/db/queries";
import { FullProduct } from "@/lib/validations/product";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

async function getProductBySlug(slug: string): Promise<FullProduct | null> {
    try {
        console.log("Fetching product with slug:", slug);

        // First, let's see what products exist
        try {
            const allProducts = await queries.product.paginate({
                limit: 5,
                page: 1,
                isDeleted: false,
            });
            console.log(
                "Products found:",
                allProducts.items,
                "pages:",
                allProducts.pages
            );
            if (allProducts.data && Array.isArray(allProducts.data)) {
                console.log(
                    "Sample products in database:",
                    allProducts.data.map((p: any) => ({
                        id: p.id,
                        title: p.title,
                        slug: p.slug,
                        isPublished: p.isPublished,
                        isActive: p.isActive,
                        isAvailable: p.isAvailable,
                    }))
                );
            }
        } catch (err) {
            console.error("Error fetching sample products:", err);
        }

        // Directly call the database query - start with less strict filters
        const product = await queries.product.get({
            slug,
            // Comment out strict filters for now to test if product exists at all
            // isPublished: true,
            // isActive: true,
            // isAvailable: true,
            isDeleted: false,
        });

        console.log("Product found:", !!product);

        if (!product) {
            console.log("No product found with slug:", slug);
            return null;
        }

        console.log("Product data structure:", {
            id: product.id,
            title: product.title,
            slug: product.slug,
            hasMedia: !!product.media?.length,
            hasCategory: !!product.category,
            hasUploader: !!product.uploader,
        });

        return product as unknown as FullProduct;
    } catch (error) {
        console.error("Error fetching product by slug:", error);
        return null;
    }
}

export async function generateMetadata({
    params,
}: ProductPageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return {
            title: "Product Not Found",
            description: "The requested product could not be found.",
        };
    }

    return {
        title: product.metaTitle || product.title,
        description:
            product.metaDescription ||
            product.description ||
            "Product details and information",
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;

    // Fetch the actual product from the database
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    // Fetch related products (optional - you can implement this later)
    const mockRelatedProducts: FullProduct[] = [];

    return (
        <ProductDetail
            product={product}
            relatedProducts={mockRelatedProducts}
        />
    );
}
