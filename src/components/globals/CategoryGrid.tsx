"use client";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CachedCategory } from "@/lib/validations";
import Image from "next/image";
import Link from "next/link";

interface CategoryGridProps {
    categories: CachedCategory[];
    className?: string;
}

export function CategoryGrid({ categories, className }: CategoryGridProps) {
    if (categories.length === 0) {
        return (
            <div className="py-8 text-center">
                <p className="text-muted-foreground">No categories available</p>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                className
            )}
        >
            {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
            ))}
        </div>
    );
}

interface CategoryCardProps {
    category: CachedCategory;
}

function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Link href={`/shop/categories/${category.slug}`}>
            <Card className="group cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg">
                {category.imageUrl && (
                    <div className="relative aspect-video overflow-hidden rounded-t-lg">
                        <Image
                            height={400}
                            width={800}
                            src={category.imageUrl}
                            alt={category.name}
                            fill
                            className="object-cover transition-transform duration-200 group-hover:scale-110"
                        />
                    </div>
                )}
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="line-clamp-1 text-lg font-semibold">
                            {category.name}
                        </CardTitle>
                        {category.subcategories > 0 && (
                            <Badge variant="secondary" className="text-xs">
                                {category.subcategories} subcategories
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {category.description && (
                        <CardDescription className="line-clamp-2 text-sm">
                            {category.description}
                        </CardDescription>
                    )}
                    {category.commissionRate && category.commissionRate > 0 && (
                        <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                                {(category.commissionRate / 100).toFixed(1)}%
                                commission
                            </Badge>
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}
