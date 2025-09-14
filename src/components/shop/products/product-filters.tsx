"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Price } from "@/components/ui/price";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { formatPriceTag } from "@/lib/utils";
import { Category, Subcategory } from "@/types";
import { useState } from "react";

interface ProductFiltersProps {
    categories: Category[];
    subcategories: Subcategory[];
    filters: {
        search: string;
        categoryId?: string;
        subcategoryId?: string;
        minPrice?: number;
        maxPrice?: number;
        inStock?: boolean;
        sortBy: "name" | "price_asc" | "price_desc" | "newest" | "popularity";
    };
    onFiltersChange: (filters: any) => void;
    onClearFilters: () => void;
}

const SORT_OPTIONS = [
    { value: "popularity", label: "Most Popular" },
    { value: "newest", label: "Newest First" },
    { value: "name", label: "Name (A-Z)" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
];

const priceRanges = [
    { min: 0, max: 25, label: "Under AED 25" },
    { min: 25, max: 50, label: "AED 25 - AED 50" },
    { min: 50, max: 100, label: "AED 50 - AED 100" },
    { min: 100, max: 200, label: "AED 100 - AED 200" },
    { min: 200, max: 500, label: "AED 200 - AED 500" },
    { min: 500, max: null, label: "AED 500+" },
];

export function ProductFilters({
    categories,
    subcategories,
    filters,
    onFiltersChange,
    onClearFilters,
}: ProductFiltersProps) {
    const [priceRange, setPriceRange] = useState([
        filters.minPrice || 0,
        filters.maxPrice || 500,
    ]);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const selectedCategory = categories.find(
        (cat) => cat.id === filters.categoryId
    );
    const availableSubcategories = subcategories.filter(
        (sub) => !filters.categoryId || sub.categoryId === filters.categoryId
    );

    const handlePriceRangeChange = (newRange: number[]) => {
        setPriceRange(newRange);
    };

    const handlePriceRangeCommit = (newRange: number[]) => {
        onFiltersChange({
            ...filters,
            minPrice: newRange[0] > 0 ? newRange[0] : undefined,
            maxPrice: newRange[1] < 500 ? newRange[1] : undefined,
        });
    };

    const handleCategoryChange = (categoryId: string | null) => {
        onFiltersChange({
            ...filters,
            categoryId: categoryId || undefined,
            subcategoryId: undefined, // Reset subcategory when category changes
        });
    };

    const handleQuickPriceRange = (min: number, max: number | null) => {
        const newFilters = {
            ...filters,
            minPrice: min > 0 ? min : undefined,
            maxPrice: max || undefined,
        };
        setPriceRange([min, max || 500]);
        onFiltersChange(newFilters);
    };

    const hasActiveFilters = !!(
        filters.search ||
        filters.categoryId ||
        filters.subcategoryId ||
        filters.minPrice ||
        filters.maxPrice ||
        filters.inStock
    );

    return (
        <Card className="h-fit">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Filters</CardTitle>
                    <div className="flex items-center gap-2">
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClearFilters}
                                className="text-xs"
                            >
                                Clear All
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="md:hidden"
                        >
                            {isCollapsed ? (
                                <Icons.ChevronDown className="h-4 w-4" />
                            ) : (
                                <Icons.ChevronRight className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent
                className={`space-y-6 ${isCollapsed ? "hidden md:block" : ""}`}
            >
                {/* Search */}
                <div className="space-y-2">
                    <Label htmlFor="search">Search Products</Label>
                    <div className="relative">
                        <Icons.Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="search"
                            placeholder="Search products, brands, or categories..."
                            value={filters.search}
                            onChange={(e) =>
                                onFiltersChange({
                                    ...filters,
                                    search: e.target.value,
                                })
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Escape") {
                                    onFiltersChange({
                                        ...filters,
                                        search: "",
                                    });
                                }
                            }}
                            className="pr-8 pl-10"
                            autoComplete="off"
                        />
                        {filters.search && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 p-0 hover:bg-transparent"
                                onClick={() =>
                                    onFiltersChange({
                                        ...filters,
                                        search: "",
                                    })
                                }
                                title="Clear search"
                            >
                                <Icons.Minus className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                    {filters.search && (
                        <p className="text-xs text-muted-foreground">
                            Searching for &quot;{filters.search}&quot; • Press
                            Esc to clear
                        </p>
                    )}
                </div>

                <Separator />

                {/* Sort By */}
                <div className="space-y-3">
                    <Label>Sort By</Label>
                    <RadioGroup
                        value={filters.sortBy}
                        onValueChange={(value) =>
                            onFiltersChange({
                                ...filters,
                                sortBy: value as any,
                            })
                        }
                    >
                        {SORT_OPTIONS.map((option) => (
                            <div
                                key={option.value}
                                className="flex items-center space-x-2"
                            >
                                <RadioGroupItem
                                    value={option.value}
                                    id={option.value}
                                />
                                <Label
                                    htmlFor={option.value}
                                    className="text-sm"
                                >
                                    {option.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <Separator />

                {/* Categories */}
                <div className="space-y-3">
                    <Label>Categories</Label>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="all-categories"
                                checked={!filters.categoryId}
                                onCheckedChange={() =>
                                    handleCategoryChange(null)
                                }
                            />
                            <Label htmlFor="all-categories" className="text-sm">
                                All Categories
                            </Label>
                        </div>
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="flex items-center space-x-2"
                            >
                                <Checkbox
                                    id={category.id}
                                    checked={filters.categoryId === category.id}
                                    onCheckedChange={() =>
                                        handleCategoryChange(
                                            filters.categoryId === category.id
                                                ? null
                                                : category.id
                                        )
                                    }
                                />
                                <Label
                                    htmlFor={category.id}
                                    className="text-sm"
                                >
                                    {category.name}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Subcategories */}
                {selectedCategory && availableSubcategories.length > 0 && (
                    <>
                        <Separator />
                        <div className="space-y-3">
                            <Label>Subcategories</Label>
                            <div className="space-y-2">
                                {availableSubcategories.map((subcategory) => (
                                    <div
                                        key={subcategory.id}
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            id={subcategory.id}
                                            checked={
                                                filters.subcategoryId ===
                                                subcategory.id
                                            }
                                            onCheckedChange={() =>
                                                onFiltersChange({
                                                    ...filters,
                                                    subcategoryId:
                                                        filters.subcategoryId ===
                                                        subcategory.id
                                                            ? undefined
                                                            : subcategory.id,
                                                })
                                            }
                                        />
                                        <Label
                                            htmlFor={subcategory.id}
                                            className="text-sm"
                                        >
                                            {subcategory.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                <Separator />

                {/* Price Range */}
                <div className="space-y-4">
                    <Label>Price Range</Label>

                    {/* Quick Price Ranges */}
                    <div className="space-y-2">
                        {priceRanges.map((range, index) => (
                            <Button
                                key={index}
                                variant={
                                    filters.minPrice === range.min &&
                                    filters.maxPrice === range.max
                                        ? "default"
                                        : "ghost"
                                }
                                size="sm"
                                className="w-full justify-start text-xs"
                                onClick={() =>
                                    handleQuickPriceRange(range.min, range.max)
                                }
                            >
                                {range.label}
                            </Button>
                        ))}
                    </div>

                    {/* Custom Price Range Slider */}
                    <div className="space-y-3">
                        <div className="px-2">
                            <Slider
                                value={priceRange}
                                onValueChange={handlePriceRangeChange}
                                onValueCommit={handlePriceRangeCommit}
                                max={500}
                                min={0}
                                step={500}
                                className="w-full"
                            />
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <Price value={priceRange[0]} className="text-sm" />
                            <Price value={priceRange[1]} className="text-sm" />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Stock Status */}
                <div className="space-y-3">
                    <Label>Availability</Label>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="in-stock"
                            checked={filters.inStock || false}
                            onCheckedChange={(checked) =>
                                onFiltersChange({
                                    ...filters,
                                    inStock: checked || undefined,
                                })
                            }
                        />
                        <Label htmlFor="in-stock" className="text-sm">
                            In Stock Only
                        </Label>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
