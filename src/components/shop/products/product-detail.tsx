"use client";

import { FullProduct } from "@/lib/validations";
import { ProductBreadcrumb } from "./product-breadcrumb";
import { ProductImageGallery } from "./product-image-gallery";
import { ProductInfo } from "./product-info";
import { ProductTabs } from "./product-tabs";
import { RelatedProducts } from "./related-products";

interface ProductDetailProps {
    product: FullProduct;
    relatedProducts: FullProduct[];
}

export function ProductDetail({
    product,
    relatedProducts,
}: ProductDetailProps) {
    // Collect product image URLs ensuring we end up with a strict string[] (not (string | undefined)[])
    const images: string[] =
        product.media
            ?.map((m) => m.mediaItem?.url)
            .filter(
                (u): u is string => typeof u === "string" && u.length > 0
            ) || [];

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb Navigation */}
            <ProductBreadcrumb product={product} />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Product Images */}
                <div className="lg:sticky lg:top-4 lg:self-start">
                    <ProductImageGallery
                        images={images}
                        productName={product.title}
                    />
                </div>

                {/* Product Information */}
                <div className="space-y-6">
                    <ProductInfo product={product} />
                </div>
            </div>

            {/* Product Details Tabs */}
            <div className="mt-12">
                <ProductTabs product={product} />
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-12">
                    <RelatedProducts products={relatedProducts} />
                </div>
            )}
        </div>
    );
}
