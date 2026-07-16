import pg from "pg";

const { Pool } = pg;

const pool = globalThis.robotCafeCmsPool || new Pool({ connectionString: process.env.DATABASE_URL });

if (process.env.NODE_ENV !== "production") {
  globalThis.robotCafeCmsPool = pool;
}

export async function ensureCmsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "cms_content" (
      "key" TEXT PRIMARY KEY,
      "content" JSONB NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await pool.query('ALTER TABLE "cms_content" ENABLE ROW LEVEL SECURITY;');
}

export async function getCmsContent(key) {
  await ensureCmsTable();
  const result = await pool.query('SELECT "content" FROM "cms_content" WHERE "key" = $1 LIMIT 1', [key]);
  return result.rows[0]?.content || null;
}

export async function saveCmsContent(key, content) {
  await ensureCmsTable();
  const result = await pool.query(
    `INSERT INTO "cms_content" ("key", "content")
     VALUES ($1, $2::jsonb)
     ON CONFLICT ("key")
     DO UPDATE SET "content" = EXCLUDED."content", "updatedAt" = CURRENT_TIMESTAMP
     RETURNING "content"`,
    [key, JSON.stringify(content)]
  );
  return result.rows[0].content;
}
