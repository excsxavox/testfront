import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import type { PilotoApiHealthResponse } from "@piloto/shared-types";
import { handlePersistenceSummary } from "./internal/persistence-summary-handler.js";

function sendJson(res: ServerResponse, statusCode: number, body: unknown): void {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function handleRequest(req: IncomingMessage, res: ServerResponse): void {
  if (handlePersistenceSummary(req, res)) {
    return;
  }

  if (req.url === "/health" && req.method === "GET") {
    const body: PilotoApiHealthResponse = { ok: true, service: "piloto-api" };
    sendJson(res, 200, body);
    return;
  }

  sendJson(res, 404, {
    error: "not_found",
    message: "Ruta no implementada",
  });
}

/**
 * Adaptador HTTP de entrada; los routers `/api/public/*` y `/api/reception/*` se montarán aquí.
 */
export function createHttpServer(): Server {
  return createServer(handleRequest);
}
