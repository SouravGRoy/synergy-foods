"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Banner } from "@/lib/validations";
import { formatDate } from "date-fns";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

// Create a simple date formatter
const formatBannerDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

interface BannerPreviewDialogProps {
    banner: Banner;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const LOCATION_OPTIONS = [
    { value: "homepage", label: "Homepage" },
    { value: "category", label: "Category Pages" },
    { value: "product", label: "Product Pages" },
    { value: "shop", label: "Shop Page" },
    { value: "search", label: "Search Results" },
    { value: "cart", label: "Cart Page" },
    { value: "checkout", label: "Checkout Page" },
    { value: "custom", label: "Custom Location" },
];

export function BannerPreviewDialog({
    banner,
    open,
    onOpenChange,
}: BannerPreviewDialogProps) {
    const locationLabel =
        LOCATION_OPTIONS.find((opt) => opt.value === banner.location)?.label ||
        banner.location;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Banner Preview</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Banner Image */}
                    <div className="relative h-64 w-full overflow-hidden rounded-lg bg-gray-100 md:h-80">
                        <Image
                            src={banner.imageUrl}
                            alt={banner.title}
                            fill
                            className="object-cover"
                        />

                        {/* Banner Content Overlay */}
                        <div className="bg-opacity-40 absolute inset-0 flex items-center justify-center bg-black">
                            <div className="max-w-2xl p-6 text-center text-white">
                                <h1 className="mb-2 text-2xl font-bold md:text-4xl">
                                    {banner.title}
                                </h1>
                                <p className="mb-4 text-lg md:text-xl">
                                    {banner.description}
                                </p>
                                {banner.url && (
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        className="bg-white text-black hover:bg-gray-100"
                                        onClick={() =>
                                            window.open(
                                                banner.url ?? "",
                                                "_blank"
                                            )
                                        }
                                    >
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Visit Link
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Banner Details */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
                                    Title
                                </h3>
                                <p className="text-lg font-medium">
                                    {banner.title}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
                                    Description
                                </h3>
                                <p className="text-gray-700">
                                    {banner.description}
                                </p>
                            </div>

                            {banner.url && (
                                <div>
                                    <h3 className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
                                        Link URL
                                    </h3>
                                    <a
                                        href={banner.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="break-all text-blue-600 underline hover:text-blue-800"
                                    >
                                        {banner.url}
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
                                    Location
                                </h3>
                                <Badge variant="secondary" className="mt-1">
                                    {locationLabel}
                                </Badge>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
                                    Created
                                </h3>
                                <p className="text-gray-700">
                                    {formatBannerDate(banner.createdAt)}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
                                    Last Updated
                                </h3>
                                <p className="text-gray-700">
                                    {formatBannerDate(banner.updatedAt)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
