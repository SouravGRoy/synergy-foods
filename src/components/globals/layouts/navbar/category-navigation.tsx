"use client";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { useCategories } from "@/hooks/use-categories";
import { cn } from "@/lib/utils";
import { ChevronDown, Package } from "lucide-react";
import Link from "next/link";
import { forwardRef } from "react";

// Helper component for custom links
const ListItem = forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a"> & {
        title: string;
        children?: React.ReactNode;
        href: string;
    }
>(({ className, title, children, href, ...props }, ref) => {
    return (
        <NavigationMenuLink asChild>
            <Link
                ref={ref}
                href={href}
                className={cn(
                    "block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none focus:bg-accent focus:text-accent-foreground",
                    className
                )}
                {...props}
            >
                <div className="text-sm leading-none font-medium">{title}</div>
                {children && (
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                )}
            </Link>
        </NavigationMenuLink>
    );
});
ListItem.displayName = "ListItem";

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
            <NavigationMenuLink asChild>
                <Link
                    href="/shop"
                    className="flex items-center gap-2 rounded-lg p-1.5 px-4 font-semibold transition-all ease-in-out hover:bg-muted hover:text-green-600"
                    title={
                        error ? `Error loading categories: ${error}` : undefined
                    }
                >
                    <Package className="h-4 w-4" />
                    Shop
                </Link>
            </NavigationMenuLink>
        );
    }

    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="gap-2 font-semibold hover:text-green-600">
                        <Package className="h-4 w-4" />
                        Categories
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="md:left-1/2 md:-translate-x-1/2">
                        <div className="grid w-[600px] grid-cols-2 items-start gap-2 p-4 md:w-[700px] lg:w-[800px] lg:grid-cols-3">
                            {/* All Products Link */}
                            <div className="col-span-full">
                                <ListItem
                                    href="/shop"
                                    title="All Products"
                                    className="flex items-center gap-2 font-medium"
                                ></ListItem>
                                <div className="my-1 border-t" />
                            </div>

                            {/* Categories Grid */}
                            {categories.map((category) => (
                                <div key={category.id} className="space-y-1.5">
                                    <div className="mb-2 px-3 text-sm">
                                        <Link
                                            href={`/shop/categories/${category.slug}`}
                                            className="font-bold text-green-700 transition-colors hover:text-green-600 dark:text-green-400 dark:hover:text-green-300"
                                        >
                                            {category.name}
                                        </Link>
                                    </div>

                                    {category.subcategories?.length ? (
                                        <div className="space-y-1">
                                            {category.subcategories
                                                .slice(0, 3)
                                                .map((subcategory) => (
                                                    <div
                                                        key={subcategory.id}
                                                        className="space-y-0.5"
                                                    >
                                                        <ListItem
                                                            href={`/shop/categories/${category.slug}/${subcategory.slug}`}
                                                            title={
                                                                subcategory.name
                                                            }
                                                            className="py-1.5 text-sm font-normal text-foreground"
                                                        >
                                                            {subcategory
                                                                .productTypes
                                                                ?.length
                                                                ? ` `
                                                                : "View all"}
                                                        </ListItem>

                                                        {/* Product Types for this subcategory */}
                                                        {subcategory
                                                            .productTypes
                                                            ?.length ? (
                                                            <div className="ml-3 space-y-1 border-l border-border pl-3">
                                                                {subcategory.productTypes
                                                                    .slice(0, 3)
                                                                    .map(
                                                                        (
                                                                            productType
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    productType.id
                                                                                }
                                                                            >
                                                                                <Link
                                                                                    href={`/shop/categories/${category.slug}/${subcategory.slug}/${productType.slug}`}
                                                                                    className="block rounded-sm px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                                                                >
                                                                                    {
                                                                                        productType.name
                                                                                    }
                                                                                </Link>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                {subcategory
                                                                    .productTypes
                                                                    .length >
                                                                    3 && (
                                                                    <div className="px-2 py-1">
                                                                        <Link
                                                                            href={`/shop/categories/${category.slug}/${subcategory.slug}`}
                                                                            className="text-xs text-muted-foreground/70 transition-colors hover:text-green-600"
                                                                        >
                                                                            +
                                                                            {subcategory
                                                                                .productTypes
                                                                                .length -
                                                                                3}{" "}
                                                                            more...
                                                                        </Link>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                ))}
                                            {category.subcategories.length >
                                                3 && (
                                                <div className="px-3 py-2">
                                                    <Link
                                                        href={`/shop/categories/${category.slug}`}
                                                        className="text-xs transition-colors hover:text-green-600"
                                                    >
                                                        +
                                                        {category.subcategories
                                                            .length - 3}{" "}
                                                        more subcategories...
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="px-3 text-xs">
                                            No subcategories yet
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}
