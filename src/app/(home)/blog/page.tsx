"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Bookmark,
    Calendar,
    Clock,
    Flame,
    Search,
    Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ------------------------
// Mock data (replace with your CMS / DB)
// ------------------------
const categories = [
    "All",
    "Sustainability",
    "Recipes",
    "Supply Chain",
    "Market Trends",
    "Farming",
    "Nutrition",
];

const posts = [
    {
        id: "featured",
        title: "How Cold-Chain Logistics Keeps Produce Fresher for Longer",
        excerpt:
            "We break down modern cold-chain workflows and the exact checkpoints that matter for freshness, safety, and margins.",
        cover: "https://images.unsplash.com/photo-1493236272120-200db0da1927?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        date: "2025-08-17",
        readTime: 6,
        category: "Supply Chain",
        author: {
            name: " Alex Carter",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
    },
    {
        id: "1",
        title: "7 Seasonal Superfoods You Can Source Right Now",
        excerpt:
            "From berries to leafy greens: where to buy, how to store, and quick ways to use them.",
        cover: "https://images.unsplash.com/photo-1605655293168-0235eac3f255?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        date: "2025-08-12",
        readTime: 4,
        category: "Nutrition",
        author: {
            name: "Maya Singh",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
    },
    {
        id: "2",
        title: "Inside a Zero‑Waste Packhouse: A Practical Tour",
        excerpt:
            "We visited a facility that turns organic waste into value. Here’s what the data says.",
        cover: "https://images.unsplash.com/photo-1608663003523-ec3d747161ca?q=80&w=654&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        date: "2025-08-09",
        readTime: 5,
        category: "Sustainability",
        author: {
            name: "Kabir Shah",
            avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2662&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
    },
    {
        id: "3",
        title: "Quick Meal Prep with Frozen Veg—Without Losing Nutrients",
        excerpt:
            "Freezing isn’t the enemy. Learn which cuts and techniques keep texture and flavor.",
        cover: "https://plus.unsplash.com/premium_photo-1723987767064-f8ccdc01f83e?q=80&w=1708&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        date: "2025-08-03",
        readTime: 3,
        category: "Recipes",
        author: {
            name: "Neha Verma",
            avatar: "https://plus.unsplash.com/premium_photo-1673957923985-b814a9dbc03d?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
    },
    {
        id: "4",
        title: "What Retail Buyers Want in 2025: Packaging, Claims, and Pricing",
        excerpt:
            "Survey insights from 120+ buyers on shelf appeal and conversion triggers.",
        cover: "https://images.unsplash.com/photo-1742037770612-2a3c1699c766?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        date: "2025-07-28",
        readTime: 7,
        category: "Market Trends",
        author: {
            name: "Rohan Mehta",
            avatar: "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
    },
    {
        id: "5",
        title: "Regenerative Farming, Explained in 5 Diagrams",
        excerpt:
            "Soil health, biodiversity, and ROI—see the system at a glance.",
        cover: "https://images.unsplash.com/photo-1696850194823-24cf64cb3dad?q=80&w=2831&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        date: "2025-07-24",
        readTime: 5,
        category: "Farming",
        author: {
            name: "Isha Kapoor",
            avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
    },
    {
        id: "6",
        title: "A Trader’s Guide to Hedging Price Volatility",
        excerpt:
            "Risk isn’t the enemy—uncertainty is. Here’s how pros plan around it.",
        cover: "https://images.unsplash.com/photo-1643962579365-3a9222e923b8?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        date: "2025-07-19",
        readTime: 8,
        category: "Market Trends",
        author: {
            name: "Sameer Rao",
            avatar: "https://plus.unsplash.com/premium_photo-1669703777437-27602d656c27?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
    },
];

function formatDate(input: string) {
    try {
        return new Date(input).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
        });
    } catch {
        return input;
    }
}

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white">
            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-emerald-200/50 blur-3xl" />
                <div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-emerald-300/30 blur-3xl" />

                <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 md:pt-24">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge className="mb-4 bg-emerald-600/90">Blog</Badge>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                            Fresh Ideas for Food & Trade
                        </h1>
                        <p className="mt-4 text-base text-gray-600 sm:text-lg">
                            Stories, playbooks, and research from our team and
                            partners across farming, logistics, and nutrition.
                        </p>

                        {/* Search bar */}
                        <div className="mt-6 flex w-full items-center justify-center">
                            <div className="flex w-full max-w-xl items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
                                <Search className="ml-2 size-5 opacity-70" />
                                <Input
                                    placeholder="Search articles, topics, or authors…"
                                    className="border-0 focus-visible:ring-0"
                                />
                                <Button
                                    className="rounded-xl"
                                    variant="default"
                                >
                                    Search
                                </Button>
                            </div>
                        </div>

                        {/* Category pills */}
                        <div className="mt-6 overflow-x-auto">
                            <div className="flex items-center justify-center gap-2 px-1 whitespace-nowrap">
                                {categories.map((c) => (
                                    <Button
                                        key={c}
                                        variant="secondary"
                                        className="rounded-full bg-white/70 backdrop-blur hover:bg-white"
                                    >
                                        {c}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured + Grid */}
            <section className="mx-auto max-w-7xl px-4 pb-24">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Featured */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-2"
                    >
                        <Card className="overflow-hidden border-0 shadow-xl">
                            <div className="relative aspect-[16/9] w-full">
                                <Image
                                    src={posts[0].cover}
                                    alt={posts[0].title}
                                    fill
                                    priority
                                    className="object-cover"
                                />
                                <div className="absolute top-4 left-4 flex items-center gap-2">
                                    <Badge className="bg-emerald-600/90">
                                        {posts[0].category}
                                    </Badge>
                                    <Badge
                                        variant="secondary"
                                        className="backdrop-blur"
                                    >
                                        <Flame className="mr-1 size-3.5" />{" "}
                                        Featured
                                    </Badge>
                                </div>
                            </div>

                            <CardHeader className="space-y-3">
                                <Link
                                    href="/blog"
                                    className="group inline-block"
                                >
                                    <h2 className="text-2xl leading-tight font-semibold text-gray-900 md:text-3xl">
                                        {posts[0].title}
                                    </h2>
                                    <span className="mt-1 inline-flex items-center text-sm text-emerald-700 group-hover:underline">
                                        Read the deep‑dive{" "}
                                        <ArrowRight className="ml-1 size-4" />
                                    </span>
                                </Link>
                                <p className="text-gray-600">
                                    {posts[0].excerpt}
                                </p>
                            </CardHeader>

                            <CardFooter className="flex items-center justify-between border-t bg-gray-50/60">
                                <AuthorRow
                                    author={posts[0].author}
                                    date={posts[0].date}
                                    read={posts[0].readTime}
                                />
                                <Button
                                    asChild
                                    variant="outline"
                                    className="rounded-xl"
                                >
                                    <Link href="/blog">Continue Reading</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>

                    {/* Sidebar / Popular */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Popular Reads
                        </h3>
                        <div className="space-y-4">
                            {posts.slice(1, 4).map((p) => (
                                <Link key={p.id} href="/blog" className="group">
                                    <Card className="overflow-hidden transition-shadow hover:shadow-md">
                                        <div className="flex items-center gap-4 p-3">
                                            <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl">
                                                <Image
                                                    src={p.cover}
                                                    alt={p.title}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-105"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <Badge
                                                    variant="secondary"
                                                    className="mb-1"
                                                >
                                                    {p.category}
                                                </Badge>
                                                <h4 className="truncate text-sm font-semibold text-gray-900">
                                                    {p.title}
                                                </h4>
                                                <Meta
                                                    date={p.date}
                                                    read={p.readTime}
                                                    compact
                                                />
                                            </div>
                                            <Bookmark className="ml-auto hidden size-4 opacity-40 group-hover:opacity-70 sm:block" />
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        {/* Newsletter / CTA */}
                        <Card className="border-0 bg-emerald-600/95 text-white">
                            <CardHeader>
                                <h4 className="text-lg font-semibold">
                                    Get new posts first
                                </h4>
                                <p className="text-sm text-emerald-50/90">
                                    Join our newsletter for weekly insights and
                                    market notes.
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="your@email.com"
                                        className="bg-white text-gray-900 placeholder:text-gray-500"
                                    />
                                    <Button
                                        variant="secondary"
                                        className="whitespace-nowrap"
                                    >
                                        Subscribe
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Posts Grid */}
                <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
                    {posts.slice(1).map((p, i) => (
                        <motion.article
                            key={p.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: i * 0.06 }}
                        >
                            <Card className="group overflow-hidden border-0 shadow hover:shadow-lg">
                                <div className="relative aspect-[16/10] w-full">
                                    <Image
                                        src={p.cover}
                                        alt={p.title}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                    <Badge className="absolute top-3 left-3 bg-white/90 text-gray-900 backdrop-blur">
                                        <Tag className="mr-1 size-3.5" />{" "}
                                        {p.category}
                                    </Badge>
                                </div>
                                <CardHeader className="space-y-2">
                                    <Link
                                        href="/blog"
                                        className="group inline-block"
                                    >
                                        <h3 className="line-clamp-2 text-xl font-semibold text-gray-900 group-hover:underline">
                                            {p.title}
                                        </h3>
                                    </Link>
                                    <p className="line-clamp-2 text-gray-600">
                                        {p.excerpt}
                                    </p>
                                </CardHeader>
                                <CardFooter className="flex items-center justify-between border-t bg-gray-50/60">
                                    <AuthorRow
                                        author={p.author}
                                        date={p.date}
                                        read={p.readTime}
                                    />
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="rounded-xl"
                                    >
                                        <Link href="/blog">
                                            Read{" "}
                                            <ArrowRight className="ml-1 size-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.article>
                    ))}
                </div>
            </section>

            {/* Footer tease */}
            <section className="border-t bg-gray-50/60">
                <div className="mx-auto max-w-7xl px-4 py-12 text-center">
                    <p className="text-sm text-gray-500">
                        Psst… looking for something specific? Try the search bar
                        above or explore categories.
                    </p>
                </div>
            </section>
        </main>
    );
}

function AuthorRow({
    author,
    date,
    read,
}: {
    author: { name: string; avatar?: string };
    date: string;
    read: number;
}) {
    return (
        <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
                <div className="font-medium text-gray-900">{author.name}</div>
                <Meta date={date} read={read} />
            </div>
        </div>
    );
}

function Meta({
    date,
    read,
    compact = false,
}: {
    date: string;
    read: number;
    compact?: boolean;
}) {
    return (
        <div
            className={`mt-0.5 flex items-center gap-3 text-gray-500 ${compact ? "text-xs" : "text-sm"}`}
        >
            <span className="inline-flex items-center">
                <Calendar className="mr-1 size-3.5" /> {formatDate(date)}
            </span>
            <span className="inline-flex items-center">
                <Clock className="mr-1 size-3.5" /> {read} min read
            </span>
        </div>
    );
}

function getInitials(name: string) {
    const parts = name.split(" ").filter(Boolean);
    const first = parts[0]?.[0] ?? "?";
    const last = parts[1]?.[0] ?? "";
    return (first + last).toUpperCase();
}
