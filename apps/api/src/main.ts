import { createServer } from "node:http";

const PORT = Number(process.env["PORT"] ?? 3000);

/**
 * Scaffold HTTP mínimo del piloto.
 * Los contratos REST (/api/public/*, /api/reception/*) se implementarán según OpenSpec y gap-analysis.
 */
const server = createServer((req, res) => {
  if (req.url === "/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, service: "piloto-api" }));
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "not_found", message: "Ruta no implementada" }));
});

server.listen(PORT, () => {
  console.log(`piloto-api listening on http://127.0.0.1:${PORT}`);
});
