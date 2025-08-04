"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Icons } from "../icons";

const testimonials = [
    {
        name: "Sarah Chen",
        role: "Environmental Activist",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b9f44008?w=80&h=80&fit=crop&crop=face",
        content:
            "Finally, a platform where I can shop with a clear conscience. The transparency about each product&apos;s journey is incredible!",
        rating: 5,
    },
    {
        name: "Marcus Rodriguez",
        role: "Sustainable Living Blogger",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
        content:
            "The quality is outstanding and knowing the environmental impact of my purchases helps me make better choices.",
        rating: 5,
    },
    {
        name: "Emma Thompson",
        role: "Fashion Designer",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
        content:
            "This marketplace has revolutionized how I think about fashion. Every piece tells a story of sustainability.",
        rating: 5,
    },
];

const stats = [
    {
        value: "50K+",
        label: "Happy Customers",
        description: "Customers choosing sustainable fashion",
    },
    {
        value: "100%",
        label: "Eco-Certified",
        description: "Products verified for sustainability",
    },
    {
        value: "25K+",
        label: "Trees Planted",
        description: "Through our environmental initiatives",
    },
    {
        value: "95%",
        label: "Customer Satisfaction",
        description: "Based on verified reviews",
    },
];

export function Testimonials({ className, ...props }: GenericProps) {
    return (
        <section className={cn("py-16 md:py-24", className)} {...props}>
            {/* Stats Section */}
            <div className="mb-20">
                <div className="mb-12 space-y-6 text-center">
                    <h2 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                        Trusted by Thousands
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Join a community that values quality, sustainability,
                        and positive impact.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="group space-y-2 text-center"
                        >
                            <div className="text-3xl font-bold text-emerald-600 transition-transform duration-300 group-hover:scale-110 md:text-4xl lg:text-5xl">
                                {stat.value}
                            </div>
                            <div className="text-lg font-semibold text-foreground">
                                {stat.label}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {stat.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="space-y-12">
                <div className="space-y-6 text-center">
                    <h3 className="text-2xl font-bold text-foreground md:text-3xl">
                        What Our Customers Say
                    </h3>
                    <p className="mx-auto max-w-xl text-muted-foreground">
                        Real stories from people who&apos;ve made the switch to
                        sustainable fashion.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                        >
                            {/* Background gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                            <div className="relative space-y-6">
                                {/* Rating Stars */}
                                <div className="flex items-center space-x-1">
                                    {[...Array(testimonial.rating)].map(
                                        (_, i) => (
                                            <Icons.Heart
                                                key={i}
                                                className="size-5 fill-yellow-400 text-yellow-400"
                                            />
                                        )
                                    )}
                                </div>

                                {/* Testimonial Content */}
                                <blockquote className="leading-relaxed text-gray-700">
                                    &quot;{testimonial.content}&quot;
                                </blockquote>

                                {/* Author */}
                                <div className="flex items-center space-x-4">
                                    <div className="relative size-12 overflow-hidden rounded-full ring-2 ring-emerald-100 transition-all duration-300 group-hover:ring-emerald-200">
                                        <Image
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-foreground">
                                            {testimonial.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {testimonial.role}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quote icon */}
                            <div className="absolute top-6 right-6 opacity-10 transition-opacity duration-300 group-hover:opacity-20">
                                <svg
                                    className="size-8 text-emerald-600"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to action */}
                <div className="pt-8 text-center">
                    <p className="mb-4 text-muted-foreground">
                        Ready to join thousands of satisfied customers?
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <button className="inline-flex items-center rounded-lg border border-emerald-600 px-6 py-3 text-sm font-medium text-emerald-600 transition-colors duration-200 hover:bg-emerald-50">
                            Read All Reviews
                            <Icons.ChevronRight className="ml-2 size-4" />
                        </button>
                        <button className="inline-flex items-center rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-emerald-700">
                            Start Shopping
                            <Icons.Heart className="ml-2 size-4" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
