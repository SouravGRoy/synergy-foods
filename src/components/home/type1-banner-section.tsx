"use client";

import { GeneralShell } from "@/components/globals/layouts";
import { Type1Banner } from "@/components/home/banners";
import { axios } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export function Type1BannerSection() {
    const {
        data: banners,
        isError,
        isLoading,
    } = useQuery({
        queryKey: ["promotional-banners", "home", "type1"],
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

    if (isError || !banners?.type1?.length) return null;

    return (
        <section className="mt-4 md:mt-6">
            <GeneralShell
                classNames={{
                    mainWrapper: "mt-0",
                    innerWrapper: "xl:max-w-[100rem]",
                }}
            >
                {banners.type1.map((banner: any) => (
                    <Type1Banner
                        key={banner.id}
                        banner={banner}
                        className="mb-8"
                    />
                ))}
            </GeneralShell>
        </section>
    );
}
