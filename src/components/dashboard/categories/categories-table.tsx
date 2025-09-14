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
import type { Category } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Edit, Eye, EyeOff, MoreHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteCategoryDialog } from "./delete-category-dialog";
import { EditCategoryDialog } from "./edit-category-dialog";

interface CategoriesTableProps {
    categories: Category[];
    onCategoryUpdated: (category: Category) => void;
    onCategoryDeleted: (categoryId: string) => void;
}

export function CategoriesTable({
    categories,
    onCategoryUpdated,
    onCategoryDeleted,
}: CategoriesTableProps) {
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null
    );
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(
        null
    );
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

    const handleToggleStatus = async (category: Category) => {
        setUpdatingStatus(category.id);
        try {
            const response = await axios.patch(
                `/api/categories/${category.id}`,
                {
                    isActive: !category.isActive,
                }
            );

            if (response.data.success) {
                onCategoryUpdated(response.data.data);
                toast.success(
                    `Category ${!category.isActive ? "activated" : "deactivated"} successfully`
                );
            }
        } catch (error) {
            console.error("Error toggling category status:", error);
            toast.error("Failed to update category status");
        } finally {
            setUpdatingStatus(null);
        }
    };

    const formatCommissionRate = (rate: number) => {
        return `${(rate / 100).toFixed(2)}%`;
    };

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Commission Rate</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="w-[70px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="py-8 text-center text-muted-foreground"
                                >
                                    No categories found
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            {category.imageUrl && (
                                                <Image
                                                    width={32}
                                                    height={32}
                                                    src={category.imageUrl}
                                                    alt={category.name}
                                                    className="h-8 w-8 rounded object-cover"
                                                />
                                            )}
                                            <div>
                                                <div className="font-medium">
                                                    {category.name}
                                                </div>
                                                {category.description && (
                                                    <div className="line-clamp-1 text-sm text-muted-foreground">
                                                        {category.description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <code className="rounded bg-muted px-2 py-1 text-sm">
                                            {category.slug}
                                        </code>
                                    </TableCell>
                                    <TableCell>
                                        {formatCommissionRate(
                                            category.commissionRate
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                category.isActive
                                                    ? "default"
                                                    : "secondary"
                                            }
                                            className={
                                                category.isActive
                                                    ? "bg-green-100 text-green-800"
                                                    : ""
                                            }
                                        >
                                            {category.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDistanceToNow(
                                            new Date(category.createdAt),
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
                                                        setEditingCategory(
                                                            category
                                                        )
                                                    }
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleToggleStatus(
                                                            category
                                                        )
                                                    }
                                                    disabled={
                                                        updatingStatus ===
                                                        category.id
                                                    }
                                                >
                                                    {category.isActive ? (
                                                        <EyeOff className="mr-2 h-4 w-4" />
                                                    ) : (
                                                        <Eye className="mr-2 h-4 w-4" />
                                                    )}
                                                    {category.isActive
                                                        ? "Deactivate"
                                                        : "Activate"}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setDeletingCategory(
                                                            category
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
            <EditCategoryDialog
                category={editingCategory}
                open={!!editingCategory}
                onOpenChange={(open: boolean) =>
                    !open && setEditingCategory(null)
                }
                onCategoryUpdated={onCategoryUpdated}
            />

            {/* Delete Dialog */}
            <DeleteCategoryDialog
                category={deletingCategory}
                open={!!deletingCategory}
                onOpenChange={(open: boolean) =>
                    !open && setDeletingCategory(null)
                }
                onCategoryDeleted={onCategoryDeleted}
            />
        </>
    );
}
