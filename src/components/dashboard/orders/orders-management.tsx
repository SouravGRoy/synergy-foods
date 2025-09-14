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
import { Download, Eye, Filter, MoreHorizontal, Search } from "lucide-react";

// Mock data
const orders = [
    {
        id: "#3210",
        customer: "Alice Johnson",
        email: "alice@example.com",
        date: "2024-08-14",
        status: "completed",
        total: "$299.99",
        items: 2,
        payment: "Card ending in 4242",
    },
    {
        id: "#3209",
        customer: "Bob Smith",
        email: "bob@example.com",
        date: "2024-08-14",
        status: "processing",
        total: "$399.99",
        items: 1,
        payment: "Card ending in 1234",
    },
    {
        id: "#3208",
        customer: "Carol Davis",
        email: "carol@example.com",
        date: "2024-08-13",
        status: "shipped",
        total: "$89.99",
        items: 3,
        payment: "PayPal",
    },
    {
        id: "#3207",
        customer: "David Wilson",
        email: "david@example.com",
        date: "2024-08-13",
        status: "completed",
        total: "$24.99",
        items: 1,
        payment: "Card ending in 5678",
    },
    {
        id: "#3206",
        customer: "Eva Brown",
        email: "eva@example.com",
        date: "2024-08-12",
        status: "cancelled",
        total: "$159.99",
        items: 2,
        payment: "Card ending in 9876",
    },
];

function getStatusBadge(status: string) {
    switch (status) {
        case "completed":
            return (
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
            );
        case "processing":
            return (
                <Badge className="bg-yellow-100 text-yellow-800">
                    Processing
                </Badge>
            );
        case "shipped":
            return <Badge className="bg-blue-100 text-blue-800">Shipped</Badge>;
        case "cancelled":
            return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
}

export function OrdersManagement() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Orders Management
                    </h1>
                    <p className="mt-1 text-gray-600">
                        View and manage all customer orders
                    </p>
                </div>
                <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Export Orders
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                        <p className="text-xs text-green-600">
                            +12% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Pending Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">23</div>
                        <p className="text-xs text-yellow-600">
                            Needs attention
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Revenue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$45,231</div>
                        <p className="text-xs text-green-600">
                            +8% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Avg. Order Value
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$189</div>
                        <p className="text-xs text-green-600">
                            +5% from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Recent Orders</CardTitle>
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <Input
                                    placeholder="Search orders..."
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
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">
                                        {order.id}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">
                                                {order.customer}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {order.email}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{order.date}</TableCell>
                                    <TableCell>
                                        {getStatusBadge(order.status)}
                                    </TableCell>
                                    <TableCell>{order.items}</TableCell>
                                    <TableCell className="font-medium">
                                        {order.total}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500">
                                        {order.payment}
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
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Download Invoice
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
