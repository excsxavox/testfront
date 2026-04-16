import { scryptSync } from "node:crypto";
import { eq } from "drizzle-orm";
import { createDbClient, resolveActiveSqliteFilePath, type DbClient } from "./db.js";
import { hotelSettings, reservations, rooms, roomTypes, users } from "./schema/index.js";

/** Usuario de recepción insertado por el seed del piloto (login futuro). */
export const SEED_RECEPTION_USERNAME = "reception";

/**
 * Contraseña en claro **solo** para entornos de demo local (documentada en README).
 * No usar en producción; el CLI del seed rechaza `NODE_ENV=production`.
 */
export const SEED_RECEPTION_PASSWORD = "piloto2026";

function hashPasswordScrypt(password: string): string {
  const salt = Buffer.from("piloto-seed-v1-salt", "utf8");
  const key = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

export type SeedPilotoDemoResult = {
  /** Ruta del fichero SQLite activo al ejecutar el seed. */
  databasePath: string;
  roomTypeIds: { single: number; double: number; suite: number };
  roomIds: { ind101: number; ind102: number; dbl201: number; dbl202: number; ste301: number };
  receptionUserId: number;
  reservationIds: { pending: number; confirmedA: number; confirmedB: number; cancelled: number };
};

/**
 * Reinicia datos mínimos del piloto en una transacción: borra filas en orden seguro por FK
 * y vuelve a insertar tipos, habitaciones, usuario recepción, ajustes TZ y reservas de ejemplo.
 */
export function seedPilotoDemoData(client: DbClient = createDbClient()): SeedPilotoDemoResult {
  const ts = nowIso();
  const databasePath = resolveActiveSqliteFilePath();

  const inner = client.transaction((tx) => {
    tx.delete(reservations).run();
    tx.delete(rooms).run();
    tx.delete(roomTypes).run();
    tx.delete(users).run();
    tx.delete(hotelSettings).run();

    tx.insert(hotelSettings).values({ timezoneIana: "Europe/Madrid" }).run();

    tx.insert(roomTypes)
      .values([
        {
          code: "single",
          displayName: "Individual",
          orientedPriceCents: 7500,
          createdAt: ts,
        },
        {
          code: "double",
          displayName: "Doble",
          orientedPriceCents: 11000,
          createdAt: ts,
        },
        {
          code: "suite",
          displayName: "Suite",
          orientedPriceCents: 18500,
          createdAt: ts,
        },
      ])
      .run();

    const singleRow = tx.select().from(roomTypes).where(eq(roomTypes.code, "single")).get();
    const doubleRow = tx.select().from(roomTypes).where(eq(roomTypes.code, "double")).get();
    const suiteRow = tx.select().from(roomTypes).where(eq(roomTypes.code, "suite")).get();
    if (!singleRow || !doubleRow || !suiteRow) {
      throw new Error("seed: missing room_types after insert");
    }

    tx.insert(rooms)
      .values([
        { roomTypeId: singleRow.id, unitCode: "IND-101", createdAt: ts },
        { roomTypeId: singleRow.id, unitCode: "IND-102", createdAt: ts },
        { roomTypeId: doubleRow.id, unitCode: "DBL-201", createdAt: ts },
        { roomTypeId: doubleRow.id, unitCode: "DBL-202", createdAt: ts },
        { roomTypeId: suiteRow.id, unitCode: "STE-301", createdAt: ts },
      ])
      .run();

    const ind101 = tx.select().from(rooms).where(eq(rooms.unitCode, "IND-101")).get();
    const ind102 = tx.select().from(rooms).where(eq(rooms.unitCode, "IND-102")).get();
    const dbl201 = tx.select().from(rooms).where(eq(rooms.unitCode, "DBL-201")).get();
    const dbl202 = tx.select().from(rooms).where(eq(rooms.unitCode, "DBL-202")).get();
    const ste301 = tx.select().from(rooms).where(eq(rooms.unitCode, "STE-301")).get();
    if (!ind101 || !ind102 || !dbl201 || !dbl202 || !ste301) {
      throw new Error("seed: missing rooms after insert");
    }

    tx.insert(users)
      .values({
        username: SEED_RECEPTION_USERNAME,
        passwordHash: hashPasswordScrypt(SEED_RECEPTION_PASSWORD),
        role: "reception",
        createdAt: ts,
      })
      .run();

    const receptionUser = tx.select().from(users).where(eq(users.username, SEED_RECEPTION_USERNAME)).get();
    if (!receptionUser) {
      throw new Error("seed: missing reception user after insert");
    }

    tx.insert(reservations)
      .values([
        {
          roomTypeId: doubleRow.id,
          roomId: null,
          status: "pending",
          checkInDate: "2026-09-01",
          checkOutDate: "2026-09-04",
          guestName: "María Pérez",
          guestEmail: "maria.perez@example.com",
          guestPhone: "+34600111222",
          notes: "Llegada tarde, seed demo.",
          cancelReason: null,
          createdAt: ts,
          updatedAt: ts,
        },
        {
          roomTypeId: singleRow.id,
          roomId: ind101.id,
          status: "confirmed",
          checkInDate: "2026-07-01",
          checkOutDate: "2026-07-05",
          guestName: "Ana Ruiz",
          guestEmail: "ana.ruiz@example.com",
          guestPhone: "+34600333444",
          notes: null,
          cancelReason: null,
          createdAt: ts,
          updatedAt: ts,
        },
        {
          roomTypeId: singleRow.id,
          roomId: ind102.id,
          status: "confirmed",
          checkInDate: "2026-07-10",
          checkOutDate: "2026-07-12",
          guestName: "Luis Gómez",
          guestEmail: "luis.gomez@example.com",
          guestPhone: "+34600555666",
          notes: null,
          cancelReason: null,
          createdAt: ts,
          updatedAt: ts,
        },
        {
          roomTypeId: suiteRow.id,
          roomId: null,
          status: "cancelled",
          checkInDate: "2026-06-15",
          checkOutDate: "2026-06-17",
          guestName: "Carla Vega",
          guestEmail: "carla.vega@example.com",
          guestPhone: "+34600777888",
          notes: "Suite vista jardín",
          cancelReason: "Cliente canceló con antelación (seed).",
          createdAt: ts,
          updatedAt: ts,
        },
      ])
      .run();

    const pending = tx.select().from(reservations).where(eq(reservations.guestEmail, "maria.perez@example.com")).get();
    const confirmedA = tx.select().from(reservations).where(eq(reservations.guestEmail, "ana.ruiz@example.com")).get();
    const confirmedB = tx.select().from(reservations).where(eq(reservations.guestEmail, "luis.gomez@example.com")).get();
    const cancelled = tx.select().from(reservations).where(eq(reservations.guestEmail, "carla.vega@example.com")).get();
    if (!pending || !confirmedA || !confirmedB || !cancelled) {
      throw new Error("seed: missing reservations after insert");
    }

    return {
      roomTypeIds: { single: singleRow.id, double: doubleRow.id, suite: suiteRow.id },
      roomIds: {
        ind101: ind101.id,
        ind102: ind102.id,
        dbl201: dbl201.id,
        dbl202: dbl202.id,
        ste301: ste301.id,
      },
      receptionUserId: receptionUser.id,
      reservationIds: {
        pending: pending.id,
        confirmedA: confirmedA.id,
        confirmedB: confirmedB.id,
        cancelled: cancelled.id,
      },
    };
  });

  return { ...inner, databasePath };
}
