import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Configuración del único establecimiento piloto. `timezoneIana` es la fuente de verdad para interpretar `check_in_date` / `check_out_date`.
 * Valor por defecto documentado: `Europe/Madrid` (piloto en España).
 */
export const hotelSettings = sqliteTable("hotel_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  timezoneIana: text("timezone_iana", { length: 64 }).notNull().default("Europe/Madrid"),
});

export type HotelSettingsRow = typeof hotelSettings.$inferSelect;
export type HotelSettingsInsert = typeof hotelSettings.$inferInsert;
