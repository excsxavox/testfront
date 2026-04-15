import { scryptSync } from "node:crypto";
import { sql } from "drizzle-orm";
import { createDbClient } from "./db.js";
import {
  hotelSettings,
  reservations,
  roomTypes,
  rooms,
  users,
} from "./schema/index.js";

const NOW_ISO = new Date().toISOString();

/** Contraseña de ejemplo para recepción tras `npm run db:seed` (solo entornos de prueba). */
export const SEED_RECEPTION_USERNAME = "reception";
export const SEED_RECEPTION_PASSWORD = "piloto2026";

function hashPasswordScrypt(password: string): string {
  const salt = Buffer.from("piloto-seed-v1-salt", "utf8"); // fijo: solo datos de demo
  const key = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

/**
 * Puebla `room_types`, `rooms`, `users`, `hotel_settings` y `reservations` de ejemplo.
 * Borra filas existentes en esas tablas (orden respetando FK). No ejecutar en producción.
 */
export async function seedPilotoDemoData(): Promise<void> {
  if (process.env["NODE_ENV"] === "production") {
    throw new Error("Refusing to run piloto DB seed when NODE_ENV=production");
  }

  const db = createDbClient();

  db.transaction((tx) => {
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
          createdAt: NOW_ISO,
        },
        {
          code: "double",
          displayName: "Doble",
          orientedPriceCents: 11000,
          createdAt: NOW_ISO,
        },
        {
          code: "suite",
          displayName: "Suite",
          orientedPriceCents: 18500,
          createdAt: NOW_ISO,
        },
      ])
      .run();

    const typeRows = tx.select().from(roomTypes).all();
    const byCode = (code: string) => {
      const row = typeRows.find((r) => r.code === code);
      if (!row) throw new Error(`Missing seeded room type: ${code}`);
      return row.id;
    };

    const singleId = byCode("single");
    const doubleId = byCode("double");
    const suiteId = byCode("suite");

    tx.insert(rooms)
      .values([
        { roomTypeId: singleId, unitCode: "IND-101", createdAt: NOW_ISO },
        { roomTypeId: singleId, unitCode: "IND-102", createdAt: NOW_ISO },
        { roomTypeId: doubleId, unitCode: "DBL-201", createdAt: NOW_ISO },
        { roomTypeId: doubleId, unitCode: "DBL-202", createdAt: NOW_ISO },
        { roomTypeId: suiteId, unitCode: "STE-301", createdAt: NOW_ISO },
      ])
      .run();

    tx.insert(users)
      .values({
        username: SEED_RECEPTION_USERNAME,
        passwordHash: hashPasswordScrypt(SEED_RECEPTION_PASSWORD),
        role: "reception",
        createdAt: NOW_ISO,
      })
      .run();

    const roomRows = tx.select().from(rooms).all();
    const roomByCode = (unit: string) => {
      const row = roomRows.find((r) => r.unitCode === unit);
      if (!row) throw new Error(`Missing seeded room: ${unit}`);
      return row.id;
    };

    tx.insert(reservations)
      .values([
        {
          roomTypeId: doubleId,
          roomId: null,
          status: "pending",
          checkInDate: "2026-09-01",
          checkOutDate: "2026-09-04",
          guestName: "María Pérez",
          guestEmail: "maria.perez@example.com",
          guestPhone: "+34600111222",
          notes: "Llegada tarde, seed demo.",
          cancelReason: null,
          createdAt: NOW_ISO,
          updatedAt: NOW_ISO,
        },
        {
          roomTypeId: singleId,
          roomId: roomByCode("IND-101"),
          status: "confirmed",
          checkInDate: "2026-07-01",
          checkOutDate: "2026-07-05",
          guestName: "Ana Ruiz",
          guestEmail: "ana.ruiz@example.com",
          guestPhone: "+34600333444",
          notes: null,
          cancelReason: null,
          createdAt: NOW_ISO,
          updatedAt: NOW_ISO,
        },
        {
          roomTypeId: singleId,
          roomId: roomByCode("IND-102"),
          status: "confirmed",
          checkInDate: "2026-07-10",
          checkOutDate: "2026-07-12",
          guestName: "Luis Gómez",
          guestEmail: "luis.gomez@example.com",
          guestPhone: "+34600555666",
          notes: null,
          cancelReason: null,
          createdAt: NOW_ISO,
          updatedAt: NOW_ISO,
        },
        {
          roomTypeId: suiteId,
          roomId: null,
          status: "cancelled",
          checkInDate: "2026-06-15",
          checkOutDate: "2026-06-17",
          guestName: "Carla Vega",
          guestEmail: "carla.vega@example.com",
          guestPhone: "+34600777888",
          notes: "Suite vista jardín",
          cancelReason: "Cliente canceló con antelación (seed).",
          createdAt: NOW_ISO,
          updatedAt: NOW_ISO,
        },
      ])
      .run();
  });

  const counts = {
    roomTypes: Number(db.select({ c: sql`count(*)` }).from(roomTypes).get()?.c ?? 0),
    rooms: Number(db.select({ c: sql`count(*)` }).from(rooms).get()?.c ?? 0),
    users: Number(db.select({ c: sql`count(*)` }).from(users).get()?.c ?? 0),
    reservations: Number(db.select({ c: sql`count(*)` }).from(reservations).get()?.c ?? 0),
  };

  console.log("Seed completed.", counts);
  console.log(
    `Recepción demo: usuario "${SEED_RECEPTION_USERNAME}" / contraseña "${SEED_RECEPTION_PASSWORD}" (solo pruebas).`,
  );
}
