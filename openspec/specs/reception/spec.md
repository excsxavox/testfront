# Especificación — Recepción (con login)

## Purpose

Gestionar reservas del establecimiento: listar por estado, ver detalle, confirmar o cancelar con motivo breve.

## Requirements

### Requirement: Listados por estado

El sistema autenticado para recepción SHALL listar reservas en estados pendiente, confirmada y cancelada, con filtros o pestañas equivalentes.

#### Scenario: Acceso sin autenticación

- GIVEN un usuario no autenticado
- WHEN intenta acceder a listados o acciones de recepción
- THEN el sistema SHALL denegar el acceso

### Requirement: Confirmar o cancelar con motivo

El sistema SHALL permitir confirmar una reserva pendiente o cancelar una reserva con captura de **motivo breve** cuando aplique la política de negocio.

#### Scenario: Confirmación desde pendiente

- GIVEN una reserva pendiente compatible con inventario
- WHEN recepción confirma
- THEN el estado SHALL pasar a confirmada
- AND el inventario SHALL reflejar la ocupación según `openspec/specs/inventory/spec.md`

### Requirement: Detalle de reserva

El sistema SHALL mostrar ficha de detalle con fechas, tipo, datos de contacto, notas, estado e historial mínimo de acciones relevantes (confirmación/cancelación).
