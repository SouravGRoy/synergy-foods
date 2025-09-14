import { env } from "../../../../../env";
import { db } from "@/lib/db";
import { 
    addresses, 
    carts, 
    orders,
    orderItems,
    orderStatusHistory,
    products, 
    productVariants,
    users, 
    mediaItems
} from "@/lib/db/schemas";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { deliveryService } from "@/lib/delivery/delivery-service";
import { mockDeliveryProvider } from "@/lib/delivery/providers/mock-provider";
import { createShipment } from "@/lib/db/queries/delivery";

// Initialize delivery service with mock provider
if (!deliveryService.isReady()) {
    deliveryService.registerProvider('mock', mockDeliveryProvider);
}

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-08-27.basil",
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const headersList = await headers();
        const signature = headersList.get("stripe-signature");

        if (!signature) {
            console.error("No Stripe signature found");
            return NextResponse.json(
                { error: "No signature" },
                { status: 400 }
            );
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.error("Webhook signature verification failed:", err);
            return NextResponse.json(
                { error: "Invalid signature" },
                { status: 400 }
            );
        }

        // Handle the event
        switch (event.type) {
            case "checkout.session.completed":
                await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
                break;
            case "payment_intent.succeeded":
                console.log("Payment intent succeeded:", event.data.object.id);
                break;
            case "payment_intent.payment_failed":
                console.log("Payment intent failed:", event.data.object.id);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json(
            { error: "Webhook handler failed" },
            { status: 500 }
        );
    }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    try {
        console.log("Processing completed checkout session:", session.id);

        const { userId } = session.metadata || {};

        if (!userId) {
            console.error("Missing userId in session metadata:", session.id);
            return;
        }

        // Get user details
        const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        if (!user.length) {
            console.error("User not found:", userId);
            return;
        }

        // Get user's cart items with product details and media
        const cartItems = await db
            .select({
                id: carts.id,
                productId: carts.productId,
                variantId: carts.variantId,
                quantity: carts.quantity,
                product: products,
                variant: productVariants,
            })
            .from(carts)
            .leftJoin(products, eq(carts.productId, products.id))
            .leftJoin(productVariants, eq(carts.variantId, productVariants.id))
            .where(eq(carts.userId, userId));

        // Get media items for products to resolve image URLs
        const cartItemsWithImages = await Promise.all(
            cartItems.map(async (item) => {
                let productImageUrl = null;
                
                // Try to get variant image first
                if (item.variant?.image) {
                    productImageUrl = item.variant.image;
                } else if (item.product?.media && Array.isArray(item.product.media) && item.product.media.length > 0) {
                    // Get the first media item URL
                    const firstMediaId = item.product.media[0]?.id;
                    if (firstMediaId) {
                        const mediaItem = await db
                            .select({ url: mediaItems.url })
                            .from(mediaItems)
                            .where(eq(mediaItems.id, firstMediaId))
                            .limit(1);
                        
                        if (mediaItem.length > 0) {
                            productImageUrl = mediaItem[0].url;
                        }
                    }
                }
                
                return {
                    ...item,
                    productImageUrl
                };
            })
        );

        if (!cartItemsWithImages.length) {
            console.error("No cart items found for user:", userId);
            return;
        }

        // Calculate totals
        const subtotal = cartItemsWithImages.reduce((sum, item) => {
            const price = item.variant?.price || item.product?.price || 0;
            return sum + (parseFloat(price.toString()) * item.quantity);
        }, 0);

        // Generate unique order number
        const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;

        // Create order
        const [order] = await db.insert(orders).values({
            orderNumber,
            userId,
            customerEmail: user[0].email,
            status: "confirmed",
            paymentStatus: "paid",
            paymentMethod: "stripe",
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent as string,
            subtotal: subtotal.toString(),
            shippingCost: "0",
            taxAmount: "0",
            discountAmount: "0",
            total: subtotal.toString(),
            currency: "AED",
            orderNotes: `Order created via Stripe Checkout session: ${session.id}`,
        }).returning();

        console.log(`Order created with ID: ${order.id} and number: ${orderNumber}`);

        // Create order items
        const orderItemsData = cartItemsWithImages.map(item => ({
            orderId: order.id,
            productId: item.productId,
            variantId: item.variantId,
            productTitle: item.product?.title || "Unknown Product",
            productSlug: item.product?.slug || "unknown",
            variantName: item.variant?.combinations ? JSON.stringify(item.variant.combinations) : null,
            productImage: item.productImageUrl || null,
            quantity: item.quantity,
            unitPrice: (item.variant?.price || item.product?.price || 0).toString(),
            totalPrice: (parseFloat((item.variant?.price || item.product?.price || 0).toString()) * item.quantity).toString(),
            productSku: item.variant?.sku || item.product?.sku || null,
            productWeight: item.variant?.weight || item.product?.weight || null,
        }));

        await db.insert(orderItems).values(orderItemsData);

        // Create initial status history record
        await db.insert(orderStatusHistory).values({
            orderId: order.id,
            previousStatus: null,
            newStatus: "confirmed",
            changeReason: "Order created from successful Stripe payment",
            notes: `Payment completed via Stripe session: ${session.id}`,
        });

        console.log(`Created ${orderItemsData.length} order items for order ${order.id}`);

        // Clear user's cart after successful order creation
        await db.delete(carts).where(eq(carts.userId, userId));

        console.log(`Payment successful and order created for user ${userId}. Order number: ${orderNumber}`);

        // Initialize delivery for the order
        await initializeOrderDelivery(order, cartItemsWithImages);

        // TODO: Send order confirmation email here
        
    } catch (error) {
        console.error("Error processing checkout session:", error);
        throw error;
    }
}

async function initializeOrderDelivery(order: any, cartItems: any[]) {
    try {
        console.log(`Initializing delivery for order ${order.id}`);
        
        // Calculate package dimensions and weight based on cart items
        let totalWeight = 0;
        let maxLength = 0;
        let maxWidth = 0;
        let totalHeight = 0;
        
        cartItems.forEach(item => {
            const weight = item.variant?.weight || item.product?.weight || 500; // Default 500g
            const length = item.variant?.length || item.product?.length || 20; // Default 20cm
            const width = item.variant?.width || item.product?.width || 15; // Default 15cm
            const height = item.variant?.height || item.product?.height || 10; // Default 10cm
            
            totalWeight += weight * item.quantity;
            maxLength = Math.max(maxLength, length);
            maxWidth = Math.max(maxWidth, width);
            totalHeight += height * item.quantity; // Stack height
        });
        
        // Default shipping address (can be enhanced to use actual customer address)
        const defaultShippingAddress = {
            name: "Customer",
            phone: "+971501234567",
            street: "Sheikh Zayed Road",
            city: "Dubai",
            state: "Dubai",
            country: "AE",
            postalCode: "12345"
        };
        
        // Create shipment request
        const shipmentRequest = {
            orderId: order.id,
            orderNumber: order.orderNumber,
            originAddress: deliveryService.getOriginAddress(),
            destinationAddress: defaultShippingAddress,
            packageDetails: {
                weight: totalWeight / 1000, // Convert to kg
                dimensions: {
                    length: maxLength,
                    width: maxWidth,
                    height: Math.min(totalHeight, 50) // Cap height at 50cm
                },
                description: `Order ${order.orderNumber} - ${cartItems.length} items`
            }
        };
        
        // Create shipment using delivery service
        const shipmentResponse = await deliveryService.createShipment(shipmentRequest, 'mock');
        
        if (shipmentResponse.success) {
            // Update order with tracking information
            await db
                .update(orders)
                .set({
                    trackingNumber: shipmentResponse.trackingNumber,
                    deliveryProvider: 'mock',
                    estimatedDelivery: shipmentResponse.estimatedDelivery ? new Date(shipmentResponse.estimatedDelivery) : null,
                    updatedAt: new Date()
                })
                .where(eq(orders.id, order.id));
                
            // Create shipment record in database
            await createShipment({
                orderId: order.id,
                trackingNumber: shipmentResponse.trackingNumber!,
                deliveryProvider: 'mock',
                originName: shipmentRequest.originAddress.name,
                originPhone: shipmentRequest.originAddress.phone,
                originStreet: shipmentRequest.originAddress.street,
                originCity: shipmentRequest.originAddress.city,
                originState: shipmentRequest.originAddress.state,
                originCountry: shipmentRequest.originAddress.country,
                originPostalCode: shipmentRequest.originAddress.postalCode,
                destinationName: defaultShippingAddress.name,
                destinationPhone: defaultShippingAddress.phone,
                destinationStreet: defaultShippingAddress.street,
                destinationCity: defaultShippingAddress.city,
                destinationState: defaultShippingAddress.state,
                destinationCountry: defaultShippingAddress.country,
                destinationPostalCode: defaultShippingAddress.postalCode,
                packageWeight: totalWeight / 1000,
                packageLength: maxLength,
                packageWidth: maxWidth,
                packageHeight: Math.min(totalHeight, 50),
                packageDescription: shipmentRequest.packageDetails.description,
                shippingCost: shipmentResponse.cost,
                estimatedDelivery: shipmentResponse.estimatedDelivery ? new Date(shipmentResponse.estimatedDelivery) : undefined
            });
            
            console.log(`Delivery initialized for order ${order.id}, tracking: ${shipmentResponse.trackingNumber}`);
        } else {
            console.error(`Failed to create shipment for order ${order.id}:`, shipmentResponse.error);
        }
        
    } catch (error) {
        console.error(`Error initializing delivery for order ${order.id}:`, error);
        // Don't throw error to avoid failing the entire webhook
    }
}
