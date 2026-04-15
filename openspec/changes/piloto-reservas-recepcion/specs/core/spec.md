# Delta — core

## ADDED Requirements

### Requirement: Criterio de hecho extremo a extremo del piloto

El sistema SHALL permitir verificar en un entorno de prueba el flujo: **solicitud pública** → **confirmación en recepción** → **ocupación efectiva** en el rango de fechas para la asignación correspondiente.

#### Scenario: Verificación tras confirmar

- GIVEN una reserva creada desde el canal público en estado pendiente
- WHEN recepción confirma la reserva
- THEN una consulta de disponibilidad o de ocupación para el mismo tipo y fechas SHALL reflejar la reducción de capacidad acorde a `openspec/specs/inventory/spec.md`
- AND el estado de la reserva SHALL ser confirmada

## MODIFIED Requirements

### Requirement: Zona horaria del establecimiento

El sistema SHALL interpretar fechas de estancia y cortes operativos según una **zona horaria del hotel** configurable, con valor por defecto acorde al país del piloto.

#### Scenario: Coherencia dominio y persistencia en calendario hotel

- GIVEN `hotel_settings.timezone_iana` como fuente de verdad de la zona horaria del establecimiento
- WHEN el dominio valida intervalos de estancia o detecta solapes entre estancias almacenadas como `YYYY-MM-DD`
- THEN las comparaciones SHALL operar sobre esas fechas de **calendario del hotel** (intervalo `[check_in, check_out)`)
- AND el mismo identificador IANA SHALL usarse al validar la configuración y al aplicar reglas de negocio que dependan de fechas de estancia
- AND no SHALL inferirse la fecha de estancia a partir de instantes UTC del cliente sin alinearlas explícitamente al calendario del hotel
