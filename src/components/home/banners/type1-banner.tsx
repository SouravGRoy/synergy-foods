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

// Fallback images for Type 1 banners (3 images required)
const defaultFallbackImages = [
    {
        url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=930&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        altText: "Fresh vegetables and fruits",
    },
    {
        url: "https://plus.unsplash.com/premium_photo-1667543228378-ec4478ab2845?q=80&w=1744&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        altText: "Healthy organic food",
    },
    {
        url: "https://images.unsplash.com/photo-1628200487311-7bdfd5e6ace3?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        altText: "Farm fresh produce",
    },
];

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
                // Replace with fallback on error
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback = target.nextSibling as HTMLElement;
                if (fallback) fallback.style.display = "flex";
            }}
            {...props}
        />
    );
};

// Type 1: Three images side-by-side
export function Type1Banner({ banner, className }: BannerComponentProps) {
    // Use banner images if available, otherwise fall back to default images
    const availableImages = banner.media.filter((media) => media?.url);
    const imagesToUse =
        availableImages.length >= 3
            ? availableImages.slice(0, 3)
            : [
                  ...availableImages,
                  ...defaultFallbackImages.slice(availableImages.length),
              ].slice(0, 3);

    return (
        <div className={cn("w-full", className)}>
            {/* Show indicator if using fallback images */}
            {availableImages.length < 3 && (
                <div className="mb-2 text-center">
                    <p className="inline-block rounded bg-amber-50 px-2 py-1 text-xs text-amber-600">
                        Some images are using fallback content
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {imagesToUse.map((media, index) => {
                    const isOriginal = index < availableImages.length;
                    const isCenterImage = index === 1; // Center image for Shop Now button
                    return (
                        <div
                            key={index}
                            className="group relative aspect-square overflow-hidden rounded-lg"
                        >
                            <GracefulImage
                                src={media?.url}
                                alt={
                                    media?.altText ||
                                    `${banner.title} image ${index + 1}`
                                }
                                className="h-full w-full object-cover transition-transform hover:scale-105"
                                width={400}
                                height={300}
                            />

                            {/* Shop Now button overlay for center image */}
                            {isCenterImage && (
                                <>
                                    {/* Dark overlay for better button visibility */}
                                    <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/30" />

                                    {/* Shop Now Button */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Button
                                            asChild
                                            variant="secondary"
                                            size="lg"
                                            className="transform rounded-full bg-white/90 font-semibold text-green-700 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white focus:ring-2 focus:ring-white focus:ring-offset-2"
                                        >
                                            <Link
                                                href={banner.ctaLink || "/shop"}
                                                tabIndex={0}
                                                className="flex items-center gap-2"
                                            >
                                                {banner.ctaLabel || "Shop Now"}
                                                <ExternalLink className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </>
                            )}

                            {/* Show indicator for fallback images */}
                            {!isOriginal && (
                                <div className="absolute top-2 right-2 rounded bg-amber-500/80 px-2 py-1 text-xs text-white">
                                    Fallback
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
