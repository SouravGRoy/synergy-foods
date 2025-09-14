"use client";

import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const categorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
    description: z.string().optional(),
    slug: z.string().min(1, "Slug is required"),
    parentCategoryId: z.string().optional(),
    isActive: z.boolean().default(true),
    sortOrder: z.number().int().min(0).default(0),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
});

type CategoryForm = z.infer<typeof categorySchema>;

interface Category {
    id: string;
    name: string;
    description?: string;
    slug: string;
    parentCategoryId?: string;
    isActive: boolean;
    sortOrder: number;
    productCount: number;
    createdAt: Date;
    updatedAt: Date;
    metaTitle?: string;
    metaDescription?: string;
}

interface CategoryManagerProps {
    categories: Category[];
    onCreateCategory: (data: CategoryForm) => Promise<void>;
    onUpdateCategory: (
        id: string,
        data: Partial<CategoryForm>
    ) => Promise<void>;
    onDeleteCategory: (id: string) => Promise<void>;
}

export function CategoryManager({
    categories,
    onCreateCategory,
    onUpdateCategory,
    onDeleteCategory,
}: CategoryManagerProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null
    );
    const [searchTerm, setSearchTerm] = useState("");

    const form = useForm<CategoryForm>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            description: "",
            slug: "",
            parentCategoryId: "",
            isActive: true,
            sortOrder: 0,
            metaTitle: "",
            metaDescription: "",
        },
    });

    const filteredCategories = categories.filter(
        (category) =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    const rootCategories = filteredCategories.filter(
        (cat) => !cat.parentCategoryId
    );
    const subCategories = filteredCategories.filter(
        (cat) => cat.parentCategoryId
    );

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    const handleSubmit = async (data: CategoryForm) => {
        try {
            if (editingCategory) {
                await onUpdateCategory(editingCategory.id, data);
                setEditingCategory(null);
            } else {
                await onCreateCategory(data);
                setIsCreating(false);
            }
            form.reset();
        } catch (error) {
            console.error("Failed to save category:", error);
        }
    };

    const startEdit = (category: Category) => {
        setEditingCategory(category);
        setIsCreating(true);
        form.reset({
            name: category.name,
            description: category.description || "",
            slug: category.slug,
            parentCategoryId: category.parentCategoryId || "",
            isActive: category.isActive,
            sortOrder: category.sortOrder,
            metaTitle: category.metaTitle || "",
            metaDescription: category.metaDescription || "",
        });
    };

    const cancelEdit = () => {
        setEditingCategory(null);
        setIsCreating(false);
        form.reset();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Category Management</h2>
                    <p className="text-muted-foreground">
                        Organize your products into categories and subcategories
                    </p>
                </div>
                <Button
                    onClick={() => setIsCreating(true)}
                    disabled={isCreating}
                >
                    <Icons.Plus className="mr-2 h-4 w-4" />
                    Add Category
                </Button>
            </div>

            {/* Search */}
            <div className="flex items-center space-x-2">
                <div className="relative max-w-sm flex-1">
                    <Icons.Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                    <Input
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Create/Edit Form */}
            {isCreating && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {editingCategory
                                ? "Edit Category"
                                : "Create New Category"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(handleSubmit)}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Category Name *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Enter category name"
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            if (
                                                                !editingCategory
                                                            ) {
                                                                form.setValue(
                                                                    "slug",
                                                                    generateSlug(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                );
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Slug *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="category-slug"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    URL-friendly version of the
                                                    name
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
                                                    {...field}
                                                    placeholder="Enter category description"
                                                    rows={3}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="parentCategoryId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Parent Category
                                                </FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select parent category (optional)" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="">
                                                            None (Root Category)
                                                        </SelectItem>
                                                        {rootCategories
                                                            .filter(
                                                                (cat) =>
                                                                    cat.id !==
                                                                    editingCategory?.id
                                                            )
                                                            .map((category) => (
                                                                <SelectItem
                                                                    key={
                                                                        category.id
                                                                    }
                                                                    value={
                                                                        category.id
                                                                    }
                                                                >
                                                                    {
                                                                        category.name
                                                                    }
                                                                </SelectItem>
                                                            ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="sortOrder"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Sort Order
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        min="0"
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                parseInt(
                                                                    e.target
                                                                        .value
                                                                ) || 0
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Lower numbers appear first
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">
                                                    Active
                                                </FormLabel>
                                                <FormDescription>
                                                    Category will be visible to
                                                    customers
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* SEO Fields */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-medium">
                                        SEO Settings
                                    </h4>
                                    <div className="grid grid-cols-1 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="metaTitle"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Meta Title
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="SEO title for search engines"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="metaDescription"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Meta Description
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            placeholder="SEO description for search engines"
                                                            rows={2}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={cancelEdit}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        {editingCategory
                                            ? "Update Category"
                                            : "Create Category"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            )}

            {/* Categories List */}
            <div className="space-y-4">
                {/* Root Categories */}
                <div>
                    <h3 className="mb-3 text-lg font-semibold">Categories</h3>
                    <div className="grid gap-4">
                        {rootCategories.map((category) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                subCategories={subCategories.filter(
                                    (sub) =>
                                        sub.parentCategoryId === category.id
                                )}
                                onEdit={startEdit}
                                onDelete={onDeleteCategory}
                            />
                        ))}
                    </div>
                </div>

                {/* Orphaned Subcategories */}
                {subCategories.some(
                    (sub) =>
                        !rootCategories.find(
                            (root) => root.id === sub.parentCategoryId
                        )
                ) && (
                    <div>
                        <h3 className="mb-3 text-lg font-semibold">
                            Orphaned Subcategories
                        </h3>
                        <div className="grid gap-4">
                            {subCategories
                                .filter(
                                    (sub) =>
                                        !rootCategories.find(
                                            (root) =>
                                                root.id === sub.parentCategoryId
                                        )
                                )
                                .map((category) => (
                                    <CategoryCard
                                        key={category.id}
                                        category={category}
                                        subCategories={[]}
                                        onEdit={startEdit}
                                        onDelete={onDeleteCategory}
                                    />
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

interface CategoryCardProps {
    category: Category;
    subCategories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (id: string) => Promise<void>;
}

function CategoryCard({
    category,
    subCategories,
    onEdit,
    onDelete,
}: CategoryCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (
            window.confirm(
                `Are you sure you want to delete "${category.name}"?`
            )
        ) {
            setIsDeleting(true);
            try {
                await onDelete(category.id);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                            <h4 className="font-semibold">{category.name}</h4>
                            <Badge
                                variant={
                                    category.isActive ? "default" : "secondary"
                                }
                            >
                                {category.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant="outline">
                                {category.productCount} products
                            </Badge>
                        </div>
                        {category.description && (
                            <p className="mb-2 text-sm text-muted-foreground">
                                {category.description}
                            </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Slug: {category.slug}</span>
                            <span>Order: {category.sortOrder}</span>
                            <span>
                                Created:{" "}
                                {category.createdAt.toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(category)}
                        >
                            <Icons.Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDelete}
                            disabled={isDeleting || category.productCount > 0}
                        >
                            <Icons.Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Subcategories */}
                {subCategories.length > 0 && (
                    <div className="mt-4 space-y-2 border-l-2 pl-4">
                        <h5 className="text-sm font-medium text-muted-foreground">
                            Subcategories:
                        </h5>
                        {subCategories.map((subCategory) => (
                            <div
                                key={subCategory.id}
                                className="flex items-center justify-between rounded bg-muted/50 p-2"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">
                                        {subCategory.name}
                                    </span>
                                    <Badge
                                        variant={
                                            subCategory.isActive
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {subCategory.isActive
                                            ? "Active"
                                            : "Inactive"}
                                    </Badge>
                                    <Badge variant="outline">
                                        {subCategory.productCount} products
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(subCategory)}
                                    >
                                        <Icons.Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(subCategory.id)}
                                        disabled={subCategory.productCount > 0}
                                    >
                                        <Icons.Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
