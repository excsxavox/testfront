import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Credenciales de staff de recepción (hash de contraseña; nunca en claro).
 */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username", { length: 64 }).notNull().unique(),
  passwordHash: text("password_hash", { length: 256 }).notNull(),
  role: text("role", { length: 32 }).notNull().default("reception"),
  createdAt: text("created_at").notNull(),
});

export type UserRow = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
