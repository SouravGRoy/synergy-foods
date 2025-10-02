import { queries } from "@/lib/db/queries";
import { NotificationHelpers } from "./notifications";

/**
 * Configuration for low stock thresholds
 */
const LOW_STOCK_THRESHOLD = 10; // Default threshold
const OUT_OF_STOCK_THRESHOLD = 0;

/**
 * Check if a product's stock is low and create notifications if needed
 */
export async function checkLowStock(productId: string, currentQuantity: number, threshold = LOW_STOCK_THRESHOLD) {
    try {
        // Don't check if stock is above threshold
        if (currentQuantity > threshold) {
            return;
        }

        // Get product details
        const product = await queries.product.get({ id: productId, isDeleted: false });
        if (!product) {
            console.warn(`Product ${productId} not found for low stock check`);
            return;
        }

        // Check if we've already sent a notification for this stock level
        // This prevents spam notifications when stock is consistently low
        const recentNotifications = await queries.notification.getByType(
            "system", // We'll need a system user or modify this logic
            "low_stock",
            5
        );

        const hasRecentLowStockNotification = recentNotifications.some(
            notification => {
                const metadata = notification.metadata as any;
                return metadata?.productId === productId &&
                       metadata?.currentStock <= currentQuantity;
            }
        );

        if (hasRecentLowStockNotification) {
            return; // Don't spam with notifications
        }

        // Create low stock notification
        await NotificationHelpers.lowStock(
            productId,
            product.title,
            currentQuantity,
            threshold
        );

        console.log(`Low stock notification created for product: ${product.title} (${currentQuantity} units left)`);
    } catch (error) {
        console.error("Error checking low stock:", error);
    }
}

/**
 * Check multiple products for low stock (can be used in cron jobs)
 */
export async function checkAllProductsLowStock(threshold = LOW_STOCK_THRESHOLD) {
    try {
        // This would need to be implemented based on your product query structure
        // You'd want to get all products with quantity <= threshold
        console.log("Checking all products for low stock...");
        
        // For now, this is a placeholder - you'd implement the actual product scanning logic
        // const lowStockProducts = await queries.product.getLowStockProducts(threshold);
        
        // for (const product of lowStockProducts) {
        //     await checkLowStock(product.id, product.quantity, threshold);
        // }
    } catch (error) {
        console.error("Error checking all products for low stock:", error);
    }
}

/**
 * Utility function to be called when product quantity is updated
 */
export async function onProductQuantityUpdate(productId: string, newQuantity: number, oldQuantity?: number) {
    try {
        // Check for low stock
        await checkLowStock(productId, newQuantity);

        // If product went from in-stock to out-of-stock, create urgent notification
        if (oldQuantity && oldQuantity > 0 && newQuantity === 0) {
            const product = await queries.product.get({ id: productId, isDeleted: false });
            if (product) {
                await NotificationHelpers.systemAlert(
                    "Product Out of Stock",
                    `${product.title} is now out of stock`,
                    "urgent"
                );
            }
        }
    } catch (error) {
        console.error("Error handling product quantity update:", error);
    }
}

/**
 * Helper function to simulate order creation notifications
 * This should be integrated into your actual order creation logic
 */
export async function onOrderCreated(orderId: string, orderTotal: number, customerName: string, customerId: string) {
    try {
        await NotificationHelpers.newOrder(orderId, orderTotal, customerName);
        console.log(`New order notification created for order: ${orderId}`);
    } catch (error) {
        console.error("Error creating order notification:", error);
    }
}

/**
 * Helper function for payment received notifications
 */
export async function onPaymentReceived(orderId: string, amount: number, customerName: string) {
    try {
        await NotificationHelpers.paymentReceived(orderId, amount, customerName);
        console.log(`Payment received notification created for order: ${orderId}`);
    } catch (error) {
        console.error("Error creating payment notification:", error);
    }
}