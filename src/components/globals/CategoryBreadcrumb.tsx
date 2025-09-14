"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { generateCategoryBreadcrumbs } from "@/lib/utils/category";
import { Category, ProductType, Subcategory } from "@/lib/validations";
import { Fragment } from "react";

interface CategoryBreadcrumbProps {
    category?: Category;
    subcategory?: Subcategory;
    productType?: ProductType;
    currentPage?: string;
}

export function CategoryBreadcrumb({
    category,
    subcategory,
    productType,
    currentPage,
}: CategoryBreadcrumbProps) {
    const breadcrumbs = generateCategoryBreadcrumbs(
        category,
        subcategory,
        productType
    );

    // Add current page if provided and different from the last breadcrumb
    if (
        currentPage &&
        currentPage !== breadcrumbs[breadcrumbs.length - 1]?.label
    ) {
        breadcrumbs.push({ label: currentPage, href: "#" });
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                    <Fragment key={breadcrumb.href}>
                        <BreadcrumbItem>
                            {index === breadcrumbs.length - 1 ? (
                                <BreadcrumbPage>
                                    {breadcrumb.label}
                                </BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink href={breadcrumb.href}>
                                    {breadcrumb.label}
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                        {index < breadcrumbs.length - 1 && (
                            <BreadcrumbSeparator />
                        )}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
