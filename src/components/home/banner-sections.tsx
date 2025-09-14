"use client";

import { GeneralShell } from "@/components/globals/layouts";
import {
    CarouselBanner,
    Type1Banner,
    Type2Banner,
    Type3Banner,
    Type4Banner,
} from "@/components/home/banners";
import { axios } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export function BannerSections() {
    // Fetch home banners client-side via API
    const { data: allBanners } = useQuery({
        queryKey: ["promotional-banners", "home", "all"],
        queryFn: async () => {
            const response = await axios.get(
                "/api/promotional-banners/by-location",
                {
                    params: { location: "home" },
                }
            );
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });

    // Fetch hero banners client-side via API
    const { data: type2HeroBanners } = useQuery({
        queryKey: ["promotional-banners", "home-hero", "all"],
        queryFn: async () => {
            const response = await axios.get(
                "/api/promotional-banners/by-location",
                {
                    params: { location: "home-hero" },
                }
            );
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });

    if (!allBanners || !type2HeroBanners) {
        return (
            <div className="space-y-8">
                {/* Loading skeletons */}
                <div className="h-64 animate-pulse rounded-lg bg-gray-100" />
                <div className="h-32 animate-pulse rounded-lg bg-gray-100" />
                <div className="h-96 animate-pulse rounded-lg bg-gray-100" />
            </div>
        );
    }

    return (
        <>
            {/* Hero Carousel Section */}
            {allBanners.carousel?.length > 0 && (
                <section className="mt-8">
                    {allBanners.carousel.map((banner: any) => (
                        <CarouselBanner
                            key={banner.id}
                            banner={banner}
                            className="mb-8"
                        />
                    ))}
                </section>
            )}

            {/* Type 1 Banners - Three Images Layout */}
            {allBanners.type1?.length > 0 && (
                <section className="mt-4 md:mt-6">
                    <GeneralShell
                        classNames={{
                            mainWrapper: "mt-0",
                            innerWrapper: "xl:max-w-[100rem]",
                        }}
                    >
                        {allBanners.type1.map((banner: any) => (
                            <Type1Banner
                                key={banner.id}
                                banner={banner}
                                className="mb-8"
                            />
                        ))}
                    </GeneralShell>
                </section>
            )}

            {/* Type 2 Banners - Large Image with Shop Now */}
            {type2HeroBanners.type2?.length > 0 && (
                <section className="mt-16">
                    {type2HeroBanners.type2.map((banner: any) => (
                        <Type2Banner
                            key={banner.id}
                            banner={banner}
                            className="mb-8"
                        />
                    ))}
                </section>
            )}

            {/* Type 3 Banners - Stacked Images */}
            {allBanners.type3?.length > 0 && (
                <section className="py-4 md:mt-16">
                    {allBanners.type3.map((banner: any) => (
                        <Type3Banner
                            key={banner.id}
                            banner={banner}
                            className="md:mb-8"
                        />
                    ))}
                </section>
            )}

            {/* Type 4 Banners - Single Image with Discover More */}
            {allBanners.type4?.length > 0 && (
                <section className="py-4 md:mt-16">
                    {allBanners.type4.map((banner: any) => (
                        <Type4Banner
                            key={banner.id}
                            banner={banner}
                            className="mb-6"
                        />
                    ))}
                </section>
            )}
        </>
    );
}
