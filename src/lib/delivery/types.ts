export interface DeliveryAddress {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface PackageDetails {
  weight: number; // in kg
  dimensions: {
    length: number; // in cm
    width: number; // in cm
    height: number; // in cm
  };
  description: string;
}

export interface ShipmentRequest {
  orderId: string;
  orderNumber: string;
  originAddress: DeliveryAddress;
  destinationAddress: DeliveryAddress;
  packageDetails: PackageDetails;
}

export interface ShipmentResponse {
  success: boolean;
  trackingNumber?: string;
  estimatedDelivery?: string;
  cost?: number;
  provider?: string;
  error?: string;
}

export interface TrackingUpdate {
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed' | 'cancelled';
  location?: string;
  timestamp: Date;
  description: string;
}

export interface ShippingRate {
  serviceName: string;
  cost: number;
  currency: string;
  estimatedDays: string; // e.g., "3-5", "1-2", "1"
  description: string;
  provider?: string;
  restrictions?: string[];
}

export interface DeliveryProvider {
  name: string;
  createShipment(request: ShipmentRequest): Promise<ShipmentResponse>;
  trackShipment(trackingNumber: string): Promise<TrackingUpdate[]>;
  cancelShipment(trackingNumber: string): Promise<boolean>;
  getShippingRates(request: Omit<ShipmentRequest, 'orderId' | 'orderNumber'>): Promise<ShippingRate[]>;
}

export interface DeliveryServiceConfig {
  storeName: string;
  storePhone: string;
  storeAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}
