"use client";

import { CarouselBanner } from "@/components/home/banners";
import { axios } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export function HeroBannerSection() {
    const { data: banners } = useQuery({
        queryKey: ["promotional-banners", "home", "carousel"],
        queryFn: async () => {
            const response = await axios.get(
                "/api/promotional-banners/by-location",
                {
                    params: { location: "home" },
                }
            );
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    if (!banners?.carousel?.length) return null;

    return (
        <section className="mt-8">
            {banners.carousel.map((banner: any) => (
                <CarouselBanner
                    key={banner.id}
                    banner={banner}
                    className="mb-8"
                />
            ))}
        </section>
    );
}
