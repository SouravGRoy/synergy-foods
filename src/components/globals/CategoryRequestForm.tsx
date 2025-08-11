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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CategorySelect, SubcategorySelect } from "@/components/globals/CategorySelect";
import { toast } from "sonner";
import {
    CreateCategoryRequest,
    createCategoryRequestSchema,
    CachedCategory,
    CachedSubcategory
} from "@/lib/validations";
import { getCategoryTypeLabel } from "@/lib/utils/category";
import { useEffect } from "react";

interface CategoryRequestFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function CategoryRequestForm({ onSuccess, onCancel }: CategoryRequestFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState<CachedCategory[]>([]);
    const [subcategories, setSubcategories] = useState<CachedSubcategory[]>([]);
    const [filteredSubcategories, setFilteredSubcategories] = useState<CachedSubcategory[]>([]);

    const form = useForm<CreateCategoryRequest>({
        resolver: zodResolver(createCategoryRequestSchema),
        defaultValues: {
            type: "category",
            name: "",
            description: "",
            parentCategoryId: null,
            parentSubcategoryId: null,
        },
    });

    const watchType = form.watch("type");
    const watchParentCategoryId = form.watch("parentCategoryId");

    useEffect(() => {
        // Fetch categories and subcategories
        const fetchData = async () => {
            try {
                const [categoriesRes, subcategoriesRes] = await Promise.all([
                    fetch("/api/categories"),
                    fetch("/api/subcategories"),
                ]);

                if (categoriesRes.ok) {
                    const categoriesData = await categoriesRes.json();
                    setCategories(categoriesData.data);
                }

                if (subcategoriesRes.ok) {
                    const subcategoriesData = await subcategoriesRes.json();
                    setSubcategories(subcategoriesData.data);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Filter subcategories based on selected category
        if (watchParentCategoryId) {
            const filtered = subcategories.filter(
                (sub) => sub.categoryId === watchParentCategoryId
            );
            setFilteredSubcategories(filtered);
        } else {
            setFilteredSubcategories([]);
        }

        // Reset subcategory selection when category changes
        form.setValue("parentSubcategoryId", null);
    }, [watchParentCategoryId, subcategories, form]);

    const onSubmit = async (values: CreateCategoryRequest) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/category-requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to submit request");
            }

            toast.success("Category request submitted successfully");
            onSuccess?.();
            form.reset();
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
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Request Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select request type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="category">Category</SelectItem>
                                    <SelectItem value="subcategory">Subcategory</SelectItem>
                                    <SelectItem value="product_type">Product Type</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                The type of category you want to request
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
                                    placeholder={`${getCategoryTypeLabel(watchType)} name`}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                The name for the new {getCategoryTypeLabel(watchType).toLowerCase()}
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
                                    placeholder={`Describe the ${getCategoryTypeLabel(watchType).toLowerCase()}`}
                                    {...field}
                                    value={field.value || ""}
                                />
                            </FormControl>
                            <FormDescription>
                                Optional description for the {getCategoryTypeLabel(watchType).toLowerCase()}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {(watchType === "subcategory" || watchType === "product_type") && (
                    <FormField
                        control={form.control}
                        name="parentCategoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Parent Category</FormLabel>
                                <FormControl>
                                    <CategorySelect
                                        categories={categories}
                                        value={field.value || ""}
                                        onValueChange={(value) => field.onChange(value || null)}
                                        placeholder="Select parent category"
                                    />
                                </FormControl>
                                <FormDescription>
                                    The category this {getCategoryTypeLabel(watchType).toLowerCase()} belongs to
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {watchType === "product_type" && (
                    <FormField
                        control={form.control}
                        name="parentSubcategoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Parent Subcategory</FormLabel>
                                <FormControl>
                                    <SubcategorySelect
                                        subcategories={filteredSubcategories}
                                        value={field.value || ""}
                                        onValueChange={(value) => field.onChange(value || null)}
                                        placeholder="Select parent subcategory"
                                        disabled={!watchParentCategoryId}
                                    />
                                </FormControl>
                                <FormDescription>
                                    The subcategory this product type belongs to
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <div className="flex gap-4">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Request"}
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