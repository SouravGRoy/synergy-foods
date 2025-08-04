"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

const footerLinks = {
    shop: [
        { name: "New Arrivals", href: "/shop?sort=newest" },
        { name: "Best Sellers", href: "/shop?sort=popular" },
        { name: "Sale", href: "/shop?on_sale=true" },
        { name: "Gift Cards", href: "/gift-cards" },
    ],
    company: [
        { name: "About Us", href: "/about" },
        { name: "Our Impact", href: "/impact" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
    ],
    support: [
        { name: "Help Center", href: "/help" },
        { name: "Size Guide", href: "/size-guide" },
        { name: "Shipping Info", href: "/shipping" },
        { name: "Returns", href: "/returns" },
    ],
    legal: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "Sustainability", href: "/sustainability" },
    ],
};

const socialLinks = [
    {
        name: "Twitter",
        href: siteConfig.links?.Twitter || "#",
        icon: Icons.X_Twitter,
    },
    {
        name: "Instagram",
        href: siteConfig.links?.Instagram || "#",
        icon: Icons.Instagram,
    },
    {
        name: "Youtube",
        href: siteConfig.links?.Youtube || "#",
        icon: Icons.Youtube,
    },
    {
        name: "Github",
        href: siteConfig.links?.Github || "#",
        icon: Icons.Github,
    },
];

export function Footer({ className, ...props }: GenericProps) {
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            // Handle newsletter subscription here
            setIsSubscribed(true);
            setEmail("");
            setTimeout(() => setIsSubscribed(false), 3000);
        }
    };

    return (
        <footer className={cn("bg-gray-900 text-white", className)} {...props}>
            {/* Newsletter Section */}
            <div className="border-b border-gray-800">
                <div className="mx-auto px-4 py-12 md:px-8 xl:max-w-[100rem]">
                    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold md:text-3xl">
                                Stay Updated on Sustainable Fashion
                            </h3>
                            <p className="text-gray-300 md:text-lg">
                                Get the latest news on eco-friendly products,
                                sustainability tips, and exclusive offers.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <form
                                onSubmit={handleSubscribe}
                                className="flex gap-3"
                            >
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 border-gray-700 bg-gray-800 text-white placeholder:text-gray-400 focus:border-emerald-500"
                                    required
                                />
                                <Button
                                    type="submit"
                                    className="bg-emerald-600 px-6 hover:bg-emerald-700"
                                >
                                    Subscribe
                                </Button>
                            </form>

                            {isSubscribed && (
                                <p className="text-sm text-emerald-400">
                                    ✓ Thanks for subscribing! Check your email
                                    for confirmation.
                                </p>
                            )}

                            <p className="text-xs text-gray-400">
                                By subscribing, you agree to our Privacy Policy
                                and consent to receive updates from our team.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="mx-auto px-4 py-12 md:px-8 xl:max-w-[100rem]">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6">
                    {/* Brand Section */}
                    <div className="space-y-6 lg:col-span-2">
                        <div className="space-y-4">
                            <Link href="/" className="inline-block">
                                <h2 className="text-2xl font-bold text-white">
                                    {siteConfig.name}
                                </h2>
                            </Link>
                            <p className="leading-relaxed text-gray-300">
                                Discover sustainable fashion that makes a
                                difference. Every purchase supports
                                environmental initiatives and ethical
                                manufacturing.
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold tracking-wide text-gray-200 uppercase">
                                Follow Us
                            </h4>
                            <div className="flex gap-3">
                                {socialLinks.map((social, index) => {
                                    const IconComponent = social.icon;
                                    return (
                                        <Link
                                            key={index}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group rounded-lg bg-gray-800 p-2.5 transition-all duration-200 hover:bg-emerald-600"
                                            aria-label={`Follow us on ${social.name}`}
                                        >
                                            <IconComponent className="size-5 text-gray-300 group-hover:text-white" />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold tracking-wide text-gray-200 uppercase">
                            Shop
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.shop.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-300 transition-colors duration-200 hover:text-emerald-400"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold tracking-wide text-gray-200 uppercase">
                            Company
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-300 transition-colors duration-200 hover:text-emerald-400"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold tracking-wide text-gray-200 uppercase">
                            Support
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-300 transition-colors duration-200 hover:text-emerald-400"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold tracking-wide text-gray-200 uppercase">
                            Legal
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-300 transition-colors duration-200 hover:text-emerald-400"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="mx-auto px-4 py-6 md:px-8 xl:max-w-[100rem]">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="flex flex-col items-center gap-2 text-sm text-gray-400 md:flex-row md:gap-4">
                            <p>
                                © {new Date().getFullYear()} {siteConfig.name}.
                                All rights reserved.
                            </p>
                            <span className="hidden md:inline">•</span>
                            <p>
                                Made with{" "}
                                <Icons.Heart className="inline size-4 text-red-500" />{" "}
                                for a sustainable future
                            </p>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <Icons.Heart className="size-4 text-emerald-500" />
                                <span>Carbon Neutral Shipping</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
