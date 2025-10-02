"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useNotification } from "@/lib/react-query";
import { useAuth, UserButton } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { Bell, Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

export function DashboardHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const {
        useGetUnreadNotifications,
        useMarkAsRead,
        useMarkAllAsRead,
        useDeleteNotification,
    } = useNotification();

    // Get unread notifications
    const { data: notificationData, isLoading } = useGetUnreadNotifications();
    const { mutate: markAsRead } = useMarkAsRead();
    const { mutate: markAllAsRead } = useMarkAllAsRead();
    const { mutate: deleteNotification } = useDeleteNotification();

    const notifications = notificationData?.notifications || [];
    const unreadCount = notificationData?.unreadCount || 0;

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleNotificationClick = (notification: any) => {
        if (!notification.isRead) {
            markAsRead(notification.id);
        }

        // Navigate to action URL if provided
        if (notification.actionUrl) {
            window.location.href = notification.actionUrl;
        }
    };

    const handleMarkAllAsRead = () => {
        markAllAsRead();
    };

    const handleDeleteNotification = (
        e: React.MouseEvent,
        notificationId: string
    ) => {
        e.stopPropagation();
        deleteNotification(notificationId);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "urgent":
                return "text-red-600";
            case "high":
                return "text-orange-600";
            case "medium":
                return "text-blue-600";
            case "low":
                return "text-gray-600";
            default:
                return "text-gray-600";
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "new_order":
                return "🛒";
            case "low_stock":
                return "📦";
            case "customer_inquiry":
                return "💬";
            case "product_review":
                return "⭐";
            case "payment_received":
                return "💰";
            case "order_cancelled":
                return "❌";
            case "inventory_alert":
                return "⚠️";
            case "system_alert":
                return "🔔";
            default:
                return "📢";
        }
    };

    return (
        <header className="border-b border-slate-200/60 bg-white/95 px-6 py-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between">
                {/* Left side - Mobile menu button and search */}
                <div className="flex flex-1 items-center space-x-6">
                    {/* Mobile menu button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    {/* Search bar */}
                    <div className="relative max-w-lg flex-1">
                        <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                        <Input
                            placeholder="Search products, orders, customers..."
                            className="w-full border-slate-200 bg-slate-50/50 pr-4 pl-12 focus:bg-white focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Right side - Notifications and user menu */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="relative hover:bg-slate-100"
                                disabled={isLoading}
                            >
                                <Bell className="h-5 w-5 text-slate-600" />
                                {/* Notification badge */}
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 text-xs font-medium text-white shadow-lg">
                                        {unreadCount > 99 ? "99+" : unreadCount}
                                    </span>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="max-h-96 w-96 overflow-y-auto border-slate-200"
                        >
                            <div className="flex items-center justify-between p-4">
                                <DropdownMenuLabel className="p-0 text-slate-900">
                                    Notifications{" "}
                                    {unreadCount > 0 && `(${unreadCount})`}
                                </DropdownMenuLabel>
                                {unreadCount > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleMarkAllAsRead}
                                        className="text-xs text-blue-600 hover:text-blue-700"
                                    >
                                        Mark all read
                                    </Button>
                                )}
                            </div>
                            <DropdownMenuSeparator className="bg-slate-200" />

                            {isLoading ? (
                                <div className="p-4 text-center text-sm text-slate-500">
                                    Loading notifications...
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-4 text-center text-sm text-slate-500">
                                    No new notifications
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <DropdownMenuItem
                                        key={notification.id}
                                        className="cursor-pointer p-0 hover:bg-slate-50"
                                        onSelect={(e) => e.preventDefault()}
                                    >
                                        <div
                                            className="flex w-full items-start gap-3 p-4"
                                            onClick={() =>
                                                handleNotificationClick(
                                                    notification
                                                )
                                            }
                                        >
                                            <span className="text-lg">
                                                {getNotificationIcon(
                                                    notification.type
                                                )}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <p
                                                            className={`text-sm font-semibold text-slate-900 ${
                                                                !notification.isRead
                                                                    ? "font-bold"
                                                                    : "font-medium"
                                                            }`}
                                                        >
                                                            {notification.title}
                                                        </p>
                                                        <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                                                            {
                                                                notification.message
                                                            }
                                                        </p>
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <span
                                                                className={`text-xs ${getPriorityColor(notification.priority)}`}
                                                            >
                                                                {notification.priority.toUpperCase()}
                                                            </span>
                                                            <span className="text-xs text-slate-400">
                                                                {formatDistanceToNow(
                                                                    new Date(
                                                                        notification.createdAt
                                                                    ),
                                                                    {
                                                                        addSuffix: true,
                                                                    }
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 hover:bg-red-100"
                                                        onClick={(e) =>
                                                            handleDeleteNotification(
                                                                e,
                                                                notification.id
                                                            )
                                                        }
                                                    >
                                                        <X className="h-3 w-3 text-slate-400 hover:text-red-600" />
                                                    </Button>
                                                </div>
                                                {!notification.isRead && (
                                                    <div className="absolute top-1/2 left-1 h-2 w-2 -translate-y-1/2 rounded-full bg-blue-500" />
                                                )}
                                            </div>
                                        </div>
                                    </DropdownMenuItem>
                                ))
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* User menu */}
                    {isMounted ? (
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox:
                                        "h-9 w-9 ring-2 ring-slate-200 hover:ring-blue-300 transition-all",
                                },
                            }}
                        />
                    ) : (
                        <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
                    )}
                </div>
            </div>
        </header>
    );
}
