
import { Pool } from 'pg';

class PoolManager {
  private pools: Map<string, Pool> = new Map();
  private systemPool: Pool;
  private baseConfig: any;

  constructor() {
    this.baseConfig = {
      user: 'thales_admin',
      password: process.env.DB_PASSWORD,
      host: 'thales_db',
      port: 5432,
    };

    this.systemPool = new Pool({
      ...this.baseConfig,
      database: 'thales_system'
    });
  }

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

    const { database } = res.rows[0].db_config;
    
    // Create a dedicated pool for this client database
    const newPool = new Pool({
      ...this.baseConfig,
      database: database
    });

    this.pools.set(projectId, newPool);
    return newPool;
  }

  getSystemPool() {
    return this.systemPool;
  }
}

export const poolManager = new PoolManager();
