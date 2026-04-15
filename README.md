# Piloto reservas y recepción

Monorepo OpenSpec: `apps/web` (Vite + React), `apps/api` (Node + Drizzle + SQLite), especificaciones en `openspec/`.

## Datos de ejemplo (SQLite)

1. Instalar dependencias: `npm install` (en la raíz del repositorio).
2. Aplicar migraciones: `npm run db:migrate -w @piloto/api`
3. Cargar el seed de demostración: `npm run db:seed -w @piloto/api`

El comando `db:seed` aplica migraciones y luego **borra y vuelve a insertar** filas en `reservations`, `rooms`, `room_types`, `users` y `hotel_settings` de la base activa (`DATABASE_URL` o por defecto `apps/api/data/piloto.sqlite`). No se ejecuta si `NODE_ENV=production`.

### Credenciales de recepción (solo demo)

- Usuario: `reception`
- Contraseña: `piloto2026`

### Contenido mínimo sembrado

- Tipos: individual (`single`), doble (`double`), suite (`suite`).
- Habitaciones: `IND-101`, `IND-102`, `DBL-201`, `DBL-202`, `STE-301`.
- Zona horaria del hotel: `Europe/Madrid`.
- Reservas: una pendiente (doble, sin habitación asignada), dos confirmadas en `IND-101` e `IND-102` (sin solape en la misma unidad), una cancelada en suite con motivo.

Para comprobar recuentos con el API en marcha: `GET /api/internal/persistence-summary` o la vista **Reserva pública** en la SPA (panel de persistencia). En **Inicio** hay un resumen visible del seed.
