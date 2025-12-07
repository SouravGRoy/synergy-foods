"use client";

import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { useBanner } from "@/lib/react-query/banner";
import { cn } from "@/lib/utils";
import { Banner } from "@/lib/validations/banner";
import { PromotionalBanner } from "@/lib/validations/promotional-banner";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { Icons } from "../icons";

interface DynamicBannerCarouselProps {
    className?: string;
    location?: string;
    fallbackBanners?: Array<{
        title: string;
        description: string;
        imageUrl: string;
        url?: string;
    }>;
}

// Fallback banners in case API fails or no banners are configured
const defaultFallbackBanners = [
    {
        title: "Wear Product You Value",
        description: "Discover our curated collection of sustainable fashion.",
        imageUrl:
            "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D",
        url: "/shop",
    },
    {
        title: "Trace Your Product Journey",
        description: "Learn about the journey of each product you wear.",
        imageUrl:
            "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZvb2R8ZW58MHx8MHx8fDA%3D",
        url: "/shop",
    },
    {
        title: "Know Your Impact",
        description: "Understand the environmental impact of your choices.",
        imageUrl:
            "https://images.unsplash.com/photo-1464454709131-ffd692591ee5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGZvb2R8ZW58MHx8MHx8fDA%3D",
        url: "/shop",
    },
    {
        title: "Choose Consciously",
        description: "Make informed decisions for a better future.",
        imageUrl:
            "https://images.unsplash.com/photo-1457666134378-6b77915bd5f2?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzR8fGZvb2R8ZW58MHx8MHx8fDA%3D",
        url: "/shop",
    },
];

export function DynamicBannerCarousel({
    className,
    location = "homepage",
    fallbackBanners = defaultFallbackBanners,
}: DynamicBannerCarouselProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Use the React Query hook to fetch actual banners from API
    const { useScan } = useBanner();
    const {
        data: banners = [],
        isLoading,
        error,
    } = useScan({
        location,
        enabled: isMounted, // Only fetch after client-side mount
    });

    // Show loading skeleton on server-side render
    if (!isMounted) {
        return (
            <section className={cn("relative w-full", className)}>
                <div className="aspect-[16/9] w-full animate-pulse rounded-lg bg-muted" />
            </section>
        );
    }

    // Use actual API banners if available, otherwise use fallbacks
    const displayBanners: (Banner | PromotionalBanner)[] =
        banners.length > 0
            ? banners
            : fallbackBanners.map((banner, index) => ({
                  id: `fallback-${index}`,
                  title: banner.title,
                  description: banner.description,
                  type: "carousel" as const,
                  media: [
                      {
                          url: banner.imageUrl,
                          altText: banner.title,
                      },
                  ],
                  isActive: true,
                  order: index,
                  location: "home" as const,
                  startDate: new Date(),
                  endDate: null,
                  ctaText: "Explore Now",
                  ctaLink: banner.url || "/shop",
                  createdAt: new Date(),
                  updatedAt: new Date(),
              }));

    // Transform banners for display
    const transformedBanners = displayBanners.map((banner) => {
        // Check if it's a PromotionalBanner (has media property) or Banner (has imageUrl property)
        const imageUrl =
            "media" in banner
                ? banner.media[0]?.url || ""
                : "imageUrl" in banner
                  ? banner.imageUrl
                  : "";
        const url =
            "ctaLink" in banner
                ? banner.ctaLink || "/shop"
                : "url" in banner
                  ? banner.url || "/shop"
                  : "/shop";

        return {
            title: banner.title,
            description: banner.description,
            imageUrl,
            url,
        };
    });

    return (
        <section className={cn("relative", className)}>
            {/* Loading indicator */}
            {isLoading && (
                <div className="absolute top-4 right-4 z-10 rounded bg-blue-600/70 px-3 py-1 text-xs text-white">
                    Loading banners...
                </div>
            )}

            {/* Banner source indicator */}
            {!isLoading && (
                <div className="absolute top-4 right-4 z-10 rounded bg-black/50 px-3 py-1 text-xs text-white">
                    {banners.length > 0
                        ? `${banners.length} banners`
                        : "banners"}
                </div>
            )}

            {/* Error indicator */}

            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                plugins={[
                    Autoplay({
                        delay: 5000,
                    }),
                ]}
                className="h-[40vh] w-full md:h-[60vh] lg:h-[75vh]"
            >
                <CarouselContent
                    classNames={{
                        wrapper: "size-full",
                        inner: "size-full ml-0",
                    }}
                >
                    {transformedBanners.map((item, index) => (
                        <CarouselItem key={index} className="h-full p-0">
                            <div className="relative size-full">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    width={2000}
                                    height={2000}
                                    className="size-full object-cover brightness-50"
                                    priority={index === 0}
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-5 p-4 text-center text-background md:space-y-10">
                                    <h1 className="max-w-3xl text-3xl font-bold text-balance uppercase md:text-5xl lg:text-7xl">
                                        {item.title}
                                    </h1>

                                    <p className="max-w-xl text-balance text-background/80 md:text-lg lg:max-w-3xl lg:text-2xl">
                                        {item.description}
                                    </p>

                                    <div className="flex gap-4">
                                        <Button
                                            size="lg"
                                            className="mt-1 bg-background/60 font-semibold text-foreground uppercase hover:bg-background/90 md:mt-0 md:py-5"
                                            asChild
                                        >
                                            <Link href="/shop">
                                                Discover More
                                            </Link>
                                        </Button>

                                        {item.url && item.url !== "/shop" && (
                                            <Button
                                                size="lg"
                                                variant="outline"
                                                className="mt-1 border-background/60 bg-transparent text-background hover:bg-background/20 md:mt-0 md:py-5"
                                                asChild
                                            >
                                                <Link href={item.url}>
                                                    <ExternalLink className="mr-2 h-4 w-4" />
                                                    Learn More
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            <Marquee autoFill speed={100}>
                {transformedBanners.map((banner, index) => (
                    <div key={index} className="flex items-center">
                        <p className="text-sm">{banner.title}</p>
                        <Icons.Heart className="mx-4 size-3 fill-background md:size-4" />
                    </div>
                ))}
            </Marquee>
        </section>
    );
}
