# Proposal: Sitio web público hotelero (MVP institucional + reservas)

## Intent

Registrar en OpenSpec la intención del **requerimiento global** (sitio público con información del establecimiento y canal web de reservas con precio y condiciones claras), **sin sustituir** los contratos ya acordados en `openspec/specs/`. Este change sirve de **puente analítico** para consultoría y para agentes Backend/Frontend que implementen el producto encima de las specs vigentes.

## Scope

**In scope (alineación con specs actuales):**

- **Fuente de disponibilidad y precios:** en este repositorio el contrato operativo es la **API propia** del monorepo (`apps/api`), persistencia SQLite en piloto; no se asume PMS ni motor externo salvo change futuro que lo introduzca.
- **Flujo reserva pública:** cubierto por `openspec/specs/public-booking/spec.md` y detalle operativo en `inventory` / `reception`; exclusiones de pago en línea y multi-propiedad permanecen en `openspec/specs/core/spec.md`.
- **Contenido institucional y UX (home, habitaciones, políticas, responsive, accesibilidad razonable):** hoy **no** hay dominio `content`/`marketing` en `openspec/specs/`; las implementaciones en `apps/web` deben evolucionar con **delta** en un change posterior o ampliación de spec cuando se fije el alcance de CMS/admin.

**Out of scope (explícito en requerimiento global, coherente con core):**

- PMS completo, housekeeping, app nativa, pasarela de pago real en MVP piloto (salvo decisión explícita que archive un change de alcance).

## Approach

1. Mantener `openspec/specs/` como fuente de verdad de comportamiento **comportamental** (RFC 2119, escenarios).
2. Incorporar necesidades nuevas del sitio institucional mediante **nuevo change** con `specs/<dominio>/spec.md` en delta (ADDED/MODIFIED) cuando se acuerde redacción, no duplicando aquí texto de UI para huéspedes finales.
3. Registrar supuestos abiertos del cliente en `design.md` o en checklist de tareas de un change específico de “contenido/admin” cuando exista.

## Supuestos a decidir (del requerimiento global)

- Pago online (Stripe u otro), depósito, o solo reserva sin cobro / garantía en hotel.
- Política de cancelación fija vs. por tarifa.
- Si la API propia del piloto es suficiente para producción o hace falta contrato con backend/PMS externo (nuevo dominio o integración documentada en `design.md`).
