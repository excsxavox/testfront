# Tasks — MVP sitio hotelero (seguimiento OpenSpec)

## 1. Decisiones de producto (consultor / cliente)

- [ ] 1.1 Modelo de cobro: pago online, depósito, o reserva sin cobro en MVP.
- [ ] 1.2 Política de cancelación: fija global vs. por tarifa/tipo.
- [ ] 1.3 Alcance “solo web”: confirmar si recepción en piloto se mantiene o se oculta en despliegue MVP comercial.

## 2. Especificación

- [ ] 2.1 Si aplica sitio institucional + admin de contenidos: crear change con delta `specs/<dominio>/spec.md` (ADDED) para páginas, i18n, moneda y criterios WCAG mínimos.
- [ ] 2.2 Actualizar `public-booking` / `inventory` con requisitos de desglose fiscal, número de huéspedes (adultos/niños) y mensajes “sin stock” si difieren del piloto actual.

## 3. Implementación (referencia para agentes)

- [ ] 3.1 Frontend: rutas públicas, formularios etiquetados, estados de carga/error según escenarios acordados.
- [ ] 3.2 Backend: contratos HTTPS, sin secretos en cliente; validaciones servidor coherentes con `core`.
