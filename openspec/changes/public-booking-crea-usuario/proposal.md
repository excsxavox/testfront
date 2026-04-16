# Proposal: Creación de usuario en el flujo público de reserva

## Intent

Alinear el producto con el requerimiento del cliente: **aplicación web de reservas de habitaciones de hotel** donde, **al completar una reserva** (solicitud pública exitosa), el sistema **crea o vincula una cuenta de usuario** asociada al huésped, sin obligar a un flujo de registro previo al formulario.

## Scope

**In scope:**

- Definir en contrato de comportamiento que una reserva creada desde el canal público SHALL ir acompañada de la creación (o vinculación idempotente por identidad de contacto) de un **registro de usuario huésped** mínimo.
- Mantener el canal público **sin login previo**; la autenticación de recepción permanece separada según `openspec/specs/reception/spec.md`.

**Out of scope:**

- Sustituir el modelo de autenticación de recepción existente.
- Pagos, multi-propiedad y channel manager (ya fuera de alcance en `core`).

## Approach

Capturar el comportamiento como **delta** en `openspec/changes/public-booking-crea-usuario/specs/public-booking/spec.md`. La implementación backend/frontend fijará credenciales (si las hubiera), verificación de email y límites de duplicado en `design.md` de este change o en tareas, sin duplicar texto de UI en specs canónicos hasta archivo del change.
