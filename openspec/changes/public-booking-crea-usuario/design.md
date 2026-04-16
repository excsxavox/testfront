# Design — Usuario huésped en reserva pública (borrador)

## Technical approach

- Reutilizar la tabla o módulo de usuarios existente en `apps/api` distinguiendo **rol recepción** vs **rol huésped** (o tabla dedicada si el modelo actual no admite mezcla sin riesgo).
- La creación del usuario huésped MUST ocurrir en la misma unidad transaccional que la reserva pública para evitar huérfanos.
- El canal público sigue sin flujo de login previo; contraseña u onboarding posterior queda como decisión de producto fuera del mínimo de este borrador.

## Decisions pendientes (para implementación)

- Política de unicidad: email normalizado (lower-case trim) vs permitir duplicados con aviso.
- Si el huésped recibe credenciales o enlace mágico: fuera del delta hasta acordarse con el cliente.
