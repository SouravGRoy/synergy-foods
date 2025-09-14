"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { PromotionalBanner } from "@/lib/validations/promotional-banner";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

interface PromotionalBannerPreviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    banner: PromotionalBanner | null;
}

const BANNER_TYPE_LABELS = {
    carousel: "Carousel",
    type1: "Three Images",
    type2: "Large Image",
    type3: "Stacked Images",
    type4: "Single Image",
};

export function PromotionalBannerPreviewDialog({
    open,
    onOpenChange,
    banner,
}: PromotionalBannerPreviewDialogProps) {
    if (!banner) return null;

    const renderBannerPreview = () => {
        switch (banner.type) {
            case "type1":
                return (
                    <div className="grid grid-cols-3 gap-4">
                        {banner.media.slice(0, 3).map((media, index) => (
                            <div key={index} className="aspect-video">
                                <Image
                                    src={media.url}
                                    alt={media.altText || `Image ${index + 1}`}
                                    className="h-full w-full rounded-lg object-cover"
                                    fill
                                />
                            </div>
                        ))}
                    </div>
                );

            case "type2":
                return (
                    <div className="relative">
                        {banner.media[0] && (
                            <div className="relative aspect-video">
                                <Image
                                    fill
                                    src={banner.media[0].url}
                                    alt={
                                        banner.media[0].altText || banner.title
                                    }
                                    className="h-full w-full rounded-lg object-cover"
                                />
                                {banner.ctaLabel && banner.ctaLink && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Button size="lg" className="shadow-lg">
                                            {banner.ctaLabel}
                                            <ExternalLink className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );

            case "type3":
                return (
                    <div className="space-y-4">
                        {banner.media.slice(0, 2).map((media, index) => (
                            <div key={index} className="aspect-video">
                                <Image
                                    fill
                                    src={media.url}
                                    alt={media.altText || `Image ${index + 1}`}
                                    className="h-full w-full rounded-lg object-cover"
                                />
                            </div>
                        ))}
                    </div>
                );

            case "type4":
                return (
                    <div className="relative">
                        {banner.media[0] && (
                            <div className="relative aspect-video">
                                <Image
                                    fill
                                    src={banner.media[0].url}
                                    alt={
                                        banner.media[0].altText || banner.title
                                    }
                                    className="h-full w-full rounded-lg object-cover"
                                />
                                {banner.ctaLabel && banner.ctaLink && (
                                    <div className="absolute bottom-4 left-4">
                                        <Button
                                            variant="secondary"
                                            className="shadow-lg"
                                        >
                                            {banner.ctaLabel}
                                            <ExternalLink className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );

            case "carousel":
            default:
                return (
                    <div className="space-y-4">
                        {banner.media.map((media, index) => (
                            <div key={index} className="aspect-video">
                                <Image
                                    fill
                                    src={media.url}
                                    alt={media.altText || `Slide ${index + 1}`}
                                    className="h-full w-full rounded-lg object-cover"
                                />
                            </div>
                        ))}
                    </div>
                );
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {banner.title}
                        <Badge variant="outline">
                            {BANNER_TYPE_LABELS[banner.type] || banner.type}
                        </Badge>
                        <Badge
                            variant={banner.isActive ? "default" : "secondary"}
                        >
                            {banner.isActive ? "Active" : "Inactive"}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Banner Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium">Location:</span>{" "}
                            {banner.location}
                        </div>
                        <div>
                            <span className="font-medium">Order:</span>{" "}
                            {banner.order}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h4 className="mb-2 font-medium">Description</h4>
                        <p className="text-muted-foreground">
                            {banner.description}
                        </p>
                    </div>

                    {/* CTA Info */}
                    {(banner.ctaLabel || banner.ctaLink) && (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {banner.ctaLabel && (
                                <div>
                                    <span className="font-medium">
                                        CTA Label:
                                    </span>{" "}
                                    {banner.ctaLabel}
                                </div>
                            )}
                            {banner.ctaLink && (
                                <div>
                                    <span className="font-medium">
                                        CTA Link:
                                    </span>{" "}
                                    <a
                                        href={banner.ctaLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="break-all text-blue-600 hover:underline"
                                    >
                                        {banner.ctaLink}
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Visual Preview */}
                    <div>
                        <h4 className="mb-4 font-medium">Visual Preview</h4>
                        <div className="rounded-lg border bg-gray-50 p-4">
                            {renderBannerPreview()}
                        </div>
                    </div>

                    {/* Media Details */}
                    <div>
                        <h4 className="mb-4 font-medium">Media Details</h4>
                        <div className="space-y-2">
                            {banner.media.map((media, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 rounded border p-2"
                                >
                                    <Image
                                        fill
                                        src={media.url}
                                        alt={
                                            media.altText ||
                                            `Image ${index + 1}`
                                        }
                                        className="h-16 w-16 rounded object-cover"
                                    />
                                    <div className="flex-1">
                                        <div className="font-medium">
                                            Image {index + 1}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Alt Text:{" "}
                                            {media.altText || "Not provided"}
                                        </div>
                                        <div className="text-xs break-all text-muted-foreground">
                                            URL: {media.url}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
