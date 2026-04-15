import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { roomTypes } from "./room-types.js";

/**
 * Unidad física de inventario; el anti-solape de confirmadas se aplica por `room_id`.
 */
export const rooms = sqliteTable(
  "rooms",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    roomTypeId: integer("room_type_id")
      .notNull()
      .references(() => roomTypes.id, { onDelete: "restrict", onUpdate: "cascade" }),
    unitCode: text("unit_code", { length: 64 }).notNull().unique(),
    createdAt: text("created_at").notNull(),
  },
  (t) => ({
    typeIdx: index("rooms_room_type_id_idx").on(t.roomTypeId),
  }),
);

export type RoomRow = typeof rooms.$inferSelect;
export type RoomInsert = typeof rooms.$inferInsert;
