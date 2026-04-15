# Especificación — Inventario y ocupación

## Purpose

Modelar un inventario **fijo** de habitaciones por tipo y evitar solapes de reservas **confirmadas** en la misma habitación lógica del mismo tipo, usando asignación “primera libre” o equivalente por tipo si el diseño del producto lo acota solo a tipo.

## Requirements

### Requirement: Capacidad fija por tipo

El sistema SHALL mantener un número fijo de habitaciones por tipo (individual, doble, suite) configurable para el piloto.

#### Scenario: Sin disponibilidad

- GIVEN todas las unidades de un tipo ocupadas o bloqueadas por confirmadas en el rango solicitado
- WHEN un visitante consulta o solicita
- THEN el sistema SHALL indicar falta de disponibilidad para ese tipo

### Requirement: Sin solape de confirmadas

El sistema SHALL impedir que dos reservas confirmadas ocupen la misma asignación de habitación en fechas solapadas según la estrategia de asignación elegida en implementación (primera libre por tipo o por unidad).

#### Scenario: Confirmación con conflicto

- GIVEN una reserva pendiente que no puede asignarse sin solapar confirmadas
- WHEN recepción intenta confirmar
- THEN el sistema SHALL rechazar la confirmación con explicación operativa
