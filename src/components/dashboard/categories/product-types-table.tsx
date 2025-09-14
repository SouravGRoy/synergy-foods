"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
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
import { axios } from "@/lib/axios";
import type { ProductType, Subcategory } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Edit, Eye, EyeOff, MoreHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteProductTypeDialog } from "./delete-product-type-dialog";
import { EditProductTypeDialog } from "./edit-product-type-dialog";

interface ProductTypesTableProps {
    productTypes: ProductType[];
    subcategories: Subcategory[];
    onProductTypeUpdated: (productType: ProductType) => void;
    onProductTypeDeleted: (productTypeId: string) => void;
}

export function ProductTypesTable({
    productTypes,
    subcategories,
    onProductTypeUpdated,
    onProductTypeDeleted,
}: ProductTypesTableProps) {
    const [editingProductType, setEditingProductType] =
        useState<ProductType | null>(null);
    const [deletingProductType, setDeletingProductType] =
        useState<ProductType | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

    const handleToggleStatus = async (productType: ProductType) => {
        setUpdatingStatus(productType.id);
        try {
            const response = await axios.patch(
                `/api/product-types/${productType.id}`,
                {
                    isActive: !productType.isActive,
                }
            );

            if (response.data.success) {
                onProductTypeUpdated(response.data.data);
                toast.success(
                    `Product type ${!productType.isActive ? "activated" : "deactivated"} successfully`
                );
            }
        } catch (error) {
            console.error("Error toggling product type status:", error);
            toast.error("Failed to update product type status");
        } finally {
            setUpdatingStatus(null);
        }
    };

    const getSubcategoryName = (subcategoryId: string) => {
        const subcategory = subcategories.find(
            (sub) => sub.id === subcategoryId
        );
        return subcategory?.name || "Unknown";
    };

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Subcategory</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="w-[70px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {productTypes.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="py-8 text-center text-muted-foreground"
                                >
                                    No product types found
                                </TableCell>
                            </TableRow>
                        ) : (
                            productTypes.map((productType) => (
                                <TableRow key={productType.id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            {productType.imageUrl && (
                                                <Image
                                                    height={32}
                                                    width={32}
                                                    src={productType.imageUrl}
                                                    alt={productType.name}
                                                    className="h-8 w-8 rounded object-cover"
                                                />
                                            )}
                                            <div>
                                                <div className="font-medium">
                                                    {productType.name}
                                                </div>
                                                {productType.description && (
                                                    <div className="line-clamp-1 text-sm text-muted-foreground">
                                                        {
                                                            productType.description
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <code className="rounded bg-muted px-2 py-1 text-sm">
                                            {productType.slug}
                                        </code>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {getSubcategoryName(
                                                productType.subcategoryId
                                            )}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                productType.isActive
                                                    ? "default"
                                                    : "secondary"
                                            }
                                            className={
                                                productType.isActive
                                                    ? "bg-green-100 text-green-800"
                                                    : ""
                                            }
                                        >
                                            {productType.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDistanceToNow(
                                            new Date(productType.createdAt),
                                            { addSuffix: true }
                                        )}
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
                                                <DropdownMenuLabel>
                                                    Actions
                                                </DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setEditingProductType(
                                                            productType
                                                        )
                                                    }
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleToggleStatus(
                                                            productType
                                                        )
                                                    }
                                                    disabled={
                                                        updatingStatus ===
                                                        productType.id
                                                    }
                                                >
                                                    {productType.isActive ? (
                                                        <EyeOff className="mr-2 h-4 w-4" />
                                                    ) : (
                                                        <Eye className="mr-2 h-4 w-4" />
                                                    )}
                                                    {productType.isActive
                                                        ? "Deactivate"
                                                        : "Activate"}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setDeletingProductType(
                                                            productType
                                                        )
                                                    }
                                                    className="text-destructive"
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
            <EditProductTypeDialog
                productType={editingProductType}
                subcategories={subcategories}
                open={!!editingProductType}
                onOpenChange={(open: boolean) =>
                    !open && setEditingProductType(null)
                }
                onProductTypeUpdated={onProductTypeUpdated}
            />

            {/* Delete Dialog */}
            <DeleteProductTypeDialog
                productType={deletingProductType}
                open={!!deletingProductType}
                onOpenChange={(open: boolean) =>
                    !open && setDeletingProductType(null)
                }
                onProductTypeDeleted={onProductTypeDeleted}
            />
        </>
    );
}
