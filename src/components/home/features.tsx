"use client";

import { cn } from "@/lib/utils";
import { Icons } from "../icons";
import { Button } from "../ui/button";

const features = [
    {
        icon: Icons.Heart,
        title: "Sustainable Materials",
        description:
            "Every product is made from eco-friendly, ethically sourced materials that respect our planet.",
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
    },
    {
        icon: Icons.Check,
        title: "Verified Quality",
        description:
            "Each item undergoes rigorous quality checks and comes with detailed authenticity certificates.",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
    },
    {
        icon: Icons.Store,
        title: "Carbon Neutral Shipping",
        description:
            "Free shipping on orders over $50 with carbon-neutral delivery options.",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
    },
    {
        icon: Icons.Upload,
        title: "Circular Economy",
        description:
            "Join our recycling program and get rewards for returning products at end of life.",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
    },
];

export function Features({ className, ...props }: GenericProps) {
    return (
        <section className={cn("py-16 md:py-24", className)} {...props}>
            <div className="mb-16 space-y-6 text-center">
                <h2 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                    Why Choose Sustainable Fashion?
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                    We&apos;re committed to creating a better future through
                    conscious fashion choices. Here&apos;s what makes our
                    approach different.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                {features.map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                        >
                            {/* Background gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                            <div className="relative space-y-4">
                                {/* Icon */}
                                <div
                                    className={cn(
                                        "inline-flex rounded-xl p-3 transition-all duration-300 group-hover:scale-110",
                                        feature.bgColor
                                    )}
                                >
                                    <IconComponent
                                        className={cn("size-6", feature.color)}
                                    />
                                </div>

                                {/* Content */}
                                <div className="space-y-3">
                                    <h3 className="text-xl font-semibold text-foreground transition-colors group-hover:text-gray-900">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Learn more link */}
                                <div className="pt-2">
                                    <button
                                        className={cn(
                                            "text-sm font-medium transition-all duration-200 hover:underline",
                                            feature.color
                                        )}
                                    >
                                        Learn More →
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Call to action */}
            <div className="mt-16 text-center">
                <Button
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700"
                >
                    Explore Our Impact
                    <Icons.ChevronRight className="ml-2 size-4" />
                </Button>
            </div>
        </section>
    );
}
