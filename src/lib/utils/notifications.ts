import { queries } from "@/lib/db/queries";

interface NotificationParams {
    userId: string;
    type: "new_order" | "low_stock" | "customer_inquiry" | "product_review" | "payment_received" | "order_cancelled" | "inventory_alert" | "system_alert";
    title: string;
    message: string;
    priority?: "low" | "medium" | "high" | "urgent";
    metadata?: any;
    actionUrl?: string;
}

/**
 * Create a notification for a specific user
 */
export async function createNotification(params: NotificationParams) {
    try {
        return await queries.notification.create({
            userId: params.userId,
            type: params.type,
            title: params.title,
            message: params.message,
            priority: params.priority || "medium",
            metadata: params.metadata,
            actionUrl: params.actionUrl,
        });
    } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
}

/**
 * Create notifications for multiple users (e.g., all admins)
 */
export async function createBulkNotifications(userIds: string[], notificationData: Omit<NotificationParams, "userId">) {
    try {
        const notifications = userIds.map(userId => ({
            userId,
            type: notificationData.type,
            title: notificationData.title,
            message: notificationData.message,
            priority: notificationData.priority || "medium",
            metadata: notificationData.metadata,
            actionUrl: notificationData.actionUrl,
        }));

        return await queries.notification.createMultiple(notifications);
    } catch (error) {
        console.error("Error creating bulk notifications:", error);
        throw error;
    }
}

/**
 * Get all admin users for bulk notifications
 */
export async function getAdminUsers() {
    try {
        const adminUsers = await queries.user.getAdminUsers();
        return adminUsers.map(user => user.id);
    } catch (error) {
        console.error("Error fetching admin users:", error);
        return [];
    }
}

/**
 * Helper functions for common notification scenarios
 */
export const NotificationHelpers = {
    /**
     * Create notification for new order
     */
    newOrder: async (orderId: string, orderTotal: number, customerName: string) => {
        const adminUsers = await getAdminUsers();
        
        return createBulkNotifications(adminUsers, {
            type: "new_order",
            title: "New Order Received",
            message: `New order from ${customerName} - $${orderTotal.toFixed(2)}`,
            priority: "high",
            metadata: { orderId, orderTotal, customerName },
            actionUrl: `/dashboard/orders/${orderId}`,
        });
    },

    /**
     * Create notification for low stock
     */
    lowStock: async (productId: string, productName: string, currentStock: number, threshold: number) => {
        const adminUsers = await getAdminUsers();
        
        return createBulkNotifications(adminUsers, {
            type: "low_stock",
            title: "Low Stock Alert",
            message: `${productName} is running low - ${currentStock} units left (threshold: ${threshold})`,
            priority: currentStock === 0 ? "urgent" : "high",
            metadata: { productId, productName, currentStock, threshold },
            actionUrl: `/dashboard/products/p/${productId}`,
        });
    },

    /**
     * Create notification for customer inquiry
     */
    customerInquiry: async (customerName: string, subject: string, inquiryId?: string) => {
        const adminUsers = await getAdminUsers();
        
        return createBulkNotifications(adminUsers, {
            type: "customer_inquiry",
            title: "New Customer Inquiry",
            message: `${customerName} sent an inquiry: ${subject}`,
            priority: "medium",
            metadata: { customerName, subject, inquiryId },
            actionUrl: inquiryId ? `/dashboard/inquiries/${inquiryId}` : "/dashboard/inquiries",
        });
    },

    /**
     * Create notification for payment received
     */
    paymentReceived: async (orderId: string, amount: number, customerName: string) => {
        const adminUsers = await getAdminUsers();
        
        return createBulkNotifications(adminUsers, {
            type: "payment_received",
            title: "Payment Received",
            message: `Payment of $${amount.toFixed(2)} received from ${customerName}`,
            priority: "medium",
            metadata: { orderId, amount, customerName },
            actionUrl: `/dashboard/orders/${orderId}`,
        });
    },

    /**
     * Create notification for order cancellation
     */
    orderCancelled: async (orderId: string, customerName: string, reason?: string) => {
        const adminUsers = await getAdminUsers();
        
        return createBulkNotifications(adminUsers, {
            type: "order_cancelled",
            title: "Order Cancelled",
            message: `Order cancelled by ${customerName}${reason ? ` - Reason: ${reason}` : ''}`,
            priority: "medium",
            metadata: { orderId, customerName, reason },
            actionUrl: `/dashboard/orders/${orderId}`,
        });
    },

    /**
     * Create notification for product review
     */
    productReview: async (productId: string, productName: string, rating: number, reviewerName: string) => {
        const adminUsers = await getAdminUsers();
        
        return createBulkNotifications(adminUsers, {
            type: "product_review",
            title: "New Product Review",
            message: `${reviewerName} left a ${rating}-star review for ${productName}`,
            priority: rating <= 2 ? "high" : "low",
            metadata: { productId, productName, rating, reviewerName },
            actionUrl: `/dashboard/products/p/${productId}`,
        });
    },

    /**
     * Create system alert notification
     */
    systemAlert: async (title: string, message: string, priority: "low" | "medium" | "high" | "urgent" = "medium") => {
        const adminUsers = await getAdminUsers();
        
        return createBulkNotifications(adminUsers, {
            type: "system_alert",
            title,
            message,
            priority,
            metadata: { timestamp: new Date().toISOString() },
        });
    },
};