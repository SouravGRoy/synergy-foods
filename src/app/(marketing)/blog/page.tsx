import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Blog & News",
    description: "Latest updates, news, and insights from Synergy Foods",
};

const blogPosts = [
    {
        id: 1,
        title: "The Benefits of Organic Food: Why It Matters",
        excerpt:
            "Discover the health and environmental benefits of choosing organic products for your family and business.",
        date: "2026-01-25",
        readTime: "5 min read",
        category: "Health & Wellness",
        image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80",
    },
    {
        id: 2,
        title: "Understanding Food Safety Standards in Global Trade",
        excerpt:
            "Learn about international food safety certifications and how they ensure quality in the supply chain.",
        date: "2026-01-20",
        readTime: "7 min read",
        category: "Food Safety",
        image: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=80",
    },
    {
        id: 3,
        title: "Seasonal Produce Guide: What to Buy This Month",
        excerpt:
            "Maximize freshness and flavor with our guide to seasonal fruits and vegetables available now.",
        date: "2026-01-15",
        readTime: "4 min read",
        category: "Seasonal Guide",
        image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80",
    },
    {
        id: 4,
        title: "Sustainable Sourcing: Our Commitment to the Planet",
        excerpt:
            "How we work with farmers and suppliers to ensure environmentally responsible food production.",
        date: "2026-01-10",
        readTime: "6 min read",
        category: "Sustainability",
        image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
    },
    {
        id: 5,
        title: "Rice Varieties Explained: A Complete Guide",
        excerpt:
            "From Basmati to Jasmine, learn about different rice types and their culinary uses.",
        date: "2026-01-05",
        readTime: "8 min read",
        category: "Product Guide",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
    },
    {
        id: 6,
        title: "Wholesale Buying Tips for Restaurant Owners",
        excerpt:
            "Essential strategies for purchasing quality ingredients in bulk while managing costs.",
        date: "2025-12-28",
        readTime: "5 min read",
        category: "Business Tips",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    },
];

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
                <div className="space-y-12">
                    {/* Header */}
                    <div className="space-y-4 text-center">
                        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                            Blog & News
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                            Stay informed with the latest insights, tips, and
                            updates from the world of food trading and quality
                            products.
                        </p>
                    </div>

                    {/* Featured Post */}
                    <div className="relative overflow-hidden rounded-lg border bg-card shadow-lg">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="relative h-64 lg:h-auto">
                                <Image
                                    src={blogPosts[0].image}
                                    alt={blogPosts[0].title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col justify-center space-y-4 p-6 lg:p-8">
                                <div className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                    Featured
                                </div>
                                <h2 className="text-3xl font-bold">
                                    {blogPosts[0].title}
                                </h2>
                                <p className="text-muted-foreground">
                                    {blogPosts[0].excerpt}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(
                                            blogPosts[0].date
                                        ).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {blogPosts[0].readTime}
                                    </div>
                                </div>
                                <Button className="w-fit">Read Article</Button>
                            </div>
                        </div>
                    </div>

                    {/* Blog Grid */}
                    <div>
                        <h2 className="mb-6 text-2xl font-semibold">
                            Recent Articles
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {blogPosts.slice(1).map((post) => (
                                <article
                                    key={post.id}
                                    className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <div className="relative h-48">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="space-y-3 p-4">
                                        <div className="inline-flex rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                                            {post.category}
                                        </div>
                                        <h3 className="line-clamp-2 text-lg font-semibold group-hover:text-primary">
                                            {post.title}
                                        </h3>
                                        <p className="line-clamp-2 text-sm text-muted-foreground">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(
                                                    post.date
                                                ).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {post.readTime}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    {/* Newsletter CTA */}
                    <div className="rounded-lg border bg-primary/5 p-8 text-center">
                        <h2 className="mb-2 text-2xl font-semibold">
                            Stay Updated
                        </h2>
                        <p className="mb-6 text-muted-foreground">
                            Subscribe to our newsletter for the latest articles,
                            tips, and exclusive offers.
                        </p>
                        <Button size="lg">Subscribe Now</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
