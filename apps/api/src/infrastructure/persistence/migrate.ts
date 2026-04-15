import { resolveActiveSqliteFilePath } from "./db.js";
import { runMigrations } from "./run-migrations.js";

runMigrations();
console.log(`piloto-api: migraciones aplicadas en ${resolveActiveSqliteFilePath()}`);
