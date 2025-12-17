
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { poolManager } from './db';

const app = express();
app.use(cors());
app.use(express.json());

// Bootstrapping
async function bootstrap() {
  let retries = 5;
  while (retries > 0) {
    try {
      console.log('Connecting to PostgreSQL...');
      const pool = poolManager.getSystemPool();
      await pool.query('SELECT 1');
      console.log('Database connected successfully.');
      
      // Ensure admin exists (Demo/Default admin)
      await pool.query(`
        INSERT INTO system.admins (email, password_hash)
        VALUES ('admin@inercia.io', '$2b$10$YourHashedPasswordHere')
        ON CONFLICT (email) DO NOTHING
      `);
      
      return;
    } catch (err) {
      console.error(`Bootstrap failed. Retrying in 5s... (${retries} left)`);
      retries--;
      await new Promise(r => setTimeout(r, 5000));
    }
  }
  // Added casting to any to fix the error: Property 'exit' does not exist on type 'Process'
  (process as any).exit(1);
}

// Multi-tenant Middleware
const getContext = async (req: Request, res: Response, next: NextFunction) => {
  const projectId = req.headers['x-project-id'] as string;
  
  if (!projectId && !req.path.startsWith('/api/control')) {
    return res.status(400).json({ error: 'Missing x-project-id header' });
  }

  try {
    req.pool = await poolManager.getPool(projectId || 'SYSTEM_INTERNAL');
    next();
  } catch (err) {
    res.status(404).json({ error: 'Project not found' });
  }
};

// Extend Request type
declare global {
  namespace Express {
    interface Request {
      pool: any;
    }
  }
}

// Control Plane Routes
app.get('/api/control/projects', getContext, async (req, res) => {
  const result = await req.pool.query('SELECT id, name, slug, created_at FROM system.projects');
  res.json(result.rows);
});

// Data Plane Routes (Dynamic API)
app.get('/api/data/:table', getContext, async (req, res) => {
  const { table } = req.params;
  try {
    // Sanitize table name in real implementation
    const result = await req.pool.query(`SELECT * FROM public."${table}" LIMIT 100`);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/data/:table', getContext, async (req, res) => {
  const { table } = req.params;
  const data = req.body;
  const columns = Object.keys(data).join(', ');
  const values = Object.values(data);
  const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

  try {
    const query = `INSERT INTO public."${table}" (${columns}) VALUES (${placeholders}) RETURNING *`;
    const result = await req.pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Metadata Routes
app.get('/api/meta/tables', getContext, async (req, res) => {
  const query = `
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
  `;
  const result = await req.pool.query(query);
  res.json(result.rows);
});

const PORT = process.env.PORT || 4000;
bootstrap().then(() => {
  app.listen(PORT, () => {
    console.log(`Inércia API running on port ${PORT}`);
  });
});
