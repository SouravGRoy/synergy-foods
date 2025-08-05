"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryForm } from "@/components/globals/CategoryForm";
import { formatCommissionRate } from "@/lib/utils/category";
import { CachedCategory } from "@/lib/validations";
import { Plus, Search, MoreHorizontal, Edit, Eye, EyeOff, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function CategoriesManagementPage() {
    const [categories, setCategories] = useState<CachedCategory[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<CachedCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CachedCategory | null>(null);

    const fetchCategories = async () => {
        try {
            const response = await fetch("/api/categories?active=false");
            const result = await response.json();
            if (response.ok) {
                setCategories(result.data);
                setFilteredCategories(result.data);
            } else {
                toast.error("Failed to fetch categories");
            }
        } catch {
            toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const filtered = categories.filter((category) =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCategories(filtered);
    }, [searchTerm, categories]);

    const handleCreateCategory = () => {
        setEditingCategory(null);
        setDialogOpen(true);
    };

    const handleEditCategory = (category: CachedCategory) => {
        setEditingCategory(category);
        setDialogOpen(true);
    };

    const handleToggleActive = async (category: CachedCategory) => {
        try {
            const response = await fetch(`/api/categories/${category.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    isActive: !category.isActive,
                }),
            });

            if (response.ok) {
                toast.success(`Category ${!category.isActive ? "activated" : "deactivated"}`);
                fetchCategories();
            } else {
                toast.error("Failed to update category");
            }
        } catch {
            toast.error("Failed to update category");
        }
    };

    const handleDeleteCategory = async (category: CachedCategory) => {
        if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return;

        try {
            const response = await fetch(`/api/categories/${category.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("Category deleted successfully");
                fetchCategories();
            } else {
                toast.error("Failed to delete category");
            }
        } catch {
            toast.error("Failed to delete category");
        }
    };

    const handleFormSuccess = () => {
        setDialogOpen(false);
        setEditingCategory(null);
        fetchCategories();
    };

    if (loading) {
        return <div className="p-6">Loading categories...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Categories Management</h1>
                    <p className="text-muted-foreground">
                        Manage your product categories and their settings
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleCreateCategory}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                {editingCategory ? "Edit Category" : "Create Category"}
                            </DialogTitle>
                            <DialogDescription>
                                {editingCategory
                                    ? "Update the category information below"
                                    : "Fill in the information to create a new category"
                                }
                            </DialogDescription>
                        </DialogHeader>
                        <CategoryForm
                            category={editingCategory || undefined}
                            onSuccess={handleFormSuccess}
                            onCancel={() => setDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="mb-6">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Commission</TableHead>
                            <TableHead>Subcategories</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCategories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    {searchTerm ? "No categories found matching your search" : "No categories yet"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCategories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {category.imageUrl && (
                                                <img
                                                    src={category.imageUrl}
                                                    alt={category.name}
                                                    className="w-8 h-8 rounded object-cover"
                                                />
                                            )}
                                            <div>
                                                <div className="font-medium">{category.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    /{category.slug}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-xs truncate">
                                            {category.description || "—"}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {formatCommissionRate(category.commissionRate)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {category.subcategories}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={category.isActive ? "default" : "secondary"}>
                                            {category.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => handleEditCategory(category)}
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleToggleActive(category)}
                                                >
                                                    {category.isActive ? (
                                                        <>
                                                            <EyeOff className="h-4 w-4 mr-2" />
                                                            Deactivate
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            Activate
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteCategory(category)}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}