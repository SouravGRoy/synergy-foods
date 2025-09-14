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
    createProductTypeSchema,
    type CreateProductType,
    type ProductType,
    type Subcategory,
} from "@/lib/validations/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CreateProductTypeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    subcategories: Subcategory[];
    onProductTypeCreated: (productType: ProductType) => void;
}

export function CreateProductTypeDialog({
    open,
    onOpenChange,
    subcategories,
    onProductTypeCreated,
}: CreateProductTypeDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<CreateProductType>({
        resolver: zodResolver(createProductTypeSchema),
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
    React.useEffect(() => {
        if (selectedSubcategory) {
            form.setValue("categoryId", selectedSubcategory.categoryId);
        }
    }, [selectedSubcategory, form]);

    const onSubmit = async (data: CreateProductType) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post("/api/product-types", data);

            if (response.data.success) {
                onProductTypeCreated(response.data.data);
                form.reset();
                toast.success("Product type created successfully");
            }
        } catch (error: any) {
            console.error("Error creating product type:", error);
            const message =
                error.response?.data?.message ||
                "Failed to create product type";
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

    const activeSubcategories = subcategories.filter((sub) => sub.isActive);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create New Product Type</DialogTitle>
                    <DialogDescription>
                        Add a new product type under an existing subcategory to
                        further categorize products.
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
                                        defaultValue={field.value}
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
                                Create Product Type
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
