# Especificación — Reserva pública (sin login)

## Purpose

Permitir a cualquier visitante consultar disponibilidad orientativa y enviar una **solicitud de reserva** que queda pendiente de confirmación por recepción.

## Requirements

### Requirement: Consulta de disponibilidad por fechas y tipo

El sistema SHALL permitir elegir fecha de entrada, fecha de salida y tipo de habitación (individual, doble, suite) y SHALL mostrar disponibilidad orientativa y precio orientativo según inventario y reglas de negocio.

#### Scenario: Salida anterior o igual a entrada

- GIVEN fechas con salida no posterior a entrada
- WHEN el visitante consulta o envía solicitud
- THEN el sistema SHALL mostrar error de validación
- AND no SHALL aceptar la operación

### Requirement: Solicitud de reserva con estado inicial pendiente

El sistema SHALL aceptar nombre, email, teléfono, notas opcionales y SHALL crear una reserva en estado **pendiente de confirmación**.

#### Scenario: Solicitud válida

- GIVEN datos de contacto válidos y fechas válidas
- WHEN el visitante envía la solicitud
- THEN el sistema SHALL persistir la reserva como pendiente
- AND recepción SHALL poder verla en el listado correspondiente
