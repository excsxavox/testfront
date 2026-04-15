import { resolveActiveSqliteFilePath } from "./db.js";
import { runMigrations } from "./run-migrations.js";
import { SEED_RECEPTION_PASSWORD, SEED_RECEPTION_USERNAME, seedPilotoDemoData } from "./seed.js";

if (process.env["NODE_ENV"] === "production") {
  console.error("piloto-api: db:seed refused (NODE_ENV=production).");
  process.exit(1);
}

runMigrations();
const result = seedPilotoDemoData();
console.log(
  `piloto-api: seed aplicado en ${result.databasePath} (activo: ${resolveActiveSqliteFilePath()}). Usuario recepción: ${SEED_RECEPTION_USERNAME} / ${SEED_RECEPTION_PASSWORD} (solo demo).`,
);
