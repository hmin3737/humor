import { neon } from '@neondatabase/serverless';

export type Humor = {
  id: number;
  author: string;
  front: string;
  back: string;
  overlap: string;
  likes: number;
  created_at: string;
};

// Vercel's Postgres (Neon) integration exposes the connection string as
// DATABASE_URL; older setups use POSTGRES_URL. Support both.
// Created lazily (not at module load) so `next build` doesn't require a DB.
type Sql = ReturnType<typeof neon>;
let _sql: Sql | null = null;

function getSql(): Sql {
  if (_sql) return _sql;
  const connectionString =
    process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? '';
  if (!connectionString) {
    throw new Error(
      'No database connection string. Set DATABASE_URL (or POSTGRES_URL).'
    );
  }
  _sql = neon(connectionString);
  return _sql;
}

let initialized = false;

// Lazily create the table on first access so no migration step is needed.
export async function ensureSchema() {
  if (initialized) return;
  await getSql()`
    CREATE TABLE IF NOT EXISTS humors (
      id SERIAL PRIMARY KEY,
      author TEXT NOT NULL,
      front TEXT NOT NULL,
      back TEXT NOT NULL,
      overlap TEXT NOT NULL,
      likes INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;
  initialized = true;
}

export async function listHumors(): Promise<Humor[]> {
  await ensureSchema();
  const rows = (await getSql()`
    SELECT id, author, front, back, overlap, likes, created_at
    FROM humors
    ORDER BY likes DESC, created_at DESC;
  `) as Humor[];
  return rows;
}

export async function createHumor(input: {
  author: string;
  front: string;
  back: string;
  overlap: string;
}): Promise<Humor> {
  await ensureSchema();
  const rows = (await getSql()`
    INSERT INTO humors (author, front, back, overlap)
    VALUES (${input.author}, ${input.front}, ${input.back}, ${input.overlap})
    RETURNING id, author, front, back, overlap, likes, created_at;
  `) as Humor[];
  return rows[0];
}

export async function likeHumor(id: number): Promise<number> {
  await ensureSchema();
  const rows = (await getSql()`
    UPDATE humors SET likes = likes + 1 WHERE id = ${id} RETURNING likes;
  `) as { likes: number }[];
  return rows[0]?.likes ?? 0;
}
