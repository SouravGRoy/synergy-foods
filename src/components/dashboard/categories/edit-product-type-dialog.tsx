"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { axios } from "@/lib/axios";
import {
    updateProductTypeSchema,
    type ProductType,
    type Subcategory,
    type UpdateProductType,
} from "@/lib/validations/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditProductTypeDialogProps {
    productType: ProductType | null;
    subcategories: Subcategory[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onProductTypeUpdated: (productType: ProductType) => void;
}

export function EditProductTypeDialog({
    productType,
    subcategories,
    open,
    onOpenChange,
    onProductTypeUpdated,
}: EditProductTypeDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<UpdateProductType>({
        resolver: zodResolver(updateProductTypeSchema),
        defaultValues: {
            categoryId: "",
            subcategoryId: "",
            name: "",
            description: "",
            imageUrl: "",
            isActive: true,
        },
    });

    const selectedSubcategoryId = form.watch("subcategoryId");
    const selectedSubcategory = subcategories.find(
        (sub) => sub.id === selectedSubcategoryId
    );

    // Auto-set categoryId when subcategory is selected
    useEffect(() => {
        if (selectedSubcategory) {
            form.setValue("categoryId", selectedSubcategory.categoryId);
        }
    }, [selectedSubcategory, form]);

    useEffect(() => {
        if (productType && open) {
            form.reset({
                categoryId: productType.categoryId,
                subcategoryId: productType.subcategoryId,
                name: productType.name,
                description: productType.description || "",
                imageUrl: productType.imageUrl || "",
                isActive: productType.isActive,
            });
        }
    }, [productType, open, form]);

    const onSubmit = async (data: UpdateProductType) => {
        if (!productType) return;

        setIsSubmitting(true);
        try {
            const response = await axios.patch(
                `/api/product-types/${productType.id}`,
                data
            );

            if (response.data.success) {
                onProductTypeUpdated(response.data.data);
                toast.success("Product type updated successfully");
            }
        } catch (error: any) {
            console.error("Error updating product type:", error);
            const message =
                error.response?.data?.message ||
                "Failed to update product type";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen && !isSubmitting) {
            form.reset();
        }
        onOpenChange(newOpen);
    };

    if (!productType) return null;

    const activeSubcategories = subcategories.filter((sub) => sub.isActive);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Product Type</DialogTitle>
                    <DialogDescription>
                        Update the product type information. Changes will be
                        reflected immediately.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="subcategoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subcategory</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={isSubmitting}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a subcategory" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {activeSubcategories.map(
                                                (subcategory) => (
                                                    <SelectItem
                                                        key={subcategory.id}
                                                        value={subcategory.id}
                                                    >
                                                        {subcategory.name}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Choose the parent subcategory for this
                                        product type
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter product type name"
                                            {...field}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter product type description"
                                            className="min-h-[100px]"
                                            {...field}
                                            value={field.value || ""}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="url"
                                            placeholder="https://example.com/image.jpg"
                                            {...field}
                                            value={field.value || ""}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Optional image URL for the product type
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Active Status
                                        </FormLabel>
                                        <FormDescription>
                                            Enable this product type to make it
                                            visible to customers
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Update Product Type
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
