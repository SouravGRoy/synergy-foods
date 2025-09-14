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
import {
    AlertTriangle,
    Edit,
    Filter,
    MoreHorizontal,
    Package,
    Search,
} from "lucide-react";

// Mock data
const inventoryItems = [
    {
        id: "1",
        name: "Wireless Headphones",
        sku: "WH-001",
        category: "Electronics",
        stock: 45,
        reserved: 5,
        available: 40,
        lowStockThreshold: 10,
        price: "$299.99",
        status: "in_stock",
    },
    {
        id: "2",
        name: "Smart Watch",
        sku: "SW-002",
        category: "Electronics",
        stock: 8,
        reserved: 2,
        available: 6,
        lowStockThreshold: 10,
        price: "$399.99",
        status: "low_stock",
    },
    {
        id: "3",
        name: "Laptop Stand",
        sku: "LS-003",
        category: "Accessories",
        stock: 0,
        reserved: 0,
        available: 0,
        lowStockThreshold: 5,
        price: "$89.99",
        status: "out_of_stock",
    },
    {
        id: "4",
        name: "USB-C Cable",
        sku: "UC-004",
        category: "Accessories",
        stock: 150,
        reserved: 10,
        available: 140,
        lowStockThreshold: 20,
        price: "$24.99",
        status: "in_stock",
    },
    {
        id: "5",
        name: "Bluetooth Speaker",
        sku: "BS-005",
        category: "Electronics",
        stock: 15,
        reserved: 3,
        available: 12,
        lowStockThreshold: 15,
        price: "$129.99",
        status: "low_stock",
    },
];

function getStatusBadge(status: string, stock: number, threshold: number) {
    if (stock === 0) {
        return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>;
    } else if (stock <= threshold) {
        return (
            <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
        );
    } else {
        return <Badge className="bg-green-100 text-green-800">In Stock</Badge>;
    }
}

export function InventoryManagement() {
    const totalItems = inventoryItems.length;
    const lowStockItems = inventoryItems.filter(
        (item) => item.stock <= item.lowStockThreshold && item.stock > 0
    ).length;
    const outOfStockItems = inventoryItems.filter(
        (item) => item.stock === 0
    ).length;
    const totalValue = inventoryItems.reduce(
        (acc, item) =>
            acc + item.stock * parseFloat(item.price.replace("$", "")),
        0
    );

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Inventory Management
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Track and manage your product inventory
                    </p>
                </div>
                <Button>
                    <Package className="mr-2 h-4 w-4" />
                    Add Stock
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Products
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalItems}</div>
                        <p className="text-xs text-gray-500">Tracked items</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Low Stock Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {lowStockItems}
                        </div>
                        <p className="text-xs text-yellow-600">
                            Items need restocking
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Out of Stock
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {outOfStockItems}
                        </div>
                        <p className="text-xs text-red-600">
                            Urgent attention needed
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Inventory Value
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${totalValue.toLocaleString()}
                        </div>
                        <p className="text-xs text-green-600">
                            Total stock value
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Inventory Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Inventory Items</CardTitle>
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <Input
                                    placeholder="Search products..."
                                    className="w-64 pl-10"
                                />
                            </div>
                            <Button variant="outline" size="sm">
                                <Filter className="mr-2 h-4 w-4" />
                                Filter
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Reserved</TableHead>
                                <TableHead>Available</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inventoryItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            {item.stock <=
                                                item.lowStockThreshold && (
                                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                            )}
                                            <div className="font-medium">
                                                {item.name}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">
                                        {item.sku}
                                    </TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>
                                        <span
                                            className={
                                                item.stock === 0
                                                    ? "font-medium text-red-600"
                                                    : ""
                                            }
                                        >
                                            {item.stock}
                                        </span>
                                    </TableCell>
                                    <TableCell>{item.reserved}</TableCell>
                                    <TableCell>{item.available}</TableCell>
                                    <TableCell>
                                        {getStatusBadge(
                                            item.status,
                                            item.stock,
                                            item.lowStockThreshold
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {item.price}
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
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit Stock
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Package className="mr-2 h-4 w-4" />
                                                    Add Stock
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
