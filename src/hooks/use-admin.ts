import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface DashboardStats {
    totalProducts: number;
    totalUsers: number;
    totalCategories: number;
    pendingOrders: number;
    monthlyRevenue: number;
    totalRevenue: number;
    recentActivity: Array<{
        id: string;
        type: 'order' | 'user' | 'product';
        message: string;
        timestamp: Date;
    }>;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
    slug: string;
    parentCategoryId?: string;
    isActive: boolean;
    sortOrder: number;
    productCount: number;
    createdAt: Date;
    updatedAt: Date;
    metaTitle?: string;
    metaDescription?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'admin' | 'user';
    isActive: boolean;
    isEmailVerified: boolean;
    totalOrders: number;
    totalSpent: number;
    createdAt: Date;
    lastLoginAt?: Date;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    productImage?: string;
    quantity: number;
    price: number;
    total: number;
}

export interface ShippingAddress {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
}

export interface Order {
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
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    shippingAddress: ShippingAddress;
    billingAddress?: ShippingAddress;
    trackingNumber?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Dashboard Stats Hook
export function useAdminStats() {
    return useQuery<DashboardStats>({
        queryKey: ["admin-stats"],
        queryFn: async () => {
            const response = await fetch("/api/admin/stats");
            if (!response.ok) throw new Error("Failed to fetch stats");
            return response.json();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

// Categories Hooks
export function useAdminCategories() {
    return useQuery<Category[]>({
        queryKey: ["admin-categories"],
        queryFn: async () => {
            const response = await fetch("/api/categories");
            if (!response.ok) throw new Error("Failed to fetch categories");
            return response.json();
        },
    });
}

export function useCreateCategory() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: Omit<Category, 'id' | 'productCount' | 'createdAt' | 'updatedAt'>) => {
            const response = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error("Failed to create category");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
            queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
            toast.success("Category created successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to create category");
        },
    });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<Category> }) => {
            const response = await fetch(`/api/categories/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error("Failed to update category");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
            toast.success("Category updated successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update category");
        },
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/categories/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete category");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
            queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
            toast.success("Category deleted successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to delete category");
        },
    });
}

// Users Hooks  
export function useAdminUsers() {
    return useQuery<User[]>({
        queryKey: ["admin-users"],
        queryFn: async () => {
            const response = await fetch("/api/admin/users");
            if (!response.ok) throw new Error("Failed to fetch users");
            return response.json();
        },
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
            const response = await fetch(`/api/admin/users/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error("Failed to update user");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            toast.success("User updated successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update user");
        },
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/admin/users/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete user");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
            toast.success("User deleted successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to delete user");
        },
    });
}

export function useSendUserEmail() {
    return useMutation({
        mutationFn: async ({ userId, subject, message }: { userId: string; subject: string; message: string }) => {
            const response = await fetch(`/api/admin/users/${userId}/email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject, message }),
            });
            if (!response.ok) throw new Error("Failed to send email");
        },
        onSuccess: () => {
            toast.success("Email sent successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to send email");
        },
    });
}

// Orders Hooks
export function useAdminOrders() {
    return useQuery<Order[]>({
        queryKey: ["admin-orders"],
        queryFn: async () => {
            const response = await fetch("/api/admin/orders");
            if (!response.ok) throw new Error("Failed to fetch orders");
            return response.json();
        },
    });
}

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ orderId, status, notes }: { orderId: string; status: OrderStatus; notes?: string }) => {
            const response = await fetch(`/api/admin/orders/${orderId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, notes }),
            });
            if (!response.ok) throw new Error("Failed to update order status");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
            queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
            toast.success("Order status updated successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update order status");
        },
    });
}

export function useAddTrackingNumber() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ orderId, trackingNumber }: { orderId: string; trackingNumber: string }) => {
            const response = await fetch(`/api/admin/orders/${orderId}/tracking`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ trackingNumber }),
            });
            if (!response.ok) throw new Error("Failed to add tracking number");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
            toast.success("Tracking number added successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to add tracking number");
        },
    });
}

export function useRefundOrder() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ orderId, amount, reason }: { orderId: string; amount: number; reason: string }) => {
            const response = await fetch(`/api/admin/orders/${orderId}/refund`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, reason }),
            });
            if (!response.ok) throw new Error("Failed to process refund");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
            queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
            toast.success("Refund processed successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to process refund");
        },
    });
}
