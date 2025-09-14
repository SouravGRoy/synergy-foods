import { db } from '../index';
import { deliveryShipments, deliveryTrackingUpdates, deliveryRates } from '../schemas/delivery';
import { orders } from '../schemas/order';
import { eq, and, desc, lt, gt } from 'drizzle-orm';

// Shipment management
export async function createShipment(shipmentData: {
  orderId: string;
  trackingNumber: string;
  deliveryProvider: string;
  originName: string;
  originPhone: string;
  originStreet: string;
  originCity: string;
  originState: string;
  originCountry: string;
  originPostalCode: string;
  destinationName: string;
  destinationPhone: string;
  destinationStreet: string;
  destinationCity: string;
  destinationState: string;
  destinationCountry: string;
  destinationPostalCode: string;
  packageWeight: number;
  packageLength: number;
  packageWidth: number;
  packageHeight: number;
  packageDescription?: string;
  status?: string;
  estimatedDelivery?: Date;
  shippingCost?: number;
  currency?: string;
  providerResponse?: any;
}) {
  try {
    const [shipment] = await db
      .insert(deliveryShipments)
      .values({
        orderId: shipmentData.orderId,
        trackingNumber: shipmentData.trackingNumber,
        deliveryProvider: shipmentData.deliveryProvider,
        originName: shipmentData.originName,
        originPhone: shipmentData.originPhone,
        originStreet: shipmentData.originStreet,
        originCity: shipmentData.originCity,
        originState: shipmentData.originState,
        originCountry: shipmentData.originCountry,
        originPostalCode: shipmentData.originPostalCode,
        destinationName: shipmentData.destinationName,
        destinationPhone: shipmentData.destinationPhone,
        destinationStreet: shipmentData.destinationStreet,
        destinationCity: shipmentData.destinationCity,
        destinationState: shipmentData.destinationState,
        destinationCountry: shipmentData.destinationCountry,
        destinationPostalCode: shipmentData.destinationPostalCode,
        packageWeight: shipmentData.packageWeight.toString(),
        packageLength: shipmentData.packageLength.toString(),
        packageWidth: shipmentData.packageWidth.toString(),
        packageHeight: shipmentData.packageHeight.toString(),
        packageDescription: shipmentData.packageDescription,
        status: shipmentData.status || 'pending',
        estimatedDelivery: shipmentData.estimatedDelivery,
        shippingCost: shipmentData.shippingCost?.toString(),
        currency: shipmentData.currency || 'AED',
        providerResponse: shipmentData.providerResponse
      })
      .returning();

    return shipment;
  } catch (error) {
    console.error('Error creating shipment:', error);
    throw error;
  }
}

export async function getShipmentByTrackingNumber(trackingNumber: string) {
  try {
    const [shipment] = await db
      .select()
      .from(deliveryShipments)
      .where(eq(deliveryShipments.trackingNumber, trackingNumber))
      .limit(1);

    return shipment || null;
  } catch (error) {
    console.error('Error getting shipment by tracking number:', error);
    throw error;
  }
}

export async function getShipmentByOrderId(orderId: string) {
  try {
    const [shipment] = await db
      .select()
      .from(deliveryShipments)
      .where(eq(deliveryShipments.orderId, orderId))
      .limit(1);

    return shipment || null;
  } catch (error) {
    console.error('Error getting shipment by order ID:', error);
    throw error;
  }
}

export async function updateShipmentStatus(
  trackingNumber: string, 
  status: string, 
  actualDelivery?: Date
) {
  try {
    const updateData: any = { 
      status,
      updatedAt: new Date()
    };

    if (actualDelivery) {
      updateData.actualDelivery = actualDelivery;
    }

    const [updatedShipment] = await db
      .update(deliveryShipments)
      .set(updateData)
      .where(eq(deliveryShipments.trackingNumber, trackingNumber))
      .returning();

    return updatedShipment;
  } catch (error) {
    console.error('Error updating shipment status:', error);
    throw error;
  }
}

// Tracking updates management
export async function addTrackingUpdate(updateData: {
  shipmentId: string;
  trackingNumber: string;
  status: string;
  location?: string;
  description: string;
  timestamp: Date;
  providerData?: any;
}) {
  try {
    const [trackingUpdate] = await db
      .insert(deliveryTrackingUpdates)
      .values({
        shipmentId: updateData.shipmentId,
        trackingNumber: updateData.trackingNumber,
        status: updateData.status,
        location: updateData.location,
        description: updateData.description,
        timestamp: updateData.timestamp,
        providerData: updateData.providerData
      })
      .returning();

    return trackingUpdate;
  } catch (error) {
    console.error('Error adding tracking update:', error);
    throw error;
  }
}

export async function getTrackingUpdates(trackingNumber: string) {
  try {
    const updates = await db
      .select()
      .from(deliveryTrackingUpdates)
      .where(eq(deliveryTrackingUpdates.trackingNumber, trackingNumber))
      .orderBy(desc(deliveryTrackingUpdates.timestamp));

    return updates;
  } catch (error) {
    console.error('Error getting tracking updates:', error);
    throw error;
  }
}

export async function getTrackingUpdatesByShipmentId(shipmentId: string) {
  try {
    const updates = await db
      .select()
      .from(deliveryTrackingUpdates)
      .where(eq(deliveryTrackingUpdates.shipmentId, shipmentId))
      .orderBy(desc(deliveryTrackingUpdates.timestamp));

    return updates;
  } catch (error) {
    console.error('Error getting tracking updates by shipment ID:', error);
    throw error;
  }
}

// Delivery rates management
export async function cacheDeliveryRate(rateData: {
  originCity: string;
  originCountry: string;
  destinationCity: string;
  destinationCountry: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  deliveryProvider: string;
  serviceName: string;
  cost: number;
  currency: string;
  estimatedDays: string;
  description?: string;
  expiresAt: Date;
}) {
  try {
    const [rate] = await db
      .insert(deliveryRates)
      .values({
        originCity: rateData.originCity,
        originCountry: rateData.originCountry,
        destinationCity: rateData.destinationCity,
        destinationCountry: rateData.destinationCountry,
        weight: rateData.weight.toString(),
        length: rateData.length.toString(),
        width: rateData.width.toString(),
        height: rateData.height.toString(),
        deliveryProvider: rateData.deliveryProvider,
        serviceName: rateData.serviceName,
        cost: rateData.cost.toString(),
        currency: rateData.currency,
        estimatedDays: rateData.estimatedDays,
        description: rateData.description,
        expiresAt: rateData.expiresAt
      })
      .returning();

    return rate;
  } catch (error) {
    console.error('Error caching delivery rate:', error);
    throw error;
  }
}

export async function getCachedDeliveryRates(params: {
  originCity: string;
  originCountry: string;
  destinationCity: string;
  destinationCountry: string;
  weight: number;
  length: number;
  width: number;
  height: number;
}) {
  try {
    const rates = await db
      .select()
      .from(deliveryRates)
      .where(and(
        eq(deliveryRates.originCity, params.originCity),
        eq(deliveryRates.originCountry, params.originCountry),
        eq(deliveryRates.destinationCity, params.destinationCity),
        eq(deliveryRates.destinationCountry, params.destinationCountry),
        eq(deliveryRates.weight, params.weight.toString()),
        eq(deliveryRates.length, params.length.toString()),
        eq(deliveryRates.width, params.width.toString()),
        eq(deliveryRates.height, params.height.toString()),
        gt(deliveryRates.expiresAt, new Date()) // Only non-expired rates
      ));

    return rates;
  } catch (error) {
    console.error('Error getting cached delivery rates:', error);
    throw error;
  }
}

export async function cleanupExpiredRates() {
  try {
    const deletedRates = await db
      .delete(deliveryRates)
      .where(lt(deliveryRates.expiresAt, new Date()))
      .returning();

    console.log(`Cleaned up ${deletedRates.length} expired delivery rates`);
    return deletedRates.length;
  } catch (error) {
    console.error('Error cleaning up expired rates:', error);
    throw error;
  }
}

// Order integration queries
export async function getOrderWithDeliveryInfo(orderId: string) {
  try {
    const [orderData] = await db
      .select({
        order: orders,
        shipment: deliveryShipments
      })
      .from(orders)
      .leftJoin(deliveryShipments, eq(orders.id, deliveryShipments.orderId))
      .where(eq(orders.id, orderId))
      .limit(1);

    return orderData || null;
  } catch (error) {
    console.error('Error getting order with delivery info:', error);
    throw error;
  }
}

export async function getUserOrdersWithDelivery(userId: string, limit = 10) {
  try {
    const ordersWithDelivery = await db
      .select({
        order: orders,
        shipment: deliveryShipments
      })
      .from(orders)
      .leftJoin(deliveryShipments, eq(orders.id, deliveryShipments.orderId))
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt))
      .limit(limit);

    return ordersWithDelivery;
  } catch (error) {
    console.error('Error getting user orders with delivery:', error);
    throw error;
  }
}
