import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PromotionalBanner } from "@/lib/validations/promotional-banner";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PromotionalBannerDisplayProps {
    banners: PromotionalBanner[];
    className?: string;
}

interface BannerComponentProps {
    banner: PromotionalBanner;
}

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
                console.warn(`Failed to load image: ${src}`);
                // Replace with fallback in case of error
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback = document.createElement("div");
                fallback.className = className || "";
                fallback.innerHTML =
                    '<span class="text-gray-500 text-sm">Image not available</span>';
                fallback.style.cssText =
                    "background-color: #f3f4f6; display: flex; align-items: center; justify-content: center;";
                target.parentNode?.replaceChild(fallback, target);
            }}
            {...props}
        />
    );
};

// Type 1: Three images side-by-side
const Type1Banner = ({ banner }: BannerComponentProps) => {
    const requiredImages = banner.media.slice(0, 3);

    if (requiredImages.length < 3) {
        console.warn(
            `Type 1 banner "${banner.title}" requires 3 images but only has ${requiredImages.length}`
        );
    }

    return (
        <div className="w-full">
            <div className="mb-4 text-center">
                <h2 className="mb-2 text-2xl font-bold">{banner.title}</h2>
                <p className="text-muted-foreground">{banner.description}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {Array(3)
                    .fill(null)
                    .map((_, index) => {
                        const media = requiredImages[index];
                        return (
                            <div
                                key={index}
                                className="aspect-[4/3] overflow-hidden rounded-lg"
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
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

// Type 2: Large image with Shop Now button
const Type2Banner = ({ banner }: BannerComponentProps) => {
    const media = banner.media[0];

    if (!media) {
        console.warn(
            `Type 2 banner "${banner.title}" requires 1 image but has none`
        );
        return null;
    }

    const ctaLabel = banner.ctaLabel || "Shop Now";

    return (
        <div className="w-full">
            <div className="mb-4 text-center">
                <h2 className="mb-2 text-2xl font-bold">{banner.title}</h2>
                <p className="text-muted-foreground">{banner.description}</p>
            </div>
            <div className="group relative aspect-[16/9] overflow-hidden rounded-lg">
                <GracefulImage
                    src={media.url}
                    alt={media.altText || banner.title}
                    className="h-full w-full object-cover"
                    width={800}
                    height={450}
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/30" />

                {/* CTA Button */}
                {banner.ctaLink && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="transform shadow-lg transition-transform hover:scale-105 focus:ring-2 focus:ring-white focus:ring-offset-2"
                        >
                            <Link href={banner.ctaLink} tabIndex={0}>
                                {ctaLabel}
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Type 3: Two images stacked vertically
const Type3Banner = ({ banner }: BannerComponentProps) => {
    const requiredImages = banner.media.slice(0, 2);

    if (requiredImages.length < 2) {
        console.warn(
            `Type 3 banner "${banner.title}" requires 2 images but only has ${requiredImages.length}`
        );
    }

    return (
        <div className="w-full">
            <div className="mb-4 text-center">
                <h2 className="mb-2 text-2xl font-bold">{banner.title}</h2>
                <p className="text-muted-foreground">{banner.description}</p>
            </div>
            <div className="space-y-4">
                {Array(2)
                    .fill(null)
                    .map((_, index) => {
                        const media = requiredImages[index];
                        return (
                            <div
                                key={index}
                                className="aspect-[16/9] overflow-hidden rounded-lg"
                            >
                                <GracefulImage
                                    src={media?.url}
                                    alt={
                                        media?.altText ||
                                        `${banner.title} image ${index + 1}`
                                    }
                                    className="h-full w-full object-cover transition-transform hover:scale-105"
                                    width={800}
                                    height={450}
                                />
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

// Type 4: Single image with Discover More button
const Type4Banner = ({ banner }: BannerComponentProps) => {
    const media = banner.media[0];

    if (!media) {
        console.warn(
            `Type 4 banner "${banner.title}" requires 1 image but has none`
        );
        return null;
    }

    const ctaLabel = banner.ctaLabel || "Discover More";

    return (
        <div className="w-full">
            <div className="mb-4 text-center">
                <h2 className="mb-2 text-2xl font-bold">{banner.title}</h2>
                <p className="text-muted-foreground">{banner.description}</p>
            </div>
            <div className="group relative aspect-[16/9] overflow-hidden rounded-lg">
                <GracefulImage
                    src={media.url}
                    alt={media.altText || banner.title}
                    className="h-full w-full object-cover"
                    width={800}
                    height={450}
                />
                {/* Light overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* CTA Button positioned at bottom left */}
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
            </div>
        </div>
    );
};

// Carousel: Traditional banner carousel (legacy)
const CarouselBanner = ({ banner }: BannerComponentProps) => {
    if (banner.media.length === 0) {
        console.warn(`Carousel banner "${banner.title}" has no images`);
        return null;
    }

    return (
        <div className="w-full">
            <div className="mb-4 text-center">
                <h2 className="mb-2 text-2xl font-bold">{banner.title}</h2>
                <p className="text-muted-foreground">{banner.description}</p>
            </div>
            <div className="space-y-4">
                {banner.media.map((media, index) => (
                    <div
                        key={index}
                        className="aspect-[16/9] overflow-hidden rounded-lg"
                    >
                        <GracefulImage
                            src={media.url}
                            alt={
                                media.altText ||
                                `${banner.title} slide ${index + 1}`
                            }
                            className="h-full w-full object-cover transition-transform hover:scale-105"
                            width={800}
                            height={450}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function PromotionalBannerDisplay({
    banners,
    className,
}: PromotionalBannerDisplayProps) {
    // Filter active banners and sort by order
    const activeBanners = banners
        .filter((banner) => banner.isActive)
        .sort((a, b) => a.order - b.order);

    if (activeBanners.length === 0) {
        return null;
    }

    return (
        <section className={cn("space-y-16 py-8", className)}>
            {activeBanners.map((banner) => {
                // Skip banners with insufficient media for their type
                const requiredMedia =
                    {
                        type1: 3,
                        type2: 1,
                        type3: 2,
                        type4: 1,
                        carousel: 1,
                    }[banner.type] || 1;

                if (banner.media.length < requiredMedia) {
                    console.warn(
                        `Skipping banner "${banner.title}" (type: ${banner.type}) - insufficient media: ${banner.media.length}/${requiredMedia}`
                    );
                    return null;
                }

                return (
                    <div key={banner.id} className="container mx-auto px-4">
                        {(() => {
                            switch (banner.type) {
                                case "type1":
                                    return <Type1Banner banner={banner} />;
                                case "type2":
                                    return <Type2Banner banner={banner} />;
                                case "type3":
                                    return <Type3Banner banner={banner} />;
                                case "type4":
                                    return <Type4Banner banner={banner} />;
                                case "carousel":
                                default:
                                    return <CarouselBanner banner={banner} />;
                            }
                        })()}
                    </div>
                );
            })}
        </section>
    );
}
