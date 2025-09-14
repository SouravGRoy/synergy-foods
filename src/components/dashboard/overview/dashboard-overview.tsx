"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    DollarSign,
    Eye,
    Package,
    Plus,
    ShoppingCart,
    TrendingUp,
    Users,
} from "lucide-react";
import Link from "next/link";

// Mock data - in a real app, this would come from your API
const stats = [
    {
        title: "Total Revenue",
        value: "$45,231.00",
        change: "+20.1%",
        changeType: "increase" as const,
        icon: DollarSign,
        description: "from last month",
    },
    {
        title: "Orders",
        value: "1,234",
        change: "+12.5%",
        changeType: "increase" as const,
        icon: ShoppingCart,
        description: "from last month",
    },
    {
        title: "Customers",
        value: "2,847",
        change: "+8.2%",
        changeType: "increase" as const,
        icon: Users,
        description: "active customers",
    },
    {
        title: "Products",
        value: "187",
        change: "-2.1%",
        changeType: "decrease" as const,
        icon: Package,
        description: "in inventory",
    },
];

const recentOrders = [
    {
        id: "#3210",
        customer: "Alice Johnson",
        product: "Wireless Headphones",
        amount: "$299.99",
        status: "completed",
        date: "2 minutes ago",
    },
    {
        id: "#3209",
        customer: "Bob Smith",
        product: "Smart Watch",
        amount: "$399.99",
        status: "processing",
        date: "1 hour ago",
    },
    {
        id: "#3208",
        customer: "Carol Davis",
        product: "Laptop Stand",
        amount: "$89.99",
        status: "shipped",
        date: "3 hours ago",
    },
    {
        id: "#3207",
        customer: "David Wilson",
        product: "USB-C Cable",
        amount: "$24.99",
        status: "completed",
        date: "5 hours ago",
    },
];

const topProducts = [
    {
        name: "Wireless Headphones",
        sales: 234,
        revenue: "$23,400",
        trend: "+15%",
    },
    {
        name: "Smart Watch",
        sales: 189,
        revenue: "$18,900",
        trend: "+8%",
    },
    {
        name: "Laptop Stand",
        sales: 156,
        revenue: "$15,600",
        trend: "+12%",
    },
    {
        name: "USB-C Cable",
        sales: 145,
        revenue: "$14,500",
        trend: "+5%",
    },
];

function getStatusBadge(status: string) {
    switch (status) {
        case "completed":
            return (
                <Badge
                    variant="default"
                    className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                >
                    Completed
                </Badge>
            );
        case "processing":
            return (
                <Badge
                    variant="default"
                    className="bg-amber-100 text-amber-800 hover:bg-amber-200"
                >
                    Processing
                </Badge>
            );
        case "shipped":
            return (
                <Badge
                    variant="default"
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                    Shipped
                </Badge>
            );
        default:
            return (
                <Badge
                    variant="secondary"
                    className="bg-slate-100 text-slate-700"
                >
                    {status}
                </Badge>
            );
    }
}

export function DashboardOverview() {
    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 lg:text-4xl">
                        Dashboard Overview
                    </h1>
                    <p className="mt-2 text-slate-600">
                        Welcome back! Here&apos;s what&apos;s happening with
                        your store today.
                    </p>
                </div>
                <div className="flex space-x-3">
                    <Button
                        asChild
                        className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-600/25 hover:from-blue-700 hover:to-blue-800"
                    >
                        <Link href="/dashboard/products/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        asChild
                        className="border-slate-300 hover:bg-slate-50"
                    >
                        <Link href="/dashboard/analytics">
                            <Eye className="mr-2 h-4 w-4" />
                            View Analytics
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card
                        key={stat.title}
                        className="border-slate-200/60 bg-white/80 backdrop-blur-sm transition-all hover:shadow-lg"
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-semibold text-slate-600">
                                {stat.title}
                            </CardTitle>
                            <div className="rounded-lg bg-slate-100 p-2">
                                <stat.icon className="h-5 w-5 text-slate-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">
                                {stat.value}
                            </div>
                            <div className="mt-2 flex items-center text-sm text-slate-600">
                                {stat.changeType === "increase" ? (
                                    <ArrowUpIcon className="mr-1 h-4 w-4 text-emerald-500" />
                                ) : (
                                    <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
                                )}
                                <span
                                    className={
                                        stat.changeType === "increase"
                                            ? "text-emerald-600"
                                            : "text-red-600"
                                    }
                                >
                                    {stat.change}
                                </span>
                                <span className="ml-1 text-slate-500">
                                    {stat.description}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Recent Orders */}
                <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-200/60 pb-4">
                        <CardTitle className="text-xl font-semibold text-slate-900">
                            Recent Orders
                        </CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="border-slate-300 hover:bg-slate-50"
                        >
                            <Link href="/dashboard/orders">View All</Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-200/60">
                            {recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between p-6 transition-colors hover:bg-slate-50/50"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                                            <div>
                                                <p className="font-semibold text-slate-900">
                                                    {order.id}
                                                </p>
                                                <p className="text-sm text-slate-600">
                                                    {order.customer}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {order.product}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-slate-900">
                                            {order.amount}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {order.date}
                                        </p>
                                    </div>
                                    <div className="ml-4">
                                        {getStatusBadge(order.status)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Products */}
                <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-200/60 pb-4">
                        <CardTitle className="text-xl font-semibold text-slate-900">
                            Top Products
                        </CardTitle>
                        <div className="rounded-lg bg-slate-100 p-2">
                            <TrendingUp className="h-5 w-5 text-slate-600" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {topProducts.map((product, index) => (
                                <div
                                    key={product.name}
                                    className="flex items-center space-x-4"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-sm font-semibold text-white shadow-lg">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-slate-900">
                                            {product.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {product.sales} sales
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-slate-900">
                                            {product.revenue}
                                        </p>
                                        <p className="text-xs font-medium text-emerald-600">
                                            {product.trend}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <Button
                            variant="outline"
                            className="flex h-20 flex-col space-y-2"
                            asChild
                        >
                            <Link href="/dashboard/products/create">
                                <Package className="h-6 w-6" />
                                <span>Add Product</span>
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="flex h-20 flex-col space-y-2"
                            asChild
                        >
                            <Link href="/dashboard/categories">
                                <Plus className="h-6 w-6" />
                                <span>Manage Categories</span>
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="flex h-20 flex-col space-y-2"
                            asChild
                        >
                            <Link href="/dashboard/orders">
                                <ShoppingCart className="h-6 w-6" />
                                <span>View Orders</span>
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="flex h-20 flex-col space-y-2"
                            asChild
                        >
                            <Link href="/dashboard/analytics">
                                <TrendingUp className="h-6 w-6" />
                                <span>Analytics</span>
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
