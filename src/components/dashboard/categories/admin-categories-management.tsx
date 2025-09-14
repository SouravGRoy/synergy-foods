"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Edit,
    FolderTree,
    Grid3X3,
    MoreHorizontal,
    Plus,
    Search,
    Tag,
    Trash2,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    commissionRate: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Subcategory {
    id: string;
    categoryId: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface ProductType {
    id: string;
    categoryId: string;
    subcategoryId: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export function AdminCategoriesManagement() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("categories");

    const fetchCategories = async () => {
        try {
            const response = await fetch("/api/categories");
            if (!response.ok) throw new Error("Failed to fetch categories");
            const data = await response.json();
            setCategories(data.data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to load categories");
        }
    };

    const fetchSubcategories = async () => {
        try {
            const response = await fetch("/api/subcategories");
            if (!response.ok) throw new Error("Failed to fetch subcategories");
            const data = await response.json();
            setSubcategories(data.data || []);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
            toast.error("Failed to load subcategories");
        }
    };

    const fetchProductTypes = async () => {
        try {
            const response = await fetch("/api/product-types");
            if (!response.ok) throw new Error("Failed to fetch product types");
            const data = await response.json();
            setProductTypes(data.data || []);
        } catch (error) {
            console.error("Error fetching product types:", error);
            toast.error("Failed to load product types");
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([
                fetchCategories(),
                fetchSubcategories(),
                fetchProductTypes(),
            ]);
            setLoading(false);
        };
        loadData();
    }, []);

    const handleDeleteCategory = async (categoryId: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
            const response = await fetch(`/api/categories/${categoryId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete category");

            toast.success("Category deleted successfully");
            fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Failed to delete category");
        }
    };

    const handleDeleteSubcategory = async (subcategoryId: string) => {
        if (!confirm("Are you sure you want to delete this subcategory?"))
            return;

        try {
            const response = await fetch(
                `/api/subcategories/${subcategoryId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) throw new Error("Failed to delete subcategory");

            toast.success("Subcategory deleted successfully");
            fetchSubcategories();
        } catch (error) {
            console.error("Error deleting subcategory:", error);
            toast.error("Failed to delete subcategory");
        }
    };

    const handleDeleteProductType = async (productTypeId: string) => {
        if (!confirm("Are you sure you want to delete this product type?"))
            return;

        try {
            const response = await fetch(
                `/api/product-types/${productTypeId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) throw new Error("Failed to delete product type");

            toast.success("Product type deleted successfully");
            fetchProductTypes();
        } catch (error) {
            console.error("Error deleting product type:", error);
            toast.error("Failed to delete product type");
        }
    };

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredSubcategories = subcategories.filter((subcategory) =>
        subcategory.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredProductTypes = productTypes.filter((productType) =>
        productType.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getCategoryName = (categoryId: string) => {
        return (
            categories.find((cat) => cat.id === categoryId)?.name || "Unknown"
        );
    };

    const getSubcategoryName = (subcategoryId: string) => {
        return (
            subcategories.find((sub) => sub.id === subcategoryId)?.name ||
            "Unknown"
        );
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Categories Management
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Organize your product catalog with categories,
                        subcategories, and product types
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                            <FolderTree className="mr-2 h-4 w-4" />
                            Categories
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {categories.length}
                        </div>
                        <p className="text-xs text-gray-500">
                            {categories.filter((c) => c.isActive).length} active
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                            <Tag className="mr-2 h-4 w-4" />
                            Subcategories
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {subcategories.length}
                        </div>
                        <p className="text-xs text-gray-500">
                            {subcategories.filter((s) => s.isActive).length}{" "}
                            active
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                            <Grid3X3 className="mr-2 h-4 w-4" />
                            Product Types
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {productTypes.length}
                        </div>
                        <p className="text-xs text-gray-500">
                            {productTypes.filter((p) => p.isActive).length}{" "}
                            active
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Catalog Structure</CardTitle>
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <Input
                                    placeholder="Search..."
                                    className="w-64 pl-10"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="categories">
                                Categories
                            </TabsTrigger>
                            <TabsTrigger value="subcategories">
                                Subcategories
                            </TabsTrigger>
                            <TabsTrigger value="product-types">
                                Product Types
                            </TabsTrigger>
                        </TabsList>

                        {/* Categories Tab */}
                        <TabsContent value="categories">
                            <div className="mb-4 flex justify-end">
                                <Button size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Category
                                </Button>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Commission Rate</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCategories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    {category.imageUrl ? (
                                                        <Image
                                                            src={
                                                                category.imageUrl
                                                            }
                                                            alt={category.name}
                                                            width={40}
                                                            height={40}
                                                            className="rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200">
                                                            <FolderTree className="h-4 w-4 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-medium">
                                                            {category.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {
                                                                category.description
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {category.commissionRate}%
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        category.isActive
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                >
                                                    {category.isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    category.createdAt
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit Category
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleDeleteCategory(
                                                                    category.id
                                                                )
                                                            }
                                                            className="text-red-600"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete Category
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TabsContent>

                        {/* Subcategories Tab */}
                        <TabsContent value="subcategories">
                            <div className="mb-4 flex justify-end">
                                <Button size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Subcategory
                                </Button>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Subcategory</TableHead>
                                        <TableHead>Parent Category</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredSubcategories.map(
                                        (subcategory) => (
                                            <TableRow key={subcategory.id}>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        {subcategory.imageUrl ? (
                                                            <Image
                                                                src={
                                                                    subcategory.imageUrl
                                                                }
                                                                alt={
                                                                    subcategory.name
                                                                }
                                                                width={40}
                                                                height={40}
                                                                className="rounded-lg object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200">
                                                                <Tag className="h-4 w-4 text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="font-medium">
                                                                {
                                                                    subcategory.name
                                                                }
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {
                                                                    subcategory.description
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {getCategoryName(
                                                        subcategory.categoryId
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            subcategory.isActive
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                    >
                                                        {subcategory.isActive
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(
                                                        subcategory.createdAt
                                                    ).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit Subcategory
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleDeleteSubcategory(
                                                                        subcategory.id
                                                                    )
                                                                }
                                                                className="text-red-600"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                                Subcategory
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </TabsContent>

                        {/* Product Types Tab */}
                        <TabsContent value="product-types">
                            <div className="mb-4 flex justify-end">
                                <Button size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Product Type
                                </Button>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product Type</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Subcategory</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProductTypes.map((productType) => (
                                        <TableRow key={productType.id}>
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    {productType.imageUrl ? (
                                                        <Image
                                                            src={
                                                                productType.imageUrl
                                                            }
                                                            alt={
                                                                productType.name
                                                            }
                                                            width={40}
                                                            height={40}
                                                            className="rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200">
                                                            <Grid3X3 className="h-4 w-4 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-medium">
                                                            {productType.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {
                                                                productType.description
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getCategoryName(
                                                    productType.categoryId
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {getSubcategoryName(
                                                    productType.subcategoryId
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        productType.isActive
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                >
                                                    {productType.isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    productType.createdAt
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit Product Type
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleDeleteProductType(
                                                                    productType.id
                                                                )
                                                            }
                                                            className="text-red-600"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete Product Type
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
