"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCategories } from "@/hooks/use-categories";
import { cn } from "@/lib/utils";
import { ChevronDown, Package } from "lucide-react";
import Link from "next/link";
import { forwardRef } from "react";

export function CategoryNavigation() {
    const { categories, isLoading, error } = useCategories();

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 rounded-lg p-1.5 px-4 font-semibold opacity-50 transition-all ease-in-out">
                <Package className="h-4 w-4 animate-pulse" />
                Categories
                <ChevronDown className="h-3 w-3" />
            </div>
        );
    }

    if (error || !categories.length) {
        return (
            <Link
                href="/shop"
                className="flex items-center gap-2 rounded-lg p-1.5 px-4 font-semibold transition-all ease-in-out hover:bg-muted hover:text-green-600"
                title={error ? `Error loading categories: ${error}` : undefined}
            >
                <Package className="h-4 w-4" />
                Shop
            </Link>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg p-1.5 px-4 font-semibold transition-all ease-in-out hover:bg-muted hover:text-green-600">
                <Package className="h-4 w-4" />
                Categories
                <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="start">
                <DropdownMenuLabel>Shop by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* All Products */}
                <DropdownMenuItem asChild>
                    <Link href="/shop">
                        <Package className="mr-2 h-4 w-4" />
                        All Products
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Categories */}
                {categories.map((category) => (
                    <DropdownMenuSub key={category.id}>
                        <DropdownMenuSubTrigger>
                            {category.name}
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="w-48">
                            {/* Category main link */}
                            <DropdownMenuItem asChild>
                                <Link
                                    href={`/shop/categories/${category.slug}`}
                                >
                                    View All {category.name}
                                </Link>
                            </DropdownMenuItem>

                            {category.subcategories &&
                                category.subcategories.length > 0 && (
                                    <>
                                        <DropdownMenuSeparator />
                                        {category.subcategories.map(
                                            (subcategory) => (
                                                <DropdownMenuItem
                                                    key={subcategory.id}
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/shop/categories/${category.slug}/${subcategory.slug}`}
                                                    >
                                                        {subcategory.name}
                                                    </Link>
                                                </DropdownMenuItem>
                                            )
                                        )}
                                    </>
                                )}
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
