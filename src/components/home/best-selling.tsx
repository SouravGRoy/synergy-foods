"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Price } from "@/components/ui/price";
import { Skeleton } from "@/components/ui/skeleton";
import { useProduct } from "@/lib/react-query";
import { cn } from "@/lib/utils";
import { ChevronRight, Package, RotateCcw, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export function BestSelling({
    className,
    limit = 6,
    ...props
}: GenericProps & { limit?: number }) {
    const { useNewArrivals } = useProduct();

    const {
        data: productsData,
        isLoading,
        error,
        refetch,
        isFetching,
    } = useNewArrivals({
        limit,
        enabled: true,
    });

    const products = productsData?.data || [];

    // Debug logging for mobile issues
    React.useEffect(() => {
        console.log("BestSelling Debug:", {
            isLoading,
            isFetching,
            error: error?.message,
            productsDataExists: !!productsData,
            productsCount: products.length,
            screenWidth:
                typeof window !== "undefined" ? window.innerWidth : "SSR",
        });
    }, [isLoading, isFetching, error, productsData, products.length]);

    if (error) {
        return (
            <div className={cn("py-16", className)} {...props}>
                <div className="text-center">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-lg text-muted-foreground">
                        Failed to load new arrivals. Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <section className={cn("py-10", className)} {...props}>
            {/* Responsive Container - Stack on mobile, horizontal on larger screens */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16">
                {/* Left Section - Title and Description */}
                <div className="lg:col-span-4 xl:col-span-3">
                    <div className="space-y-4 lg:sticky lg:top-8">
                        <div className="flex items-center justify-between">
                            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                                <Sparkles className="h-4 w-4" />
                                Best Selling
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => refetch()}
                                disabled={isFetching}
                                className="h-8 w-8 p-0"
                            >
                                <RotateCcw
                                    className={cn(
                                        "h-4 w-4",
                                        isFetching && "animate-spin"
                                    )}
                                />
                            </Button>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-3xl xl:text-4xl">
                            Best Seller Products
                        </h2>
                        <p className="text-lg text-muted-foreground lg:text-base xl:text-lg">
                            Discover our most popular products that customers
                            love.
                        </p>
                        {/* View All Button - Moved here for better UX */}
                        {!isLoading && products.length > 0 && (
                            <div className="pt-4">
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="w-full sm:w-auto"
                                >
                                    <Link href="/shop?sortBy=createdAt&sortOrder=desc">
                                        View All Best Seller Products
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section - Products Grid (3 products) */}
                <div className="lg:col-span-8 xl:col-span-9">
                    {isLoading ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Card key={i} className="overflow-hidden">
                                    <CardContent className="p-0">
                                        <Skeleton className="aspect-[4/3] w-full" />
                                        <div className="space-y-1.5 p-3">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-1/2" />
                                            <Skeleton className="h-6 w-full" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {products.slice(0, 3).map((product) => {
                                const mainImage =
                                    product.media?.[0]?.mediaItem?.url;

                                const discount =
                                    product.compareAtPrice &&
                                    product.price !== null &&
                                    product.compareAtPrice > product.price
                                        ? Math.round(
                                              ((product.compareAtPrice -
                                                  product.price) /
                                                  product.compareAtPrice) *
                                                  100
                                          )
                                        : null;

                                return (
                                    <Card
                                        key={product.id}
                                        className="group relative overflow-hidden border-0 shadow-none transition-all hover:shadow-lg"
                                    >
                                        <CardContent className="p-0">
                                            <Link
                                                href={`/shop/products/${product.slug}`}
                                            >
                                                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                                    {mainImage ? (
                                                        <Image
                                                            src={mainImage}
                                                            alt={product.title}
                                                            fill
                                                            className="object-cover transition-transform group-hover:scale-105"
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center">
                                                            <Package className="h-12 w-12 text-muted-foreground" />
                                                        </div>
                                                    )}

                                                    {/* Discount Badge - Top Left */}
                                                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                                                        {discount && (
                                                            <Badge
                                                                variant="destructive"
                                                                className="text-xs"
                                                            >
                                                                -{discount}%
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5 p-3 text-center">
                                                    <h3 className="line-clamp-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                                                        {product.title}
                                                    </h3>

                                                    <div className="flex items-center justify-center gap-2">
                                                        {product.compareAtPrice && (
                                                            <Price
                                                                value={
                                                                    product.compareAtPrice
                                                                }
                                                                className="text-xs text-muted-foreground line-through"
                                                            />
                                                        )}
                                                        {product.price !==
                                                        null ? (
                                                            <Price
                                                                value={
                                                                    product.price
                                                                }
                                                                className="text-base font-bold"
                                                            />
                                                        ) : (
                                                            <span className="text-base font-bold text-muted-foreground">
                                                                N/A
                                                            </span>
                                                        )}
                                                    </div>

                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        className="mt-1.5 w-full rounded-full text-xs"
                                                    >
                                                        ADD TO CART
                                                        <ChevronRight className="ml-1 h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                            <p className="mt-4 text-lg text-muted-foreground">
                                No best selling products found at the moment.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Check back soon for more popular products!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
