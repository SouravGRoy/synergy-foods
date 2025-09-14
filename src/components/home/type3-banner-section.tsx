"use client";

import { Type3Banner } from "@/components/home/banners";
import { axios } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export function Type3BannerSection() {
    const {
        data: banners,
        isError,
        isLoading,
    } = useQuery({
        queryKey: ["promotional-banners", "home", "type3"],
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
        retry: 3,
        retryDelay: 1000,
    });

    if (isLoading) {
        return (
            <section className="mt-8">
                <div className="h-32 animate-pulse rounded-lg bg-muted" />
            </section>
        );
    }

    if (isError || !banners?.type3?.length) return null;

    return (
        <section className="py-4 md:mt-16">
            {banners.type3.map((banner: any) => (
                <Type3Banner
                    key={banner.id}
                    banner={banner}
                    className="md:mb-8"
                />
            ))}
        </section>
    );
}
