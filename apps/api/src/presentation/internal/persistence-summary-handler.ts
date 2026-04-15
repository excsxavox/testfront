import type { IncomingMessage, ServerResponse } from "node:http";
import type { PilotoApiPersistenceSummaryResponse } from "@piloto/shared-types";
import { buildPersistenceSummary } from "../../infrastructure/persistence/persistence-summary.js";
import { db, resolveActiveSqliteFilePath } from "../../infrastructure/persistence/db.js";

export function handlePersistenceSummary(req: IncomingMessage, res: ServerResponse): boolean {
  if (req.url !== "/api/internal/persistence-summary" || req.method !== "GET") {
    return false;
  }

  try {
    const dbPath = resolveActiveSqliteFilePath();
    const summary = buildPersistenceSummary(db, dbPath);
    const body: PilotoApiPersistenceSummaryResponse = { ok: true, summary };
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(body));
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ ok: false, error: "persistence_summary_failed", message }));
  }

  return true;
}
