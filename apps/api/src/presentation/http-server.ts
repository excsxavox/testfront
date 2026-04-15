import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

function handleRequest(req: IncomingMessage, res: ServerResponse): void {
  if (req.url === "/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, service: "piloto-api" }));
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "not_found", message: "Ruta no implementada" }));
}

/**
 * Adaptador HTTP de entrada; los routers `/api/public/*` y `/api/reception/*` se montarán aquí.
 */
export function createHttpServer() {
  return createServer(handleRequest);
}
