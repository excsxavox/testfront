import { createHttpServer } from "./presentation/http-server.js";

const PORT = Number(process.env["PORT"] ?? 3000);
const server = createHttpServer();

server.listen(PORT, () => {
  console.log(`piloto-api listening on http://127.0.0.1:${PORT}`);
});
