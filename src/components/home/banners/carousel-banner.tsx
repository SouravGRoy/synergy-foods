"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PromotionalBanner } from "@/lib/validations/promotional-banner";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface BannerComponentProps {
    banner: PromotionalBanner;
    className?: string;
}

// Fallback images for Carousel banners (multiple images)
const defaultFallbackImages = [
    {
        url: "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D",
        altText: "Fresh and healthy food collection",
    },
    {
        url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZvb2R8ZW58MHx8MHx8fDA%3D",
        altText: "Fresh vegetables and fruits",
    },
    {
        url: "https://images.unsplash.com/photo-1464454709131-ffd692591ee5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGZvb2R8ZW58MHx8MHx8fDA%3D",
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

// Carousel: Multiple images with navigation
export function CarouselBanner({ banner, className }: BannerComponentProps) {
    // Use banner images if available, otherwise fall back to default images
    const availableImages = banner.media.filter((media) => media?.url);
    const imagesToUse =
        availableImages.length > 0 ? availableImages : defaultFallbackImages;
    const isUsingFallback = availableImages.length === 0;

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % imagesToUse.length);
    };

    const prevSlide = () => {
        setCurrentIndex(
            (prev) => (prev - 1 + imagesToUse.length) % imagesToUse.length
        );
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const ctaLabel = banner.ctaLabel || "Learn More";

    return (
        <div className={cn("w-full", className)}>
            {/* Show indicator if using fallback images */}
            {isUsingFallback && (
                <div className="mb-2 text-center">
                    <p className="inline-block rounded bg-amber-50 px-2 py-1 text-xs text-amber-600">
                        Using fallback image content
                    </p>
                </div>
            )}

            <div className="mb-4 text-center">
                <h2 className="mb-2 text-2xl font-bold">{banner.title}</h2>
                <p className="text-muted-foreground">{banner.description}</p>
            </div>
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                {/* Current Image */}
                <div className="relative h-full w-full">
                    <GracefulImage
                        src={imagesToUse[currentIndex]?.url}
                        alt={
                            imagesToUse[currentIndex]?.altText ||
                            `${banner.title} - Slide ${currentIndex + 1}`
                        }
                        className="h-full w-full object-cover"
                        width={800}
                        height={450}
                    />
                    {/* Light overlay for better text/button visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {/* Navigation Arrows */}
                {imagesToUse.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none"
                            aria-label="Next image"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </>
                )}

                {/* CTA Button */}
                {banner.ctaLink && (
                    <div className="absolute bottom-6 left-6">
                        <Button
                            asChild
                            variant="secondary"
                            size="lg"
                            className="bg-white/90 shadow-lg backdrop-blur-sm hover:bg-white focus:ring-2 focus:ring-white focus:ring-offset-2"
                        >
                            <Link href={banner.ctaLink} tabIndex={0}>
                                {ctaLabel}
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                )}

                {/* Dots Indicator */}
                {imagesToUse.length > 1 && (
                    <div className="absolute right-6 bottom-6 flex space-x-2">
                        {imagesToUse.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={cn(
                                    "h-2 w-2 rounded-full transition-all focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none",
                                    index === currentIndex
                                        ? "bg-white"
                                        : "bg-white/50 hover:bg-white/75"
                                )}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Show indicator for fallback images */}
                {isUsingFallback && (
                    <div className="absolute top-4 right-4 rounded bg-amber-500/80 px-2 py-1 text-xs text-white">
                        Fallback Images
                    </div>
                )}
            </div>
        </div>
    );
}
