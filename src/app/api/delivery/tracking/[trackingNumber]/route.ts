import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { deliveryService } from '@/lib/delivery/delivery-service';
import { mockDeliveryProvider } from '@/lib/delivery/providers/mock-provider';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schemas';
import { eq, and } from 'drizzle-orm';

// Initialize delivery service with mock provider
if (!deliveryService.isReady()) {
  deliveryService.registerProvider('mock', mockDeliveryProvider);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackingNumber: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { trackingNumber } = await params;

    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Missing tracking number' },
        { status: 400 }
      );
    }

    // Verify that the user owns this tracking number
    const orderData = await db
      .select()
      .from(orders)
      .where(and(
        eq(orders.trackingNumber, trackingNumber),
        eq(orders.userId, userId)
      ))
      .limit(1);

    if (orderData.length === 0) {
      return NextResponse.json(
        { error: 'Tracking number not found or not authorized' },
        { status: 404 }
      );
    }

    const order = orderData[0];

    // Get tracking updates from delivery service
    const trackingUpdates = await deliveryService.trackShipment(
      trackingNumber,
      order.deliveryProvider || 'mock'
    );

    return NextResponse.json({
      trackingNumber,
      orderId: order.id,
      orderNumber: order.orderNumber,
      deliveryProvider: order.deliveryProvider,
      estimatedDelivery: order.estimatedDelivery,
      updates: trackingUpdates
    });

  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ trackingNumber: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { trackingNumber } = await params;
    const body = await request.json();
    const { action } = body;

    if (action !== 'cancel') {
      return NextResponse.json(
        { error: 'Invalid action. Only "cancel" is supported' },
        { status: 400 }
      );
    }

    // Verify that the user owns this tracking number
    const orderData = await db
      .select()
      .from(orders)
      .where(and(
        eq(orders.trackingNumber, trackingNumber),
        eq(orders.userId, userId)
      ))
      .limit(1);

    if (orderData.length === 0) {
      return NextResponse.json(
        { error: 'Tracking number not found or not authorized' },
        { status: 404 }
      );
    }

    const order = orderData[0];

    // Cancel shipment using delivery service
    const cancelled = await deliveryService.cancelShipment(
      trackingNumber,
      order.deliveryProvider || 'mock'
    );

    if (!cancelled) {
      return NextResponse.json(
        { error: 'Shipment cannot be cancelled at this stage' },
        { status: 400 }
      );
    }

    // Update order status in database
    await db
      .update(orders)
      .set({
        status: 'cancelled',
        updatedAt: new Date()
      })
      .where(eq(orders.id, order.id));

    return NextResponse.json({
      success: true,
      message: 'Shipment cancelled successfully'
    });

  } catch (error) {
    console.error('Shipment cancellation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
