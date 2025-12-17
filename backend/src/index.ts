
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
// Fix: Import crypto using ES modules to avoid 'require' is not defined error
import crypto from 'crypto';
import { poolManager } from './db';

const app = express();
app.use(cors());
app.use(express.json());

// Bootstrapping: Ensures the system is ready
async function bootstrap() {
  let retries = 5;
  while (retries > 0) {
    try {
      const pool = poolManager.getSystemPool();
      await pool.query('SELECT 1');
      console.log('Control Plane: Database connected.');
      return;
    } catch (err) {
      console.error(`Bootstrap failed. Retrying in 5s... (${retries} left)`);
      retries--;
      await new Promise(r => setTimeout(r, 5000));
    }
  }
  (process as any).exit(1);
}

// Context Middleware: Resolves the Project Pool
const getContext = async (req: Request, res: Response, next: NextFunction) => {
  const projectId = req.headers['x-project-id'] as string;
  
  if (!projectId && !req.path.startsWith('/api/control')) {
    return res.status(400).json({ error: 'Missing x-project-id header' });
  }

  try {
    req.pool = await poolManager.getPool(projectId || 'SYSTEM_INTERNAL');
    next();
  } catch (err: any) {
    res.status(404).json({ error: `Project context error: ${err.message}` });
  }
};

declare global {
  namespace Express {
    interface Request {
      pool: any;
    }
  }
}

// --- CONTROL PLANE: Management of Projects ---

app.get('/api/control/projects', getContext, async (req, res) => {
  const result = await req.pool.query('SELECT id, name, slug, created_at FROM system.projects ORDER BY created_at DESC');
  res.json(result.rows);
});

app.post('/api/control/projects', getContext, async (req, res) => {
  const { name, slug } = req.body;
  const systemPool = poolManager.getSystemPool();
  
  try {
    // 1. Create the Database for the new Project (Logical Isolation)
    // Note: Database names must be sanitized. We use the slug.
    await systemPool.query(`CREATE DATABASE "${slug}"`);
    
    // 2. Register project in system catalog
    // Fix: Using imported crypto module instead of require
    const jwtSecret = crypto.randomBytes(32).toString('hex');
    const result = await systemPool.query(
      `INSERT INTO system.projects (name, slug, jwt_secret, db_config) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, slug, jwtSecret, { database: slug }]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- DATA PLANE: BaaS Functionality ---

// Fetch Table List
app.get('/api/meta/tables', getContext, async (req, res) => {
  const result = await req.pool.query(`
    SELECT table_name, 
           (SELECT count(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
    FROM information_schema.tables t
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  `);
  res.json(result.rows);
});

// Fetch Table Data
app.get('/api/data/:table', getContext, async (req, res) => {
  try {
    const result = await req.pool.query(`SELECT * FROM public."${req.params.table}" LIMIT 100`);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Execute Arbitrary SQL (Logic Editor / RPC)
app.post('/api/query', getContext, async (req, res) => {
  const { sql, params } = req.body;
  try {
    const result = await req.pool.query(sql, params || []);
    res.json({
      rows: result.rows,
      rowCount: result.rowCount,
      command: result.command
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Create Table (DDL API)
app.post('/api/meta/tables', getContext, async (req, res) => {
  const { name, columns } = req.body; // columns: [{name, type, nullable, default}]
  const colDefs = columns.map((c: any) => 
    `"${c.name}" ${c.type} ${c.nullable ? '' : 'NOT NULL'} ${c.default ? `DEFAULT ${c.default}` : ''}`
  ).join(', ');
  
  try {
    await req.pool.query(`CREATE TABLE public."${name}" (${colDefs})`);
    res.status(201).json({ message: `Table ${name} created successfully` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
bootstrap().then(() => {
  app.listen(PORT, () => console.log(`Inércia Engine active on port ${PORT}`));
});
