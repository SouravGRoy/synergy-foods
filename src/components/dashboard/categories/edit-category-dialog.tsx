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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { axios } from "@/lib/axios";
import {
    updateCategorySchema,
    type Category,
    type UpdateCategory,
} from "@/lib/validations/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditCategoryDialogProps {
    category: Category | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCategoryUpdated: (category: Category) => void;
}

export function EditCategoryDialog({
    category,
    open,
    onOpenChange,
    onCategoryUpdated,
}: EditCategoryDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<UpdateCategory>({
        resolver: zodResolver(updateCategorySchema),
        defaultValues: {
            name: "",
            description: "",
            commissionRate: 0,
            imageUrl: "",
            isActive: true,
        },
    });

    useEffect(() => {
        if (category && open) {
            form.reset({
                name: category.name,
                description: category.description || "",
                commissionRate: category.commissionRate || 0,
                imageUrl: category.imageUrl || "",
                isActive: category.isActive,
            });
        }
    }, [category, open, form]);

    const onSubmit = async (data: UpdateCategory) => {
        if (!category) return;

        setIsSubmitting(true);
        try {
            const response = await axios.patch(
                `/api/categories/${category.id}`,
                data
            );

            if (response.data.success) {
                onCategoryUpdated(response.data.data);
                toast.success("Category updated successfully");
            }
        } catch (error: any) {
            console.error("Error updating category:", error);
            const message =
                error.response?.data?.message || "Failed to update category";
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

    if (!category) return null;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                    <DialogDescription>
                        Update the category information. Changes will be
                        reflected immediately.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter category name"
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
                                name="commissionRate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Commission Rate (%)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                placeholder="0.00"
                                                {...field}
                                                value={
                                                    field.value
                                                        ? (
                                                              field.value / 100
                                                          ).toFixed(2)
                                                        : ""
                                                }
                                                onChange={(e) => {
                                                    const value =
                                                        parseFloat(
                                                            e.target.value
                                                        ) || 0;
                                                    field.onChange(
                                                        Math.round(value * 100)
                                                    ); // Convert to basis points
                                                }}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Commission rate for products in this
                                            category (in percentage)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter category description"
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
                                        Optional image URL for the category
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
                                            Enable this category to make it
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
                                Update Category
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
