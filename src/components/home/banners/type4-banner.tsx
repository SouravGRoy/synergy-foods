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

// Fallback image for Type 4 banners (single image)
const defaultFallbackImage = {
    url: "https://plus.unsplash.com/premium_photo-1728670182314-a8aefbb9d53c?q=80&w=2094&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    altText: "Farm fresh produce",
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

// Type 4: Single image with Discover More button
export function Type4Banner({ banner, className }: BannerComponentProps) {
    // Use banner image if available, otherwise fall back to default image
    const media = banner.media[0];
    const imageToUse = media?.url ? media : defaultFallbackImage;
    const isUsingFallback = !media?.url;

    const ctaLabel = banner.ctaLabel || "Discover More";

    return (
        <div className={cn("w-full", className)}>
            <div className="group relative aspect-[16/9] overflow-hidden sm:aspect-[4/3] lg:aspect-auto">
                <GracefulImage
                    src={imageToUse.url}
                    alt={imageToUse.altText || banner.title}
                    className="h-full w-full object-cover"
                    width={800}
                    height={450}
                />
                {/* Light overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Show indicator for fallback image */}
                {isUsingFallback && (
                    <div className="absolute top-2 right-2 rounded bg-amber-500/80 px-2 py-1 text-xs text-white sm:top-4 sm:right-4">
                        Fallback Image
                    </div>
                )}

                {/* CTA Button positioned at bottom left */}
                {banner.ctaLink && (
                    <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-8">
                        <Button
                            asChild
                            variant="secondary"
                            size="sm"
                            className="sm:size-lg rounded-full bg-white/90 px-3 py-2 shadow-lg backdrop-blur-sm hover:bg-white focus:ring-2 focus:ring-white focus:ring-offset-2 sm:px-4 sm:py-2"
                        >
                            <Link
                                href={banner.ctaLink}
                                tabIndex={0}
                                className="text-sm sm:text-base"
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
