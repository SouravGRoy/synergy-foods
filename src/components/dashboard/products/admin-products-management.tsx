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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { FullProduct } from "@/lib/validations/product";
import {
    AlertTriangle,
    DollarSign,
    Edit,
    Eye,
    Filter,
    MoreHorizontal,
    Package,
    Plus,
    Search,
    Trash2,
    TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function getStatusBadge(product: FullProduct) {
    if (!product.isActive) {
        return <Badge variant="secondary">Inactive</Badge>;
    }
    if (!product.isPublished) {
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
    }
    if (!product.isAvailable) {
        return <Badge className="bg-red-100 text-red-800">Unavailable</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Active</Badge>;
}

function getVerificationBadge(status: string) {
    switch (status) {
        case "approved":
            return (
                <Badge className="bg-green-100 text-green-800">Approved</Badge>
            );
        case "pending":
            return (
                <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
            );
        case "rejected":
            return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
        default:
            return <Badge variant="secondary">Idle</Badge>;
    }
}

interface ProductsResponse {
    data: FullProduct[];
    items: number;
    pages: number;
}

export function AdminProductsManagement() {
    const [products, setProducts] = useState<FullProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        draft: 0,
        lowStock: 0,
    });

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: "10",
                ...(searchTerm && { search: searchTerm }),
                ...(categoryFilter !== "all" && { categoryId: categoryFilter }),
                ...(statusFilter !== "all" && {
                    ...(statusFilter === "active" && {
                        isActive: "true",
                        isPublished: "true",
                    }),
                    ...(statusFilter === "draft" && { isPublished: "false" }),
                    ...(statusFilter === "inactive" && { isActive: "false" }),
                }),
            });

            const response = await fetch(`/api/products?${params}`);
            if (!response.ok) throw new Error("Failed to fetch products");

            const result: ProductsResponse = await response.json();
            setProducts(result.data || []);
            setTotalItems(result.items);
            setTotalPages(result.pages);

            // Calculate stats
            setStats({
                total: result.items,
                active:
                    result.data?.filter((p) => p.isActive && p.isPublished)
                        .length || 0,
                draft: result.data?.filter((p) => !p.isPublished).length || 0,
                lowStock:
                    result.data?.filter((p) => (p.quantity || 0) < 10).length ||
                    0,
            });
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [currentPage, searchTerm, categoryFilter, statusFilter]);

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete product");

            toast.success("Product deleted successfully");
            fetchProducts(); // Refresh the list
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product");
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Products Management
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Manage your product catalog and inventory
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/products/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Link>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                            <Package className="mr-2 h-4 w-4" />
                            Total Products
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-gray-500">All products</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Active Products
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {stats.active}
                        </div>
                        <p className="text-xs text-green-600">Live on store</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Draft Products
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {stats.draft}
                        </div>
                        <p className="text-xs text-yellow-600">
                            Pending publish
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Low Stock
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {stats.lowStock}
                        </div>
                        <p className="text-xs text-red-600">Need restocking</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Product Catalog</CardTitle>
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <Input
                                    placeholder="Search products..."
                                    className="w-64 pl-10"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>

                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="inactive">
                                        Inactive
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex h-32 items-center justify-center">
                            <div className="text-gray-500">
                                Loading products...
                            </div>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Verification</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                {product.media?.[0]?.mediaItem
                                                    ?.url ? (
                                                    <Image
                                                        src={
                                                            product.media[0]
                                                                .mediaItem.url
                                                        }
                                                        alt={product.title}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200">
                                                        <Package className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium">
                                                        {product.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {product.sku}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {product.category?.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {product.subcategory?.name}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">
                                                $
                                                {(
                                                    (product.price || 0) / 100
                                                ).toFixed(2)}
                                            </div>
                                            {product.compareAtPrice && (
                                                <div className="text-sm text-gray-500 line-through">
                                                    $
                                                    {(
                                                        (product.compareAtPrice ||
                                                            0) / 100
                                                    ).toFixed(2)}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={
                                                    (product.quantity || 0) < 10
                                                        ? "font-medium text-red-600"
                                                        : ""
                                                }
                                            >
                                                {product.quantity || 0}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(product)}
                                        </TableCell>
                                        <TableCell>
                                            {getVerificationBadge(
                                                product.verificationStatus
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                product.createdAt
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/shop/products/${product.slug}`}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Product
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/dashboard/products/${product.id}/edit`}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit Product
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleDeleteProduct(
                                                                product.id
                                                            )
                                                        }
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete Product
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                Showing {(currentPage - 1) * 10 + 1} to{" "}
                                {Math.min(currentPage * 10, totalItems)} of{" "}
                                {totalItems} products
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(1, prev - 1)
                                        )
                                    }
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.min(totalPages, prev + 1)
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
