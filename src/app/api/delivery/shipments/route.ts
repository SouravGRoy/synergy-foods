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

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      orderId, 
      destinationAddress, 
      packageDetails,
      provider = 'mock' // Default to mock provider
    } = body;

    // Validate required fields
    if (!orderId || !destinationAddress || !packageDetails) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, destinationAddress, packageDetails' },
        { status: 400 }
      );
    }

    // Get order details from database
    const orderData = await db
      .select()
      .from(orders)
      .where(and(
        eq(orders.id, orderId),
        eq(orders.userId, userId)
      ))
      .limit(1);

    if (orderData.length === 0) {
      return NextResponse.json(
        { error: 'Order not found or not authorized' },
        { status: 404 }
      );
    }

    const order = orderData[0];

    // Check if order already has a shipment
    if (order.trackingNumber) {
      return NextResponse.json(
        { error: 'Order already has a shipment', trackingNumber: order.trackingNumber },
        { status: 409 }
      );
    }

    // Create shipment request
    const shipmentRequest = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      originAddress: deliveryService.getOriginAddress(),
      destinationAddress,
      packageDetails
    };

    // Create shipment using delivery service
    const shipmentResponse = await deliveryService.createShipment(
      shipmentRequest,
      provider
    );

    if (!shipmentResponse.success) {
      return NextResponse.json(
        { error: shipmentResponse.error || 'Failed to create shipment' },
        { status: 500 }
      );
    }

    // Update order with tracking information
    await db
      .update(orders)
      .set({
        trackingNumber: shipmentResponse.trackingNumber,
        deliveryProvider: provider,
        shippingCost: shipmentResponse.cost?.toString(),
        estimatedDelivery: shipmentResponse.estimatedDelivery ? new Date(shipmentResponse.estimatedDelivery) : null,
        updatedAt: new Date()
      })
      .where(eq(orders.id, orderId));

    return NextResponse.json({
      success: true,
      trackingNumber: shipmentResponse.trackingNumber,
      estimatedDelivery: shipmentResponse.estimatedDelivery,
      cost: shipmentResponse.cost,
      provider: shipmentResponse.provider
    });

  } catch (error) {
    console.error('Shipment creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing orderId parameter' },
        { status: 400 }
      );
    }

    // Get order with shipment details
    const orderData = await db
      .select()
      .from(orders)
      .where(and(
        eq(orders.id, orderId),
        eq(orders.userId, userId)
      ))
      .limit(1);

    if (orderData.length === 0) {
      return NextResponse.json(
        { error: 'Order not found or not authorized' },
        { status: 404 }
      );
    }

    const order = orderData[0];

    if (!order.trackingNumber) {
      return NextResponse.json(
        { error: 'No shipment found for this order' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      trackingNumber: order.trackingNumber,
      deliveryProvider: order.deliveryProvider,
      shippingCost: order.shippingCost,
      estimatedDelivery: order.estimatedDelivery,
      status: order.status
    });

  } catch (error) {
    console.error('Shipment retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
