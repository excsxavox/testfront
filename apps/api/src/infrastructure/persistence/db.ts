import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as schema from "./schema/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Raíz del paquete `apps/api` (donde viven `drizzle/` y `data/` por defecto). */
export function getApiPackageRoot(): string {
  return resolve(__dirname, "../../..");
}

function defaultDatabaseUrl(): string {
  return `file:${resolve(getApiPackageRoot(), "data/piloto.sqlite")}`;
}

/**
 * Resuelve la ruta del fichero SQLite desde `DATABASE_URL`:
 * - `file:/absolute/path` → absoluto
 * - cualquier otro `file:…` relativo → relativo a la raíz del paquete `apps/api` (no al CWD), para scripts desde el monorepo
 */
export function resolveSqliteFilePath(databaseUrl: string): string {
  if (!databaseUrl.startsWith("file:")) {
    throw new Error(`DATABASE_URL must use file: protocol, got: ${databaseUrl}`);
  }
  const rest = databaseUrl.slice("file:".length);
  if (rest.startsWith("/")) {
    return rest;
  }
  return resolve(getApiPackageRoot(), rest);
}

export function createDbClient(databaseUrl = process.env["DATABASE_URL"] ?? defaultDatabaseUrl()) {
  const filePath = resolveSqliteFilePath(databaseUrl);
  mkdirSync(dirname(filePath), { recursive: true });
  const sqlite = new Database(filePath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  return drizzle(sqlite, { schema });
}

export type DbClient = ReturnType<typeof createDbClient>;

/** Cliente por defecto para scripts y futura inyección en la app HTTP. */
export const db = createDbClient();
