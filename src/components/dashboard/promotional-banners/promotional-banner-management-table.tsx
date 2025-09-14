"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePromotionalBanner } from "@/lib/react-query/promotional-banner";
import { PromotionalBanner } from "@/lib/validations/promotional-banner";
import { Filter, RefreshCw, Search } from "lucide-react";
import { useState } from "react";
import PromotionalBannerTable from "./promotional-banner-table";
import QuickPromotionalBannerCreate from "./quick-promotional-banner-create";

interface PromotionalBannerManagementTableProps {
    initialData?: {
        data: PromotionalBanner[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    };
}

export default function PromotionalBannerManagementTable({
    initialData,
}: PromotionalBannerManagementTableProps) {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("all");
    const [type, setType] = useState<
        "carousel" | "type1" | "type2" | "type3" | "type4" | "all"
    >("all");

    const limit = 10;
    const { usePaginate } = usePromotionalBanner();

    const {
        data: bannersData,
        isLoading,
        error,
        refetch,
    } = usePaginate({
        page,
        limit,
        search: search || undefined,
        location: location === "all" ? undefined : location,
        type: type === "all" ? undefined : type,
        initialData,
    });

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1); // Reset to first page when searching
    };

    const handleLocationChange = (value: string) => {
        setLocation(value);
        setPage(1);
    };

    const handleTypeChange = (value: string) => {
        setType(value as any);
        setPage(1);
    };

    const clearFilters = () => {
        setSearch("");
        setLocation("all");
        setType("all");
        setPage(1);
    };

    if (error) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-center text-red-600">
                        <p>Failed to load promotional banners</p>
                        <Button onClick={() => refetch()} className="mt-2">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Try Again
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Promotional Banners
                    </h1>
                    <p className="text-muted-foreground">
                        Manage promotional banners with different layout types
                    </p>
                </div>
            </div>

            <Tabs defaultValue="manage" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="manage">Manage Banners</TabsTrigger>
                    <TabsTrigger value="create">Create New</TabsTrigger>
                </TabsList>

                <TabsContent value="manage" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Filters</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4 md:flex-row">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                        <Input
                                            placeholder="Search banners..."
                                            value={search}
                                            onChange={(e) =>
                                                handleSearchChange(
                                                    e.target.value
                                                )
                                            }
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <Select
                                    value={location}
                                    onValueChange={handleLocationChange}
                                >
                                    <SelectTrigger className="w-full md:w-48">
                                        <SelectValue placeholder="Filter by location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Locations
                                        </SelectItem>
                                        <SelectItem value="home-hero">
                                            Home Hero
                                        </SelectItem>
                                        <SelectItem value="home-secondary">
                                            Home Secondary
                                        </SelectItem>
                                        <SelectItem value="about-us">
                                            About Us
                                        </SelectItem>
                                        <SelectItem value="shop">
                                            Shop
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={type}
                                    onValueChange={handleTypeChange}
                                >
                                    <SelectTrigger className="w-full md:w-48">
                                        <SelectValue placeholder="Filter by type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Types
                                        </SelectItem>
                                        <SelectItem value="carousel">
                                            Carousel
                                        </SelectItem>
                                        <SelectItem value="type1">
                                            Three Images
                                        </SelectItem>
                                        <SelectItem value="type2">
                                            Large Image
                                        </SelectItem>
                                        <SelectItem value="type3">
                                            Stacked Images
                                        </SelectItem>
                                        <SelectItem value="type4">
                                            Single Image
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                    className="w-full md:w-auto"
                                >
                                    <Filter className="mr-2 h-4 w-4" />
                                    Clear
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>All Promotional Banners</CardTitle>
                                {bannersData && (
                                    <div className="text-sm text-muted-foreground">
                                        {bannersData.meta.total} total banners
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-4">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center space-x-4"
                                        >
                                            <Skeleton className="h-16 w-16 rounded" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-4 w-48" />
                                                <Skeleton className="h-3 w-32" />
                                            </div>
                                            <Skeleton className="h-8 w-24" />
                                            <Skeleton className="h-8 w-16" />
                                        </div>
                                    ))}
                                </div>
                            ) : bannersData ? (
                                <>
                                    <PromotionalBannerTable
                                        bannersData={bannersData}
                                        page={page}
                                        search={search}
                                        location={location}
                                    />

                                    {/* Pagination */}
                                    {bannersData.meta.totalPages > 1 && (
                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="text-sm text-muted-foreground">
                                                Page {bannersData.meta.page} of{" "}
                                                {bannersData.meta.totalPages}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        setPage(page - 1)
                                                    }
                                                    disabled={
                                                        !bannersData.meta
                                                            .hasPrev
                                                    }
                                                >
                                                    Previous
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        setPage(page + 1)
                                                    }
                                                    disabled={
                                                        !bannersData.meta
                                                            .hasNext
                                                    }
                                                >
                                                    Next
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="py-8 text-center">
                                    <p className="text-muted-foreground">
                                        No data available
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="create">
                    <QuickPromotionalBannerCreate />
                </TabsContent>
            </Tabs>
        </div>
    );
}
