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
import type { Subcategory } from "@/types";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteSubcategoryDialogProps {
    subcategory: Subcategory | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubcategoryDeleted: (subcategoryId: string) => void;
}

export function DeleteSubcategoryDialog({
    subcategory,
    open,
    onOpenChange,
    onSubcategoryDeleted,
}: DeleteSubcategoryDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!subcategory) return;

        setIsDeleting(true);
        try {
            const response = await axios.delete(
                `/api/subcategories/${subcategory.id}`
            );

            if (response.data.success) {
                onSubcategoryDeleted(subcategory.id);
                onOpenChange(false);
                toast.success("Subcategory deleted successfully");
            }
        } catch (error: any) {
            console.error("Error deleting subcategory:", error);
            const message =
                error.response?.data?.message || "Failed to delete subcategory";
            toast.error(message);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!subcategory) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Delete Subcategory
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this subcategory? This
                        action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="rounded-lg border border-muted p-4">
                        <h4 className="font-medium">{subcategory.name}</h4>
                        {subcategory.description && (
                            <p className="mt-1 text-sm text-muted-foreground">
                                {subcategory.description}
                            </p>
                        )}
                        <div className="mt-2 text-xs text-muted-foreground">
                            ID: {subcategory.id}
                        </div>
                    </div>

                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            <strong>Warning:</strong> Deleting this subcategory
                            will also delete all its product types and may
                            affect existing products. This action is permanent
                            and cannot be undone.
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
                        Delete Subcategory
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
