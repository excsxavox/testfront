# Especificaciones (fuente de verdad)

Este directorio describe el comportamiento acordado del piloto de **reservas y recepción** para un único establecimiento.

## Dominios

| Ruta | Contenido |
|------|-------------|
| [core/spec.md](core/spec.md) | Alcance del piloto, no objetivos, zona horaria y validaciones transversales |
| [public-booking/spec.md](public-booking/spec.md) | Consulta pública de disponibilidad y solicitud de reserva |
| [reception/spec.md](reception/spec.md) | Flujo de recepción autenticada: listados, confirmación y cancelación |
| [inventory/spec.md](inventory/spec.md) | Inventario fijo por tipo y ocupación sin solapes para reservas confirmadas |

Convención: requisitos en formato **Requirement** + **Scenario**; palabras clave MUST/SHALL según RFC 2119.
