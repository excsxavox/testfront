/** Identificadores de servicio para healthchecks y telemetría básica. */
export type PilotoServiceId = "piloto-api" | "piloto-web";

/** Respuesta de `GET /health` del API piloto (scaffold). */
export type PilotoApiHealthResponse = {
  ok: boolean;
  service: PilotoServiceId;
};
