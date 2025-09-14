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
import { cn } from "@/lib/utils";
import {
    AlertCircle,
    CheckCircle,
    Clock,
    MapPin,
    Package,
    Truck,
    XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

interface TrackingUpdate {
    status: string;
    location?: string;
    description: string;
    timestamp: string;
}

interface DeliveryInfo {
    trackingNumber: string;
    orderId: string;
    orderNumber: string;
    deliveryProvider: string;
    estimatedDelivery: string | null;
    updates: TrackingUpdate[];
}

interface DeliveryTrackingProps {
    trackingNumber: string;
    className?: string;
}

const statusIcons = {
    pending: Package,
    picked_up: Truck,
    in_transit: Truck,
    out_for_delivery: MapPin,
    delivered: CheckCircle,
    cancelled: XCircle,
    failed: AlertCircle,
};

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
    pending: "Order Confirmed",
    picked_up: "Picked Up",
    in_transit: "In Transit",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
    failed: "Delivery Failed",
};

export function DeliveryTracking({
    trackingNumber,
    className,
}: DeliveryTrackingProps) {
    const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTrackingInfo();
    }, [trackingNumber]);

    const fetchTrackingInfo = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `/api/delivery/tracking/${trackingNumber}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch tracking information");
            }

            const data = await response.json();
            setDeliveryInfo(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load tracking information"
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-AE", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getCurrentStatus = () => {
        if (!deliveryInfo?.updates.length) return "pending";
        return deliveryInfo.updates[0].status;
    };

    const getEstimatedDeliveryDate = () => {
        if (!deliveryInfo?.estimatedDelivery) return null;
        return new Date(deliveryInfo.estimatedDelivery).toLocaleDateString(
            "en-AE",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            }
        );
    };

    if (loading) {
        return (
            <Card className={cn("w-full", className)}>
                <CardContent className="p-6">
                    <div className="flex items-center justify-center py-8">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className={cn("w-full", className)}>
                <CardContent className="p-6">
                    <div className="py-8 text-center">
                        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
                        <p className="mb-4 text-red-600">{error}</p>
                        <Button onClick={fetchTrackingInfo} variant="outline">
                            Try Again
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!deliveryInfo) {
        return (
            <Card className={cn("w-full", className)}>
                <CardContent className="p-6">
                    <div className="py-8 text-center">
                        <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">
                            No tracking information available
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const currentStatus = getCurrentStatus();
    const StatusIcon =
        statusIcons[currentStatus as keyof typeof statusIcons] || Package;

    return (
        <Card className={cn("w-full", className)}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <StatusIcon className="h-5 w-5" />
                            Delivery Tracking
                        </CardTitle>
                        <CardDescription>
                            Order #{deliveryInfo.orderNumber} •{" "}
                            {deliveryInfo.trackingNumber}
                        </CardDescription>
                    </div>
                    <Badge
                        className={cn(
                            "text-white",
                            statusColors[
                                currentStatus as keyof typeof statusColors
                            ] || "bg-gray-500"
                        )}
                    >
                        {statusLabels[
                            currentStatus as keyof typeof statusLabels
                        ] || currentStatus}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="p-6 pt-0">
                {/* Estimated Delivery */}
                {getEstimatedDeliveryDate() &&
                    currentStatus !== "delivered" && (
                        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <div className="flex items-center gap-2 text-blue-700">
                                <Clock className="h-4 w-4" />
                                <span className="font-medium">
                                    Estimated Delivery
                                </span>
                            </div>
                            <p className="mt-1 text-blue-600">
                                {getEstimatedDeliveryDate()}
                            </p>
                        </div>
                    )}

                {/* Tracking Timeline */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
                        Tracking Updates
                    </h3>

                    {deliveryInfo.updates.length === 0 ? (
                        <p className="py-4 text-center text-muted-foreground">
                            No tracking updates available yet
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {deliveryInfo.updates.map((update, index) => {
                                const UpdateIcon =
                                    statusIcons[
                                        update.status as keyof typeof statusIcons
                                    ] || Package;
                                const isLatest = index === 0;

                                return (
                                    <div key={index} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={cn(
                                                    "flex h-8 w-8 items-center justify-center rounded-full",
                                                    isLatest
                                                        ? statusColors[
                                                              update.status as keyof typeof statusColors
                                                          ] || "bg-gray-500"
                                                        : "bg-gray-200"
                                                )}
                                            >
                                                <UpdateIcon
                                                    className={cn(
                                                        "h-4 w-4",
                                                        isLatest
                                                            ? "text-white"
                                                            : "text-gray-500"
                                                    )}
                                                />
                                            </div>
                                            {index <
                                                deliveryInfo.updates.length -
                                                    1 && (
                                                <div className="mt-2 h-6 w-px bg-gray-200" />
                                            )}
                                        </div>

                                        <div className="flex-1 pb-4">
                                            <div className="flex items-center justify-between">
                                                <p
                                                    className={cn(
                                                        "font-medium",
                                                        isLatest
                                                            ? "text-foreground"
                                                            : "text-muted-foreground"
                                                    )}
                                                >
                                                    {statusLabels[
                                                        update.status as keyof typeof statusLabels
                                                    ] || update.status}
                                                </p>
                                                <time className="text-sm text-muted-foreground">
                                                    {formatDate(
                                                        update.timestamp
                                                    )}
                                                </time>
                                            </div>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {update.description}
                                            </p>
                                            {update.location && (
                                                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                                                    <MapPin className="h-3 w-3" />
                                                    {update.location}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <Separator className="my-6" />

                {/* Delivery Provider */}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                        Delivery Provider
                    </span>
                    <span className="font-medium capitalize">
                        {deliveryInfo.deliveryProvider}
                    </span>
                </div>

                {/* Refresh Button */}
                <div className="mt-6">
                    <Button
                        onClick={fetchTrackingInfo}
                        variant="outline"
                        className="w-full"
                        disabled={loading}
                    >
                        Refresh Tracking
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
