"use client";

import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Price } from "@/components/ui/price";
import Link from "next/link";

interface DashboardStats {
    totalProducts: number;
    totalUsers: number;
    totalCategories: number;
    pendingOrders: number;
    monthlyRevenue: number;
    totalRevenue: number;
    recentActivity: Array<{
        id: string;
        type: "order" | "user" | "product";
        message: string;
        timestamp: Date;
    }>;
}

interface AdminOverviewProps {
    stats: DashboardStats;
}

export function AdminOverview({ stats }: AdminOverviewProps) {
    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Products
                        </CardTitle>
                        <Icons.Store className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalProducts.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Active products in catalog
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Users
                        </CardTitle>
                        <Icons.User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalUsers.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Registered customers
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Categories
                        </CardTitle>
                        <Icons.LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalCategories}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Product categories
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pending Orders
                        </CardTitle>
                        <Icons.ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.pendingOrders}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Awaiting processing
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            <Price value={stats.monthlyRevenue} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            +12.5% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            <Price value={stats.totalRevenue} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            All-time revenue
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button asChild className="w-full justify-start">
                            <Link href="/dashboard/products/create">
                                <Icons.Plus className="mr-2 h-4 w-4" />
                                Add New Product
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="w-full justify-start"
                        >
                            <Link href="/dashboard/categories">
                                <Icons.LayoutDashboard className="mr-2 h-4 w-4" />
                                Manage Categories
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="w-full justify-start"
                        >
                            <Link href="/dashboard/products">
                                <Icons.Store className="mr-2 h-4 w-4" />
                                View All Products
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="w-full justify-start"
                        >
                            <Link href="/dashboard/users">
                                <Icons.User className="mr-2 h-4 w-4" />
                                Manage Users
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.recentActivity.length === 0 ? (
                                <p className="py-4 text-center text-sm text-muted-foreground">
                                    No recent activity
                                </p>
                            ) : (
                                stats.recentActivity.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-start space-x-3"
                                    >
                                        <div className="mt-1">
                                            {activity.type === "order" && (
                                                <Icons.ShoppingBag className="h-4 w-4 text-blue-500" />
                                            )}
                                            {activity.type === "user" && (
                                                <Icons.User className="h-4 w-4 text-green-500" />
                                            )}
                                            {activity.type === "product" && (
                                                <Icons.Store className="h-4 w-4 text-purple-500" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm text-foreground">
                                                {activity.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {activity.timestamp.toLocaleDateString()}{" "}
                                                at{" "}
                                                {activity.timestamp.toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* System Status */}
            <Card>
                <CardHeader>
                    <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="flex items-center justify-between rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span className="text-sm font-medium">
                                    API Status
                                </span>
                            </div>
                            <Badge
                                variant="default"
                                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            >
                                Operational
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                <span className="text-sm font-medium">
                                    Database
                                </span>
                            </div>
                            <Badge
                                variant="default"
                                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                            >
                                Healthy
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between rounded-lg bg-purple-50 p-3 dark:bg-purple-950/20">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-purple-500" />
                                <span className="text-sm font-medium">
                                    Cache
                                </span>
                            </div>
                            <Badge
                                variant="default"
                                className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                            >
                                Active
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
