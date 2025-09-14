"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

const logos = [
    { src: "/images/1-manufactures.jpg", alt: "Eco Friendly" },
    { src: "/images/2-manufactures.jpg", alt: "Eat Healthy" },
    { src: "/images/3-manufactures.jpg", alt: "100% Natural" },
    { src: "/images/4-manufactures.jpg", alt: "Organic" },
    { src: "/images/5-manufactures.jpg", alt: "Eat Healthy Again" },
    { src: "/images/6-manufactures.jpg", alt: "Eat Healthy Again" },
];

export default function ShowCase() {
    return (
        <div className="mb-8 w-full sm:mb-12">
            {/* Mobile Carousel */}
            <div className="block sm:hidden">
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    plugins={[
                        Autoplay({
                            delay: 2000,
                        }),
                    ]}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2">
                        {logos.map((logo, index) => (
                            <CarouselItem
                                key={index}
                                className="basis-1/3 pl-2"
                            >
                                <div className="flex items-center justify-center p-2">
                                    <div className="transform transition-all duration-300 ease-in-out hover:scale-110">
                                        <Image
                                            src={logo.src}
                                            alt={logo.alt}
                                            width={120}
                                            height={100}
                                            className="h-20 w-24 object-contain grayscale transition-all duration-500 ease-in-out hover:brightness-0"
                                        />
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>

            {/* Desktop Grid */}
            <div className="hidden w-full flex-wrap items-center justify-center gap-8 px-4 sm:flex md:gap-12 lg:gap-16">
                {logos.map((logo, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 scale-90 transform transition-all duration-300 ease-in-out hover:scale-110"
                    >
                        <Image
                            src={logo.src}
                            alt={logo.alt}
                            width={180}
                            height={150}
                            className="h-24 w-32 object-contain grayscale transition-all duration-500 ease-in-out hover:brightness-0 md:h-32 md:w-40 lg:h-36 lg:w-44"
                            sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 176px"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
