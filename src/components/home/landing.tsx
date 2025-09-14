"use client";

import { cn } from "@/lib/utils";
import { DynamicBannerCarousel } from "./dynamic-banner-carousel";

export function Landing({ className, ...props }: GenericProps) {
    return (
        <DynamicBannerCarousel
            className={cn("", className)}
            location="homepage"
            {...props}
        />
    );
}
