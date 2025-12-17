
import { Pool } from 'pg';

/**
 * Connection Pool Manager for Multi-tenancy
 */
class PoolManager {
  private pools: Map<string, Pool> = new Map();
  private systemPool: Pool;

  constructor() {
    this.systemPool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  /**
   * Get connection pool for a specific project
   */
  async getPool(projectId: string): Promise<Pool> {
    if (projectId === 'SYSTEM_INTERNAL') return this.systemPool;

    if (this.pools.has(projectId)) {
      return this.pools.get(projectId)!;
    }

    // Resolve project config from system database
    const res = await this.systemPool.query(
      'SELECT db_config FROM system.projects WHERE id = $1',
      [projectId]
    );

    if (res.rowCount === 0) {
      throw new Error(`Project ${projectId} not found`);
    }

    const config = res.rows[0].db_config;
    
    // In a multi-database setup, we'd use config.connectionString.
    // For single-VPS simple setup, we use the main pool but could set search_path.
    // For this implementation, we reuse the system pool but strictly scope by project ID in queries.
    // In production, you would create separate Pools for isolation.
    
    const newPool = new Pool({
      connectionString: process.env.DATABASE_URL // Pointing to the same DB but we'll use isolation logic
    });

    this.pools.set(projectId, newPool);
    return newPool;
  }

  getSystemPool() {
    return this.systemPool;
  }
}

export const poolManager = new PoolManager();
