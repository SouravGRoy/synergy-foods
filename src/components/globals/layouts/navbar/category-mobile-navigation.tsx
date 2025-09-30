"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCategories } from "@/hooks/use-categories";
import { cn } from "@/lib/utils";
import { ChevronDown, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface CategoryMobileNavigationProps {
    onLinkClick?: () => void;
}

export function CategoryMobileNavigation({
    onLinkClick,
}: CategoryMobileNavigationProps) {
    const { categories, isLoading, error } = useCategories();
    const pathname = usePathname();

    const getLinkClassName = (href: string) =>
        cn(
            "block rounded-lg px-3 py-2 text-base font-medium transition-colors",
            pathname === href
                ? "bg-green-50 text-green-600"
                : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
        );

    if (isLoading) {
        return (
            <div className="animate-pulse rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-400">Loading categories...</span>
                </div>
            </div>
        );
    }

    if (error || !categories.length) {
        return (
            <Link
                href="/shop"
                className={getLinkClassName("/shop")}
                onClick={onLinkClick}
            >
                All Products
            </Link>
        );
    }

    return (
        <>
            {/* All Products Link */}
            <Link
                href="/shop"
                className={
                    getLinkClassName("/shop") + " rounded-2xl bg-blue-200"
                }
                onClick={onLinkClick}
            >
                All Products
            </Link>

            {/* Categories with Dropdown */}
            {categories.map((category) => (
                <div key={category.id}>
                    {category.subcategories &&
                    category.subcategories.length > 0 ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                className={cn(
                                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-base font-medium transition-colors",
                                    pathname.startsWith(
                                        `/shop/categories/${category.slug}`
                                    )
                                        ? "bg-green-50 text-green-600"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
                                )}
                            >
                                <span>{category.name}</span>
                                <ChevronDown className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56"
                                align="start"
                                side="right"
                            >
                                {/* View All Category */}
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={`/shop/categories/${category.slug}`}
                                        onClick={onLinkClick}
                                    >
                                        <Package className="mr-2 h-4 w-4" />
                                        View All {category.name}
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                {/* Subcategories */}
                                {category.subcategories.map((subcategory) => (
                                    <DropdownMenuItem
                                        key={subcategory.id}
                                        asChild
                                    >
                                        <Link
                                            href={`/shop/categories/${category.slug}/${subcategory.slug}`}
                                            onClick={onLinkClick}
                                        >
                                            {subcategory.name}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link
                            href={`/shop/categories/${category.slug}`}
                            className={getLinkClassName(
                                `/shop/categories/${category.slug}`
                            )}
                            onClick={onLinkClick}
                        >
                            {category.name}
                        </Link>
                    )}
                </div>
            ))}
        </>
    );
}
