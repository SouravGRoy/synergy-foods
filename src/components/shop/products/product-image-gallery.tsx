"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getImageUrl } from "@/lib/utils";
import { placeholderImage } from "@/lib/utils/image-placeholder";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductImageGalleryProps {
    images: string[];
    productName: string;
}

export function ProductImageGallery({
    images,
    productName,
}: ProductImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    // Default to placeholder if no images
    const displayImages = images.length > 0 ? images : [placeholderImage];

    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % displayImages.length);
    };

    const prevImage = () => {
        setSelectedImage(
            (prev) => (prev - 1 + displayImages.length) % displayImages.length
        );
    };

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                <Image
                    src={getImageUrl(displayImages[selectedImage])}
                    alt={`${productName} - Image ${selectedImage + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                />

                {/* Navigation arrows for multiple images */}
                {displayImages.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white"
                            onClick={prevImage}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white"
                            onClick={nextImage}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </>
                )}

                {/* Zoom button */}
                <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 bottom-2 bg-white/80 hover:bg-white"
                        >
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl p-0">
                        <div className="relative aspect-square">
                            <Image
                                height={800}
                                width={800}
                                src={getImageUrl(displayImages[selectedImage])}
                                alt={`${productName} - Image ${selectedImage + 1}`}
                                fill
                                className="object-contain"
                                sizes="90vw"
                            />
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Image counter */}
                {displayImages.length > 1 && (
                    <div className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-xs text-white">
                        {selectedImage + 1} / {displayImages.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Images */}
            {displayImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {displayImages.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                                index === selectedImage
                                    ? "border-primary"
                                    : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                            <Image
                                src={getImageUrl(image)}
                                alt={`${productName} - Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
