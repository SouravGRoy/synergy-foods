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
import type { Category, Subcategory } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Edit, Eye, EyeOff, MoreHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteSubcategoryDialog } from "./delete-subcategory-dialog";
import { EditSubcategoryDialog } from "./edit-subcategory-dialog";

interface SubcategoriesTableProps {
    subcategories: Subcategory[];
    categories: Category[];
    onSubcategoryUpdated: (subcategory: Subcategory) => void;
    onSubcategoryDeleted: (subcategoryId: string) => void;
}
export function SubcategoriesTable({
    subcategories,
    categories,
    onSubcategoryUpdated,
    onSubcategoryDeleted,
}: SubcategoriesTableProps) {
    const [editingSubcategory, setEditingSubcategory] =
        useState<Subcategory | null>(null);
    const [deletingSubcategory, setDeletingSubcategory] =
        useState<Subcategory | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
    const handleToggleStatus = async (subcategory: Subcategory) => {
        setUpdatingStatus(subcategory.id);
        try {
            const response = await axios.patch(
                `/api/subcategories/${subcategory.id}`,
                { isActive: !subcategory.isActive }
            );
            if (response.data.success) {
                onSubcategoryUpdated(response.data.data);
                toast.success(
                    `Subcategory ${!subcategory.isActive ? "activated" : "deactivated"} successfully`
                );
            }
        } catch (error) {
            console.error("Error toggling subcategory status:", error);
            toast.error("Failed to update subcategory status");
        } finally {
            setUpdatingStatus(null);
        }
    };
    const getCategoryName = (categoryId: string) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category?.name || "Unknown";
    };
    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="w-[70px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subcategories.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="py-8 text-center text-muted-foreground"
                                >
                                    No subcategories found
                                </TableCell>
                            </TableRow>
                        ) : (
                            subcategories.map((subcategory) => (
                                <TableRow key={subcategory.id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            {subcategory.imageUrl && (
                                                <Image
                                                    height={32}
                                                    width={32}
                                                    src={subcategory.imageUrl}
                                                    alt={subcategory.name}
                                                    className="h-8 w-8 rounded object-cover"
                                                />
                                            )}
                                            <div>
                                                <div className="font-medium">
                                                    {subcategory.name}
                                                </div>
                                                {subcategory.description && (
                                                    <div className="line-clamp-1 text-sm text-muted-foreground">
                                                        {
                                                            subcategory.description
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <code className="rounded bg-muted px-2 py-1 text-sm">
                                            {subcategory.slug}
                                        </code>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {getCategoryName(
                                                subcategory.categoryId
                                            )}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                subcategory.isActive
                                                    ? "default"
                                                    : "secondary"
                                            }
                                            className={
                                                subcategory.isActive
                                                    ? "bg-green-100 text-green-800"
                                                    : ""
                                            }
                                        >
                                            {subcategory.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDistanceToNow(
                                            new Date(subcategory.createdAt),
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
                                                        setEditingSubcategory(
                                                            subcategory
                                                        )
                                                    }
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleToggleStatus(
                                                            subcategory
                                                        )
                                                    }
                                                    disabled={
                                                        updatingStatus ===
                                                        subcategory.id
                                                    }
                                                >
                                                    {subcategory.isActive ? (
                                                        <EyeOff className="mr-2 h-4 w-4" />
                                                    ) : (
                                                        <Eye className="mr-2 h-4 w-4" />
                                                    )}
                                                    {subcategory.isActive
                                                        ? "Deactivate"
                                                        : "Activate"}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setDeletingSubcategory(
                                                            subcategory
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
            <EditSubcategoryDialog
                subcategory={editingSubcategory}
                categories={categories}
                open={!!editingSubcategory}
                onOpenChange={(open: boolean) =>
                    !open && setEditingSubcategory(null)
                }
                onSubcategoryUpdated={onSubcategoryUpdated}
            />
            {/* Delete Dialog */}
            <DeleteSubcategoryDialog
                subcategory={deletingSubcategory}
                open={!!deletingSubcategory}
                onOpenChange={(open: boolean) =>
                    !open && setDeletingSubcategory(null)
                }
                onSubcategoryDeleted={onSubcategoryDeleted}
            />
        </>
    );
}
