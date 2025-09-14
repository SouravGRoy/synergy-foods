import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { dbPool } from '@/lib/db/pool';
import { Redis } from '@upstash/redis';

// Create Redis instance only if environment variables are available
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN 
  ? Redis.fromEnv() 
  : null;

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    database: {
      status: 'healthy' | 'unhealthy';
      latency?: number;
      error?: string;
      stats?: any;
    };
    redis: {
      status: 'healthy' | 'unhealthy';
      latency?: number;
      error?: string;
    };
    auth: {
      status: 'healthy' | 'unhealthy';
      error?: string;
    };
  };
  performance: {
    uptime: number;
    memoryUsage: NodeJS.MemoryUsage;
    responseTime: number;
  };
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  
  // Check database health
  let dbHealth: HealthStatus['services']['database'];
  try {
    const dbStart = Date.now();
    await db.execute('SELECT 1 as test');
    const dbLatency = Date.now() - dbStart;
    
    // Get connection pool stats if available
    let stats;
    try {
      stats = await dbPool.getStats();
    } catch {
      stats = null;
    }
    
    dbHealth = {
      status: 'healthy',
      latency: dbLatency,
      stats,
    };
  } catch (error) {
    dbHealth = {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
  
  // Check Redis health
  let redisHealth: HealthStatus['services']['redis'];
  if (!redis) {
    redisHealth = {
      status: 'unhealthy',
      error: 'Redis not configured (missing environment variables)',
    };
  } else {
    try {
      const redisStart = Date.now();
      await redis.ping();
      const redisLatency = Date.now() - redisStart;
      redisHealth = {
        status: 'healthy',
        latency: redisLatency,
      };
    } catch (error) {
      redisHealth = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  // Check auth service (basic check)
  let authHealth: HealthStatus['services']['auth'];
  try {
    // Simple check for required env vars
    if (process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
      authHealth = { status: 'healthy' };
    } else {
      authHealth = { 
        status: 'unhealthy',
        error: 'Missing authentication configuration'
      };
    }
  } catch (error) {
    authHealth = {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
  
  // Determine overall status
  const services = [dbHealth.status, redisHealth.status, authHealth.status];
  const unhealthyCount = services.filter(s => s === 'unhealthy').length;
  
  let overallStatus: HealthStatus['status'];
  if (unhealthyCount === 0) {
    overallStatus = 'healthy';
  } else if (unhealthyCount < services.length) {
    overallStatus = 'degraded';
  } else {
    overallStatus = 'unhealthy';
  }
  
  const responseTime = Date.now() - startTime;
  
  const healthStatus: HealthStatus = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    services: {
      database: dbHealth,
      redis: redisHealth,
      auth: authHealth,
    },
    performance: {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      responseTime,
    },
  };
  
  return NextResponse.json(healthStatus, {
    status: overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 207 : 503,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Response-Time': `${responseTime}ms`,
      'X-Health-Status': overallStatus,
    },
  });
}
