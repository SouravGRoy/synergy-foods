"use client";

import { Icons } from "@/components/icons";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    DEFAULT_PAGINATION_LIMIT,
    DEFAULT_PAGINATION_PAGE,
} from "@/config/const";
import { useProduct } from "@/lib/react-query";
import { FullProduct, UpdateProduct } from "@/lib/validations";
import Link from "next/link";
import { parseAsInteger, useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";

interface PageProps {
    data: FullProduct;
}

export function ProductAction({ data }: PageProps) {
    const [page] = useQueryState(
        "page",
        parseAsInteger.withDefault(DEFAULT_PAGINATION_PAGE)
    );
    const [limit] = useQueryState(
        "limit",
        parseAsInteger.withDefault(DEFAULT_PAGINATION_LIMIT)
    );
    const [search] = useQueryState("search", { defaultValue: "" });

    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { usePaginate, useUpdate, useDelete, useUpdateMarketingStatus } =
        useProduct();
    const { refetch } = usePaginate({
        limit,
        page,
        search,
    });

    const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdate();
    const { mutateAsync: deleteProduct, isPending: isDeleting } = useDelete();
    const { mutateAsync: updateMarketingStatus, isPending: isMarketing } =
        useUpdateMarketingStatus();

    const handleUpdate = async (
        values: UpdateProduct,
        onSuccess?: () => void
    ) => {
        try {
            console.log("Updating product:", data.id, "with values:", values);
            await updateProduct({
                id: data.id,
                values: {
                    ...data,
                    ...values,
                },
            });

            refetch();
            toast.success("Product updated successfully");
            onSuccess?.();
        } catch (error: any) {
            console.error("Update error:", error);

            if (error?.response?.status === 404) {
                toast.error(
                    "Product not found. It may have been deleted. Please refresh the page.",
                    { duration: 5000 }
                );
                // Suggest page refresh after a short delay
                setTimeout(() => {
                    if (
                        confirm(
                            "Product not found. Would you like to refresh the page to get the latest data?"
                        )
                    ) {
                        window.location.reload();
                    }
                }, 2000);
            } else {
                toast.error("Failed to update product");
            }

            throw error;
        }
    };

    const handleDelete = async () => {
        await deleteProduct(data.id);
        refetch();
        setIsDeleteModalOpen(false);
    };

    const handleMarketingUpdate = async (isMarketed: boolean) => {
        try {
            await updateMarketingStatus({ id: data.id, isMarketed });
            refetch();
            setIsMarketModalOpen(false);
        } catch (error: any) {
            console.error("Marketing update error:", error);
            // Error handling is done in the mutation
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="size-8">
                        <span className="sr-only">Open menu</span>
                        <Icons.MoreVertical className="size-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/products/p/${data.id}`}>
                                <Icons.Pencil className="size-4" />
                                <span>Edit</span>
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => setIsMarketModalOpen(true)}
                            disabled={isMarketing}
                        >
                            {data.isMarketed ? (
                                <>
                                    <Icons.TrendingDown className="size-4" />
                                    <span>Unmarket</span>
                                </>
                            ) : (
                                <>
                                    <Icons.TrendingUp className="size-4" />
                                    <span>Market Product</span>
                                </>
                            )}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => setIsPublishModalOpen(true)}
                            disabled={isUpdating}
                        >
                            {data.isPublished ? (
                                <>
                                    <Icons.Unlock className="size-4" />
                                    <span>Unpublish</span>
                                </>
                            ) : (
                                <>
                                    <Icons.Lock className="size-4" />
                                    <span>Publish</span>
                                </>
                            )}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        <Icons.Trash2 className="size-4" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog
                open={isPublishModalOpen}
                onOpenChange={setIsPublishModalOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {data.isPublished
                                ? "Are you sure you want to unpublish this product?"
                                : "Are you sure you want to publish this product?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {data.isPublished
                                ? "This product will no longer be visible to customers and cannot be purchased."
                                : "People will be able to see and purchase this product. Are you sure you want to publish it?"}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={isUpdating}
                            onClick={() => setIsPublishModalOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant={
                                data.isPublished ? "destructive" : "default"
                            }
                            size="sm"
                            disabled={isUpdating}
                            onClick={() =>
                                handleUpdate(
                                    {
                                        isPublished: !data.isPublished,
                                        publishedAt: data.isPublished
                                            ? null
                                            : new Date(),
                                    },
                                    () => setIsPublishModalOpen(false)
                                )
                            }
                        >
                            {isUpdating ? (
                                <>
                                    <Icons.Loader className="mr-2 h-4 w-4 animate-spin" />
                                    {data.isPublished
                                        ? "Unpublishing..."
                                        : "Publishing..."}
                                </>
                            ) : data.isPublished ? (
                                "Unpublish"
                            ) : (
                                "Publish"
                            )}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={isMarketModalOpen}
                onOpenChange={setIsMarketModalOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {data.isMarketed
                                ? "Are you sure you want to unmarket this product?"
                                : "Are you sure you want to market this product?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {data.isMarketed
                                ? "This product will be removed from the featured products carousel on the homepage."
                                : "This product will appear in the featured products carousel on the homepage. Marketing will also automatically publish the product if it's not already published. Maximum 10 products can be marketed at once."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={isMarketing}
                            onClick={() => setIsMarketModalOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant={
                                data.isMarketed ? "destructive" : "default"
                            }
                            size="sm"
                            disabled={isMarketing}
                            onClick={() =>
                                handleMarketingUpdate(!data.isMarketed)
                            }
                        >
                            {isMarketing ? (
                                <>
                                    <Icons.Loader className="mr-2 h-4 w-4 animate-spin" />
                                    {data.isMarketed
                                        ? "Unmarketing..."
                                        : "Marketing..."}
                                </>
                            ) : data.isMarketed ? (
                                "Unmarket"
                            ) : (
                                "Market Product"
                            )}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure you want to delete this product?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the product &quot;{data.title}&quot; and
                            remove it from your store.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={isDeleting}
                            onClick={handleDelete}
                        >
                            {isDeleting ? (
                                <>
                                    <Icons.Loader className="mr-2 size-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete Product"
                            )}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
