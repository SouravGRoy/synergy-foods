"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PromotionalBanner } from "@/lib/validations/promotional-banner";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BannerComponentProps {
    banner: PromotionalBanner;
    className?: string;
}

// Fallback image for Type 2 banners (large hero image)
const defaultFallbackImage = {
    url: "https://images.unsplash.com/photo-1543353071-087092ec393a?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    altText: "Fresh and healthy food collection",
};

// Fallback image component for missing or broken images
const FallbackImage = ({ className }: { className?: string }) => (
    <div
        className={cn(
            "flex items-center justify-center bg-gray-200",
            className
        )}
    >
        <span className="text-sm text-gray-500">Image not available</span>
    </div>
);

// Graceful image component with fallback
const GracefulImage = ({
    src,
    alt,
    className,
    ...props
}: {
    src?: string;
    alt: string;
    className?: string;
    [key: string]: any;
}) => {
    if (!src) {
        return <FallbackImage className={className} />;
    }

    return (
        <Image
            src={src}
            alt={alt}
            className={className}
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback = target.nextSibling as HTMLElement;
                if (fallback) fallback.style.display = "flex";
            }}
            {...props}
        />
    );
};

// Type 2: Large image with Shop Now button
export function Type2Banner({ banner, className }: BannerComponentProps) {
    // Use banner image if available, otherwise fall back to default image
    const media = banner.media[0];
    const imageToUse = media?.url ? media : defaultFallbackImage;
    const isUsingFallback = !media?.url;

    const ctaLabel = banner.ctaLabel || "Shop Now";

    return (
        <div className={cn("w-full", className)}>
            {/* Show indicator if using fallback image */}
            {isUsingFallback && (
                <div className="mb-2 text-center">
                    <p className="inline-block rounded bg-amber-50 px-2 py-1 text-xs text-amber-600">
                        Using fallback image content
                    </p>
                </div>
            )}

            <div className="group relative aspect-[16/9] overflow-hidden sm:aspect-[21/9] lg:aspect-auto">
                <GracefulImage
                    src={imageToUse.url}
                    alt={imageToUse.altText || banner.title}
                    className="size-full object-cover"
                    width={2000}
                    height={2000}
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/30" />

                {/* Show indicator for fallback image */}
                {isUsingFallback && (
                    <div className="absolute top-2 right-2 rounded bg-amber-500/80 px-2 py-1 text-xs text-white sm:top-4 sm:right-4">
                        Fallback Image
                    </div>
                )}

                {/* CTA Button */}
                {banner.ctaLink && (
                    <div className="absolute inset-0 flex items-end justify-center p-4 sm:justify-start sm:p-8 lg:p-12">
                        <Button
                            asChild
                            variant={"link"}
                            size="sm"
                            className="sm:size-lg transform rounded-full bg-white px-4 py-2 font-bold text-green-700 shadow-lg transition-transform hover:scale-105 focus:ring-2 focus:ring-white focus:ring-offset-2 sm:px-6 sm:py-3"
                        >
                            <Link
                                href={banner.ctaLink}
                                tabIndex={0}
                                className="text-sm font-bold text-green-400 sm:text-base"
                            >
                                {ctaLabel}
                                <ExternalLink className="ml-1 h-3 w-3 sm:ml-2 sm:h-4 sm:w-4" />
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
