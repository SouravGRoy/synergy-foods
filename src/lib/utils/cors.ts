import { NextRequest, NextResponse } from 'next/server';

export interface CorsOptions {
  origin?: string | string[] | boolean;
  methods?: string[];
  allowedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

const defaultCorsOptions: Required<CorsOptions> = {
  origin: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Accept',
    'Accept-Version',
    'Authorization',
    'Content-Type',
    'X-Requested-With',
    'X-CSRF-Token',
    'X-API-Key',
  ],
  credentials: true,
  maxAge: 86400, // 24 hours
};

/**
 * Production-ready CORS configuration
 */
export function configureCors(options: CorsOptions = {}): Required<CorsOptions> {
  const corsOptions = { ...defaultCorsOptions, ...options };

  // In production, set specific allowed origins
  if (process.env.NODE_ENV === 'production') {
    corsOptions.origin = [
      process.env.NEXTAUTH_URL || '',
      process.env.NEXT_PUBLIC_APP_URL || '',
      // Add your production domains here
    ].filter(Boolean);
  } else {
    // In development, allow localhost
    corsOptions.origin = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
    ];
  }

  return corsOptions;
}

/**
 * Apply CORS headers to response
 */
export function applyCorsHeaders(
  response: NextResponse,
  request: NextRequest,
  options: CorsOptions = {}
): NextResponse {
  const corsOptions = configureCors(options);
  const origin = request.headers.get('origin');

  // Check if origin is allowed
  let allowedOrigin = '';
  if (corsOptions.origin === true) {
    allowedOrigin = origin || '*';
  } else if (typeof corsOptions.origin === 'string') {
    allowedOrigin = corsOptions.origin;
  } else if (Array.isArray(corsOptions.origin) && origin) {
    if (corsOptions.origin.includes(origin)) {
      allowedOrigin = origin;
    }
  }

  // Set CORS headers
  if (allowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  }

  response.headers.set('Access-Control-Allow-Methods', corsOptions.methods.join(', '));
  response.headers.set('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(', '));
  
  if (corsOptions.credentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  response.headers.set('Access-Control-Max-Age', corsOptions.maxAge.toString());

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // CSP header for production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
    );
  }

  return response;
}

/**
 * Handle preflight OPTIONS requests
 */
export function handlePreflight(request: NextRequest, options: CorsOptions = {}): NextResponse {
  const response = new NextResponse(null, { status: 200 });
  return applyCorsHeaders(response, request, options);
}

/**
 * Middleware wrapper for API routes with CORS
 */
export function withCors(
  handler: (request: NextRequest) => Promise<NextResponse> | NextResponse,
  options: CorsOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return handlePreflight(request, options);
    }

    // Process the actual request
    const response = await handler(request);
    
    // Apply CORS headers to the response
    return applyCorsHeaders(response, request, options);
  };
}

/**
 * CORS configuration for different environments
 */
export const corsConfigs = {
  // For public APIs
  public: {
    origin: true,
    credentials: false,
    methods: ['GET', 'POST', 'OPTIONS'] as string[],
  },
  
  // For authenticated APIs
  authenticated: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.NEXTAUTH_URL || '', process.env.NEXT_PUBLIC_APP_URL || ''].filter(Boolean)
      : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'] as string[],
  },
  
  // For admin APIs
  admin: {
    origin: process.env.NODE_ENV === 'production'
      ? [process.env.NEXTAUTH_URL || ''].filter(Boolean)
      : ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'] as string[],
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'X-Admin-Token',
    ] as string[],
  },
};
