"use client";

import { Type2Banner } from "@/components/home/banners";
import { axios } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export function Type2BannerSection() {
    const { data: banners } = useQuery({
        queryKey: ["promotional-banners", "home-hero", "type2"],
        queryFn: async () => {
            const response = await axios.get(
                "/api/promotional-banners/by-location",
                {
                    params: { location: "home-hero" },
                }
            );
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    if (!banners?.type2?.length) return null;

    return (
        <section className="mt-16">
            {banners.type2.map((banner: any) => (
                <Type2Banner key={banner.id} banner={banner} className="mb-8" />
            ))}
        </section>
    );
}
