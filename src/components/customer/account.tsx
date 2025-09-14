"use client";

import { DeliveryTracking } from "@/components/delivery";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Price } from "@/components/ui/price";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, useCustomer } from "@/lib/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function CustomerAccount() {
    const { useCurrentUser } = useAuth();
    const { useStats, useOrders, useProfile, useAddresses } = useCustomer();
    const [activeTab, setActiveTab] = useState("overview");

    const { data: user } = useCurrentUser();
    const { data: stats, isLoading: statsLoading } = useStats();
    const { data: ordersData, isLoading: ordersLoading } = useOrders({
        limit: 10,
    });
    const { data: profileData } = useProfile();
    const { data: addressesData, isLoading: addressesLoading } = useAddresses();

    if (!user) {
        return (
            <div className="py-12 text-center">
                <h1 className="mb-4 text-2xl font-bold">Please sign in</h1>
                <Button asChild>
                    <Link href="/auth/signin">Sign In</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-card/20 to-background">
            <div className="container mx-auto space-y-8 px-4 py-8">
                <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 p-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 backdrop-blur-3xl"></div>
                    <div className="relative flex items-center justify-between">
                        <div>
                            <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-4xl font-bold text-transparent">
                                My Account
                            </h1>
                            <p className="mt-3 text-lg text-muted-foreground">
                                Welcome back,{" "}
                                <span className="font-semibold text-card-foreground">
                                    {user.firstName}
                                </span>
                                !
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Badge
                                variant="secondary"
                                className="border-accent/20 bg-accent/10 text-accent-foreground"
                            >
                                <Icons.Heart className="mr-2 h-4 w-4" />
                                Member since{" "}
                                {new Date(user.createdAt).getFullYear()}
                            </Badge>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-primary/20 bg-card/50 backdrop-blur-sm hover:bg-primary/10"
                            >
                                <Icons.Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Button>
                        </div>
                    </div>
                </div>

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-6 rounded-xl border border-primary/10 bg-card/50 p-1 backdrop-blur-sm">
                        <TabsTrigger
                            value="overview"
                            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            <Icons.LifeBuoy className="h-4 w-4" />
                            <span className="hidden sm:inline">Overview</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="orders"
                            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            <Icons.ShoppingBag className="h-4 w-4" />
                            <span className="hidden sm:inline">Orders</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="tracking"
                            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            <Icons.Truck className="h-4 w-4" />
                            <span className="hidden sm:inline">Tracking</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="profile"
                            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            <Icons.User className="h-4 w-4" />
                            <span className="hidden sm:inline">Profile</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="addresses"
                            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            <Icons.MapPin className="h-4 w-4" />
                            <span className="hidden sm:inline">Addresses</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="security"
                            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            <Icons.Shield className="h-4 w-4" />
                            <span className="hidden sm:inline">Security</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="mt-8 space-y-8">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-card to-card/50 transition-all duration-300 hover:shadow-lg">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                                <CardHeader className="relative pb-2">
                                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                        <Icons.ShoppingBag className="h-4 w-4 text-primary" />
                                        Total Orders
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="relative">
                                    {statsLoading ? (
                                        <Skeleton className="h-8 w-16" />
                                    ) : (
                                        <div className="text-3xl font-bold text-card-foreground">
                                            {stats?.data?.totalOrders || 0}
                                        </div>
                                    )}
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        All time
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="relative overflow-hidden border-accent/20 bg-gradient-to-br from-card to-card/50 transition-all duration-300 hover:shadow-lg">
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent"></div>
                                <CardHeader className="relative pb-2">
                                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                        <Icons.DollarSign className="h-4 w-4 text-accent" />
                                        Total Spent
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="relative">
                                    {statsLoading ? (
                                        <Skeleton className="h-8 w-20" />
                                    ) : (
                                        <div className="text-3xl font-bold text-card-foreground">
                                            <Price
                                                value={
                                                    stats?.data?.totalSpent || 0
                                                }
                                            />
                                        </div>
                                    )}
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        All time
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-card to-card/50 transition-all duration-300 hover:shadow-lg">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                                <CardHeader className="relative pb-2">
                                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                        <Icons.MapPin className="h-4 w-4 text-primary" />
                                        Addresses
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="relative">
                                    {addressesLoading ? (
                                        <Skeleton className="h-8 w-8" />
                                    ) : (
                                        <div className="text-3xl font-bold text-card-foreground">
                                            {addressesData?.data?.length || 0}
                                        </div>
                                    )}
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Saved addresses
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="relative overflow-hidden border-accent/20 bg-gradient-to-br from-card to-card/50 transition-all duration-300 hover:shadow-lg">
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent"></div>
                                <CardHeader className="relative pb-2">
                                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                        <Icons.Apple className="h-4 w-4 text-accent" />
                                        Account Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="relative">
                                    <Badge
                                        variant="default"
                                        className="bg-accent text-accent-foreground"
                                    >
                                        Active
                                    </Badge>
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Good standing
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50 shadow-lg">
                                <CardHeader className="flex flex-row items-center justify-between rounded-t-lg bg-gradient-to-r from-primary/5 to-accent/5">
                                    <CardTitle className="flex items-center gap-2">
                                        <Icons.Shield className="h-5 w-5 text-primary" />
                                        Recent Orders
                                    </CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setActiveTab("orders")}
                                        className="border-primary/20 bg-card/50 hover:bg-primary/10"
                                    >
                                        View All
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        {ordersLoading ? (
                                            Array.from({ length: 3 }).map(
                                                (_, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-center justify-between rounded-xl border border-primary/10 bg-gradient-to-r from-card/50 to-transparent p-4"
                                                    >
                                                        <div className="space-y-2">
                                                            <Skeleton className="h-4 w-24" />
                                                            <Skeleton className="h-3 w-16" />
                                                        </div>
                                                        <Skeleton className="h-4 w-16" />
                                                    </div>
                                                )
                                            )
                                        ) : ordersData?.data?.length > 0 ? (
                                            ordersData.data
                                                .slice(0, 3)
                                                .map((orderData: any) => (
                                                    <div
                                                        key={orderData.order.id}
                                                        className="rounded-xl border border-primary/10 bg-gradient-to-r from-card/50 to-transparent p-4 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md"
                                                    >
                                                        <div className="mb-3 flex items-start justify-between">
                                                            <div>
                                                                <p className="text-sm font-semibold text-card-foreground">
                                                                    Order #
                                                                    {
                                                                        orderData
                                                                            .order
                                                                            .orderNumber
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {new Date(
                                                                        orderData.order.createdAt
                                                                    ).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <Price
                                                                    value={
                                                                        orderData
                                                                            .order
                                                                            .total ||
                                                                        0
                                                                    }
                                                                    className="text-sm font-semibold text-card-foreground"
                                                                />
                                                                <Badge
                                                                    variant={
                                                                        orderData
                                                                            .order
                                                                            .status ===
                                                                        "delivered"
                                                                            ? "default"
                                                                            : orderData
                                                                                    .order
                                                                                    .status ===
                                                                                "shipped"
                                                                              ? "secondary"
                                                                              : "outline"
                                                                    }
                                                                    className="mt-1 text-xs"
                                                                >
                                                                    {
                                                                        orderData
                                                                            .order
                                                                            .status
                                                                    }
                                                                </Badge>
                                                            </div>
                                                        </div>

                                                        {/* Product Images Preview */}
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            {orderData.items
                                                                ?.slice(0, 3)
                                                                .map(
                                                                    (
                                                                        item: any,
                                                                        index: number
                                                                    ) => {
                                                                        const productImage =
                                                                            item.resolvedImageUrl ||
                                                                            item
                                                                                .orderItem
                                                                                ?.productImage ||
                                                                            item
                                                                                .product
                                                                                ?.media?.[0]
                                                                                ?.mediaItem
                                                                                ?.url ||
                                                                            item
                                                                                .product
                                                                                ?.media?.[0]
                                                                                ?.url;
                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-primary/10 bg-gradient-to-br from-card to-muted"
                                                                            >
                                                                                {productImage ? (
                                                                                    <Image
                                                                                        src={
                                                                                            productImage ||
                                                                                            "/placeholder.svg"
                                                                                        }
                                                                                        alt={
                                                                                            item
                                                                                                .orderItem
                                                                                                ?.productTitle ||
                                                                                            "Product"
                                                                                        }
                                                                                        fill
                                                                                        className="h-full w-full object-cover"
                                                                                    />
                                                                                ) : (
                                                                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-card">
                                                                                        <Icons.ShoppingBag className="h-5 w-5 text-muted-foreground" />
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            {orderData.items
                                                                ?.length >
                                                                3 && (
                                                                <span className="ml-2 text-xs font-medium text-muted-foreground">
                                                                    +
                                                                    {orderData
                                                                        .items
                                                                        .length -
                                                                        3}{" "}
                                                                    more
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                        ) : (
                                            <div className="py-8 text-center">
                                                <Icons.ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                                <p className="text-muted-foreground">
                                                    No orders yet
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-accent/20 bg-gradient-to-br from-card to-card/50 shadow-lg">
                                <CardHeader className="rounded-t-lg bg-gradient-to-r from-accent/5 to-primary/5">
                                    <CardTitle className="flex items-center gap-2">
                                        <Icons.Pencil className="h-5 w-5 text-accent" />
                                        Quick Actions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 p-6">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start border-primary/20 bg-gradient-to-r from-card/50 to-transparent transition-all duration-300 hover:border-primary/30 hover:bg-primary/10"
                                        asChild
                                    >
                                        <Link href="/shop">
                                            <Icons.ShoppingBag className="mr-3 h-5 w-5 text-primary" />
                                            Continue Shopping
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start border-primary/20 bg-gradient-to-r from-card/50 to-transparent transition-all duration-300 hover:border-primary/30 hover:bg-primary/10"
                                        onClick={() =>
                                            setActiveTab("addresses")
                                        }
                                    >
                                        <Icons.MapPin className="mr-3 h-5 w-5 text-primary" />
                                        Manage Addresses
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start border-primary/20 bg-gradient-to-r from-card/50 to-transparent transition-all duration-300 hover:border-primary/30 hover:bg-primary/10"
                                        onClick={() => setActiveTab("profile")}
                                    >
                                        <Icons.User className="mr-3 h-5 w-5 text-primary" />
                                        Edit Profile
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start border-primary/20 bg-gradient-to-r from-card/50 to-transparent transition-all duration-300 hover:border-primary/30 hover:bg-primary/10"
                                    >
                                        <Icons.HelpCircle className="mr-3 h-5 w-5 text-primary" />
                                        Help & Support
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Orders Tab */}
                    <TabsContent value="orders" className="mt-8 space-y-6">
                        <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50 shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between rounded-t-lg bg-gradient-to-r from-primary/5 to-accent/5">
                                <CardTitle className="flex items-center gap-2">
                                    <Icons.Mail className="h-5 w-5 text-primary" />
                                    Order History
                                </CardTitle>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-primary/20 bg-card/50 hover:bg-primary/10"
                                    >
                                        <Icons.Filter className="mr-2 h-4 w-4" />
                                        Filter
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-primary/20 bg-card/50 hover:bg-primary/10"
                                    >
                                        <Icons.Download className="mr-2 h-4 w-4" />
                                        Export
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {ordersLoading ? (
                                        Array.from({ length: 5 }).map(
                                            (_, i) => (
                                                <div
                                                    key={i}
                                                    className="rounded-xl border border-primary/10 bg-gradient-to-r from-card/50 to-transparent p-6"
                                                >
                                                    <div className="mb-3 flex items-center justify-between">
                                                        <div className="space-y-2">
                                                            <Skeleton className="h-5 w-32" />
                                                            <Skeleton className="h-4 w-24" />
                                                        </div>
                                                        <div className="space-y-2 text-right">
                                                            <Skeleton className="h-5 w-20" />
                                                            <Skeleton className="h-4 w-16" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-4 w-full" />
                                                        <Skeleton className="h-4 w-3/4" />
                                                    </div>
                                                </div>
                                            )
                                        )
                                    ) : ordersData?.data?.length > 0 ? (
                                        <div className="space-y-6">
                                            {ordersData.data.map(
                                                (orderData: any) => (
                                                    <Card
                                                        key={orderData.order.id}
                                                        className="overflow-hidden border-primary/20 bg-gradient-to-br from-card to-card/50 transition-all duration-300 hover:shadow-xl"
                                                    >
                                                        <CardContent className="p-0">
                                                            {/* Order Header */}
                                                            <div className="border-b border-primary/10 bg-gradient-to-r from-primary/5 to-accent/5 px-6 py-4">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-4">
                                                                        <div>
                                                                            <h3 className="text-lg font-semibold text-card-foreground">
                                                                                Order
                                                                                #
                                                                                {
                                                                                    orderData
                                                                                        .order
                                                                                        .orderNumber
                                                                                }
                                                                            </h3>
                                                                            <p className="text-sm text-muted-foreground">
                                                                                Placed
                                                                                on{" "}
                                                                                {new Date(
                                                                                    orderData.order.createdAt
                                                                                ).toLocaleDateString()}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <Price
                                                                            value={
                                                                                orderData
                                                                                    .order
                                                                                    .total ||
                                                                                0
                                                                            }
                                                                            className="text-lg font-semibold text-card-foreground"
                                                                        />
                                                                        <div className="mt-1">
                                                                            <Badge
                                                                                variant={
                                                                                    orderData
                                                                                        .order
                                                                                        .status ===
                                                                                    "delivered"
                                                                                        ? "default"
                                                                                        : orderData
                                                                                                .order
                                                                                                .status ===
                                                                                            "shipped"
                                                                                          ? "secondary"
                                                                                          : orderData
                                                                                                  .order
                                                                                                  .status ===
                                                                                              "confirmed"
                                                                                            ? "outline"
                                                                                            : "destructive"
                                                                                }
                                                                                className="text-xs font-medium"
                                                                            >
                                                                                {orderData.order.status.toUpperCase()}
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Order Items */}
                                                            <div className="p-6">
                                                                <div className="space-y-4">
                                                                    {orderData.items?.map(
                                                                        (
                                                                            item: any,
                                                                            index: number
                                                                        ) => {
                                                                            const productImage =
                                                                                item.resolvedImageUrl ||
                                                                                item
                                                                                    .orderItem
                                                                                    ?.productImage ||
                                                                                item
                                                                                    .product
                                                                                    ?.media?.[0]
                                                                                    ?.mediaItem
                                                                                    ?.url ||
                                                                                item
                                                                                    .product
                                                                                    ?.media?.[0]
                                                                                    ?.url;

                                                                            return (
                                                                                <div
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    className="flex items-center gap-4 rounded-xl border border-primary/10 bg-gradient-to-r from-card/50 to-transparent p-4 transition-all duration-300 hover:border-primary/20"
                                                                                >
                                                                                    {/* Product Image */}
                                                                                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-primary/10 bg-gradient-to-br from-card to-muted">
                                                                                        {productImage ? (
                                                                                            <Image
                                                                                                fill
                                                                                                src={
                                                                                                    productImage ||
                                                                                                    "/placeholder.svg"
                                                                                                }
                                                                                                alt={
                                                                                                    item
                                                                                                        .orderItem
                                                                                                        ?.productTitle ||
                                                                                                    "Product"
                                                                                                }
                                                                                                className="h-full w-full object-cover"
                                                                                            />
                                                                                        ) : (
                                                                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-card">
                                                                                                <Icons.Package className="h-6 w-6 text-muted-foreground" />
                                                                                            </div>
                                                                                        )}
                                                                                    </div>

                                                                                    {/* ... existing code for product details and price ... */}
                                                                                    <div className="flex-1">
                                                                                        <h4 className="text-sm font-medium text-card-foreground">
                                                                                            {item
                                                                                                .orderItem
                                                                                                ?.productTitle ||
                                                                                                item
                                                                                                    .product
                                                                                                    ?.title ||
                                                                                                "Product"}
                                                                                        </h4>
                                                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                                                            Quantity:{" "}
                                                                                            {
                                                                                                item
                                                                                                    .orderItem
                                                                                                    ?.quantity
                                                                                            }
                                                                                        </p>
                                                                                        {item
                                                                                            .orderItem
                                                                                            ?.variantName && (
                                                                                            <p className="text-xs text-muted-foreground">
                                                                                                Variant:{" "}
                                                                                                {
                                                                                                    item
                                                                                                        .orderItem
                                                                                                        .variantName
                                                                                                }
                                                                                            </p>
                                                                                        )}
                                                                                    </div>

                                                                                    <div className="text-right">
                                                                                        <Price
                                                                                            value={
                                                                                                item
                                                                                                    .orderItem
                                                                                                    ?.totalPrice ||
                                                                                                0
                                                                                            }
                                                                                            className="font-semibold text-card-foreground"
                                                                                        />
                                                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                                                            <Price
                                                                                                value={
                                                                                                    item
                                                                                                        .orderItem
                                                                                                        ?.unitPrice ||
                                                                                                    0
                                                                                                }
                                                                                                className="text-xs"
                                                                                            />{" "}
                                                                                            each
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        }
                                                                    ) || (
                                                                        <p className="py-4 text-center text-sm text-muted-foreground">
                                                                            Order
                                                                            items
                                                                            not
                                                                            available
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                {/* Action Buttons */}
                                                                <div className="mt-6 flex flex-wrap gap-2">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="border-primary/20 bg-card/50 hover:bg-primary/10"
                                                                    >
                                                                        <Icons.Eye className="mr-2 h-4 w-4" />
                                                                        View
                                                                        Details
                                                                    </Button>
                                                                    {orderData
                                                                        .order
                                                                        .status ===
                                                                        "delivered" && (
                                                                        <>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                className="border-accent/20 bg-card/50 hover:bg-accent/10"
                                                                            >
                                                                                <Icons.Star className="mr-2 h-4 w-4" />
                                                                                Rate
                                                                                &
                                                                                Review
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                className="border-primary/20 bg-card/50 hover:bg-primary/10"
                                                                            >
                                                                                <Icons.RefreshCw className="mr-2 h-4 w-4" />
                                                                                Buy
                                                                                Again
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                className="border-destructive/20 bg-card/50 hover:bg-destructive/10"
                                                                            >
                                                                                <Icons.RotateCcw className="mr-2 h-4 w-4" />
                                                                                Return/Exchange
                                                                            </Button>
                                                                        </>
                                                                    )}
                                                                    {(orderData
                                                                        .order
                                                                        .status ===
                                                                        "shipped" ||
                                                                        orderData
                                                                            .order
                                                                            .status ===
                                                                            "confirmed") &&
                                                                        orderData
                                                                            .order
                                                                            .trackingNumber && (
                                                                            <Dialog>
                                                                                <DialogTrigger
                                                                                    asChild
                                                                                >
                                                                                    <Button
                                                                                        size="sm"
                                                                                        variant="outline"
                                                                                        className="border-accent/20 bg-card/50 hover:bg-accent/10"
                                                                                    >
                                                                                        <Icons.Truck className="mr-2 h-4 w-4" />
                                                                                        Track
                                                                                        Order
                                                                                    </Button>
                                                                                </DialogTrigger>
                                                                                <DialogContent className="max-w-2xl">
                                                                                    <DialogHeader>
                                                                                        <DialogTitle>
                                                                                            Track
                                                                                            Your
                                                                                            Order
                                                                                        </DialogTitle>
                                                                                    </DialogHeader>
                                                                                    <DeliveryTracking
                                                                                        trackingNumber={
                                                                                            orderData
                                                                                                .order
                                                                                                .trackingNumber
                                                                                        }
                                                                                    />
                                                                                </DialogContent>
                                                                            </Dialog>
                                                                        )}
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="border-primary/20 bg-card/50 hover:bg-primary/10"
                                                                    >
                                                                        <Icons.Download className="mr-2 h-4 w-4" />
                                                                        Download
                                                                        Invoice
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <div className="py-12 text-center">
                                            <Icons.ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
                                            <h3 className="mt-4 text-lg font-semibold">
                                                No orders found
                                            </h3>
                                            <p className="mt-2 text-muted-foreground">
                                                You haven't placed any orders
                                                yet.
                                            </p>
                                            <Button className="mt-4" asChild>
                                                <Link href="/shop">
                                                    Start Shopping
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ... existing code for other tabs ... */}
                    {/* Tracking Tab */}
                    <TabsContent value="tracking" className="mt-8 space-y-6">
                        <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50 shadow-lg">
                            <CardHeader className="rounded-t-lg bg-gradient-to-r from-primary/5 to-accent/5">
                                <CardTitle className="flex items-center gap-2">
                                    <Icons.Truck className="h-5 w-5 text-primary" />
                                    Order Tracking & Delivery
                                </CardTitle>
                                <CardDescription>
                                    Track your orders and view delivery status
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                {ordersData?.data?.filter(
                                    (orderData: any) =>
                                        orderData.order.trackingNumber &&
                                        ["confirmed", "shipped"].includes(
                                            orderData.order.status
                                        )
                                ).length > 0 ? (
                                    <div className="space-y-4">
                                        {ordersData.data
                                            .filter(
                                                (orderData: any) =>
                                                    orderData.order
                                                        .trackingNumber &&
                                                    [
                                                        "confirmed",
                                                        "shipped",
                                                    ].includes(
                                                        orderData.order.status
                                                    )
                                            )
                                            .map((orderData: any) => (
                                                <div
                                                    key={orderData.order.id}
                                                    className="rounded-xl border border-primary/10 bg-gradient-to-r from-card/50 to-transparent p-4 transition-all duration-300 hover:border-primary/20"
                                                >
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium text-card-foreground">
                                                                Order #
                                                                {
                                                                    orderData
                                                                        .order
                                                                        .orderNumber
                                                                }
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {
                                                                    orderData
                                                                        .order
                                                                        .trackingNumber
                                                                }
                                                            </p>
                                                        </div>
                                                        <Badge
                                                            variant="secondary"
                                                            className="border-accent/20 bg-accent/10 text-accent-foreground"
                                                        >
                                                            {orderData.order.status.toUpperCase()}
                                                        </Badge>
                                                    </div>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="w-full border-primary/20 bg-card/50 hover:bg-primary/10"
                                                            >
                                                                Track Delivery
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-2xl">
                                                            <DialogHeader>
                                                                <DialogTitle>
                                                                    Track Order
                                                                    #
                                                                    {
                                                                        orderData
                                                                            .order
                                                                            .orderNumber
                                                                    }
                                                                </DialogTitle>
                                                            </DialogHeader>
                                                            <DeliveryTracking
                                                                trackingNumber={
                                                                    orderData
                                                                        .order
                                                                        .trackingNumber
                                                                }
                                                            />
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center">
                                        <Icons.Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                        <p className="text-muted-foreground">
                                            No active deliveries
                                        </p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Your tracking information will
                                            appear here once orders are shipped
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="mt-8 space-y-6">
                        <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50 shadow-lg">
                            <CardHeader className="rounded-t-lg bg-gradient-to-r from-primary/5 to-accent/5">
                                <CardTitle className="flex items-center gap-2">
                                    <Icons.User className="h-5 w-5 text-primary" />
                                    Profile Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="firstName"
                                            className="text-card-foreground"
                                        >
                                            First Name
                                        </Label>
                                        <Input
                                            id="firstName"
                                            defaultValue={user.firstName || ""}
                                            disabled
                                            className="border-primary/20 bg-input/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="lastName"
                                            className="text-card-foreground"
                                        >
                                            Last Name
                                        </Label>
                                        <Input
                                            id="lastName"
                                            defaultValue={user.lastName || ""}
                                            disabled
                                            className="border-primary/20 bg-input/50"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-card-foreground"
                                    >
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        defaultValue={user.email || ""}
                                        disabled
                                        className="border-primary/20 bg-input/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="phone"
                                        className="text-card-foreground"
                                    >
                                        Phone Number
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        defaultValue={user.phone || ""}
                                        disabled
                                        className="border-primary/20 bg-input/50"
                                    />
                                </div>
                                <div className="pt-4">
                                    <p className="text-sm text-muted-foreground">
                                        To update your profile information,
                                        please use the account settings in
                                        Clerk.
                                    </p>
                                    <Button
                                        className="mt-2 bg-transparent"
                                        variant="outline"
                                    >
                                        <Icons.ExternalLink className="mr-2 h-4 w-4" />
                                        Manage in Clerk
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Addresses Tab */}
                    <TabsContent value="addresses" className="mt-8 space-y-6">
                        <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50 shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between rounded-t-lg bg-gradient-to-r from-primary/5 to-accent/5">
                                <CardTitle className="flex items-center gap-2">
                                    <Icons.MapPin className="h-5 w-5 text-primary" />
                                    Saved Addresses
                                </CardTitle>
                                <Button className="bg-primary hover:bg-primary/90">
                                    <Icons.Plus className="mr-2 h-4 w-4" />
                                    Add Address
                                </Button>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {addressesLoading ? (
                                        Array.from({ length: 2 }).map(
                                            (_, i) => (
                                                <div
                                                    key={i}
                                                    className="rounded-xl border border-primary/10 bg-gradient-to-r from-card/50 to-transparent p-4"
                                                >
                                                    <div className="mb-2 flex items-start justify-between">
                                                        <div className="space-y-2">
                                                            <Skeleton className="h-5 w-32" />
                                                            <Skeleton className="h-4 w-16" />
                                                        </div>
                                                        <Skeleton className="h-8 w-8" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Skeleton className="h-4 w-full" />
                                                        <Skeleton className="h-4 w-3/4" />
                                                        <Skeleton className="h-4 w-1/2" />
                                                    </div>
                                                </div>
                                            )
                                        )
                                    ) : addressesData?.data?.length > 0 ? (
                                        addressesData.data.map(
                                            (address: any) => (
                                                <Card
                                                    key={address.id}
                                                    className="border-primary/10 bg-gradient-to-br from-card/50 to-transparent transition-all duration-300 hover:border-primary/20"
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="mb-2 flex items-start justify-between">
                                                            <div>
                                                                <h3 className="font-medium text-card-foreground">
                                                                    {
                                                                        address.firstName
                                                                    }{" "}
                                                                    {
                                                                        address.lastName
                                                                    }
                                                                </h3>
                                                                {address.isDefault && (
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="mt-1 border-accent/20 bg-accent/10 text-xs text-accent-foreground"
                                                                    >
                                                                        Default
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                            >
                                                                <Icons.MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                        <div className="space-y-1 text-sm text-muted-foreground">
                                                            <p>
                                                                {
                                                                    address.address1
                                                                }
                                                            </p>
                                                            {address.address2 && (
                                                                <p>
                                                                    {
                                                                        address.address2
                                                                    }
                                                                </p>
                                                            )}
                                                            <p>
                                                                {address.city},{" "}
                                                                {address.state}{" "}
                                                                {
                                                                    address.zipCode
                                                                }
                                                            </p>
                                                            {address.country && (
                                                                <p>
                                                                    {
                                                                        address.country
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="mt-3 flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="border-primary/20 bg-card/50 hover:bg-primary/10"
                                                            >
                                                                <Icons.Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Button>
                                                            {!address.isDefault && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="border-accent/20 bg-card/50 hover:bg-accent/10"
                                                                >
                                                                    Set as
                                                                    Default
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )
                                        )
                                    ) : (
                                        <div className="col-span-2 py-12 text-center">
                                            <Icons.MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
                                            <h3 className="mt-4 text-lg font-semibold">
                                                No addresses saved
                                            </h3>
                                            <p className="mt-2 text-muted-foreground">
                                                Add an address to make checkout
                                                faster.
                                            </p>
                                            <Button className="mt-4">
                                                <Icons.Plus className="mr-2 h-4 w-4" />
                                                Add Your First Address
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security" className="mt-8 space-y-6">
                        <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50 shadow-lg">
                            <CardHeader className="rounded-t-lg bg-gradient-to-r from-primary/5 to-accent/5">
                                <CardTitle className="flex items-center gap-2">
                                    <Icons.Shield className="h-5 w-5 text-primary" />
                                    Security Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-card-foreground">
                                            Two-factor authentication
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Add an extra layer of security to
                                            your account
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="border-primary/20 bg-card/50 hover:bg-primary/10"
                                    >
                                        Enable
                                    </Button>
                                </div>
                                <Separator className="bg-border/50" />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-card-foreground">
                                            Login activity
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            View recent login attempts and
                                            active sessions
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="border-primary/20 bg-card/50 hover:bg-primary/10"
                                    >
                                        View Activity
                                    </Button>
                                </div>
                                <Separator className="bg-border/50" />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-card-foreground">
                                            Password
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Change your password regularly to
                                            keep your account secure
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="border-primary/20 bg-card/50 hover:bg-primary/10"
                                    >
                                        <Icons.ExternalLink className="mr-2 h-4 w-4" />
                                        Change in Clerk
                                    </Button>
                                </div>
                                <Separator className="bg-border/50" />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-destructive">
                                            Delete account
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Permanently delete your account and
                                            all associated data
                                        </p>
                                    </div>
                                    <Button variant="destructive" size="sm">
                                        Delete Account
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
