"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { axios } from "@/lib/axios";
import type { Category } from "@/types";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteCategoryDialogProps {
    category: Category | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCategoryDeleted: (categoryId: string) => void;
}

export function DeleteCategoryDialog({
    category,
    open,
    onOpenChange,
    onCategoryDeleted,
}: DeleteCategoryDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!category) return;

        setIsDeleting(true);
        try {
            const response = await axios.delete(
                `/api/categories/${category.id}`
            );

            if (response.data.success) {
                onCategoryDeleted(category.id);
                onOpenChange(false);
                toast.success("Category deleted successfully");
            }
        } catch (error: any) {
            console.error("Error deleting category:", error);
            const message =
                error.response?.data?.message || "Failed to delete category";
            toast.error(message);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!category) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Delete Category
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this category? This
                        action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="rounded-lg border border-muted p-4">
                        <h4 className="font-medium">{category.name}</h4>
                        {category.description && (
                            <p className="mt-1 text-sm text-muted-foreground">
                                {category.description}
                            </p>
                        )}
                        <div className="mt-2 text-xs text-muted-foreground">
                            ID: {category.id}
                        </div>
                    </div>

                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            <strong>Warning:</strong> Deleting this category
                            will also delete all its subcategories, product
                            types, and may affect existing products. This action
                            is permanent and cannot be undone.
                        </AlertDescription>
                    </Alert>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Delete Category
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
