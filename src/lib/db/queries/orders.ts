import { db } from "@/lib/db";
import { orders, orderItems, products, users, mediaItems } from "@/lib/db/schemas";
import { desc, eq, and } from "drizzle-orm";

export async function getOrders(limit = 10) {
    try {
        const ordersData = await db
            .select({
                order: orders,
                user: {
                    id: users.id,
                    firstName: users.firstName,
                    lastName: users.lastName,
                    email: users.email,
                },
            })
            .from(orders)
            .leftJoin(users, eq(orders.userId, users.id))
            .orderBy(desc(orders.createdAt))
            .limit(limit);

        // Fetch order items for each order
        const ordersWithItems = await Promise.all(
            ordersData.map(async (orderData) => {
                const items = await db
                    .select({
                        orderItem: orderItems,
                        product: {
                            id: products.id,
                            title: products.title,
                            slug: products.slug,
                        },
                    })
                    .from(orderItems)
                    .leftJoin(products, eq(orderItems.productId, products.id))
                    .where(eq(orderItems.orderId, orderData.order.id));

                return {
                    ...orderData,
                    items,
                };
            })
        );

        return ordersWithItems;
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
}

export async function getOrderById(orderId: string) {
    try {
        const [orderData] = await db
            .select({
                order: orders,
                user: {
                    id: users.id,
                    firstName: users.firstName,
                    lastName: users.lastName,
                    email: users.email,
                },
            })
            .from(orders)
            .leftJoin(users, eq(orders.userId, users.id))
            .where(eq(orders.id, orderId))
            .limit(1);

        if (!orderData) return null;

        const orderItemsData = await db
            .select({
                orderItem: orderItems,
                product: {
                    id: products.id,
                    title: products.title,
                    slug: products.slug,
                },
            })
            .from(orderItems)
            .leftJoin(products, eq(orderItems.productId, products.id))
            .where(eq(orderItems.orderId, orderId));

        return {
            ...orderData,
            items: orderItemsData,
        };
    } catch (error) {
        console.error("Error fetching order:", error);
        return null;
    }
}

export async function getOrdersByUserId(userId: string) {
    try {
        const userOrders = await db
            .select()
            .from(orders)
            .where(eq(orders.userId, userId))
            .orderBy(desc(orders.createdAt));

        return userOrders;
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return [];
    }
}

export async function getOrdersByCustomerId(
    userId: string, 
    options: {
        limit?: number;
        page?: number;
        status?: string;
    } = {}
) {
    try {
        const { limit = 20, page = 1, status } = options;
        const offset = (page - 1) * limit;

        // Build where conditions
        const whereConditions = [eq(orders.userId, userId)];
        if (status) {
            whereConditions.push(eq(orders.status, status as any));
        }

        const ordersData = await db
            .select({
                order: orders,
                user: {
                    id: users.id,
                    firstName: users.firstName,
                    lastName: users.lastName,
                    email: users.email,
                },
            })
            .from(orders)
            .leftJoin(users, eq(orders.userId, users.id))
            .where(and(...whereConditions))
            .orderBy(desc(orders.createdAt))
            .limit(limit)
            .offset(offset);

        // Fetch order items for each order with resolved media URLs
        const ordersWithItems = await Promise.all(
            ordersData.map(async (orderData) => {
                const items = await db
                    .select({
                        orderItem: orderItems,
                        product: {
                            id: products.id,
                            title: products.title,
                            slug: products.slug,
                            media: products.media,
                        },
                    })
                    .from(orderItems)
                    .leftJoin(products, eq(orderItems.productId, products.id))
                    .where(eq(orderItems.orderId, orderData.order.id));

                // Resolve media URLs for each item
                const itemsWithImages = await Promise.all(
                    items.map(async (item) => {
                        let resolvedImageUrl = null;

                        // First try the stored productImage from orderItem
                        if (item.orderItem?.productImage) {
                            resolvedImageUrl = item.orderItem.productImage;
                        } else if (item.product?.media && Array.isArray(item.product.media) && item.product.media.length > 0) {
                            // Resolve the first media item URL
                            const firstMediaId = item.product.media[0]?.id;
                            if (firstMediaId) {
                                const mediaItem = await db
                                    .select({ url: mediaItems.url })
                                    .from(mediaItems)
                                    .where(eq(mediaItems.id, firstMediaId))
                                    .limit(1);
                                
                                if (mediaItem.length > 0) {
                                    resolvedImageUrl = mediaItem[0].url;
                                }
                            }
                        }

                        return {
                            ...item,
                            resolvedImageUrl
                        };
                    })
                );

                return {
                    ...orderData,
                    items: itemsWithImages,
                };
            })
        );

        return ordersWithItems;
    } catch (error) {
        console.error("Error fetching customer orders:", error);
        return [];
    }
}
