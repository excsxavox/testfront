# Delta — core

## ADDED Requirements

### Requirement: Criterio de hecho extremo a extremo del piloto

El sistema SHALL permitir verificar en un entorno de prueba el flujo: **solicitud pública** → **confirmación en recepción** → **ocupación efectiva** en el rango de fechas para la asignación correspondiente.

#### Scenario: Verificación tras confirmar

- GIVEN una reserva creada desde el canal público en estado pendiente
- WHEN recepción confirma la reserva
- THEN una consulta de disponibilidad o de ocupación para el mismo tipo y fechas SHALL reflejar la reducción de capacidad acorde a `openspec/specs/inventory/spec.md`
- AND el estado de la reserva SHALL ser confirmada
