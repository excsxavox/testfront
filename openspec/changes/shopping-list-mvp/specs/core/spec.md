# Delta para Core (MVP cliente)

Cambio propuesto respecto a la línea base en `openspec/specs/core/spec.md`: acotar el primer entregable a persistencia solo en cliente y dejar explícito el alcance MVP.

## ADDED Requirements

### Requirement: MVP solo localStorage

Para la implementación asociada a este cambio, el sistema SHALL persistir la lista únicamente mediante almacenamiento en cliente (`localStorage` o equivalente del navegador), sin depender de un servidor.

#### Scenario: Sin backend desplegado

- GIVEN el MVP desplegado sin API de backend
- WHEN el usuario usa la lista y recarga
- THEN los datos provienen exclusivamente del almacenamiento del navegador

## MODIFIED Requirements

### Requirement: Persistencia de datos

El sistema SHALL persistir la lista de forma que una recarga de la página conserve los ítems y su estado comprado cuando no exista flujo de autenticación ni servidor requerido. La persistencia en servidor (una lista por dispositivo) queda como trabajo futuro documentado en otra change cuando exista backend; hasta entonces el sistema SHALL usar almacenamiento en cliente (por ejemplo `localStorage`).

#### Scenario: Recarga en modo solo cliente

- GIVEN una lista con ítems y estados guardados en cliente
- WHEN el usuario recarga la página
- THEN la lista restaurada coincide con la guardada previamente
