"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCategories } from "@/hooks/use-categories";
import { cn } from "@/lib/utils";
import { ChevronDown, Folder, Package } from "lucide-react";
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
            "flex items-center rounded-lg px-3 py-2 text-base font-medium transition-colors",
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
                className={getLinkClassName("/shop")}
                onClick={onLinkClick}
            >
                <Package className="mr-2 h-4 w-4" />
                All Products
            </Link>

            {/* Categories with Dropdown */}
            {categories.map((category) => {
                const hasSubcategories =
                    category.subcategories && category.subcategories.length > 0;

                if (!hasSubcategories) {
                    // Direct link for categories without subcategories
                    return (
                        <Link
                            key={category.id}
                            href={`/shop/categories/${category.slug}`}
                            className={getLinkClassName(
                                `/shop/categories/${category.slug}`
                            )}
                            onClick={onLinkClick}
                        >
                            <Folder className="mr-2 h-4 w-4" />
                            {category.name}
                        </Link>
                    );
                }

                // Dropdown for categories with subcategories
                return (
                    <DropdownMenu key={category.id}>
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
                            <div className="flex items-center gap-2">
                                <Folder className="h-4 w-4" />
                                {category.name}
                            </div>
                            <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-56"
                            align="start"
                            side="bottom"
                            sideOffset={5}
                        >
                            <DropdownMenuLabel>
                                {category.name}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

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
                            {category.subcategories?.map((subcategory) => (
                                <DropdownMenuItem key={subcategory.id} asChild>
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
                );
            })}
        </>
    );
}
