"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FullProduct } from "@/lib/validations/product";
import Link from "next/link";

interface ProductBreadcrumbProps {
    product: FullProduct;
}

export function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
    return (
        <Breadcrumb className="mb-6">
            <BreadcrumbList>
                {/* Home */}
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/">Home</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />

                {/* Shop */}
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/shop">Shop</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />

                {/* Category */}
                {product.category && (
                    <>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link
                                    href={`/shop/categories/${product.category.slug}`}
                                >
                                    {product.category.name}
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                    </>
                )}

                {/* Subcategory */}
                {product.subcategory && (
                    <>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link
                                    href={`/shop/categories/${product.category?.slug}/${product.subcategory.slug}`}
                                >
                                    {product.subcategory.name}
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                    </>
                )}

                {/* Product Type */}
                {product.productType && (
                    <>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link
                                    href={`/shop/categories/${product.category?.slug}/${product.subcategory?.slug}?productType=${product.productType.slug}`}
                                >
                                    {product.productType.name}
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                    </>
                )}

                {/* Current Product */}
                <BreadcrumbItem>
                    <BreadcrumbPage>{product.title}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}
