"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PromotionalBanner } from "@/lib/validations/promotional-banner";

interface PromotionalBannerDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    banner: PromotionalBanner | null;
    onConfirm: () => void;
    isLoading: boolean;
}

export function PromotionalBannerDeleteDialog({
    open,
    onOpenChange,
    banner,
    onConfirm,
    isLoading,
}: PromotionalBannerDeleteDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete Promotional Banner
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the promotional banner{" "}
                        <span className="font-medium">
                            &quot;{banner?.title}&quot;
                        </span>
                        ? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isLoading ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
