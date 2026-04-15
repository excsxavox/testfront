# Análisis de huecos — requisitos vs escenarios (tarea 2)

Contraste entre el requerimiento global del piloto, los specs canónicos (`openspec/specs/**`), el delta de `core` y la propuesta REST de `design.md`. Objetivo: fijar campos obligatorios, estados, errores HTTP/códigos y decisiones pendientes **antes** de congelar contratos REST o UI.

## Leyenda

- **Cubierto**: el spec o el delta lo afirma con escenario suficiente para contrato.
- **Parcial**: comportamiento descrito pero faltan detalles para API/UI.
- **Hueco**: no hay escenario o requisito explícito; debe decidirse en implementación + delta/OpenAPI.

## Núcleo (`openspec/specs/core/spec.md` + delta `changes/.../specs/core/spec.md`)

| Requisito / escenario | Cobertura | Huecos y notas para contrato REST/UI |
|------------------------|-----------|----------------------------------------|
| Alcance y exclusiones | Cubierto (mensaje de producto, no API) | N/A para REST. |
| TZ hotel configurable + default país piloto | Parcial | **Default IANA concreto** (p. ej. `Europe/Madrid`) no está en spec; README/design deben fijarlo. API pública: ¿`check_in`/`check_out` como fecha calendario en TZ hotel (string `YYYY-MM-DD`) vs instante? **Formato y semántica** para query/body. |
| Validación email/teléfono | Parcial | Spec: «validación básica» sin regex ni E.164. **Definir regla mínima** (longitud, dígitos, `+`) y mismo criterio recepción si reutiliza DTOs. Error: **400** con cuerpo JSON estable (`code`, `message`, `fieldErrors`). |
| README flujo E2E | Cubierto (proceso, no API) | — |
| Delta: E2E solicitud → confirmar → ocupación visible | Parcial | «Consulta de disponibilidad **o** de ocupación»: no existe endpoint de «ocupación» en `design.md`; **o** se documenta que availability refleja cupo, **o** se añade recurso explícito en spec/delta. |

## Reserva pública (`openspec/specs/public-booking/spec.md`)

| Requisito / escenario | Cobertura | Huecos y notas para contrato REST/UI |
|------------------------|-----------|----------------------------------------|
| Consulta disponibilidad + precio orientativo | Parcial | Tipos: `individual` \| `doble` \| `suite` — **nombres canónicos en inglés o español** para query (`room_type`) y JSON. **Precio**: moneda, entero vs decimal, «por noche» vs «estancia total» — **pendiente de negocio** (ítem 23 del bloc). Sin esto, el front no puede etiquetar el precio. |
| Salida ≤ entrada | Cubierto (error validación) | Falta: **código HTTP 400** y forma JSON; no filtrar stack. |
| Solicitud: nombre, email, teléfono, notas opcionales, estado pendiente | Parcial | **Nombre**: obligatorio implícito; sin límite de longitud en spec. **Notas**: opcional; ¿`null` vs omitido vs `""`? **Respuesta POST**: ¿devuelve `id` y estado `pending`? ¿incluye fechas y tipo enviados? **Idempotencia** no requerida; **201** recomendado. |
| Recepción ve la solicitud en listado | Cubierto en conjunto con reception | Depende de filtro `status=pending` y de que listado incluya campos mínimos. |

## Recepción (`openspec/specs/reception/spec.md`)

| Requisito / escenario | Cobertura | Huecos y notas para contrato REST/UI |
|------------------------|-----------|----------------------------------------|
| Listados por estado | Parcial | Estados en spec: pendiente, confirmada, cancelada — **valores enum API** (`pending`, `confirmed`, `cancelled` sugeridos en design) deben alinearse con textos UI. **Paginación**, orden por defecto (fecha entrada, creado) — no especificado. |
| Sin auth → denegar | Cubierto | **401 vs 403**: usar **401** si no hay credencial; **403** si credencial inválida o sin rol — documentar. |
| Confirmar / cancelar con motivo breve | Parcial | Spec: motivo en cancelación «cuando aplique la política»; **confirmación con motivo** no es obligatorio en spec (solo cancelación explícita en design con `reason`). **Hueco**: ¿confirmar **sin** cuerpo o con `note` opcional? **Cancelación**: ¿`reason` obligatorio y longitud máx/mín? |
| Detalle: fechas, tipo, contacto, notas, estado, historial mínimo | Parcial | **Historial mínimo**: qué eventos (created, confirmed, cancelled), timestamps, actor — no definido. API: array `events[]` vs campos planos (`confirmed_at`, `cancelled_at`). **Room asignada** tras confirmar: inventory/design implican `room_id` o código; **no** está en spec recepción pero es necesario para UI «habitación ocupada». |
| Transiciones no válidas | Hueco | No hay escenarios para: confirmar no-pendiente, cancelar ya cancelada, doble confirmación. API debe definir **409 Conflict** o **422** con código interno estable. |

## Inventario (`openspec/specs/inventory/spec.md`)

| Requisito / escenario | Cobertura | Huecos y notas para contrato REST/UI |
|------------------------|-----------|----------------------------------------|
| Capacidad fija por tipo | Parcial | Números por tipo en seed; **no** expone spec si el público ve «N plazas» o solo booleano disponible. |
| Sin disponibilidad (consulta o solicitud) | Parcial | **Solicitud con cupo 0**: spec dice indicar falta en consulta o solicitud; falta escenario explícito de **POST rechazado** por inventario. Recomendación: **409** o **422** con mensaje claro; las **pendientes** no bloquean (design), así que POST público podría aceptar aunque esté «lleno» — **contradicción potencial** con «WHEN solicita» en inventory. **Aclarar**: POST público SHALL rechazar si no hay capacidad orientativa **para confirmadas futuras** o SHALL permitir lista de espera implícita. |
| Anti-solape confirmadas; confirmación con conflicto | Cubierto | Código error: **409** coherente con «conflicto inventario». Cuerpo: mensaje operativo sin stack. |
| Asignación primera libre | En design, no en spec inventory | Spec permite «por tipo» alternativa; design elige **Room**. Contrato detalle/confirm: incluir **identificador de habitación** asignada. |

## Contrato REST propuesto (`design.md`) vs specs

| Área | Hueco |
|------|--------|
| `GET .../availability` | Query obligatorios y opciones de error 400 documentadas en OpenAPI; respuesta: campos `available`, `price`, `currency`, `room_type` (confirmar nombres). |
| `POST .../reservations` | Body y **201** response shape; errores de validación vs conflicto inventario (si aplica). |
| `POST .../auth/login` | Body (`email`/`password` vs `username`), forma de token (header `Authorization: Bearer` vs cookie); **no** en spec recepción. |
| `GET .../reservations` | Filtro `status`; respuesta lista: campos mínimos para tabla (id, fechas, tipo, huésped, estado). |
| `GET .../reservations/:id` | Incluir `assigned_room` cuando `confirmed`; motivo cancelación cuando `cancelled`. |
| `POST .../confirm` | Sin cuerpo o con tipo explícito; si request incluye `room_type` debe coincidir con reserva — no especificado. |
| `POST .../cancel` | `reason` string; validación longitud. |

## Resumen ejecutivo para implementación

1. **Fijar semántica de fechas** (date-only en TZ hotel) y default TZ en config + README.
2. **Fijar reglas mínimas** email/teléfono y documentar en spec delta o OpenAPI.
3. **Política POST público sin cupo**: alinear inventory con escenario explícito (recomendado: rechazar con 409/422 si no hay unidad libre para el rango, **considerando solo confirmadas**).
4. **Precio orientativo**: resolver ítem 23 (fijo por tipo vs temporada) antes de congelar respuesta de availability.
5. **Errores**: matriz HTTP + `code` interno para validación, conflicto inventario, transición ilegal, no autenticado.
6. **Enum de estados** y nombres de `room_type` únicos en API y UI.
7. **Historial en detalle** y campos post-confirmación (`room_id` / label) para satisfacer recepción + criterio E2E.

## Anexo — matriz rápida C / P / H (resumen para UI)

| Área | Nivel | Nota breve |
|------|-------|------------|
| Alcance exclusiones | C | Escenario explícito en core. |
| TZ hotel | P | Formato API y default IANA. |
| Email / teléfono | P | Reglas observables. |
| README E2E | H* | *Hasta exista README raíz verificable. |
| Disponibilidad + precio | P | Payload y política de precio (ítem 23). |
| Fechas inválidas | C | Escenario en public-booking. |
| Solicitud → pendiente | P | Shape request/response y nombre. |
| POST sin cupo | H | Alinear inventory vs public-booking. |
| Listados recepción | P | Paginación, orden, columnas. |
| Auth denegada | P | 401/403 y cuerpo. |
| Motivo confirm/cancel | P | Política ítem 22; confirm sin motivo en design. |
| Detalle + historial | P | Eventos y `assigned_room`. |
| Anti-solape + conflicto | C | inventory + design. |

Este documento debe mantenerse alineado con `proposal.md` / `design.md`; cualquier decisión que cambie comportamiento observable debe reflejarse en delta bajo `openspec/changes/piloto-reservas-recepcion/specs/` antes de ampliar código.
