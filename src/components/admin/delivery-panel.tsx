"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
    CheckCircle,
    Clock,
    DollarSign,
    Package,
    Truck,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface DeliveryStats {
    totalShipments: number;
    activeShipments: number;
    deliveredToday: number;
    pendingPickups: number;
}

interface ShipmentData {
    shipment: {
        id: string;
        trackingNumber: string;
        deliveryProvider: string;
        status: string;
        destinationCity: string;
        packageWeight: string;
        shippingCost: string;
        createdAt: string;
        estimatedDelivery: string | null;
    };
    order: {
        id: string;
        orderNumber: string;
        customerEmail: string;
        total: string;
        status: string;
    };
}

const statusColors = {
    pending: "bg-yellow-500",
    picked_up: "bg-blue-500",
    in_transit: "bg-blue-500",
    out_for_delivery: "bg-orange-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
    failed: "bg-red-500",
};

const statusLabels = {
    pending: "Pending",
    picked_up: "Picked Up",
    in_transit: "In Transit",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
    failed: "Failed",
};

export function AdminDeliveryPanel() {
    const [stats, setStats] = useState<DeliveryStats | null>(null);
    const [shipments, setShipments] = useState<ShipmentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"overview" | "shipments">(
        "overview"
    );

    useEffect(() => {
        if (activeTab === "overview") {
            fetchStats();
        } else {
            fetchShipments();
        }
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/delivery?view=overview");
            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch delivery stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchShipments = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/delivery?view=shipments");
            const data = await response.json();
            if (data.success) {
                setShipments(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch shipments:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-AE", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatPrice = (amount: string) => {
        return `AED ${parseFloat(amount).toFixed(2)}`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Delivery Management</h1>
                    <p className="text-muted-foreground">
                        Monitor and manage all deliveries
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={
                            activeTab === "overview" ? "default" : "outline"
                        }
                        onClick={() => setActiveTab("overview")}
                    >
                        Overview
                    </Button>
                    <Button
                        variant={
                            activeTab === "shipments" ? "default" : "outline"
                        }
                        onClick={() => setActiveTab("shipments")}
                    >
                        All Shipments
                    </Button>
                </div>
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Shipments
                                </CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <Skeleton className="h-8 w-16" />
                                ) : (
                                    <div className="text-2xl font-bold">
                                        {stats?.totalShipments || 0}
                                    </div>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    All time
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Active Deliveries
                                </CardTitle>
                                <Truck className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <Skeleton className="h-8 w-16" />
                                ) : (
                                    <div className="text-2xl font-bold">
                                        {stats?.activeShipments || 0}
                                    </div>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    In progress
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Delivered Today
                                </CardTitle>
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <Skeleton className="h-8 w-16" />
                                ) : (
                                    <div className="text-2xl font-bold">
                                        {stats?.deliveredToday || 0}
                                    </div>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Completed
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Pending Pickup
                                </CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <Skeleton className="h-8 w-16" />
                                ) : (
                                    <div className="text-2xl font-bold">
                                        {stats?.pendingPickups || 0}
                                    </div>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Awaiting pickup
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>
                                Common delivery management tasks
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                            <Button onClick={() => setActiveTab("shipments")}>
                                View All Shipments
                            </Button>
                            <Button variant="outline" onClick={fetchStats}>
                                Refresh Data
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Shipments Tab */}
            {activeTab === "shipments" && (
                <Card>
                    <CardHeader>
                        <CardTitle>All Shipments</CardTitle>
                        <CardDescription>
                            Monitor all delivery shipments
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="rounded-lg border p-4"
                                    >
                                        <div className="mb-2 flex items-center justify-between">
                                            <Skeleton className="h-5 w-32" />
                                            <Skeleton className="h-6 w-20" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-4 w-16" />
                                            <Skeleton className="h-4 w-18" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : shipments.length === 0 ? (
                            <div className="py-8 text-center">
                                <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                    No shipments found
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {shipments.map((item) => (
                                    <div
                                        key={item.shipment.id}
                                        className="rounded-lg border p-4 transition-shadow hover:shadow-md"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <h3 className="font-medium">
                                                        {item.order.orderNumber}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {
                                                            item.shipment
                                                                .trackingNumber
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge
                                                className={cn(
                                                    "text-white",
                                                    statusColors[
                                                        item.shipment
                                                            .status as keyof typeof statusColors
                                                    ] || "bg-gray-500"
                                                )}
                                            >
                                                {statusLabels[
                                                    item.shipment
                                                        .status as keyof typeof statusLabels
                                                ] || item.shipment.status}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                                            <div>
                                                <p className="text-muted-foreground">
                                                    Customer
                                                </p>
                                                <p className="font-medium">
                                                    {item.order.customerEmail}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">
                                                    Destination
                                                </p>
                                                <p className="font-medium">
                                                    {
                                                        item.shipment
                                                            .destinationCity
                                                    }
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">
                                                    Provider
                                                </p>
                                                <p className="font-medium capitalize">
                                                    {
                                                        item.shipment
                                                            .deliveryProvider
                                                    }
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">
                                                    Created
                                                </p>
                                                <p className="font-medium">
                                                    {formatDate(
                                                        item.shipment.createdAt
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <Separator className="my-3" />

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 text-sm">
                                                <span>
                                                    Weight:{" "}
                                                    {parseFloat(
                                                        item.shipment
                                                            .packageWeight
                                                    ).toFixed(1)}
                                                    kg
                                                </span>
                                                <span>
                                                    Cost:{" "}
                                                    {formatPrice(
                                                        item.shipment
                                                            .shippingCost
                                                    )}
                                                </span>
                                                <span>
                                                    Order:{" "}
                                                    {formatPrice(
                                                        item.order.total
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
