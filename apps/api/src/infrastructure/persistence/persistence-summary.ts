import { count } from "drizzle-orm";
import type { DbClient } from "./db.js";
import { HOTEL_DEFAULT_TIMEZONE_IANA } from "./hotel-timezone.js";
import { hotelSettings, reservations, rooms, roomTypes, users } from "./schema/index.js";

export type PilotoPersistenceSummary = {
  engine: "sqlite";
  databasePath: string;
  hotelTimezoneIana: string;
  counts: {
    roomTypes: number;
    rooms: number;
    reservations: number;
    receptionUsers: number;
  };
};

export function buildPersistenceSummary(db: DbClient, databasePath: string): PilotoPersistenceSummary {
  const roomTypesCount = db.select({ c: count() }).from(roomTypes).get()?.c ?? 0;
  const roomsCount = db.select({ c: count() }).from(rooms).get()?.c ?? 0;
  const reservationsCount = db.select({ c: count() }).from(reservations).get()?.c ?? 0;
  const usersCount = db.select({ c: count() }).from(users).get()?.c ?? 0;

  const settings = db.select().from(hotelSettings).limit(1).get();
  const hotelTimezoneIana = settings?.timezoneIana ?? HOTEL_DEFAULT_TIMEZONE_IANA;

  return {
    engine: "sqlite",
    databasePath,
    hotelTimezoneIana,
    counts: {
      roomTypes: Number(roomTypesCount),
      rooms: Number(roomsCount),
      reservations: Number(reservationsCount),
      receptionUsers: Number(usersCount),
    },
  };
}
