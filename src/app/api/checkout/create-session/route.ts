import { auth } from "@clerk/nextjs/server";
import { env } from "../../../../../env";
import { db } from "@/lib/db";
import { carts, products, productVariants } from "@/lib/db/schemas";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-08-27.basil",
});

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user's cart items
        const userCart = await db
            .select({
                productTitle: products.title,
                productPrice: products.price,
                variantPrice: productVariants.price,
                quantity: carts.quantity,
            })
            .from(carts)
            .innerJoin(products, eq(carts.productId, products.id))
            .leftJoin(productVariants, eq(carts.variantId, productVariants.id))
            .where(eq(carts.userId, userId));

        if (userCart.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // Convert cart items to Stripe line items
        const lineItems = userCart.map(item => ({
            price_data: {
                currency: 'aed',
                product_data: {
                    name: item.productTitle,
                    // Skip images for now to avoid schema complexity
                    images: [],
                },
                unit_amount: Math.round(Number(item.variantPrice || item.productPrice) * 100), // Convert to fils
            },
            quantity: item.quantity,
        }));

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${env.NEXT_PUBLIC_BACKEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${env.NEXT_PUBLIC_BACKEND_URL}/checkout/cancel`,
            shipping_address_collection: {
                allowed_countries: ['AE'], // UAE only
            },
            metadata: {
                userId: userId,
            },
        });

        return NextResponse.json({ url: session.url });

    } catch (error) {
        console.error('Stripe error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
