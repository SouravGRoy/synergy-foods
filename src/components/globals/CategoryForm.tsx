"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
    CreateCategory,
    UpdateCategory,
    createCategorySchema,
    updateCategorySchema,
    Category
} from "@/lib/validations";
import { slugify } from "@/lib/utils";

interface CategoryFormProps {
    category?: Category;
    onSuccess?: (category: Category) => void;
    onCancel?: () => void;
}

export function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditing = !!category;

    const form = useForm<CreateCategory | UpdateCategory>({
        resolver: zodResolver(isEditing ? updateCategorySchema : createCategorySchema),
        defaultValues: {
            name: category?.name || "",
            description: category?.description || "",
            commissionRate: category?.commissionRate || 0,
            imageUrl: category?.imageUrl || "",
            isActive: category?.isActive ?? true,
        },
    });

    const onSubmit = async (values: CreateCategory | UpdateCategory) => {
        setIsSubmitting(true);
        try {
            const url = isEditing
                ? `/api/categories/${category.id}`
                : "/api/categories";

            const response = await fetch(url, {
                method: isEditing ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to save category");
            }

            const result = await response.json();
            toast.success(`Category ${isEditing ? "updated" : "created"} successfully`);
            onSuccess?.(result.data);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Category name"
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        // Auto-generate slug for new categories
                                        if (!isEditing) {
                                            const slug = slugify(e.target.value);
                                            console.log("Generated slug:", slug);
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                The display name for the category
                            </FormDescription>
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
                                    placeholder="Category description"
                                    {...field}
                                    value={field.value || ""}
                                />
                            </FormControl>
                            <FormDescription>
                                Optional description for the category
                            </FormDescription>
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
                                    placeholder="https://example.com/image.jpg"
                                    {...field}
                                    value={field.value || ""}
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
                    name="commissionRate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Commission Rate (basis points)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="500"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                            </FormControl>
                            <FormDescription>
                                Commission rate in basis points (e.g., 500 = 5%)
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
                                <FormLabel className="text-base">Active</FormLabel>
                                <FormDescription>
                                    Whether this category is active and visible to users
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting
                            ? isEditing
                                ? "Updating..."
                                : "Creating..."
                            : isEditing
                            ? "Update Category"
                            : "Create Category"}
                    </Button>
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
}