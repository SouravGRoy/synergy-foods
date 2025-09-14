"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
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
import {
    AlertTriangle,
    BarChart3,
    Edit,
    Minus,
    MoreHorizontal,
    Package,
    Plus,
    Search,
    TrendingDown,
    TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Enhanced product interface for inventory
interface InventoryProduct {
    id: string;
    name: string;
    sku: string;
    price: number;
    stockQuantity: number;
    lowStockThreshold: number;
    category: string;
    imageUrl?: string;
    status: "in_stock" | "low_stock" | "out_of_stock";
    lastUpdated: string;
    totalSold: number;
    revenue: number;
}

interface InventoryResponse {
    data: InventoryProduct[];
    items: number;
    pages: number;
}

export function AdminInventoryManagement() {
    const [products, setProducts] = useState<InventoryProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedProduct, setSelectedProduct] =
        useState<InventoryProduct | null>(null);
    const [stockUpdateDialog, setStockUpdateDialog] = useState(false);
    const [stockUpdateQuantity, setStockUpdateQuantity] = useState(0);
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStock: 0,
        outOfStock: 0,
        totalValue: 0,
    });

    const fetchInventory = async () => {
        setLoading(true);
        try {
            // In a real app, this would fetch from /api/products with inventory data
            // For now, simulate with mock data
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const mockProducts: InventoryProduct[] = [
                {
                    id: "1",
                    name: "Wireless Bluetooth Headphones",
                    sku: "WBH-001",
                    price: 299.99,
                    stockQuantity: 45,
                    lowStockThreshold: 10,
                    category: "Electronics",
                    imageUrl:
                        "https://thumbs.dreamstime.com/b/white-wireless-headphones-isolated-white-background-white-wireless-headphones-isolated-white-background-top-view-110737619.jpg",
                    status: "in_stock",
                    lastUpdated: new Date().toISOString(),
                    totalSold: 156,
                    revenue: 46764,
                },
                {
                    id: "2",
                    name: "Smart Fitness Watch",
                    sku: "SFW-002",
                    price: 199.99,
                    stockQuantity: 8,
                    lowStockThreshold: 15,
                    category: "Electronics",
                    imageUrl:
                        "https://m.media-amazon.com/images/I/61ZjlBOp+rL._AC_UY1000_.jpg",
                    status: "low_stock",
                    lastUpdated: new Date(Date.now() - 86400000).toISOString(),
                    totalSold: 134,
                    revenue: 26798.66,
                },
                {
                    id: "3",
                    name: "Portable Speaker",
                    sku: "PS-003",
                    price: 89.99,
                    stockQuantity: 0,
                    lowStockThreshold: 5,
                    category: "Electronics",
                    imageUrl:
                        "https://thumbs.dreamstime.com/b/portable-bluetooth-speaker-isolated-white-background-portable-bluetooth-speaker-isolated-white-background-122913816.jpg",
                    status: "out_of_stock",
                    lastUpdated: new Date(Date.now() - 172800000).toISOString(),
                    totalSold: 98,
                    revenue: 8819.02,
                },
                {
                    id: "4",
                    name: "USB-C Charging Cable",
                    sku: "UCC-004",
                    price: 24.99,
                    stockQuantity: 125,
                    lowStockThreshold: 20,
                    category: "Accessories",
                    status: "in_stock",
                    lastUpdated: new Date().toISOString(),
                    totalSold: 234,
                    revenue: 5847.66,
                },
                {
                    id: "5",
                    name: "Laptop Stand",
                    sku: "LS-005",
                    price: 79.99,
                    stockQuantity: 12,
                    lowStockThreshold: 15,
                    category: "Accessories",
                    status: "low_stock",
                    lastUpdated: new Date(Date.now() - 43200000).toISOString(),
                    totalSold: 76,
                    revenue: 6079.24,
                },
            ];

            const filteredProducts = mockProducts.filter((product) => {
                const matchesSearch =
                    product.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    product.sku
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());
                const matchesStatus =
                    statusFilter === "all" || product.status === statusFilter;
                return matchesSearch && matchesStatus;
            });

            setProducts(filteredProducts);
            setTotalItems(filteredProducts.length);
            setTotalPages(Math.ceil(filteredProducts.length / 10));

            // Calculate stats
            const totalValue = mockProducts.reduce(
                (sum, product) => sum + product.price * product.stockQuantity,
                0
            );
            setStats({
                totalProducts: mockProducts.length,
                lowStock: mockProducts.filter((p) => p.status === "low_stock")
                    .length,
                outOfStock: mockProducts.filter(
                    (p) => p.status === "out_of_stock"
                ).length,
                totalValue,
            });
        } catch (error) {
            console.error("Error fetching inventory:", error);
            toast.error("Failed to load inventory");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, [searchTerm, statusFilter]);

    const handleStockUpdate = async (
        productId: string,
        newQuantity: number
    ) => {
        try {
            // In a real app, this would be an API call
            setProducts((prev) =>
                prev.map((product) =>
                    product.id === productId
                        ? {
                              ...product,
                              stockQuantity: newQuantity,
                              status:
                                  newQuantity === 0
                                      ? "out_of_stock"
                                      : newQuantity <= product.lowStockThreshold
                                        ? "low_stock"
                                        : "in_stock",
                              lastUpdated: new Date().toISOString(),
                          }
                        : product
                )
            );

            toast.success("Stock updated successfully");
            setStockUpdateDialog(false);
            setSelectedProduct(null);
        } catch (error) {
            console.error("Error updating stock:", error);
            toast.error("Failed to update stock");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "in_stock":
                return (
                    <Badge className="bg-green-100 text-green-800">
                        In Stock
                    </Badge>
                );
            case "low_stock":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800">
                        Low Stock
                    </Badge>
                );
            case "out_of_stock":
                return (
                    <Badge className="bg-red-100 text-red-800">
                        Out of Stock
                    </Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getStockIcon = (status: string) => {
        switch (status) {
            case "in_stock":
                return <Package className="h-4 w-4 text-green-500" />;
            case "low_stock":
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
            case "out_of_stock":
                return <AlertTriangle className="h-4 w-4 text-red-500" />;
            default:
                return <Package className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Inventory Management
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Monitor and manage product stock levels
                    </p>
                </div>
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
                        <div className="text-2xl font-bold">
                            {stats.totalProducts}
                        </div>
                        <p className="text-xs text-gray-500">Active products</p>
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
                        <div className="text-2xl font-bold text-yellow-600">
                            {stats.lowStock}
                        </div>
                        <p className="text-xs text-yellow-600">
                            Need restocking
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Out of Stock
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {stats.outOfStock}
                        </div>
                        <p className="text-xs text-red-600">No inventory</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Total Value
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            ${stats.totalValue.toFixed(2)}
                        </div>
                        <p className="text-xs text-green-600">
                            Inventory value
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Inventory Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Inventory Overview</CardTitle>
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
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Stock Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="in_stock">
                                        In Stock
                                    </SelectItem>
                                    <SelectItem value="low_stock">
                                        Low Stock
                                    </SelectItem>
                                    <SelectItem value="out_of_stock">
                                        Out of Stock
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
                                Loading inventory...
                            </div>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Sales</TableHead>
                                    <TableHead>Last Updated</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                {product.imageUrl ? (
                                                    <Image
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        width={40}
                                                        height={40}
                                                        className="rounded object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-200">
                                                        <Package className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium">
                                                        {product.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {product.category}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-mono text-sm">
                                                {product.sku}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">
                                                ${product.price}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <span className="font-medium">
                                                    {product.stockQuantity}
                                                </span>
                                                {product.stockQuantity <=
                                                    product.lowStockThreshold && (
                                                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Threshold:{" "}
                                                {product.lowStockThreshold}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                {getStockIcon(product.status)}
                                                {getStatusBadge(product.status)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div className="font-medium">
                                                    {product.totalSold} sold
                                                </div>
                                                <div className="text-gray-500">
                                                    $
                                                    {product.revenue.toFixed(2)}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                product.lastUpdated
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
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedProduct(
                                                                product
                                                            );
                                                            setStockUpdateQuantity(
                                                                product.stockQuantity
                                                            );
                                                            setStockUpdateDialog(
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Update Stock
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleStockUpdate(
                                                                product.id,
                                                                product.stockQuantity +
                                                                    10
                                                            )
                                                        }
                                                    >
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Add 10 Units
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleStockUpdate(
                                                                product.id,
                                                                Math.max(
                                                                    0,
                                                                    product.stockQuantity -
                                                                        5
                                                                )
                                                            )
                                                        }
                                                    >
                                                        <Minus className="mr-2 h-4 w-4" />
                                                        Remove 5 Units
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    {products.length === 0 && !loading && (
                        <div className="flex h-32 items-center justify-center">
                            <div className="text-gray-500">
                                No products found
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Stock Update Dialog */}
            <Dialog
                open={stockUpdateDialog}
                onOpenChange={setStockUpdateDialog}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Update Stock - {selectedProduct?.name}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">
                                Current Stock
                            </label>
                            <div className="text-lg font-bold">
                                {selectedProduct?.stockQuantity} units
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium">
                                New Stock Quantity
                            </label>
                            <Input
                                type="number"
                                value={stockUpdateQuantity}
                                onChange={(e) =>
                                    setStockUpdateQuantity(
                                        parseInt(e.target.value) || 0
                                    )
                                }
                                min="0"
                                className="mt-1"
                            />
                        </div>
                        <div className="flex items-center justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => setStockUpdateDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() =>
                                    selectedProduct &&
                                    handleStockUpdate(
                                        selectedProduct.id,
                                        stockUpdateQuantity
                                    )
                                }
                            >
                                Update Stock
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
