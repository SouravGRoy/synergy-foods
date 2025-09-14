import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { orders, deliveryShipments } from '@/lib/db/schemas';
import { eq, desc, count, and, inArray } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Add admin role check here
    // const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    // if (!user[0] || user[0].role !== 'admin') {
    //   return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    // }

    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'overview';

    if (view === 'overview') {
      // Get delivery statistics
      const [totalShipments] = await db
        .select({ count: count() })
        .from(deliveryShipments);

      const [activeShipments] = await db
        .select({ count: count() })
        .from(deliveryShipments)
        .where(inArray(deliveryShipments.status, ['pending', 'picked_up', 'in_transit', 'out_for_delivery']));

      const [deliveredToday] = await db
        .select({ count: count() })
        .from(deliveryShipments)
        .where(
          and(
            eq(deliveryShipments.status, 'delivered'),
            // Today's deliveries (simplified - you might want to use proper date functions)
          )
        );

      return NextResponse.json({
        success: true,
        data: {
          totalShipments: totalShipments.count,
          activeShipments: activeShipments.count,
          deliveredToday: deliveredToday.count,
          pendingPickups: 0, // Will be calculated when we have more data
        }
      });
    }

    if (view === 'shipments') {
      // Get all shipments with order details
      const shipments = await db
        .select({
          shipment: deliveryShipments,
          order: {
            id: orders.id,
            orderNumber: orders.orderNumber,
            customerEmail: orders.customerEmail,
            total: orders.total,
            status: orders.status
          }
        })
        .from(deliveryShipments)
        .leftJoin(orders, eq(deliveryShipments.orderId, orders.id))
        .orderBy(desc(deliveryShipments.createdAt))
        .limit(50); // Keep it simple with pagination later

      return NextResponse.json({
        success: true,
        data: shipments
      });
    }

    return NextResponse.json({ error: 'Invalid view parameter' }, { status: 400 });

  } catch (error) {
    console.error('Admin delivery error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
