"use client";

import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { useCategories } from "@/hooks/use-categories";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Package } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface CategoryMobileNavigationProps {
    onLinkClick?: () => void;
}

export function CategoryMobileNavigation({
    onLinkClick,
}: CategoryMobileNavigationProps) {
    const { categories, isLoading } = useCategories();
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
        new Set()
    );
    const [expandedSubcategories, setExpandedSubcategories] = useState<
        Set<string>
    >(new Set());

    const toggleCategory = (categoryId: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
            // Also collapse all subcategories in this category
            const categorySubcategoryIds =
                categories
                    .find((cat) => cat.id === categoryId)
                    ?.subcategories?.map((sub) => sub.id) || [];
            categorySubcategoryIds.forEach((id) => {
                const newExpandedSub = new Set(expandedSubcategories);
                newExpandedSub.delete(id);
                setExpandedSubcategories(newExpandedSub);
            });
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    const toggleSubcategory = (subcategoryId: string) => {
        const newExpanded = new Set(expandedSubcategories);
        if (newExpanded.has(subcategoryId)) {
            newExpanded.delete(subcategoryId);
        } else {
            newExpanded.add(subcategoryId);
        }
        setExpandedSubcategories(newExpanded);
    };

    if (isLoading) {
        return (
            <li className="animate-pulse">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        <span>Categories</span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                </div>
            </li>
        );
    }

    if (!categories.length) {
        return (
            <li>
                <Link
                    href="/shop"
                    className="flex items-center justify-between gap-2 text-foreground"
                    onClick={onLinkClick}
                >
                    <span>Shop</span>
                    <Package className="size-5" />
                </Link>
            </li>
        );
    }

    return (
        <>
            {/* All Products Link */}
            <li>
                <Link
                    href="/shop"
                    className="flex items-center justify-between gap-2 text-foreground"
                    onClick={onLinkClick}
                >
                    <span>All Products</span>
                    <Package className="size-5" />
                </Link>
                <div className="py-4">
                    <Separator />
                </div>
            </li>

            {/* Categories */}
            {categories.map((category) => (
                <li key={category.id}>
                    <div className="space-y-2">
                        {/* Category Header */}
                        <div className="flex items-center justify-between">
                            <Link
                                href={`/shop/categories/${category.slug}`}
                                className="flex-1 font-medium text-foreground"
                                onClick={onLinkClick}
                            >
                                {category.name}
                            </Link>
                            {category.subcategories &&
                                category.subcategories.length > 0 && (
                                    <button
                                        onClick={() =>
                                            toggleCategory(category.id)
                                        }
                                        className="p-1 text-foreground/70 transition-colors hover:text-foreground"
                                        aria-label={`Toggle ${category.name} subcategories`}
                                    >
                                        <ChevronDown
                                            className={cn(
                                                "h-4 w-4 transition-transform duration-200",
                                                expandedCategories.has(
                                                    category.id
                                                ) && "rotate-180"
                                            )}
                                        />
                                    </button>
                                )}
                        </div>

                        {/* Subcategories */}
                        {expandedCategories.has(category.id) &&
                            category.subcategories && (
                                <div className="relative z-10 ml-4 space-y-2 border-l border-foreground/20 pl-4">
                                    {category.subcategories.map(
                                        (subcategory) => (
                                            <div
                                                key={subcategory.id}
                                                className="space-y-2"
                                            >
                                                {/* Subcategory Header */}
                                                <div className="flex items-center justify-between">
                                                    <Link
                                                        href={`/shop/categories/${category.slug}/${subcategory.slug}`}
                                                        className="flex-1 text-sm text-foreground/90"
                                                        onClick={onLinkClick}
                                                    >
                                                        {subcategory.name}
                                                    </Link>
                                                    {subcategory.productTypes &&
                                                        subcategory.productTypes
                                                            .length > 0 && (
                                                            <button
                                                                onClick={() =>
                                                                    toggleSubcategory(
                                                                        subcategory.id
                                                                    )
                                                                }
                                                                className="p-1 text-foreground/50 transition-colors hover:text-foreground/70"
                                                                aria-label={`Toggle ${subcategory.name} product types`}
                                                            >
                                                                <ChevronRight
                                                                    className={cn(
                                                                        "h-3 w-3 transition-transform duration-200",
                                                                        expandedSubcategories.has(
                                                                            subcategory.id
                                                                        ) &&
                                                                            "rotate-90"
                                                                    )}
                                                                />
                                                            </button>
                                                        )}
                                                </div>

                                                {/* Product Types */}
                                                {expandedSubcategories.has(
                                                    subcategory.id
                                                ) &&
                                                    subcategory.productTypes && (
                                                        <div className="relative z-10 ml-4 space-y-1 border-l border-foreground/10 pl-4">
                                                            {subcategory.productTypes.map(
                                                                (
                                                                    productType
                                                                ) => (
                                                                    <Link
                                                                        key={
                                                                            productType.id
                                                                        }
                                                                        href={`/shop/categories/${category.slug}/${subcategory.slug}/${productType.slug}`}
                                                                        className="block text-xs text-foreground/70 transition-colors hover:text-foreground"
                                                                        onClick={
                                                                            onLinkClick
                                                                        }
                                                                    >
                                                                        {
                                                                            productType.name
                                                                        }
                                                                    </Link>
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                    </div>
                    <div className="py-4">
                        <Separator />
                    </div>
                </li>
            ))}
        </>
    );
}
