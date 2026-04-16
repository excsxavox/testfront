# Proposal: Piloto reservas públicas y recepción (hotel único)

## Intent

Entregar un módulo web mínimo para un piloto en **un solo establecimiento**: consulta y solicitud de reserva sin login, gestión en recepción con login, inventario fijo por tipo sin solapes en confirmadas, y validaciones básicas (fechas, email, teléfono) con zona horaria del hotel configurable.

## Scope

**In scope:**

- Público: disponibilidad por entrada/salida y tipo (individual, doble, suite), precio orientativo, formulario de solicitud (nombre, email, teléfono, notas); estado inicial pendiente de confirmación.
- Recepción: listados pendiente / confirmada / cancelada; confirmar y cancelar con motivo breve; detalle de reserva.
- Inventario: capacidad fija por tipo; impedir solape de reservas confirmadas en la misma asignación (primera libre o por tipo según encaje técnico).
- Configuración de zona horaria del hotel (default país piloto).
- README con pasos y datos de ejemplo para el flujo completo.

**Out of scope:**

- Pagos en línea, channel manager, multi-propiedad, app móvil nativa.

## Approach

Seguir las especificaciones de dominio en `openspec/specs/` como contrato de comportamiento. Implementación backend y frontend en el stack que se elija en el repo (aún por definir en código); esta change documenta intención, diseño de alto nivel y tareas. Las deltas bajo `openspec/changes/piloto-reservas-recepcion/specs/` amplían o anclan requisitos de verificación y criterio de hecho sin sustituir los spec de dominio.
