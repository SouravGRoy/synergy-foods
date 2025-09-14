"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    CheckCircle,
    Clock,
    DollarSign,
    Eye,
    MoreHorizontal,
    Package,
    Search,
    ShoppingCart,
    TrendingUp,
    Truck,
    XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Database schema types
interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    variantId?: string;
    productTitle: string;
    productSlug: string;
    variantName?: string;
    productImage?: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
    productSku?: string;
    productWeight?: number;
    createdAt: string;
    updatedAt: string;
}

interface Order {
    id: string;
    orderNumber: string;
    userId: string;
    customerEmail: string;
    status:
        | "pending"
        | "confirmed"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "refunded";
    paymentStatus:
        | "pending"
        | "paid"
        | "failed"
        | "refunded"
        | "partially_refunded";
    paymentMethod?: string;
    stripeSessionId?: string;
    stripePaymentIntentId?: string;
    subtotal: string;
    shippingCost: string;
    taxAmount: string;
    discountAmount: string;
    total: string;
    currency: string;
    shippingAddressId?: string;
    billingAddressId?: string;
    orderNotes?: string;
    customerNotes?: string;
    shippingMethod?: string;
    trackingNumber?: string;
    shippedAt?: string;
    deliveredAt?: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    deletedAt?: string;
}

interface OrderWithDetails {
    order: Order;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    items?: {
        orderItem: OrderItem;
        product: {
            id: string;
            title: string;
            slug: string;
        };
    }[];
}

export function AdminOrdersManagement() {
    const [orders, setOrders] = useState<OrderWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(
        null
    );
    const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        confirmed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 0,
    });

    // Fetch orders from API
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/orders?limit=50");
            if (!response.ok) {
                throw new Error("Failed to fetch orders");
            }

            const ordersData: OrderWithDetails[] = await response.json();

            // Apply filters
            const filteredOrders = ordersData.filter((orderData) => {
                const order = orderData.order;
                const user = orderData.user;

                const matchesSearch =
                    user.email
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    `${user.firstName} ${user.lastName}`
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    order.orderNumber
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    order.id.toLowerCase().includes(searchTerm.toLowerCase());

                const matchesStatus =
                    statusFilter === "all" || order.status === statusFilter;

                return matchesSearch && matchesStatus;
            });

            setOrders(filteredOrders);
            setTotalItems(filteredOrders.length);
            setTotalPages(Math.ceil(filteredOrders.length / 10));

            // Calculate stats
            const totalRevenue = ordersData.reduce(
                (sum, orderData) => sum + parseFloat(orderData.order.total),
                0
            );

            setStats({
                total: ordersData.length,
                pending: ordersData.filter((o) => o.order.status === "pending")
                    .length,
                confirmed: ordersData.filter(
                    (o) => o.order.status === "confirmed"
                ).length,
                processing: ordersData.filter(
                    (o) => o.order.status === "processing"
                ).length,
                shipped: ordersData.filter((o) => o.order.status === "shipped")
                    .length,
                delivered: ordersData.filter(
                    (o) => o.order.status === "delivered"
                ).length,
                cancelled: ordersData.filter(
                    (o) => o.order.status === "cancelled"
                ).length,
                totalRevenue,
            });
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [searchTerm, statusFilter]);

    const handleViewOrderDetails = (orderData: OrderWithDetails) => {
        setSelectedOrder(orderData);
        setIsOrderDetailsOpen(true);
    };

    const handleUpdateOrderStatus = async (
        orderId: string,
        newStatus: string
    ) => {
        try {
            // TODO: Implement API call to update order status
            // const response = await fetch(`/api/orders/${orderId}`, {
            //     method: "PUT",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ status: newStatus }),
            // });

            // For now, just update the local state
            setOrders((prev: OrderWithDetails[]) =>
                prev.map((orderData) =>
                    orderData.order.id === orderId
                        ? {
                              ...orderData,
                              order: {
                                  ...orderData.order,
                                  status: newStatus as any,
                              },
                          }
                        : orderData
                )
            );

            toast.success("Order status updated successfully");
        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error("Failed to update order status");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800">
                        Pending
                    </Badge>
                );
            case "confirmed":
                return (
                    <Badge className="bg-green-100 text-green-800">
                        Confirmed
                    </Badge>
                );
            case "processing":
                return (
                    <Badge className="bg-blue-100 text-blue-800">
                        Processing
                    </Badge>
                );
            case "shipped":
                return (
                    <Badge className="bg-purple-100 text-purple-800">
                        Shipped
                    </Badge>
                );
            case "delivered":
                return (
                    <Badge className="bg-green-100 text-green-800">
                        Delivered
                    </Badge>
                );
            case "cancelled":
                return (
                    <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return <Clock className="h-4 w-4" />;
            case "confirmed":
                return <CheckCircle className="h-4 w-4" />;
            case "processing":
                return <Package className="h-4 w-4" />;
            case "shipped":
                return <Truck className="h-4 w-4" />;
            case "delivered":
                return <CheckCircle className="h-4 w-4" />;
            case "cancelled":
                return <XCircle className="h-4 w-4" />;
            default:
                return <ShoppingCart className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Orders Management
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Track and manage customer orders
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Total Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-gray-500">All time orders</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Total Revenue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            ${stats.totalRevenue.toFixed(2)}
                        </div>
                        <p className="text-xs text-green-600">
                            All time revenue
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                            <Clock className="mr-2 h-4 w-4" />
                            Pending Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {stats.pending}
                        </div>
                        <p className="text-xs text-yellow-600">
                            Awaiting processing
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Delivered
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {stats.delivered}
                        </div>
                        <p className="text-xs text-green-600">
                            Successfully delivered
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Order Management</CardTitle>
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <Input
                                    placeholder="Search orders..."
                                    className="w-64 pl-10"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>

                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Statuses
                                    </SelectItem>
                                    <SelectItem value="pending">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="confirmed">
                                        Confirmed
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
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex h-32 items-center justify-center">
                            <div className="text-gray-500">
                                Loading orders...
                            </div>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((orderData) => (
                                    <TableRow key={orderData.order.id}>
                                        <TableCell>
                                            <div className="font-medium">
                                                {orderData.order.orderNumber}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {orderData.order.id.slice(0, 8)}
                                                ...
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {orderData.user.firstName}{" "}
                                                    {orderData.user.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {
                                                        orderData.order
                                                            .customerEmail
                                                    }
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {orderData.items?.length || 0}{" "}
                                                item
                                                {(orderData.items?.length ||
                                                    0) !== 1
                                                    ? "s"
                                                    : ""}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {orderData.items
                                                    ?.slice(0, 2)
                                                    .map(
                                                        (item) =>
                                                            item.orderItem
                                                                .productTitle
                                                    )
                                                    .join(", ")}
                                                {(orderData.items?.length ||
                                                    0) > 2 &&
                                                    ` +${(orderData.items?.length || 0) - 2} more`}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">
                                                {orderData.order.currency}{" "}
                                                {parseFloat(
                                                    orderData.order.total
                                                ).toFixed(2)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                {getStatusIcon(
                                                    orderData.order.status
                                                )}
                                                {getStatusBadge(
                                                    orderData.order.status
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                orderData.order.createdAt
                                            ).toLocaleDateString()}
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
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleViewOrderDetails(
                                                                orderData
                                                            )
                                                        }
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    {orderData.order.status ===
                                                        "pending" && (
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleUpdateOrderStatus(
                                                                    orderData
                                                                        .order
                                                                        .id,
                                                                    "processing"
                                                                )
                                                            }
                                                        >
                                                            <Package className="mr-2 h-4 w-4" />
                                                            Mark Processing
                                                        </DropdownMenuItem>
                                                    )}
                                                    {(orderData.order.status ===
                                                        "confirmed" ||
                                                        orderData.order
                                                            .status ===
                                                            "processing") && (
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleUpdateOrderStatus(
                                                                    orderData
                                                                        .order
                                                                        .id,
                                                                    "shipped"
                                                                )
                                                            }
                                                        >
                                                            <Truck className="mr-2 h-4 w-4" />
                                                            Mark Shipped
                                                        </DropdownMenuItem>
                                                    )}
                                                    {orderData.order.status ===
                                                        "shipped" && (
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleUpdateOrderStatus(
                                                                    orderData
                                                                        .order
                                                                        .id,
                                                                    "delivered"
                                                                )
                                                            }
                                                        >
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                            Mark Delivered
                                                        </DropdownMenuItem>
                                                    )}
                                                    {orderData.order.status !==
                                                        "cancelled" &&
                                                        orderData.order
                                                            .status !==
                                                            "delivered" && (
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleUpdateOrderStatus(
                                                                        orderData
                                                                            .order
                                                                            .id,
                                                                        "cancelled"
                                                                    )
                                                                }
                                                                className="text-red-600"
                                                            >
                                                                <XCircle className="mr-2 h-4 w-4" />
                                                                Cancel Order
                                                            </DropdownMenuItem>
                                                        )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    {orders.length === 0 && !loading && (
                        <div className="flex h-32 items-center justify-center">
                            <div className="text-gray-500">No orders found</div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Order Details Dialog */}
            <Dialog
                open={isOrderDetailsOpen}
                onOpenChange={setIsOrderDetailsOpen}
            >
                <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            Order Details - {selectedOrder?.order.orderNumber}
                        </DialogTitle>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-6">
                            {/* Order Summary */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">
                                            Order Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Order Number:
                                            </span>
                                            <span className="font-medium">
                                                {
                                                    selectedOrder.order
                                                        .orderNumber
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Status:
                                            </span>
                                            <div>
                                                {getStatusBadge(
                                                    selectedOrder.order.status
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Payment Status:
                                            </span>
                                            <Badge
                                                className={
                                                    selectedOrder.order
                                                        .paymentStatus ===
                                                    "paid"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }
                                            >
                                                {
                                                    selectedOrder.order
                                                        .paymentStatus
                                                }
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Payment Method:
                                            </span>
                                            <span className="font-medium capitalize">
                                                {selectedOrder.order
                                                    .paymentMethod || "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Date Placed:
                                            </span>
                                            <span className="font-medium">
                                                {new Date(
                                                    selectedOrder.order.createdAt
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">
                                            Customer Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Name:
                                            </span>
                                            <span className="font-medium">
                                                {selectedOrder.user.firstName}{" "}
                                                {selectedOrder.user.lastName}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Email:
                                            </span>
                                            <span className="font-medium">
                                                {
                                                    selectedOrder.order
                                                        .customerEmail
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Customer ID:
                                            </span>
                                            <span className="text-sm font-medium">
                                                {selectedOrder.user.id}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Order Items */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Order Items
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {selectedOrder.items &&
                                    selectedOrder.items.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>
                                                        Product
                                                    </TableHead>
                                                    <TableHead>SKU</TableHead>
                                                    <TableHead>
                                                        Quantity
                                                    </TableHead>
                                                    <TableHead>
                                                        Unit Price
                                                    </TableHead>
                                                    <TableHead>Total</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {selectedOrder.items.map(
                                                    (item) => (
                                                        <TableRow
                                                            key={
                                                                item.orderItem
                                                                    .id
                                                            }
                                                        >
                                                            <TableCell>
                                                                <div>
                                                                    <div className="font-medium">
                                                                        {
                                                                            item
                                                                                .orderItem
                                                                                .productTitle
                                                                        }
                                                                    </div>
                                                                    {item
                                                                        .orderItem
                                                                        .variantName && (
                                                                        <div className="text-sm text-gray-500">
                                                                            Variant:{" "}
                                                                            {
                                                                                item
                                                                                    .orderItem
                                                                                    .variantName
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="text-sm">
                                                                    {item
                                                                        .orderItem
                                                                        .productSku ||
                                                                        "N/A"}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    item
                                                                        .orderItem
                                                                        .quantity
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    selectedOrder
                                                                        .order
                                                                        .currency
                                                                }{" "}
                                                                {parseFloat(
                                                                    item
                                                                        .orderItem
                                                                        .unitPrice
                                                                ).toFixed(2)}
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    selectedOrder
                                                                        .order
                                                                        .currency
                                                                }{" "}
                                                                {parseFloat(
                                                                    item
                                                                        .orderItem
                                                                        .totalPrice
                                                                ).toFixed(2)}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <div className="py-4 text-center text-gray-500">
                                            No items found for this order
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Order Totals */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Order Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Subtotal:</span>
                                            <span>
                                                {selectedOrder.order.currency}{" "}
                                                {parseFloat(
                                                    selectedOrder.order.subtotal
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Shipping:</span>
                                            <span>
                                                {selectedOrder.order.currency}{" "}
                                                {parseFloat(
                                                    selectedOrder.order
                                                        .shippingCost
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tax:</span>
                                            <span>
                                                {selectedOrder.order.currency}{" "}
                                                {parseFloat(
                                                    selectedOrder.order
                                                        .taxAmount
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                        {parseFloat(
                                            selectedOrder.order.discountAmount
                                        ) > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Discount:</span>
                                                <span>
                                                    -
                                                    {
                                                        selectedOrder.order
                                                            .currency
                                                    }{" "}
                                                    {parseFloat(
                                                        selectedOrder.order
                                                            .discountAmount
                                                    ).toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                        <hr className="my-2" />
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total:</span>
                                            <span>
                                                {selectedOrder.order.currency}{" "}
                                                {parseFloat(
                                                    selectedOrder.order.total
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Additional Information */}
                            {(selectedOrder.order.orderNotes ||
                                selectedOrder.order.customerNotes ||
                                selectedOrder.order.trackingNumber) && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">
                                            Additional Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {selectedOrder.order.orderNotes && (
                                            <div>
                                                <span className="font-medium text-gray-600">
                                                    Order Notes:
                                                </span>
                                                <p className="mt-1 text-sm">
                                                    {
                                                        selectedOrder.order
                                                            .orderNotes
                                                    }
                                                </p>
                                            </div>
                                        )}
                                        {selectedOrder.order.customerNotes && (
                                            <div>
                                                <span className="font-medium text-gray-600">
                                                    Customer Notes:
                                                </span>
                                                <p className="mt-1 text-sm">
                                                    {
                                                        selectedOrder.order
                                                            .customerNotes
                                                    }
                                                </p>
                                            </div>
                                        )}
                                        {selectedOrder.order.trackingNumber && (
                                            <div>
                                                <span className="font-medium text-gray-600">
                                                    Tracking Number:
                                                </span>
                                                <p className="mt-1 font-mono text-sm">
                                                    {
                                                        selectedOrder.order
                                                            .trackingNumber
                                                    }
                                                </p>
                                            </div>
                                        )}
                                        {selectedOrder.order
                                            .stripeSessionId && (
                                            <div>
                                                <span className="font-medium text-gray-600">
                                                    Stripe Session ID:
                                                </span>
                                                <p className="mt-1 font-mono text-xs text-gray-500">
                                                    {
                                                        selectedOrder.order
                                                            .stripeSessionId
                                                    }
                                                </p>
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
