import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Catálogo de tipos de habitación (individual, doble, suite) con precio orientativo fijo por tipo (céntimos).
 */
export const roomTypes = sqliteTable(
  "room_types",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    code: text("code", { length: 32 }).notNull().unique(),
    displayName: text("display_name", { length: 128 }).notNull(),
    orientedPriceCents: integer("oriented_price_cents").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (t) => ({
    codeIdx: index("room_types_code_idx").on(t.code),
  }),
);

export type RoomTypeRow = typeof roomTypes.$inferSelect;
export type RoomTypeInsert = typeof roomTypes.$inferInsert;
