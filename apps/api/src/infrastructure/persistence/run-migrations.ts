import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { createDbClient, getApiPackageRoot, resolveSqliteFilePath } from "./db.js";

/**
 * Aplica migraciones versionadas en `apps/api/drizzle` sobre la base SQLite activa (`DATABASE_URL`).
 * Idempotente: seguro llamar en cada arranque del API.
 */
export function runMigrations(databaseUrl?: string): void {
  const url =
    databaseUrl ??
    process.env["DATABASE_URL"] ??
    `file:${join(getApiPackageRoot(), "data", "piloto.sqlite")}`;
  const dbPath = resolveSqliteFilePath(url);
  mkdirSync(dirname(dbPath), { recursive: true });

  const client = createDbClient(url);
  const migrationsFolder = join(getApiPackageRoot(), "drizzle");
  migrate(client, { migrationsFolder });
}
