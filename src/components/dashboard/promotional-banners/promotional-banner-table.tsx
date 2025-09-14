"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { usePromotionalBanner } from "@/lib/react-query/promotional-banner";
import { PromotionalBanner } from "@/lib/validations/promotional-banner";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { PromotionalBannerDeleteDialog } from "./promotional-banner-delete-dialog";
import { PromotionalBannerEditDialog } from "./promotional-banner-edit-dialog";
import { PromotionalBannerPreviewDialog } from "./promotional-banner-preview-dialog";

interface PromotionalBannerTableProps {
    bannersData: {
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
    page: number;
    search: string;
    location: string;
}

const BANNER_TYPE_LABELS = {
    carousel: "Carousel",
    type1: "Three Images",
    type2: "Large Image",
    type3: "Stacked Images",
    type4: "Single Image",
};

export default function PromotionalBannerTable({
    bannersData,
    page,
    search,
    location,
}: PromotionalBannerTableProps) {
    const [selectedBanner, setSelectedBanner] =
        useState<PromotionalBanner | null>(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showPreviewDialog, setShowPreviewDialog] = useState(false);

    const { useDelete } = usePromotionalBanner();
    const deleteMutation = useDelete();

    const handleEdit = (banner: PromotionalBanner) => {
        setSelectedBanner(banner);
        setShowEditDialog(true);
    };

    const handleDelete = (banner: PromotionalBanner) => {
        setSelectedBanner(banner);
        setShowDeleteDialog(true);
    };

    const handlePreview = (banner: PromotionalBanner) => {
        setSelectedBanner(banner);
        setShowPreviewDialog(true);
    };

    const confirmDelete = () => {
        if (selectedBanner) {
            deleteMutation.mutate(selectedBanner.id);
            setShowDeleteDialog(false);
            setSelectedBanner(null);
        }
    };

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Preview</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Media Count</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bannersData.data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    className="py-8 text-center"
                                >
                                    <div className="text-muted-foreground">
                                        {search || location
                                            ? "No promotional banners found matching your filters."
                                            : "No promotional banners found. Create one to get started."}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            bannersData.data.map((banner) => (
                                <TableRow key={banner.id}>
                                    <TableCell>
                                        {banner.media[0]?.url ? (
                                            <Image
                                                fill
                                                src={banner.media[0].url}
                                                alt={
                                                    banner.media[0].altText ||
                                                    banner.title
                                                }
                                                className="h-16 w-16 rounded-md object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gray-200">
                                                <span className="text-xs text-gray-500">
                                                    No Image
                                                </span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">
                                                {banner.title}
                                            </div>
                                            <div className="line-clamp-1 text-sm text-muted-foreground">
                                                {banner.description}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {BANNER_TYPE_LABELS[banner.type] ||
                                                banner.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {banner.location}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm">
                                            {banner.media.length}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                banner.isActive
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {banner.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm">
                                            {banner.order}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <span className="sr-only">
                                                        Open menu
                                                    </span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handlePreview(banner)
                                                    }
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Preview
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleEdit(banner)
                                                    }
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleDelete(banner)
                                                    }
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
            </div>

            {/* Edit Dialog */}
            <PromotionalBannerEditDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                banner={selectedBanner}
                onSuccess={() => {
                    setShowEditDialog(false);
                    setSelectedBanner(null);
                }}
            />

            {/* Delete Dialog */}
            <PromotionalBannerDeleteDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                banner={selectedBanner}
                onConfirm={confirmDelete}
                isLoading={deleteMutation.isPending}
            />

            {/* Preview Dialog */}
            <PromotionalBannerPreviewDialog
                open={showPreviewDialog}
                onOpenChange={setShowPreviewDialog}
                banner={selectedBanner}
            />
        </>
    );
}
