import { 
  DeliveryProvider, 
  ShipmentRequest, 
  ShipmentResponse, 
  TrackingUpdate, 
  ShippingRate,
  DeliveryServiceConfig 
} from './types';

class DeliveryService {
  private providers: Map<string, DeliveryProvider> = new Map();
  private defaultProvider?: string;
  private config: DeliveryServiceConfig;

  constructor() {
    // Default store configuration - can be overridden
    this.config = {
      storeName: process.env.STORE_NAME || 'Synergy Foods',
      storePhone: process.env.STORE_PHONE || '+971501234567',
      storeAddress: {
        street: process.env.STORE_ADDRESS || 'Sheikh Zayed Road, Dubai',
        city: process.env.STORE_CITY || 'Dubai',
        state: process.env.STORE_STATE || 'Dubai',
        country: process.env.STORE_COUNTRY || 'AE',
        postalCode: process.env.STORE_POSTAL_CODE || '12345'
      }
    };
  }

  /**
   * Register a delivery provider
   */
  registerProvider(name: string, provider: DeliveryProvider) {
    this.providers.set(name, provider);
    if (!this.defaultProvider) {
      this.defaultProvider = name;
    }
    console.log(`Delivery provider '${name}' registered successfully`);
  }

  /**
   * Set the default delivery provider
   */
  setDefaultProvider(name: string) {
    if (this.providers.has(name)) {
      this.defaultProvider = name;
      console.log(`Default delivery provider set to '${name}'`);
    } else {
      throw new Error(`Provider '${name}' not found`);
    }
  }

  /**
   * Update store configuration
   */
  updateConfig(config: Partial<DeliveryServiceConfig>) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get store origin address
   */
  getOriginAddress() {
    return {
      name: this.config.storeName,
      phone: this.config.storePhone,
      street: this.config.storeAddress.street,
      city: this.config.storeAddress.city,
      state: this.config.storeAddress.state,
      country: this.config.storeAddress.country,
      postalCode: this.config.storeAddress.postalCode
    };
  }

  /**
   * Create a shipment
   */
  async createShipment(
    request: ShipmentRequest, 
    providerName?: string
  ): Promise<ShipmentResponse> {
    const provider = this.getProvider(providerName);
    if (!provider) {
      return {
        success: false,
        error: 'No delivery provider available'
      };
    }

    try {
      const result = await provider.createShipment(request);
      
      // Log shipment creation
      if (result.success) {
        console.log(`Shipment created successfully:`, {
          orderId: request.orderId,
          trackingNumber: result.trackingNumber,
          provider: providerName || this.defaultProvider
        });
      } else {
        console.error(`Shipment creation failed:`, {
          orderId: request.orderId,
          error: result.error,
          provider: providerName || this.defaultProvider
        });
      }

      return result;
    } catch (error) {
      console.error('Shipment creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create shipment'
      };
    }
  }

  /**
   * Track a shipment
   */
  async trackShipment(
    trackingNumber: string, 
    providerName?: string
  ): Promise<TrackingUpdate[]> {
    const provider = this.getProvider(providerName);
    if (!provider) {
      console.error('No delivery provider available for tracking');
      return [];
    }

    try {
      const updates = await provider.trackShipment(trackingNumber);
      console.log(`Tracking updates retrieved for ${trackingNumber}:`, updates.length);
      return updates;
    } catch (error) {
      console.error('Tracking error:', error);
      return [];
    }
  }

  /**
   * Cancel a shipment
   */
  async cancelShipment(
    trackingNumber: string, 
    providerName?: string
  ): Promise<boolean> {
    const provider = this.getProvider(providerName);
    if (!provider) {
      console.error('No delivery provider available for cancellation');
      return false;
    }

    try {
      const result = await provider.cancelShipment(trackingNumber);
      console.log(`Shipment cancellation ${result ? 'successful' : 'failed'} for ${trackingNumber}`);
      return result;
    } catch (error) {
      console.error('Cancellation error:', error);
      return false;
    }
  }

  /**
   * Get shipping rates from all providers
   */
  async getShippingRates(
    request: Omit<ShipmentRequest, 'orderId' | 'orderNumber'>
  ): Promise<ShippingRate[]> {
    const allRates: ShippingRate[] = [];
    
    for (const [name, provider] of this.providers) {
      try {
        const rates = await provider.getShippingRates(request);
        const ratesWithProvider = rates.map((rate) => ({ ...rate, provider: name }));
        allRates.push(...ratesWithProvider);
      } catch (error) {
        console.error(`Failed to get rates from ${name}:`, error);
      }
    }
    
    // Sort by cost (lowest first)
    return allRates.sort((a, b) => a.cost - b.cost);
  }

  /**
   * Get shipping rates from a specific provider
   */
  async getShippingRatesFromProvider(
    request: Omit<ShipmentRequest, 'orderId' | 'orderNumber'>,
    providerName: string
  ): Promise<ShippingRate[]> {
    const provider = this.getProvider(providerName);
    if (!provider) {
      console.error(`Provider '${providerName}' not found`);
      return [];
    }

    try {
      const rates = await provider.getShippingRates(request);
      return rates.map((rate) => ({ ...rate, provider: providerName }));
    } catch (error) {
      console.error(`Failed to get rates from ${providerName}:`, error);
      return [];
    }
  }

  /**
   * Get list of available providers
   */
  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Get provider instance
   */
  private getProvider(name?: string): DeliveryProvider | undefined {
    if (name && this.providers.has(name)) {
      return this.providers.get(name);
    }
    if (this.defaultProvider) {
      return this.providers.get(this.defaultProvider);
    }
    return undefined;
  }

  /**
   * Check if service is ready
   */
  isReady(): boolean {
    return this.providers.size > 0;
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      providersCount: this.providers.size,
      defaultProvider: this.defaultProvider,
      availableProviders: this.getAvailableProviders(),
      isReady: this.isReady(),
      config: this.config
    };
  }
}

// Export singleton instance
export const deliveryService = new DeliveryService();

// Export the class for testing
export { DeliveryService };
