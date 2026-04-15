import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { join } from "node:path";
import { createDbClient, getApiPackageRoot } from "./db.js";

const client = createDbClient();
const migrationsFolder = join(getApiPackageRoot(), "drizzle");
migrate(client, { migrationsFolder });
console.log("Migrations applied.");
