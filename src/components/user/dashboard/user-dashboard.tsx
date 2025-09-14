"use client";

import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Price } from "@/components/ui/price";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, useCustomer } from "@/lib/react-query";
import Link from "next/link";

export function UserDashboard() {
    const { useCurrentUser } = useAuth();
    const { useStats, useOrders, useProfile, useAddresses } = useCustomer();

    const { data: user } = useCurrentUser();
    const { data: stats, isLoading: statsLoading } = useStats();
    const { data: ordersData, isLoading: ordersLoading } = useOrders({
        limit: 5,
    });
    const { data: profileData } = useProfile();
    const { data: addressesData, isLoading: addressesLoading } = useAddresses();

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
                <Card className="w-full max-w-md border-0 bg-card/80 shadow-xl backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <Icons.User className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="mb-4 text-2xl font-bold text-balance">
                            Welcome Back
                        </h1>
                        <p className="mb-6 text-muted-foreground">
                            Please sign in to access your account
                        </p>
                        <Button asChild className="w-full">
                            <Link href="/auth/signin">Sign In</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="mb-12 text-center">
                    <div className="mb-4 inline-flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                            <Icons.User className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-left">
                            <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-4xl font-bold text-transparent">
                                My Account
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Welcome back, {user.firstName}!
                            </p>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="mb-8 grid h-14 w-full grid-cols-5 border bg-card/50 shadow-sm backdrop-blur-sm">
                        <TabsTrigger
                            value="overview"
                            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            <Icons.Menu className="h-4 w-4" />
                            <span className="hidden sm:inline">Overview</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="orders"
                            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            <Icons.Package className="h-4 w-4" />
                            <span className="hidden sm:inline">Orders</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="addresses"
                            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            <Icons.MapPin className="h-4 w-4" />
                            <span className="hidden sm:inline">Addresses</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="wishlist"
                            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            <Icons.Heart className="h-4 w-4" />
                            <span className="hidden sm:inline">Wishlist</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="settings"
                            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            <Icons.Settings className="h-4 w-4" />
                            <span className="hidden sm:inline">Settings</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-8">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/80 shadow-lg backdrop-blur-sm">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                                <CardHeader className="relative pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Total Orders
                                        </CardTitle>
                                        <Icons.Package className="h-5 w-5 text-primary" />
                                    </div>
                                </CardHeader>
                                <CardContent className="relative">
                                    {statsLoading ? (
                                        <Skeleton className="h-8 w-16" />
                                    ) : (
                                        <div className="text-3xl font-bold text-primary">
                                            {stats?.data?.totalOrders || 0}
                                        </div>
                                    )}
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        All time orders
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/80 shadow-lg backdrop-blur-sm">
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
                                <CardHeader className="relative pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Total Spent
                                        </CardTitle>
                                        <Icons.DollarSign className="h-5 w-5 text-accent" />
                                    </div>
                                </CardHeader>
                                <CardContent className="relative">
                                    {statsLoading ? (
                                        <Skeleton className="h-8 w-20" />
                                    ) : (
                                        <div className="text-3xl font-bold text-accent">
                                            <Price
                                                value={Math.round(
                                                    (stats?.data?.totalSpent ||
                                                        0) * 100
                                                )}
                                            />
                                        </div>
                                    )}
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        All time
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/80 shadow-lg backdrop-blur-sm">
                                <div className="absolute inset-0 bg-gradient-to-br from-chart-3/5 to-transparent" />
                                <CardHeader className="relative pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Addresses
                                        </CardTitle>
                                        <Icons.MapPin className="h-5 w-5 text-chart-3" />
                                    </div>
                                </CardHeader>
                                <CardContent className="relative">
                                    {addressesLoading ? (
                                        <Skeleton className="h-8 w-8" />
                                    ) : (
                                        <div className="text-3xl font-bold text-chart-3">
                                            {addressesData?.data?.length || 0}
                                        </div>
                                    )}
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Saved addresses
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/80 shadow-lg backdrop-blur-sm">
                                <div className="absolute inset-0 bg-gradient-to-br from-chart-1/5 to-transparent" />
                                <CardHeader className="relative pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Account Status
                                        </CardTitle>
                                        <Icons.User className="h-5 w-5 text-chart-1" />
                                    </div>
                                </CardHeader>
                                <CardContent className="relative">
                                    <Badge className="border-chart-1/20 bg-chart-1/10 text-chart-1 hover:bg-chart-1/20">
                                        Active
                                    </Badge>
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Member since{" "}
                                        {new Date(user.createdAt).getFullYear()}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <Card className="border-0 bg-card/80 shadow-xl backdrop-blur-sm">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                            <Icons.Package className="h-5 w-5 text-primary" />
                                        </div>
                                        <CardTitle className="text-xl">
                                            Recent Orders
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {ordersLoading ? (
                                            Array.from({ length: 3 }).map(
                                                (_, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-center justify-between rounded-xl border bg-muted/30 p-4"
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
                                                        className="flex items-center justify-between rounded-xl border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                                                    >
                                                        <div>
                                                            <p className="font-semibold">
                                                                Order #
                                                                {
                                                                    orderData
                                                                        .order
                                                                        .orderNumber
                                                                }
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {new Date(
                                                                    orderData.order.createdAt
                                                                ).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <Price
                                                                value={Math.round(
                                                                    orderData.total *
                                                                        100
                                                                )}
                                                                className="font-semibold"
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
                                                                              : "outline"
                                                                    }
                                                                    className="text-xs"
                                                                >
                                                                    {
                                                                        orderData
                                                                            .order
                                                                            .status
                                                                    }
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                        ) : (
                                            <div className="py-8 text-center">
                                                <Icons.Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                                <p className="text-muted-foreground">
                                                    No orders yet
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="mt-6 w-full bg-background/50 transition-colors hover:bg-primary hover:text-primary-foreground"
                                        asChild
                                    >
                                        <Link href="/account?tab=orders">
                                            View All Orders
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="border-0 bg-card/80 shadow-xl backdrop-blur-sm">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                                            <Icons.Edit className="h-5 w-5 text-accent" />
                                        </div>
                                        <CardTitle className="text-xl">
                                            Quick Actions
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button
                                        variant="outline"
                                        className="h-12 w-full justify-start bg-background/50 transition-colors hover:bg-primary hover:text-primary-foreground"
                                        asChild
                                    >
                                        <Link href="/shop">
                                            <Icons.Store className="mr-3 h-5 w-5" />
                                            Continue Shopping
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-12 w-full justify-start bg-background/50 transition-colors hover:bg-primary hover:text-primary-foreground"
                                        asChild
                                    >
                                        <Link href="/wishlist">
                                            <Icons.Heart className="mr-3 h-5 w-5" />
                                            View Wishlist
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-12 w-full justify-start bg-background/50 transition-colors hover:bg-primary hover:text-primary-foreground"
                                        asChild
                                    >
                                        <Link href="/cart">
                                            <Icons.ShoppingBag className="mr-3 h-5 w-5" />
                                            View Cart
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-12 w-full justify-start bg-background/50 transition-colors hover:bg-primary hover:text-primary-foreground"
                                        asChild
                                    >
                                        <Link href="/account?tab=addresses">
                                            <Icons.MapPin className="mr-3 h-5 w-5" />
                                            Manage Addresses
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="orders" className="space-y-6">
                        <Card className="border-0 bg-card/80 shadow-xl backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <Icons.Package className="h-5 w-5 text-primary" />
                                    </div>
                                    <CardTitle className="text-xl">
                                        Order History
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {ordersLoading ? (
                                        Array.from({ length: 5 }).map(
                                            (_, i) => (
                                                <div
                                                    key={i}
                                                    className="rounded-xl border bg-muted/30 p-6"
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
                                        ordersData.data.map(
                                            (orderData: any) => (
                                                <div
                                                    key={orderData.order.id}
                                                    className="rounded-xl border bg-muted/30 p-6 transition-colors hover:bg-muted/50"
                                                >
                                                    <div className="mb-3 flex items-center justify-between">
                                                        <div>
                                                            <h3 className="font-semibold">
                                                                Order #
                                                                {
                                                                    orderData
                                                                        .order
                                                                        .orderNumber
                                                                }
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                Placed on{" "}
                                                                {new Date(
                                                                    orderData.order.createdAt
                                                                ).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <Price
                                                                value={Math.round(
                                                                    orderData.total *
                                                                        100
                                                                )}
                                                                className="font-semibold"
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
                                                                              : "outline"
                                                                    }
                                                                >
                                                                    {
                                                                        orderData
                                                                            .order
                                                                            .status
                                                                    }
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        {orderData.items?.map(
                                                            (
                                                                item: any,
                                                                index: number
                                                            ) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex justify-between text-sm"
                                                                >
                                                                    <span>
                                                                        {item
                                                                            .product
                                                                            ?.name ||
                                                                            "Product"}{" "}
                                                                        x{" "}
                                                                        {
                                                                            item.quantity
                                                                        }
                                                                    </span>
                                                                    <Price
                                                                        value={Math.round(
                                                                            item.price *
                                                                                item.quantity *
                                                                                100
                                                                        )}
                                                                    />
                                                                </div>
                                                            )
                                                        ) || (
                                                            <p className="text-sm text-muted-foreground">
                                                                Order items not
                                                                available
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="mt-4 flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="bg-background/50 hover:bg-primary hover:text-primary-foreground"
                                                        >
                                                            View Details
                                                        </Button>
                                                        {orderData.order
                                                            .status ===
                                                            "delivered" && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="bg-background/50 hover:bg-accent hover:text-accent-foreground"
                                                            >
                                                                Buy Again
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <div className="py-12 text-center">
                                            <Icons.Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                                            <p className="mb-4 text-muted-foreground">
                                                No orders found
                                            </p>
                                            <Button
                                                variant="outline"
                                                className="bg-background/50 hover:bg-primary hover:text-primary-foreground"
                                                asChild
                                            >
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

                    <TabsContent value="addresses" className="space-y-6">
                        <Card className="border-0 bg-card/80 shadow-xl backdrop-blur-sm">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                                        <Icons.MapPin className="h-5 w-5 text-chart-3" />
                                    </div>
                                    <CardTitle className="text-xl">
                                        Saved Addresses
                                    </CardTitle>
                                </div>
                                <Button
                                    size="sm"
                                    className="bg-primary hover:bg-primary/90"
                                >
                                    <Icons.Plus className="mr-2 h-4 w-4" />
                                    Add Address
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {addressesLoading ? (
                                        Array.from({ length: 2 }).map(
                                            (_, i) => (
                                                <div
                                                    key={i}
                                                    className="rounded-xl border bg-muted/30 p-6"
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
                                                <div
                                                    key={address.id}
                                                    className="rounded-xl border bg-muted/30 p-6 transition-colors hover:bg-muted/50"
                                                >
                                                    <div className="mb-2 flex items-start justify-between">
                                                        <div>
                                                            <h3 className="font-medium">
                                                                {
                                                                    address.firstName
                                                                }{" "}
                                                                {
                                                                    address.lastName
                                                                }
                                                            </h3>
                                                            {address.isDefault && (
                                                                <Badge className="mt-1 border-primary/20 bg-primary/10 text-xs text-primary">
                                                                    Default
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="hover:bg-muted"
                                                        >
                                                            <Icons.MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        <p>
                                                            {address.address1}
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
                                                            {address.zipCode}
                                                        </p>
                                                        {address.country && (
                                                            <p>
                                                                {
                                                                    address.country
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <div className="col-span-2 py-12 text-center">
                                            <Icons.MapPin className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                                            <p className="mb-4 text-muted-foreground">
                                                No addresses saved
                                            </p>
                                            <Button className="bg-primary hover:bg-primary/90">
                                                <Icons.Plus className="mr-2 h-4 w-4" />
                                                Add Your First Address
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="wishlist" className="space-y-6">
                        <Card className="border-0 bg-card/80 shadow-xl backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
                                        <Icons.Heart className="h-5 w-5 text-red-500" />
                                    </div>
                                    <CardTitle className="text-xl">
                                        My Wishlist
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="py-16 text-center">
                                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                                        <Icons.Heart className="h-10 w-10 text-red-500" />
                                    </div>
                                    <h3 className="mb-3 text-xl font-semibold">
                                        Your wishlist is empty
                                    </h3>
                                    <p className="mx-auto mb-6 max-w-md text-muted-foreground">
                                        Save items you love to your wishlist and
                                        never lose track of them.
                                    </p>
                                    <Button
                                        className="bg-primary hover:bg-primary/90"
                                        asChild
                                    >
                                        <Link href="/shop">Start Shopping</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-6">
                        <Card className="border-0 bg-card/80 shadow-xl backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <Icons.Settings className="h-5 w-5 text-primary" />
                                    </div>
                                    <CardTitle className="text-xl">
                                        Account Settings
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <Card className="border bg-muted/30">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="flex items-center gap-2 text-base">
                                                <Icons.User className="h-4 w-4" />
                                                Personal Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">
                                                        Name:
                                                    </span>
                                                    <span className="font-medium">
                                                        {user.firstName}{" "}
                                                        {user.lastName}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">
                                                        Email:
                                                    </span>
                                                    <span className="font-medium">
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="mt-4 w-full bg-background/50 hover:bg-primary hover:text-primary-foreground"
                                            >
                                                Edit Profile
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    <Card className="border bg-muted/30">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="flex items-center gap-2 text-base">
                                                <Icons.Star className="h-4 w-4" />
                                                Preferences
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm">
                                                        Email notifications
                                                    </span>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="bg-background/50 hover:bg-primary hover:text-primary-foreground"
                                                    >
                                                        Configure
                                                    </Button>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm">
                                                        Privacy settings
                                                    </span>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="bg-background/50 hover:bg-primary hover:text-primary-foreground"
                                                    >
                                                        Manage
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
