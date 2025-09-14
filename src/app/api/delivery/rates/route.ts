import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { deliveryService } from '@/lib/delivery/delivery-service';
import { mockDeliveryProvider } from '@/lib/delivery/providers/mock-provider';

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
      destinationAddress, 
      packageDetails,
      provider // Optional: specific provider
    } = body;

    // Validate required fields
    if (!destinationAddress || !packageDetails) {
      return NextResponse.json(
        { error: 'Missing required fields: destinationAddress, packageDetails' },
        { status: 400 }
      );
    }

    // Validate destination address
    if (!destinationAddress.street || !destinationAddress.city || !destinationAddress.country) {
      return NextResponse.json(
        { error: 'Incomplete destination address' },
        { status: 400 }
      );
    }

    // Validate package details
    if (!packageDetails.weight || !packageDetails.dimensions) {
      return NextResponse.json(
        { error: 'Missing package weight or dimensions' },
        { status: 400 }
      );
    }

    // Create rate request
    const rateRequest = {
      originAddress: deliveryService.getOriginAddress(),
      destinationAddress,
      packageDetails
    };

    let shippingRates;

    if (provider) {
      // Get rates from specific provider
      shippingRates = await deliveryService.getShippingRatesFromProvider(
        rateRequest,
        provider
      );
    } else {
      // Get rates from all providers
      shippingRates = await deliveryService.getShippingRates(rateRequest);
    }

    return NextResponse.json({
      success: true,
      rates: shippingRates,
      origin: rateRequest.originAddress,
      destination: destinationAddress
    });

  } catch (error) {
    console.error('Shipping rates error:', error);
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

    // Return available providers and service status
    const status = deliveryService.getStatus();

    return NextResponse.json({
      success: true,
      ...status
    });

  } catch (error) {
    console.error('Service status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
