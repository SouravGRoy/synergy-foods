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

// Fallback images for Type 3 banners (2 images required)
const defaultFallbackImages = [
    {
        url: "https://images.unsplash.com/photo-1527264935190-1401c51b5bbc?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        altText: "Fresh vegetables and fruits",
    },
    {
        url: "https://plus.unsplash.com/premium_photo-1673502751768-586478eb3fcb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fG9mZmVyfGVufDB8fDB8fHww",
        altText: "Healthy organic food",
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
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback = target.nextSibling as HTMLElement;
                if (fallback) fallback.style.display = "flex";
            }}
            {...props}
        />
    );
};

// Type 3: Two images stacked vertically
export function Type3Banner({ banner, className }: BannerComponentProps) {
    // Use banner images if available, otherwise fall back to default images
    const availableImages = banner.media.filter((media) => media?.url);
    const imagesToUse =
        availableImages.length >= 2
            ? availableImages.slice(0, 2)
            : [
                  ...availableImages,
                  ...defaultFallbackImages.slice(availableImages.length),
              ].slice(0, 2);

    return (
        <div className={cn("w-full", className)}>
            {/* Show indicator if using fallback images */}
            {availableImages.length < 2 && (
                <div className="mb-2 text-center">
                    <p className="inline-block rounded bg-amber-50 px-2 py-1 text-xs text-amber-600">
                        Some images are using fallback content
                    </p>
                </div>
            )}

            <div className="">
                {imagesToUse.map((media, index) => {
                    const isOriginal = index < availableImages.length;
                    const isSecondImage = index === 1; // Second image will be clickable
                    const linkUrl = banner.ctaLink || "/shop"; // Fallback to /shop if no CTA link

                    // Render second image as a clickable link
                    if (isSecondImage) {
                        return (
                            <Link
                                key={index}
                                href={linkUrl}
                                className="group relative block aspect-auto cursor-pointer overflow-hidden"
                            >
                                <GracefulImage
                                    src={media?.url}
                                    alt={
                                        media?.altText ||
                                        `${banner.title} image ${index + 1}`
                                    }
                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                    width={800}
                                    height={450}
                                />

                                {/* Subtle hover overlay for visual feedback */}
                                <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/10" />

                                {/* Link indicator */}
                                <div className="absolute top-4 left-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <div className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-green-700 shadow-lg backdrop-blur-sm">
                                        <span>
                                            {banner.ctaLabel || "Shop Now"}
                                        </span>
                                        <ExternalLink className="h-3 w-3" />
                                    </div>
                                </div>

                                {/* Show indicator for fallback images */}
                                {!isOriginal && (
                                    <div className="absolute top-2 right-2 rounded bg-amber-500/80 px-2 py-1 text-xs text-white">
                                        Fallback
                                    </div>
                                )}

                                {/* Debug indicator to show it's a clickable link */}
                                <div className="absolute bottom-2 left-2 rounded bg-blue-500/80 px-2 py-1 text-xs text-white">
                                    Clickable
                                </div>
                            </Link>
                        );
                    }

                    // Render first image normally (non-clickable)
                    return (
                        <div
                            key={index}
                            className="relative aspect-auto overflow-hidden"
                        >
                            <GracefulImage
                                src={media?.url}
                                alt={
                                    media?.altText ||
                                    `${banner.title} image ${index + 1}`
                                }
                                className="h-full w-full object-cover transition-transform"
                                width={800}
                                height={450}
                            />

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
