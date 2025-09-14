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
import type { ProductType } from "@/types";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteProductTypeDialogProps {
    productType: ProductType | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onProductTypeDeleted: (productTypeId: string) => void;
}

export function DeleteProductTypeDialog({
    productType,
    open,
    onOpenChange,
    onProductTypeDeleted,
}: DeleteProductTypeDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!productType) return;

        setIsDeleting(true);
        try {
            const response = await axios.delete(
                `/api/product-types/${productType.id}`
            );

            if (response.data.success) {
                onProductTypeDeleted(productType.id);
                onOpenChange(false);
                toast.success("Product type deleted successfully");
            }
        } catch (error: any) {
            console.error("Error deleting product type:", error);
            const message =
                error.response?.data?.message ||
                "Failed to delete product type";
            toast.error(message);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!productType) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Delete Product Type
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this product type? This
                        action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="rounded-lg border border-muted p-4">
                        <h4 className="font-medium">{productType.name}</h4>
                        {productType.description && (
                            <p className="mt-1 text-sm text-muted-foreground">
                                {productType.description}
                            </p>
                        )}
                        <div className="mt-2 text-xs text-muted-foreground">
                            ID: {productType.id}
                        </div>
                    </div>

                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            <strong>Warning:</strong> Deleting this product type
                            may affect existing products that are assigned to
                            this category. This action is permanent and cannot
                            be undone.
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
                        Delete Product Type
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
