import { config as loadEnv } from "dotenv";
import postgres from "postgres";
import { resolve } from "node:path";

export default async function globalSetup() {
  loadEnv({ path: resolve(__dirname, "../.env.local") });

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is required for e2e tests. Copy .env.example to .env.local and set your Supabase connection string.",
    );
  }

  const sql = postgres(databaseUrl, { prepare: false });

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS artifacts (
        id serial PRIMARY KEY,
        uniquecode varchar(64) NOT NULL UNIQUE,
        html text NOT NULL,
        created_at timestamp DEFAULT now() NOT NULL
      )
    `;
  } finally {
    await sql.end();
  }
}
