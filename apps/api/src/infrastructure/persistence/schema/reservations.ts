import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { roomTypes } from "./room-types.js";
import { rooms } from "./rooms.js";

export const reservationStatuses = ["pending", "confirmed", "cancelled"] as const;
export type ReservationStatus = (typeof reservationStatuses)[number];

/**
 * Fechas de estancia como calendario del hotel: TEXT `YYYY-MM-DD` interpretadas siempre con la TZ IANA en `hotel_settings`.
 * Intervalo semántico de ocupación asignada: [check_in_date, check_out_date) (la noche de salida no cuenta como ocupada).
 *
 * Reglas de intervalo y solape (incl. solo confirmadas como bloqueo de inventario) SHALL usar
 * `validateStayHalfOpenInterval` y `hotelStayHalfOpenIntervalsOverlap` en `domain/shared/hotel-calendar.ts`
 * con el mismo `hotel_settings.timezone_iana` que la fila de configuración del piloto.
 */
export const reservations = sqliteTable(
  "reservations",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    roomTypeId: integer("room_type_id")
      .notNull()
      .references(() => roomTypes.id, { onDelete: "restrict", onUpdate: "cascade" }),
    roomId: integer("room_id").references(() => rooms.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
    status: text("status", { length: 16 }).notNull().$type<ReservationStatus>(),
    checkInDate: text("check_in_date", { length: 10 }).notNull(),
    checkOutDate: text("check_out_date", { length: 10 }).notNull(),
    guestName: text("guest_name", { length: 200 }).notNull(),
    guestEmail: text("guest_email", { length: 254 }).notNull(),
    guestPhone: text("guest_phone", { length: 64 }).notNull(),
    notes: text("notes", { length: 2000 }),
    cancelReason: text("cancel_reason", { length: 500 }),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => ({
    statusIdx: index("reservations_status_idx").on(t.status),
    typeStatusIdx: index("reservations_room_type_status_idx").on(t.roomTypeId, t.status),
    roomIdx: index("reservations_room_id_idx").on(t.roomId),
    stayIdx: index("reservations_stay_idx").on(t.checkInDate, t.checkOutDate),
  }),
);

export type ReservationRow = typeof reservations.$inferSelect;
export type ReservationInsert = typeof reservations.$inferInsert;
