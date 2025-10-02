import { ProductManageForm } from "@/components/globals/forms";
import { queries } from "@/lib/db/queries";
import { cache } from "@/lib/redis/methods";
import { FullProduct, fullProductSchema } from "@/lib/validations";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { id } = await params;

    const product = await queries.product.get({
        id,
        isDeleted: false,
    });

    return {
        title: product ? `Edit ${product.title}` : "Edit Product",
        description: product ? `Edit ${product.title}` : "Edit product details",
    };
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-2 md:flex-row">
                <div className="text-center md:text-start">
                    <h1 className="text-2xl font-bold">Edit Product</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                        Edit product details and settings
                    </p>
                </div>
            </div>

            <Suspense fallback={<div>Loading...</div>}>
                <ProductEditFetch id={id} />
            </Suspense>
        </div>
    );
}

async function ProductEditFetch({ id }: { id: string }) {
    const { userId } = await auth();
    if (!userId) {
        redirect("/auth/signin");
    }

    const user = await cache.user.get(userId);
    if (!user) {
        redirect("/auth/signin");
    }

    // Fetch the product to edit
    const product = await queries.product.get({
        id,
        isDeleted: false,
    });

    if (!product) {
        notFound();
    }

    // Check if user has permission to edit this product
    if (user.role === "user" && product.uploaderId !== userId) {
        redirect("/dashboard/products");
    }

    const [categories, subcategories, productTypes, media] = await Promise.all([
        cache.category.scan(),
        cache.subcategory.scan(),
        cache.productType.scan(),
        cache.mediaItem.scan(),
    ]);

    const parsedProduct = fullProductSchema.parse(product);

    return (
        <ProductManageForm
            product={parsedProduct}
            categories={categories}
            subcategories={subcategories}
            productTypes={productTypes}
            initialMedia={media}
            user={user}
        />
    );
}
