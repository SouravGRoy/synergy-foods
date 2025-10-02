"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { axios } from "../axios";
import { Notification } from "../validations";

interface NotificationResponse {
    notifications: Notification[];
    unreadCount: number;
    hasMore: boolean;
}

interface CreateNotificationData {
    targetUserId?: string;
    type: string;
    title: string;
    message: string;
    priority?: "low" | "medium" | "high" | "urgent";
    metadata?: any;
    actionUrl?: string;
}

export function useNotification() {
    const queryClient = useQueryClient();

    // Get user notifications
    const useGetNotifications = ({
        limit = 50,
        offset = 0,
        type,
        unreadOnly = false,
        enabled = true,
    }: {
        limit?: number;
        offset?: number;
        type?: string;
        unreadOnly?: boolean;
        enabled?: boolean;
    } = {}) => {
        return useQuery({
            queryKey: ["notifications", { limit, offset, type, unreadOnly }],
            queryFn: async (): Promise<NotificationResponse> => {
                const params = new URLSearchParams({
                    limit: limit.toString(),
                    offset: offset.toString(),
                });
                
                if (type) params.append("type", type);
                if (unreadOnly) params.append("unreadOnly", "true");

                const response = await axios.get(`/api/notifications?${params}`);
                return response.data;
            },
            enabled,
            staleTime: 30 * 1000, // 30 seconds
            refetchInterval: 60 * 1000, // Refetch every minute
        });
    };

    // Get unread notifications for dropdown
    const useGetUnreadNotifications = (enabled = true) => {
        return useQuery({
            queryKey: ["notifications", "unread"],
            queryFn: async (): Promise<NotificationResponse> => {
                const response = await axios.get("/api/notifications?unreadOnly=true&limit=10");
                return response.data;
            },
            enabled,
            staleTime: 10 * 1000, // 10 seconds
            refetchInterval: 30 * 1000, // Refetch every 30 seconds
        });
    };

    // Create notification (admin only)
    const useCreateNotification = () => {
        return useMutation({
            mutationFn: async (data: CreateNotificationData): Promise<Notification> => {
                const response = await axios.post("/api/notifications", data);
                return response.data;
            },
            onSuccess: () => {
                // Invalidate all notification queries
                queryClient.invalidateQueries({ queryKey: ["notifications"] });
                toast.success("Notification created successfully");
            },
            onError: (error: any) => {
                console.error("Error creating notification:", error);
                toast.error(error.response?.data?.error || "Failed to create notification");
            },
        });
    };

    // Mark notification as read
    const useMarkAsRead = () => {
        return useMutation({
            mutationFn: async (notificationId: string): Promise<Notification> => {
                const response = await axios.patch(`/api/notifications/${notificationId}`, {
                    isRead: true,
                });
                return response.data;
            },
            onSuccess: (data) => {
                // Update the cache optimistically
                queryClient.setQueryData(
                    ["notifications", "unread"],
                    (old: NotificationResponse | undefined) => {
                        if (!old) return old;
                        return {
                            ...old,
                            notifications: old.notifications.filter(n => n.id !== data.id),
                            unreadCount: Math.max(0, old.unreadCount - 1),
                        };
                    }
                );
                
                // Invalidate all notification queries to ensure consistency
                queryClient.invalidateQueries({ queryKey: ["notifications"] });
            },
            onError: (error: any) => {
                console.error("Error marking notification as read:", error);
                toast.error(error.response?.data?.error || "Failed to mark notification as read");
            },
        });
    };

    // Mark all notifications as read
    const useMarkAllAsRead = () => {
        return useMutation({
            mutationFn: async (): Promise<{ success: boolean; updated: number }> => {
                const response = await axios.post("/api/notifications/bulk", {
                    action: "mark_all_read",
                });
                return response.data;
            },
            onSuccess: (data) => {
                // Update the unread notifications cache
                queryClient.setQueryData(
                    ["notifications", "unread"],
                    (old: NotificationResponse | undefined) => {
                        if (!old) return old;
                        return {
                            ...old,
                            notifications: [],
                            unreadCount: 0,
                        };
                    }
                );
                
                // Invalidate all notification queries
                queryClient.invalidateQueries({ queryKey: ["notifications"] });
                toast.success(`Marked ${data.updated} notifications as read`);
            },
            onError: (error: any) => {
                console.error("Error marking all notifications as read:", error);
                toast.error(error.response?.data?.error || "Failed to mark all notifications as read");
            },
        });
    };

    // Delete notification
    const useDeleteNotification = () => {
        return useMutation({
            mutationFn: async (notificationId: string): Promise<{ success: boolean }> => {
                const response = await axios.delete(`/api/notifications/${notificationId}`);
                return response.data;
            },
            onSuccess: (_, notificationId) => {
                // Remove from cache optimistically
                queryClient.setQueryData(
                    ["notifications", "unread"],
                    (old: NotificationResponse | undefined) => {
                        if (!old) return old;
                        const notification = old.notifications.find(n => n.id === notificationId);
                        return {
                            ...old,
                            notifications: old.notifications.filter(n => n.id !== notificationId),
                            unreadCount: notification && !notification.isRead 
                                ? Math.max(0, old.unreadCount - 1) 
                                : old.unreadCount,
                        };
                    }
                );
                
                // Invalidate all notification queries
                queryClient.invalidateQueries({ queryKey: ["notifications"] });
                toast.success("Notification deleted");
            },
            onError: (error: any) => {
                console.error("Error deleting notification:", error);
                toast.error(error.response?.data?.error || "Failed to delete notification");
            },
        });
    };

    return {
        useGetNotifications,
        useGetUnreadNotifications,
        useCreateNotification,
        useMarkAsRead,
        useMarkAllAsRead,
        useDeleteNotification,
    };
}