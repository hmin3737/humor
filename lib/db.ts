import { Pool } from 'pg';

export type Humor = {
  id: number;
  author: string;
  front: string;
  back: string;
  overlap: string;
  likes: number;
  created_at: string;
};

// Vercel/Prisma Postgres exposes the connection string as DATABASE_URL;
// older setups use POSTGRES_URL. Support both.
// Pool is created lazily (not at module load) so `next build` doesn't need a DB.
let _pool: Pool | null = null;

function getPool(): Pool {
  if (_pool) return _pool;
  const connectionString =
    process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? '';
  if (!connectionString) {
    throw new Error(
      'No database connection string. Set DATABASE_URL (or POSTGRES_URL).'
    );
  }
  _pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 3,
  });
  return _pool;
}

async function query<T>(text: string, params: unknown[] = []): Promise<T[]> {
  const { rows } = await getPool().query(text, params);
  return rows as T[];
}

let initialized = false;

// Lazily create the table on first access so no migration step is needed.
export async function ensureSchema() {
  if (initialized) return;
  await query(`
    CREATE TABLE IF NOT EXISTS humors (
      id SERIAL PRIMARY KEY,
      author TEXT NOT NULL,
      front TEXT NOT NULL,
      back TEXT NOT NULL,
      overlap TEXT NOT NULL,
      likes INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  initialized = true;
}

export async function listHumors(): Promise<Humor[]> {
  await ensureSchema();
  return query<Humor>(
    `SELECT id, author, front, back, overlap, likes, created_at
     FROM humors
     ORDER BY likes DESC, created_at DESC;`
  );
}

export async function createHumor(input: {
  author: string;
  front: string;
  back: string;
  overlap: string;
}): Promise<Humor> {
  await ensureSchema();
  const rows = await query<Humor>(
    `INSERT INTO humors (author, front, back, overlap)
     VALUES ($1, $2, $3, $4)
     RETURNING id, author, front, back, overlap, likes, created_at;`,
    [input.author, input.front, input.back, input.overlap]
  );
  return rows[0];
}

export async function likeHumor(id: number): Promise<number> {
  await ensureSchema();
  const rows = await query<{ likes: number }>(
    `UPDATE humors SET likes = likes + 1 WHERE id = $1 RETURNING likes;`,
    [id]
  );
  return rows[0]?.likes ?? 0;
}
