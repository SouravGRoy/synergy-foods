"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Activity,
    BarChart3,
    Calendar,
    DollarSign,
    Eye,
    Package,
    PieChart,
    ShoppingCart,
    Star,
    TrendingDown,
    TrendingUp,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface AnalyticsData {
    revenue: {
        current: number;
        previous: number;
        change: number;
    };
    orders: {
        current: number;
        previous: number;
        change: number;
    };
    customers: {
        current: number;
        previous: number;
        change: number;
    };
    products: {
        current: number;
        previous: number;
        change: number;
    };
    topProducts: Array<{
        id: string;
        name: string;
        sales: number;
        revenue: number;
    }>;
    topCategories: Array<{
        name: string;
        sales: number;
        percentage: number;
    }>;
    recentActivity: Array<{
        id: string;
        type: "order" | "product" | "user";
        description: string;
        timestamp: string;
    }>;
}

export function AdminAnalyticsDashboard() {
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState("30d");
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        revenue: { current: 0, previous: 0, change: 0 },
        orders: { current: 0, previous: 0, change: 0 },
        customers: { current: 0, previous: 0, change: 0 },
        products: { current: 0, previous: 0, change: 0 },
        topProducts: [],
        topCategories: [],
        recentActivity: [],
    });

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Mock analytics data - replace with actual API calls
            const mockData: AnalyticsData = {
                revenue: {
                    current: 45678.9,
                    previous: 38234.56,
                    change: 19.5,
                },
                orders: {
                    current: 342,
                    previous: 289,
                    change: 18.3,
                },
                customers: {
                    current: 1456,
                    previous: 1234,
                    change: 18.0,
                },
                products: {
                    current: 89,
                    previous: 76,
                    change: 17.1,
                },
                topProducts: [
                    {
                        id: "1",
                        name: "Wireless Headphones",
                        sales: 156,
                        revenue: 23400,
                    },
                    {
                        id: "2",
                        name: "Smart Watch",
                        sales: 134,
                        revenue: 20100,
                    },
                    {
                        id: "3",
                        name: "Bluetooth Speaker",
                        sales: 98,
                        revenue: 8820,
                    },
                    { id: "4", name: "Phone Case", sales: 87, revenue: 2175 },
                    { id: "5", name: "Laptop Stand", sales: 76, revenue: 6080 },
                ],
                topCategories: [
                    { name: "Electronics", sales: 456, percentage: 45.6 },
                    { name: "Accessories", sales: 234, percentage: 23.4 },
                    { name: "Home & Garden", sales: 156, percentage: 15.6 },
                    { name: "Sports", sales: 98, percentage: 9.8 },
                    { name: "Books", sales: 56, percentage: 5.6 },
                ],
                recentActivity: [
                    {
                        id: "1",
                        type: "order",
                        description: "New order #ORD-001 placed by John Doe",
                        timestamp: new Date(Date.now() - 300000).toISOString(),
                    },
                    {
                        id: "2",
                        type: "product",
                        description:
                            "Product 'Wireless Mouse' added to catalog",
                        timestamp: new Date(Date.now() - 600000).toISOString(),
                    },
                    {
                        id: "3",
                        type: "user",
                        description: "New user Jane Smith registered",
                        timestamp: new Date(Date.now() - 900000).toISOString(),
                    },
                    {
                        id: "4",
                        type: "order",
                        description: "Order #ORD-002 shipped to Los Angeles",
                        timestamp: new Date(Date.now() - 1200000).toISOString(),
                    },
                    {
                        id: "5",
                        type: "product",
                        description: "Product 'Smart Phone' stock updated",
                        timestamp: new Date(Date.now() - 1500000).toISOString(),
                    },
                ],
            };

            setAnalytics(mockData);
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-AE", {
            style: "currency",
            currency: "AED",
        }).format(amount);
    };

    const formatPercentage = (value: number) => {
        const isPositive = value > 0;
        return (
            <span
                className={`flex items-center ${isPositive ? "text-green-600" : "text-red-600"}`}
            >
                {isPositive ? (
                    <TrendingUp className="mr-1 h-3 w-3" />
                ) : (
                    <TrendingDown className="mr-1 h-3 w-3" />
                )}
                {Math.abs(value).toFixed(1)}%
            </span>
        );
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case "order":
                return <ShoppingCart className="h-4 w-4 text-blue-500" />;
            case "product":
                return <Package className="h-4 w-4 text-green-500" />;
            case "user":
                return <Users className="h-4 w-4 text-purple-500" />;
            default:
                return <Activity className="h-4 w-4 text-gray-500" />;
        }
    };

    const getTimeAgo = (timestamp: string) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInMinutes = Math.floor(
            (now.getTime() - time.getTime()) / 60000
        );

        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440)
            return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Analytics Dashboard
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Track your business performance and insights
                    </p>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 3 months</SelectItem>
                        <SelectItem value="1y">Last year</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Total Revenue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(analytics.revenue.current)}
                        </div>
                        <div className="mt-1 flex items-center">
                            {formatPercentage(analytics.revenue.change)}
                            <span className="ml-2 text-xs text-gray-500">
                                vs last period
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Total Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {analytics.orders.current}
                        </div>
                        <div className="mt-1 flex items-center">
                            {formatPercentage(analytics.orders.change)}
                            <span className="ml-2 text-xs text-gray-500">
                                vs last period
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                            <Users className="mr-2 h-4 w-4" />
                            Total Customers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {analytics.customers.current}
                        </div>
                        <div className="mt-1 flex items-center">
                            {formatPercentage(analytics.customers.change)}
                            <span className="ml-2 text-xs text-gray-500">
                                vs last period
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                            <Package className="mr-2 h-4 w-4" />
                            Active Products
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {analytics.products.current}
                        </div>
                        <div className="mt-1 flex items-center">
                            {formatPercentage(analytics.products.change)}
                            <span className="ml-2 text-xs text-gray-500">
                                vs last period
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts and Tables Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Top Products */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <BarChart3 className="mr-2 h-5 w-5" />
                            Top Products
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analytics.topProducts.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                            <span className="text-sm font-semibold text-blue-600">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="font-medium">
                                                {product.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {product.sales} sales
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium">
                                            {formatCurrency(product.revenue)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Categories */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <PieChart className="mr-2 h-5 w-5" />
                            Top Categories
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analytics.topCategories.map((category, index) => (
                                <div
                                    key={category.name}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="h-3 w-3 rounded-full"
                                            style={{
                                                backgroundColor: `hsl(${index * 72}, 70%, 50%)`,
                                            }}
                                        ></div>
                                        <div>
                                            <div className="font-medium">
                                                {category.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {category.sales} sales
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="outline">
                                            {category.percentage}%
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Activity className="mr-2 h-5 w-5" />
                        Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex h-32 items-center justify-center">
                            <div className="text-gray-500">
                                Loading activity...
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {analytics.recentActivity.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-start space-x-3"
                                >
                                    <div className="mt-1">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm">
                                            {activity.description}
                                        </div>
                                        <div className="mt-1 text-xs text-gray-500">
                                            {getTimeAgo(activity.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
