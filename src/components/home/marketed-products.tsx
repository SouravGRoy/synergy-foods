"use client";

import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { Price } from "@/components/ui/price";
import { Skeleton } from "@/components/ui/skeleton";
import { useProduct } from "@/lib/react-query";
import { FullProduct } from "@/lib/validations";
import Autoplay from "embla-carousel-autoplay";
import { ChevronRight, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface MarketedProductsProps {
    initialData?: {
        data: FullProduct[];
        items: number;
        pages: number;
    };
}

export function MarketedProducts({ initialData }: MarketedProductsProps) {
    const [imageLoadStates, setImageLoadStates] = useState<
        Record<string, boolean>
    >({});

    const { useMarketedProducts } = useProduct();
    const { data, isLoading, error } = useMarketedProducts({
        limit: 10, // Max 10 as per business rule
        initialData,
    });

    const handleImageLoad = (id: string) => {
        setImageLoadStates((prev) => ({ ...prev, [id]: true }));
    };

    // Don't render if there are no marketed products
    if (!data?.data || data.data.length === 0) {
        return null;
    }

    if (error) {
        return (
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center text-muted-foreground">
                        Failed to load featured products
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-muted/30 py-4 sm:py-6 lg:py-8">
            <div className="container mx-auto px-2">
                {/* Header Section */}
                <div className="mb-6 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                    {/* Left Section */}
                    <div className="flex w-full flex-col justify-start text-center sm:text-left lg:w-auto">
                        {/* Image */}
                        <div className="relative mx-auto mb-4 w-40 sm:w-56 lg:mx-0">
                            <Image
                                src="/images/season discount.png"
                                alt="Seasonal Discount"
                                width={250}
                                height={200}
                                className="rounded-md object-contain"
                                sizes="(max-width: 768px) 160px, 250px"
                                priority
                            />
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-bold text-foreground sm:text-2xl md:text-3xl lg:text-4xl">
                            Everyday Fresh & Clean
                        </h2>

                        {/* Subtitle */}
                        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                            Discover our range of fresh and clean products for
                            your daily needs.
                        </p>
                    </div>

                    {/* Button */}
                    <div className="mt-4 flex w-full justify-center lg:mt-0 lg:w-auto lg:justify-end">
                        <Button
                            variant="outline"
                            className="shrink-0 px-6 py-3 sm:py-6"
                            size="sm"
                            asChild
                        >
                            <Link href="/shop" className="flex items-center">
                                View All
                                <Icons.ChevronRight className="ml-2 h-3 w-3" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col gap-4 overflow-x-auto lg:flex-row">
                    {/* Left Image Gallery */}
                    {/* Left Image Gallery */}
                    <div className="flex flex-row gap-4 lg:min-w-max lg:flex-col">
                        <div>
                            <Image
                                src="/images/LOST SPACE (1).webp"
                                alt="Lost Space 1"
                                width={350}
                                height={350}
                                className="mb-4 rounded-md"
                                loading="lazy"
                            />
                        </div>
                        <div>
                            <Image
                                src="/images/LOST SPACE (2).webp"
                                alt="Lost Space 2"
                                width={350}
                                height={350}
                                className="mb-4 rounded-md"
                                loading="lazy"
                            />
                        </div>
                        <div>
                            <Image
                                src="/images/LOST SPACE (3).webp"
                                alt="Lost Space 3"
                                width={350}
                                height={350}
                                className="mb-4 rounded-md"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* Carousel Section */}
                    <div className="min-w-0 flex-1">
                        <Carousel
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                            plugins={[
                                Autoplay({
                                    delay: 3000,
                                }),
                            ]}
                            className="w-full"
                        >
                            <div className="flex flex-col space-y-6">
                                <CarouselContent className="-ml-2 md:-ml-4">
                                    {data.data.map((product) => {
                                        const mainImage =
                                            product.media?.[0]?.mediaItem?.url;
                                        const isImageLoaded =
                                            imageLoadStates[product.id];

                                        const discount =
                                            product.compareAtPrice &&
                                            product.price !== null &&
                                            product.compareAtPrice >
                                                product.price
                                                ? Math.round(
                                                      ((product.compareAtPrice -
                                                          product.price) /
                                                          product.compareAtPrice) *
                                                          100
                                                  )
                                                : null;

                                        return (
                                            <CarouselItem
                                                key={product.id}
                                                className="basis-full pl-2 sm:basis-1/2 md:basis-1/3 md:pl-4"
                                            >
                                                <div className="mx-2 max-w-sm">
                                                    <Card className="group relative overflow-hidden border-0 shadow-none transition-all hover:shadow-lg">
                                                        <CardContent className="p-0">
                                                            <Link
                                                                href={`/shop/products/${product.slug}`}
                                                            >
                                                                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                                                    {/* Loading Skeleton */}
                                                                    {!isImageLoaded && (
                                                                        <Skeleton className="absolute inset-0 z-10" />
                                                                    )}

                                                                    {mainImage ? (
                                                                        <Image
                                                                            src={
                                                                                mainImage
                                                                            }
                                                                            alt={
                                                                                product.title
                                                                            }
                                                                            fill
                                                                            className={`object-cover transition-all duration-300 group-hover:scale-105 ${
                                                                                isImageLoaded
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0"
                                                                            }`}
                                                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                                                            onLoad={() =>
                                                                                handleImageLoad(
                                                                                    product.id
                                                                                )
                                                                            }
                                                                            loading="lazy"
                                                                        />
                                                                    ) : (
                                                                        <div className="flex h-full items-center justify-center">
                                                                            <Package className="h-8 w-8 text-muted-foreground sm:h-12 sm:w-12" />
                                                                        </div>
                                                                    )}

                                                                    {/* Badges - Top Left */}
                                                                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                                                                        {discount && (
                                                                            <Badge
                                                                                variant="destructive"
                                                                                className="text-xs"
                                                                            >
                                                                                -
                                                                                {
                                                                                    discount
                                                                                }

                                                                                %
                                                                            </Badge>
                                                                        )}
                                                                        <Badge
                                                                            variant="default"
                                                                            className="text-xs"
                                                                        >
                                                                            Featured
                                                                        </Badge>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-1.5 p-2 text-center">
                                                                    <h3 className="line-clamp-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                                                                        {
                                                                            product.title
                                                                        }
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
                                                                        ADD TO
                                                                        CART
                                                                        <ChevronRight className="ml-1 h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            </Link>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </CarouselItem>
                                        );
                                    })}
                                </CarouselContent>

                                {/* Bottom Marketing Banner */}
                                <div className="relative hidden overflow-hidden rounded-md md:block">
                                    <Image
                                        src="/images/marketed.webp"
                                        alt="Marketing Banner"
                                        width={1200}
                                        height={300}
                                        className="h-32 w-full rounded-md object-cover sm:h-40 lg:h-48"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </Carousel>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-8">
                        <Icons.Loader className="h-6 w-6 animate-spin" />
                        <span className="ml-2 text-sm text-muted-foreground">
                            Loading featured products...
                        </span>
                    </div>
                )}
            </div>
        </section>
    );
}
