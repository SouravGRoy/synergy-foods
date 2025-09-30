"use client";

import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// Inline debounce hook to avoid import issues
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

// Mock search function - replace with your actual API call
const searchProducts = async (query: string) => {
    // Replace with your actual API endpoint
    try {
        const response = await fetch(
            `/api/products/search?q=${encodeURIComponent(query)}`
        );
        if (!response.ok) throw new Error("Search failed");
        return await response.json();
    } catch (error) {
        console.error("Search error:", error);
        return { products: [] };
    }
};

interface SearchResult {
    id: string;
    name: string;
    slug: string;
    price: number;
    description?: string;
    category?: {
        name: string;
        slug: string;
    };
    subcategory?: {
        name: string;
        slug: string;
    };
    mediaItems?: Array<{
        url: string;
        alt?: string;
    }>;
}

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const router = useRouter();

    const debouncedQuery = useDebounce(query, 300);

    const handleSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        setIsLoading(true);
        setHasSearched(true);

        try {
            const data = await searchProducts(searchQuery);
            setResults(data.products || []);
        } catch (error) {
            console.error("Search failed:", error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        handleSearch(debouncedQuery);
    }, [debouncedQuery, handleSearch]);

    const handleProductClick = (product: SearchResult) => {
        onClose();
        router.push(`/shop/products/${product.slug}`);
    };

    const handleViewAllResults = () => {
        onClose();
        router.push(`/shop?search=${encodeURIComponent(query)}`);
    };

    const clearSearch = () => {
        setQuery("");
        setResults([]);
        setHasSearched(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[80vh] max-w-2xl p-0">
                <DialogHeader className="px-6 pt-6 pb-4">
                    <DialogTitle className="text-left">
                        Search Products
                    </DialogTitle>
                </DialogHeader>

                {/* Search Input */}
                <div className="px-6">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search for products..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="pr-10 pl-10"
                            autoFocus
                        />
                        {query && (
                            <button
                                onClick={clearSearch}
                                className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Search Results */}
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                    {isLoading ? (
                        <div className="mt-4 space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex gap-3 p-3">
                                    <Skeleton className="h-16 w-16 rounded-lg" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-1/2" />
                                        <Skeleton className="h-3 w-1/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : hasSearched ? (
                        <div className="mt-4">
                            {results.length > 0 ? (
                                <>
                                    <div className="space-y-2">
                                        {results.slice(0, 6).map((product) => (
                                            <button
                                                key={product.id}
                                                onClick={() =>
                                                    handleProductClick(product)
                                                }
                                                className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-gray-50"
                                            >
                                                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                                                    {product.mediaItems?.[0]
                                                        ?.url ? (
                                                        <img
                                                            src={
                                                                product
                                                                    .mediaItems[0]
                                                                    .url
                                                            }
                                                            alt={
                                                                product
                                                                    .mediaItems[0]
                                                                    .alt ||
                                                                product.name
                                                            }
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <Icons.Package className="h-6 w-6 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="truncate font-medium text-gray-900">
                                                        {product.name}
                                                    </h3>
                                                    <p className="truncate text-sm text-gray-500">
                                                        {product.description}
                                                    </p>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <span className="font-semibold text-green-600">
                                                            $
                                                            {product.price.toFixed(
                                                                2
                                                            )}
                                                        </span>
                                                        {product.category && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-xs"
                                                            >
                                                                {
                                                                    product
                                                                        .category
                                                                        .name
                                                                }
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {results.length > 6 && (
                                        <button
                                            onClick={handleViewAllResults}
                                            className="mt-4 w-full rounded-lg border border-gray-200 p-3 text-center text-gray-600 transition-colors hover:bg-gray-50"
                                        >
                                            View all {results.length} results
                                        </button>
                                    )}
                                </>
                            ) : (
                                <div className="py-8 text-center">
                                    <Icons.Search className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                    <h3 className="mb-2 text-lg font-medium text-gray-900">
                                        No products found
                                    </h3>
                                    <p className="text-gray-500">
                                        Try adjusting your search terms or
                                        browse our categories
                                    </p>
                                    <Link
                                        href="/shop"
                                        onClick={onClose}
                                        className="mt-4 inline-block rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
                                    >
                                        Browse All Products
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-8 text-center">
                            <Icons.Search className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                            <h3 className="mb-2 text-lg font-medium text-gray-900">
                                Search for products
                            </h3>
                            <p className="text-gray-500">
                                Start typing to find products, categories, and
                                more
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
