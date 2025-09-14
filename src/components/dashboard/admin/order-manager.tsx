"use client";

import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Price } from "@/components/ui/price";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

type OrderStatus =
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";

interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    productImage?: string;
    quantity: number;
    price: number;
    total: number;
}

interface ShippingAddress {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
}

interface Order {
    id: string;
    orderNumber: string;
    userId: string;
    userEmail: string;
    userName: string;
    status: OrderStatus;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
    paymentMethod: string;
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
    shippingAddress: ShippingAddress;
    billingAddress?: ShippingAddress;
    trackingNumber?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface OrderManagerProps {
    orders: Order[];
    onUpdateOrderStatus: (
        orderId: string,
        status: OrderStatus,
        notes?: string
    ) => Promise<void>;
    onAddTrackingNumber: (
        orderId: string,
        trackingNumber: string
    ) => Promise<void>;
    onRefundOrder: (
        orderId: string,
        amount: number,
        reason: string
    ) => Promise<void>;
}

export function OrderManager({
    orders,
    onUpdateOrderStatus,
    onAddTrackingNumber,
    onRefundOrder,
}: OrderManagerProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [paymentFilter, setPaymentFilter] = useState<string>("all");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [trackingDialog, setTrackingDialog] = useState<{
        isOpen: boolean;
        order: Order | null;
    }>({
        isOpen: false,
        order: null,
    });
    const [trackingNumber, setTrackingNumber] = useState("");

    // Filter orders
    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.orderNumber
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "all" || order.status === statusFilter;
        const matchesPayment =
            paymentFilter === "all" || order.paymentStatus === paymentFilter;

        return matchesSearch && matchesStatus && matchesPayment;
    });

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case "pending":
                return "secondary";
            case "processing":
                return "default";
            case "shipped":
                return "default";
            case "delivered":
                return "default";
            case "cancelled":
                return "destructive";
            case "refunded":
                return "outline";
            default:
                return "secondary";
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case "paid":
                return "default";
            case "pending":
                return "secondary";
            case "failed":
                return "destructive";
            case "refunded":
                return "outline";
            default:
                return "secondary";
        }
    };

    const handleStatusChange = async (
        orderId: string,
        newStatus: OrderStatus
    ) => {
        await onUpdateOrderStatus(orderId, newStatus);
    };

    const handleAddTracking = async () => {
        if (trackingDialog.order && trackingNumber) {
            await onAddTrackingNumber(trackingDialog.order.id, trackingNumber);
            setTrackingDialog({ isOpen: false, order: null });
            setTrackingNumber("");
        }
    };

    const openTrackingDialog = (order: Order) => {
        setTrackingDialog({ isOpen: true, order });
        setTrackingNumber(order.trackingNumber || "");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Order Management</h2>
                    <p className="text-muted-foreground">
                        Track and manage customer orders
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline">
                        {filteredOrders.length} orders
                    </Badge>
                </div>
            </div>

            {/* Order Stats */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {["pending", "processing", "shipped", "delivered"].map(
                    (status) => {
                        const count = orders.filter(
                            (order) => order.status === status
                        ).length;
                        return (
                            <Card key={status}>
                                <CardContent className="p-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">
                                            {count}
                                        </div>
                                        <div className="text-sm text-muted-foreground capitalize">
                                            {status} Orders
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    }
                )}
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="relative max-w-sm flex-1">
                            <Icons.Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                            <Input
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">
                                    Processing
                                </SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">
                                    Delivered
                                </SelectItem>
                                <SelectItem value="cancelled">
                                    Cancelled
                                </SelectItem>
                                <SelectItem value="refunded">
                                    Refunded
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={paymentFilter}
                            onValueChange={setPaymentFilter}
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Payment" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Payments
                                </SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                                <SelectItem value="refunded">
                                    Refunded
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Orders ({filteredOrders.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">
                                                {order.orderNumber}
                                            </div>
                                            {order.trackingNumber && (
                                                <div className="text-xs text-muted-foreground">
                                                    Tracking:{" "}
                                                    {order.trackingNumber}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">
                                                {order.userName}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {order.userEmail}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={order.status}
                                            onValueChange={(
                                                value: OrderStatus
                                            ) =>
                                                handleStatusChange(
                                                    order.id,
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger className="w-[120px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">
                                                    Pending
                                                </SelectItem>
                                                <SelectItem value="processing">
                                                    Processing
                                                </SelectItem>
                                                <SelectItem value="shipped">
                                                    Shipped
                                                </SelectItem>
                                                <SelectItem value="delivered">
                                                    Delivered
                                                </SelectItem>
                                                <SelectItem value="cancelled">
                                                    Cancelled
                                                </SelectItem>
                                                <SelectItem value="refunded">
                                                    Refunded
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={getPaymentStatusColor(
                                                order.paymentStatus
                                            )}
                                        >
                                            {order.paymentStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {order.items.length} item
                                            {order.items.length !== 1
                                                ? "s"
                                                : ""}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Price value={order.total} />
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {order.createdAt.toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    setSelectedOrder(order)
                                                }
                                            >
                                                <Icons.Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    openTrackingDialog(order)
                                                }
                                            >
                                                <Icons.Truck className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredOrders.length === 0 && (
                        <div className="py-8 text-center">
                            <Icons.ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-2 text-sm font-semibold">
                                No orders found
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                No orders match your current filters.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Tracking Dialog */}
            <Dialog
                open={trackingDialog.isOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setTrackingDialog({ isOpen: false, order: null });
                        setTrackingNumber("");
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Tracking Number</DialogTitle>
                        <DialogDescription>
                            Add or update tracking number for order{" "}
                            {trackingDialog.order?.orderNumber}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="tracking">Tracking Number</Label>
                            <Input
                                id="tracking"
                                value={trackingNumber}
                                onChange={(e) =>
                                    setTrackingNumber(e.target.value)
                                }
                                placeholder="Enter tracking number"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setTrackingDialog({
                                    isOpen: false,
                                    order: null,
                                });
                                setTrackingNumber("");
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddTracking}
                            disabled={!trackingNumber}
                        >
                            Save Tracking
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Order Details Dialog */}
            <Dialog
                open={!!selectedOrder}
                onOpenChange={(open) => !open && setSelectedOrder(null)}
            >
                <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                        <DialogDescription>
                            Order {selectedOrder?.orderNumber}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-6">
                            {/* Order Header */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {selectedOrder.orderNumber}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Placed on{" "}
                                        {selectedOrder.createdAt.toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant={getStatusColor(
                                            selectedOrder.status
                                        )}
                                    >
                                        {selectedOrder.status}
                                    </Badge>
                                    <Badge
                                        variant={getPaymentStatusColor(
                                            selectedOrder.paymentStatus
                                        )}
                                    >
                                        {selectedOrder.paymentStatus}
                                    </Badge>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            Customer
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="font-medium">
                                            {selectedOrder.userName}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {selectedOrder.userEmail}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            Payment
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="font-medium">
                                            {selectedOrder.paymentMethod}
                                        </div>
                                        <Badge
                                            variant={getPaymentStatusColor(
                                                selectedOrder.paymentStatus
                                            )}
                                        >
                                            {selectedOrder.paymentStatus}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Addresses */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            Shipping Address
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-1">
                                        <div className="font-medium">
                                            {selectedOrder.shippingAddress.name}
                                        </div>
                                        <div className="text-sm">
                                            {
                                                selectedOrder.shippingAddress
                                                    .address
                                            }
                                        </div>
                                        <div className="text-sm">
                                            {selectedOrder.shippingAddress.city}
                                            ,{" "}
                                            {
                                                selectedOrder.shippingAddress
                                                    .state
                                            }{" "}
                                            {
                                                selectedOrder.shippingAddress
                                                    .postalCode
                                            }
                                        </div>
                                        <div className="text-sm">
                                            {
                                                selectedOrder.shippingAddress
                                                    .country
                                            }
                                        </div>
                                        {selectedOrder.shippingAddress
                                            .phone && (
                                            <div className="text-sm">
                                                {
                                                    selectedOrder
                                                        .shippingAddress.phone
                                                }
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            Billing Address
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-1">
                                        {selectedOrder.billingAddress ? (
                                            <>
                                                <div className="font-medium">
                                                    {
                                                        selectedOrder
                                                            .billingAddress.name
                                                    }
                                                </div>
                                                <div className="text-sm">
                                                    {
                                                        selectedOrder
                                                            .billingAddress
                                                            .address
                                                    }
                                                </div>
                                                <div className="text-sm">
                                                    {
                                                        selectedOrder
                                                            .billingAddress.city
                                                    }
                                                    ,{" "}
                                                    {
                                                        selectedOrder
                                                            .billingAddress
                                                            .state
                                                    }{" "}
                                                    {
                                                        selectedOrder
                                                            .billingAddress
                                                            .postalCode
                                                    }
                                                </div>
                                                <div className="text-sm">
                                                    {
                                                        selectedOrder
                                                            .billingAddress
                                                            .country
                                                    }
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-sm text-muted-foreground">
                                                Same as shipping address
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Order Items */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        Order Items
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {selectedOrder.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                                                        <Icons.Package className="h-6 w-6 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {item.productName}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            Qty: {item.quantity}{" "}
                                                            ×{" "}
                                                            <Price
                                                                value={
                                                                    item.price
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="font-medium">
                                                    <Price value={item.total} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator className="my-4" />

                                    {/* Order Summary */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Subtotal:</span>
                                            <Price
                                                value={selectedOrder.subtotal}
                                            />
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Shipping:</span>
                                            <Price
                                                value={selectedOrder.shipping}
                                            />
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tax:</span>
                                            <Price value={selectedOrder.tax} />
                                        </div>
                                        {selectedOrder.discount > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Discount:</span>
                                                <span>
                                                    -
                                                    <Price
                                                        value={
                                                            selectedOrder.discount
                                                        }
                                                    />
                                                </span>
                                            </div>
                                        )}
                                        <Separator />
                                        <div className="flex justify-between text-lg font-semibold">
                                            <span>Total:</span>
                                            <Price
                                                value={selectedOrder.total}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tracking & Notes */}
                            {(selectedOrder.trackingNumber ||
                                selectedOrder.notes) && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            Additional Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {selectedOrder.trackingNumber && (
                                            <div>
                                                <Label className="text-sm font-medium">
                                                    Tracking Number:
                                                </Label>
                                                <div className="text-sm">
                                                    {
                                                        selectedOrder.trackingNumber
                                                    }
                                                </div>
                                            </div>
                                        )}
                                        {selectedOrder.notes && (
                                            <div>
                                                <Label className="text-sm font-medium">
                                                    Notes:
                                                </Label>
                                                <div className="text-sm">
                                                    {selectedOrder.notes}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
