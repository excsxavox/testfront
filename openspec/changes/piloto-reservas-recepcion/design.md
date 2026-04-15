# Design: Piloto reservas y recepción

## Technical approach

El repositorio actual es un contenedor mínimo (`readme.txt`). La implementación concreta (framework web, API, persistencia) la fijarán los agentes Backend/Frontend sobre la base de los `spec.md` en `openspec/specs/`.

Este documento fija la **estructura de carpetas (Clean Architecture)** y los **contratos externos** para que el agente de implementación no reinterprete límites ni convenciones.

## Architecture decisions

### Decision: Modelo de datos mínimo

- Entidades sugeridas: **RoomType** (cupos fijos), **Reservation** (fechas, tipo, estado, datos de contacto, notas, motivo cancelación si aplica), **User** o equivalente para recepción.
- Asignación: al confirmar, asociar una unidad lógica o slot por tipo de forma que no existan dos confirmadas solapadas en la misma unidad.
- **Implementación (piloto):** SQLite vía **Drizzle ORM** en `apps/api/src/infrastructure/persistence/schema/`; migraciones versionadas en `apps/api/drizzle/`; fichero por defecto `apps/api/data/piloto.sqlite` (ignorado en git). Tablas: `room_types`, `rooms`, `reservations`, `users`, `hotel_settings` (columna `timezone_iana`, por defecto `Europe/Madrid` en esquema y constante `HOTEL_DEFAULT_TIMEZONE_IANA` en `apps/api/src/infrastructure/persistence/hotel-timezone.ts`). Fechas de estancia en `reservations.check_in_date` / `check_out_date` como texto `YYYY-MM-DD` (interpretación con TZ del hotel en dominio/aplicación). Scripts: `npm run db:generate` / `npm run db:migrate` en el workspace `@piloto/api`.

### Decision: Zona horaria

- Almacenar fechas en UTC o fecha-local explícita con `timezone` configurable a nivel establecimiento (una fila de configuración o env).
- **Implementación (piloto):** validación de intervalo y detección de solapes entre estancias persistidas como `YYYY-MM-DD` centralizadas en `apps/api/src/domain/shared/hotel-calendar.ts`, usando siempre el mismo `timezone_iana` que `hotel_settings` (comprobación de IANA vía `Intl`; comparaciones de fechas en calendario civil del hotel, no instantes del cliente).

### Decision: Autenticación recepción

- Mecanismo de login acorde al stack elegido (sesión o JWT); fuera de alcance SSO avanzado en el piloto.

### Decision: Inventario — unidades físicas y «primera libre» (autoritativa para implementación)

- **Elegido:** habitaciones como **unidades discretas** (`Room`) con `room_type`; al **confirmar** una reserva pendiente, el dominio asigna la **primera habitación libre** de ese tipo en el rango `[check_in, check_out)` sin solapar otras **confirmadas** en la misma `Room`.
- **Descartado — solo cupo por tipo (sin `Room`):** cumple el anti-solape a nivel de «plazas» pero **no** materializa «la misma habitación» del spec de inventario ni el criterio de hecho del README («la habitación queda ocupada») de forma observable por unidad; obliga a narrar «slots» abstractos en documentación y QA.
- **Descartado — asignar habitación ya en solicitud pública:** mezcla política de inventario con un actor no autenticado y complica revocación si recepción rechaza; el piloto mantiene **asignación solo en confirmación** (coherente con recepción como gate).

### Decision: API pública vs recepción

- **REST JSON** sobre HTTP: superficie simple, alineada a brownfield y a contratos verificables (OpenAPI opcional en `apps/api/openapi.yaml` cuando exista).
- Rutas públicas **sin** credenciales; rutas de recepción bajo prefijo común (p. ej. `/api/reception/...`) con **autenticación obligatoria**.

## Clean Architecture — árbol de carpetas propuesto (monorepo)

Convención: **`apps/`** entregables ejecutables, **`packages/`** código compartido mínimo (opcional en el piloto). OpenSpec **no se mueve**: permanece en `openspec/` como contrato SDD.

```text
.
├── openspec/                          # Sin cambiar convención OpenSpec (specs canónicos + changes/)
├── apps/
│   ├── api/                           # Backend (único servicio HTTP del piloto)
│   │   ├── src/
│   │   │   ├── main.ts | app.py      # Punto de entrada HTTP (adaptador)
│   │   │   ├── presentation/        # Capa de entrega: routers/controllers, DTOs request/response
│   │   │   │   ├── public/          # Handlers REST públicos (booking, availability)
│   │   │   │   └── reception/       # Handlers REST recepción (auth middleware aquí o en main)
│   │   │   ├── application/         # Casos de uso: orquestan dominio + transacciones
│   │   │   │   ├── public/
│   │   │   │   └── reception/
│   │   │   ├── domain/              # Entidades, reglas puras, value objects (fechas en TZ hotel)
│   │   │   │   ├── booking/
│   │   │   │   ├── inventory/
│   │   │   │   └── shared/          # Result, errores de dominio
│   │   │   └── infrastructure/      # Implementaciones: DB, reloj, config, hashing passwords
│   │   │       ├── persistence/     # Repositorios concretos, migraciones ORM/SQL
│   │   │       └── config/          # Lectura TZ hotel, precios orientativos por tipo
│   │   ├── tests/                   # Contratos + dominio; tests de integración API opcionales
│   │   └── openapi.yaml             # Opcional: contrato REST generado o mantenido a mano
│   └── web/                           # Frontend (SPA o SSR según stack)
│       ├── src/
│       │   ├── app/                 # Rutas/layout raíz
│       │   ├── features/
│       │   │   ├── public-booking/  # Consulta disponibilidad + formulario solicitud
│       │   │   └── reception/       # Login, listados, detalle, confirmar/cancelar
│       │   ├── entities/            # Tipos/API clients delgados (mapeo DTO)
│       │   ├── shared/              # UI kit mínimo, util validación duplicada solo si imprescindible
│       │   └── processes/           # Flujos E2E en UI (opcional)
│       └── public/
├── packages/
│   └── shared-types/                # Opcional: tipos TS compartidos api ↔ web
├── scripts/                         # Seeds, smoke local (opcional)
├── README.md                        # Flujo E2E + datos ejemplo (requisito core spec)
└── docker-compose.yml               # Opcional si el stack lo usa
```

**Rol de cada capa (backend):**

| Carpeta | Responsabilidad | Dependencias |
|--------|-----------------|--------------|
| `presentation/` | HTTP, status codes, validación de forma de entrada, auth boundary | → `application/` |
| `application/` | Casos de uso, transacciones, políticas de orquestación | → `domain/`; → `infrastructure/` vía interfaces definidas en dominio o puertos |
| `domain/` | Reglas: fechas, solapes, transiciones de estado, asignación primera libre | Ninguna de frameworks |
| `infrastructure/` | Detalle técnico persistente | → `domain/` (implementa puertos) |

**Rol de cada zona (frontend):**

| Carpeta | Responsabilidad |
|--------|-----------------|
| `features/public-booking/` | UI alineada a `openspec/specs/public-booking/` |
| `features/reception/` | UI alineada a `openspec/specs/reception/` |
| `entities/` | Cliente API / tipos; **no** lógica de negocio duplicada salvo validación UX inmediata |

**Convención para ficheros nuevos:** mismo bounded context que la feature (p. ej. nuevo endpoint recepción → `presentation/reception/` + caso de uso en `application/reception/`). No añadir lógica de negocio en `presentation/`.

## Bounded contexts (alineados a OpenSpec)

| Contexto | Spec | Notas |
|----------|------|--------|
| Núcleo piloto | `openspec/specs/core/` | TZ hotel, validación contacto, exclusiones, README |
| Reserva pública | `openspec/specs/public-booking/` | Sin auth; solo lectura cupos + crear pendiente |
| Recepción | `openspec/specs/reception/` | Auth; mutaciones estado + lectura listados/detalle |
| Inventario | `openspec/specs/inventory/` | Cupos fijos; anti-solape confirmadas; asignación al confirmar |

Los casos de uso pueden vivir en `application/public` y `application/reception` reflejando **actores**, mientras `domain/inventory` concentra la política de ocupación compartida.

## Contrato REST (propuesta verificable)

Estilo **REST + JSON**. Los cuerpos son ilustrativos; el implementador puede ajustar nombres de campos si documenta en OpenAPI y mantiene comportamiento del spec.

**Público (sin autenticación)**

| Método | Ruta | Comportamiento observable |
|--------|------|---------------------------|
| `GET` | `/api/public/availability?check_in=&check_out=&room_type=` | Disponibilidad orientativa + precio orientativo; error si salida ≤ entrada |
| `POST` | `/api/public/reservations` | Crea reserva **pendiente**; rechazo sin persistir si email/teléfono/fechas inválidos |

**Recepción (autenticado)**

| Método | Ruta | Comportamiento observable |
|--------|------|---------------------------|
| `POST` | `/api/reception/auth/login` | Emite sesión o token (según stack) |
| `GET` | `/api/reception/reservations?status=pending|confirmed|cancelled` | Listados por estado |
| `GET` | `/api/reception/reservations/:id` | Detalle |
| `POST` | `/api/reception/reservations/:id/confirm` | Pendiente → confirmada + asignación habitación; error si conflicto inventario |
| `POST` | `/api/reception/reservations/:id/cancel` | Cuerpo con `reason` breve; estado cancelada |

**Alternativa descartada — GraphQL:** más flexibilidad de consulta no requerida por el piloto; mayor superficie de seguridad y contratos para un solo cliente web.

**Alternativa descartada — acciones RPC tipo `/confirmReservation` sin recursos:** válida pero menos alineada a documentación REST estándar para el mismo número de endpoints en el piloto.

## Límites de confianza y datos sensibles

- **Internet → `presentation/public`:** solo operaciones idempotentes de lectura de cupos y creación de **solicitudes**; sin acceso a listados completos ni PII agregado de otros huéspedes.
- **Recepción → `presentation/reception`:** requiere identidad verificada; respuestas de listado/detalle incluyen **email/teléfono** de huéspedes: transporte **HTTPS** en despliegue; logs **sin** duplicar teléfono/email en claro si se puede evitar.
- **Dominio:** validación de fechas y solapes en **zona horaria del hotel**; tests de dominio fijados a reloj/TZ inyectados (`infrastructure` provee implementación).
- **Secretos:** credenciales de recepción y JWT/session secret solo en config/env; nunca en repo.

## Compatibilidad y migración

- **Sistemas existentes:** el repo no expone otro producto; la primera implementación **no** requiere migración desde código previo. Si en el futuro se añade multi-propiedad, los casos de uso deberían introducir `hotel_id` en dominio y DB **sin** romper OpenSpec actual hasta que se publique un delta explícito.
- **OpenSpec:** cualquier cambio de comportamiento observable (p. ej. política de cancelación) entra como delta bajo `openspec/changes/<id>/specs/...` antes de ampliar código.

## Data flow (resumen)

```text
Visitante → consulta cupos/precio → POST solicitud (pendiente)
Recepción → lista pendientes → confirmar → inventario actualizado (ocupado)
```

## Diagrama (Mermaid)

```mermaid
flowchart TB
  subgraph PublicInternet[Visitante]
    WEB_P[apps/web public-booking]
  end
  subgraph Staff[Recepción]
    WEB_R[apps/web reception]
  end
  subgraph API[apps/api]
    PRES_P[presentation/public]
    PRES_R[presentation/reception]
    APP[application]
    DOM[domain]
    INF[infrastructure]
    PRES_P --> APP
    PRES_R --> APP
    APP --> DOM
    APP --> INF
    DOM --- INF
  end
  WEB_P -->|HTTPS REST| PRES_P
  WEB_R -->|HTTPS REST + auth| PRES_R
  INF -->[(DB)]
```

## File changes (previsto, no vinculante)

A definir al crear la aplicación: API de disponibilidad y reservas, UI pública, UI recepción, migraciones, README.

## Entregables técnicos encadenables (para numerar en `tasks.md`)

1. Monorepo `apps/api` + `apps/web` según árbol; entrada HTTP y build mínimos.
2. Persistencia: `RoomType`, `Room`, `Reservation`, `User` (recepción), configuración TZ; migraciones.
3. Dominio: intervalos `[check_in, check_out)`, solape solo para **confirmed**, asignación primera libre al confirmar.
4. REST público: availability + create pending.
5. Auth recepción + REST recepción: list, detail, confirm, cancel con `reason`.
6. Frontend features alineadas a contratos; manejo de errores de validación y conflicto inventario.
7. Seeds + README E2E (requisito `core`).
