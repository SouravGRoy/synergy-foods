import { Pool } from 'pg';

class DatabasePool {
  private static instance: DatabasePool;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Connection pool configuration
      min: 2, // Minimum number of connections
      max: 20, // Maximum number of connections
      idleTimeoutMillis: 30000, // Close idle connections after 30s
      connectionTimeoutMillis: 2000, // Timeout when connecting to database
      statement_timeout: 30000, // Timeout for SQL statements
      query_timeout: 30000, // Timeout for queries
      // Health checks
      allowExitOnIdle: true,
    });

    // Handle pool events
    this.pool.on('connect', (client) => {
      console.log('New database connection established');
    });

    this.pool.on('error', (err) => {
      console.error('Database pool error:', err);
    });

    this.pool.on('remove', () => {
      console.log('Database connection removed from pool');
    });
  }

  public static getInstance(): DatabasePool {
    if (!DatabasePool.instance) {
      DatabasePool.instance = new DatabasePool();
    }
    return DatabasePool.instance;
  }

  public getPool(): Pool {
    return this.pool;
  }

  public async query(text: string, params?: unknown[]): Promise<any> {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      
      // Log slow queries
      if (duration > 1000) {
        console.warn(`Slow query detected (${duration}ms):`, text);
      }
      
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  public async getClient() {
    return this.pool.connect();
  }

  public async end(): Promise<void> {
    await this.pool.end();
  }

  public async getStats() {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
    };
  }
}

// Export singleton instance
export const dbPool = DatabasePool.getInstance();

// Health check function
export async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  latency?: number;
  error?: string;
  stats: any;
}> {
  try {
    const start = Date.now();
    await dbPool.query('SELECT 1');
    const latency = Date.now() - start;
    
    const stats = await dbPool.getStats();
    
    return {
      status: 'healthy',
      latency,
      stats,
    };
  } catch (error) {
    const stats = await dbPool.getStats();
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      stats,
    };
  }
}
