# Delta — public-booking

## ADDED Requirements

### Requirement: Usuario huésped al crear la solicitud de reserva

El sistema MUST crear o vincular un **usuario huésped** cuando una solicitud de reserva pública se acepta con éxito (estado inicial pendiente según el dominio público), de forma que exista un vínculo estable entre la reserva y la identidad del huésped en persistencia.

#### Scenario: Primera reserva con email nuevo

- GIVEN un visitante con datos de contacto válidos y fechas válidas
- WHEN envía una solicitud de reserva que el sistema acepta
- THEN el sistema SHALL persistir la reserva en estado pendiente
- AND SHALL crear un registro de usuario huésped asociado a esa reserva
- AND el identificador de contacto principal (email) SHALL poder usarse como clave de correlación para futuras reservas del mismo huésped según reglas de negocio documentadas en implementación

#### Scenario: Misma identidad de contacto en reserva posterior

- GIVEN un usuario huésped ya existente para el mismo email (o regla equivalente definida en implementación)
- WHEN el visitante envía otra solicitud válida
- THEN el sistema SHALL vincular la nueva reserva al usuario existente sin duplicar identidades incompatibles con la política de unicidad acordada

## MODIFIED Requirements

### Requirement: Solicitud de reserva con estado inicial pendiente

El sistema SHALL aceptar nombre, email, teléfono, notas opcionales y SHALL crear una reserva en estado **pendiente de confirmación**; además, SHALL cumplir el requisito **Usuario huésped al crear la solicitud de reserva** de este delta.

#### Scenario: Solicitud válida

- GIVEN datos de contacto válidos y fechas válidas
- WHEN el visitante envía la solicitud
- THEN el sistema SHALL persistir la reserva como pendiente
- AND SHALL crear o vincular el usuario huésped según el escenario aplicable
- AND recepción SHALL poder verla en el listado correspondiente
