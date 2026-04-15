/** Identificadores de servicio para healthchecks y telemetría básica. */
export type PilotoServiceId = "piloto-api" | "piloto-web";

/** Respuesta de `GET /health` del API piloto (scaffold). */
export type PilotoApiHealthResponse = {
  ok: boolean;
  service: PilotoServiceId;
};

/** Resumen de persistencia devuelto por `GET /api/internal/persistence-summary`. */
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

export type PilotoApiPersistenceSummaryResponse =
  | { ok: true; summary: PilotoPersistenceSummary }
  | { ok: false; error: string; message: string };

export * from "./hotel-calendar.js";
