import { 
  DeliveryProvider, 
  ShipmentRequest, 
  ShipmentResponse, 
  TrackingUpdate, 
  ShippingRate 
} from '../types';

export class MockDeliveryProvider implements DeliveryProvider {
  public name: string;
  private shipments: Map<string, any> = new Map();

  constructor(name: string = 'Mock Delivery') {
    this.name = name;
  }

  async createShipment(request: ShipmentRequest): Promise<ShipmentResponse> {
    // Simulate API delay
    await this.delay(500);

    // Generate mock tracking number
    const trackingNumber = this.generateTrackingNumber();
    
    // Calculate estimated delivery (2-5 days)
    const deliveryDays = Math.floor(Math.random() * 4) + 2;
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + deliveryDays);

    // Store shipment data
    const shipmentData = {
      ...request,
      trackingNumber,
      status: 'pending',
      createdAt: new Date(),
      estimatedDelivery,
      updates: [{
        status: 'pending',
        location: 'Processing Center, Dubai',
        timestamp: new Date(),
        description: 'Shipment created and pending pickup'
      }]
    };

    this.shipments.set(trackingNumber, shipmentData);

    return {
      success: true,
      trackingNumber,
      estimatedDelivery: estimatedDelivery.toISOString(),
      cost: this.calculateShippingCost(request),
      provider: this.name
    };
  }

  async trackShipment(trackingNumber: string): Promise<TrackingUpdate[]> {
    // Simulate API delay
    await this.delay(300);

    const shipment = this.shipments.get(trackingNumber);
    if (!shipment) {
      return [];
    }

    // Generate realistic tracking updates based on shipment age
    const updates = this.generateTrackingUpdates(shipment);
    
    // Update stored shipment with new tracking data
    shipment.updates = updates;
    this.shipments.set(trackingNumber, shipment);

    return updates;
  }

  async cancelShipment(trackingNumber: string): Promise<boolean> {
    // Simulate API delay
    await this.delay(400);

    const shipment = this.shipments.get(trackingNumber);
    if (!shipment) {
      return false;
    }

    // Can only cancel if not yet picked up
    const canCancel = shipment.status === 'pending';
    
    if (canCancel) {
      shipment.status = 'cancelled';
      shipment.updates.push({
        status: 'cancelled',
        location: 'Processing Center, Dubai',
        timestamp: new Date(),
        description: 'Shipment cancelled at customer request'
      });
      this.shipments.set(trackingNumber, shipment);
    }

    return canCancel;
  }

  async getShippingRates(
    request: Omit<ShipmentRequest, 'orderId' | 'orderNumber'>
  ): Promise<ShippingRate[]> {
    // Simulate API delay
    await this.delay(600);

    const baseRate = this.calculateShippingCost(request as ShipmentRequest);
    
    return [
      {
        serviceName: 'Standard Delivery',
        cost: baseRate,
        currency: 'AED',
        estimatedDays: '3-5',
        description: 'Standard delivery within UAE'
      },
      {
        serviceName: 'Express Delivery',
        cost: baseRate * 1.5,
        currency: 'AED',
        estimatedDays: '1-2',
        description: 'Express delivery within UAE'
      },
      {
        serviceName: 'Same Day Delivery',
        cost: baseRate * 2.5,
        currency: 'AED',
        estimatedDays: '1',
        description: 'Same day delivery (Dubai only)',
        restrictions: ['Available only in Dubai']
      }
    ];
  }

  private generateTrackingNumber(): string {
    const prefix = this.name.substring(0, 3).toUpperCase();
    const number = Math.random().toString(36).substring(2, 12).toUpperCase();
    return `${prefix}${number}`;
  }

  private calculateShippingCost(request: ShipmentRequest): number {
    // Simple calculation based on weight and distance
    const baseRate = 25; // AED 25 base rate
    const weightRate = request.packageDetails.weight * 2; // AED 2 per kg
    const volumeRate = (request.packageDetails.dimensions.length * 
                       request.packageDetails.dimensions.width * 
                       request.packageDetails.dimensions.height) / 1000 * 0.5; // Volume rate

    // Distance factor (mock calculation)
    const distanceFactor = this.calculateDistanceFactor(
      request.destinationAddress.city,
      request.destinationAddress.country
    );

    return Math.round((baseRate + weightRate + volumeRate) * distanceFactor);
  }

  private calculateDistanceFactor(city: string, country: string): number {
    // Mock distance calculation
    if (country !== 'AE') return 3.0; // International
    
    const dubaiCities = ['dubai', 'dxb'];
    const nearbyEmirates = ['sharjah', 'ajman', 'ras al khaimah', 'umm al quwain'];
    const farEmirates = ['abu dhabi', 'al ain', 'fujairah'];

    const cityLower = city.toLowerCase();
    
    if (dubaiCities.some((c) => cityLower.includes(c))) return 1.0;
    if (nearbyEmirates.some((c) => cityLower.includes(c))) return 1.3;
    if (farEmirates.some((c) => cityLower.includes(c))) return 1.6;
    
    return 1.2; // Default UAE rate
  }

  private generateTrackingUpdates(shipment: any): TrackingUpdate[] {
    const now = new Date();
    const createdAt = new Date(shipment.createdAt);
    const hoursElapsed = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    const updates: TrackingUpdate[] = [
      {
        status: 'pending',
        location: 'Processing Center, Dubai',
        timestamp: createdAt,
        description: 'Shipment created and pending pickup'
      }
    ];

    if (hoursElapsed > 2) {
      updates.push({
        status: 'picked_up',
        location: 'Processing Center, Dubai',
        timestamp: new Date(createdAt.getTime() + 2 * 60 * 60 * 1000),
        description: 'Shipment confirmed and ready for pickup'
      });
    }

    if (hoursElapsed > 6) {
      updates.push({
        status: 'picked_up',
        location: 'Dubai Distribution Center',
        timestamp: new Date(createdAt.getTime() + 6 * 60 * 60 * 1000),
        description: 'Package picked up by courier'
      });
    }

    if (hoursElapsed > 24) {
      updates.push({
        status: 'in_transit',
        location: `${shipment.destinationAddress.city} Distribution Center`,
        timestamp: new Date(createdAt.getTime() + 24 * 60 * 60 * 1000),
        description: 'Package in transit to destination'
      });
    }

    if (hoursElapsed > 48) {
      updates.push({
        status: 'out_for_delivery',
        location: `${shipment.destinationAddress.city} Local Facility`,
        timestamp: new Date(createdAt.getTime() + 48 * 60 * 60 * 1000),
        description: 'Package out for delivery'
      });
    }

    if (hoursElapsed > 72) {
      updates.push({
        status: 'delivered',
        location: shipment.destinationAddress.street,
        timestamp: new Date(createdAt.getTime() + 72 * 60 * 60 * 1000),
        description: 'Package delivered successfully'
      });
    }

    return updates;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export a default instance
export const mockDeliveryProvider = new MockDeliveryProvider();
