"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useBanner } from "@/lib/react-query/banner";
import { Banner } from "@/lib/validations";
import { Eye, MoreHorizontal, Pencil, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { BannerDeleteDialog } from "./banner-delete-dialog";
import { BannerEditDialog } from "./banner-edit-dialog";
import { BannerPreviewDialog } from "./banner-preview-dialog";

interface BannerManagementProps {
    initialData?: {
        data: Banner[];
        items: number;
        pages: number;
    };
}

const LOCATION_OPTIONS = [
    { value: "homepage", label: "Homepage" },
    { value: "category", label: "Category Pages" },
    { value: "product", label: "Product Pages" },
    { value: "shop", label: "Shop Page" },
    { value: "search", label: "Search Results" },
    { value: "cart", label: "Cart Page" },
    { value: "checkout", label: "Checkout Page" },
    { value: "custom", label: "Custom Location" },
];

// Create a simple date formatter
const formatBannerDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export function BannerManagementTable({ initialData }: BannerManagementProps) {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState<string>("all");

    // Dialog states
    const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showPreviewDialog, setShowPreviewDialog] = useState(false);

    const limit = 10;

    const { usePaginate, useDelete } = useBanner();
    const deleteMutation = useDelete();

    const {
        data: bannersData,
        isLoading,
        error,
    } = usePaginate({
        page,
        limit,
        search: search || undefined,
        location: location === "all" ? undefined : location,
        initialData,
    });

    const banners = bannersData?.data || [];
    const totalPages = bannersData?.pages || 0;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Banner Management
                    </h2>
                    <p className="text-muted-foreground">
                        Manage banners for different locations across your site
                    </p>
                </div>
            </div>

            {/* Filters */}
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
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-48">
                            <Select
                                value={location}
                                onValueChange={setLocation}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Locations" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Locations
                                    </SelectItem>
                                    {LOCATION_OPTIONS.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-20">Image</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="w-16">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="h-12 w-16 animate-pulse rounded bg-gray-200" />
                                        </TableCell>
                                        <TableCell>
                                            <div className="h-4 animate-pulse rounded bg-gray-200" />
                                        </TableCell>
                                        <TableCell>
                                            <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                                        </TableCell>
                                        <TableCell>
                                            <div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
                                        </TableCell>
                                        <TableCell>
                                            <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                                        </TableCell>
                                        <TableCell>
                                            <div className="h-8 w-8 animate-pulse rounded bg-gray-200" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : banners.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No banners found. Create your first
                                        banner to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                banners.map((banner: Banner) => (
                                    <TableRow key={banner.id}>
                                        <TableCell>
                                            <div className="relative h-12 w-16 overflow-hidden rounded">
                                                <Image
                                                    src={banner.imageUrl}
                                                    alt={banner.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">
                                                {banner.title}
                                            </div>
                                            <div className="max-w-xs truncate text-sm text-muted-foreground">
                                                {banner.description}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {LOCATION_OPTIONS.find(
                                                    (opt) =>
                                                        opt.value ===
                                                        banner.location
                                                )?.label || banner.location}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="default">
                                                Active
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {formatBannerDate(banner.createdAt)}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedBanner(
                                                                banner
                                                            );
                                                            setShowPreviewDialog(
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Preview
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedBanner(
                                                                banner
                                                            );
                                                            setShowEditDialog(
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedBanner(
                                                                banner
                                                            );
                                                            setShowDeleteDialog(
                                                                true
                                                            );
                                                        }}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </p>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setPage(Math.min(totalPages, page + 1))
                            }
                            disabled={page === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Dialogs */}
            {selectedBanner && (
                <>
                    <BannerEditDialog
                        banner={selectedBanner}
                        open={showEditDialog}
                        onOpenChange={setShowEditDialog}
                    />
                    <BannerDeleteDialog
                        banner={selectedBanner}
                        open={showDeleteDialog}
                        onOpenChange={setShowDeleteDialog}
                        onConfirm={() => {
                            if (selectedBanner) {
                                deleteMutation.mutate(selectedBanner.id, {
                                    onSuccess: () => {
                                        setShowDeleteDialog(false);
                                        setSelectedBanner(null);
                                    },
                                });
                            }
                        }}
                        isDeleting={deleteMutation.isPending}
                    />
                    <BannerPreviewDialog
                        banner={selectedBanner}
                        open={showPreviewDialog}
                        onOpenChange={setShowPreviewDialog}
                    />
                </>
            )}
        </div>
    );
}
