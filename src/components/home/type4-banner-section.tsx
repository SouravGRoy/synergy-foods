"use client";

import { Type4Banner } from "@/components/home/banners";
import { axios } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export function Type4BannerSection() {
    const { data: banners } = useQuery({
        queryKey: ["promotional-banners", "home", "type4"],
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

    if (!banners?.type4?.length) return null;

    return (
        <section className="py-4 md:mt-16">
            {banners.type4.map((banner: any) => (
                <Type4Banner key={banner.id} banner={banner} className="mb-6" />
            ))}
        </section>
    );
}
