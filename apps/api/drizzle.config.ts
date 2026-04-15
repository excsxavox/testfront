import { defineConfig } from "drizzle-kit";
import { resolve } from "node:path";

/** Ruta estable para generar migraciones (relativa a `apps/api/`). */
const databaseUrl = process.env["DATABASE_URL"] ?? `file:${resolve("data", "piloto.sqlite")}`;

export default defineConfig({
  schema: "./src/infrastructure/persistence/schema/index.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: databaseUrl,
  },
});
