# Tasks — Piloto reservas y recepción

## 0. OpenSpec y contraste con specs

- [x] 0.1 Contrastar requisitos globales y dominios (`core`, `public-booking`, `reception`, `inventory`) con escenarios; documentar huecos (campos obligatorios, estados, errores) en [`gap-analysis.md`](./gap-analysis.md)

## 1. Arranque técnico

- [ ] 1.1 Elegir e inicializar stack (frontend + backend o full-stack) y dependencias; crear el **árbol de carpetas** descrito en `design.md` (sección *Clean Architecture — árbol de carpetas propuesto*)
- [ ] 1.2 Modelar persistencia (tipos de habitación, **habitaciones discretas** `Room`, reservas con asignación al confirmar, usuarios recepción, config timezone) según decisiones en `design.md`

## 2. Dominio público

- [ ] 2.1 Endpoint o acción de consulta de disponibilidad y precio orientativo
- [ ] 2.2 Formulario solicitud: validación fechas (salida > entrada), email, teléfono
- [ ] 2.3 Crear reserva en estado pendiente

## 3. Inventario y confirmación

- [ ] 3.1 Reglas de cupo por tipo y detección de solape para confirmadas
- [ ] 3.2 Transición pendiente → confirmada con asignación “primera libre” o equivalente
- [ ] 3.3 Transición a cancelada con motivo breve

## 4. Recepción

- [ ] 4.1 Autenticación y vistas listado (pendiente / confirmada / cancelada)
- [ ] 4.2 Vista detalle y acciones confirmar / cancelar

## 5. Verificación y documentación

- [ ] 5.1 Datos de ejemplo (seed o script)
- [ ] 5.2 README: pasos para flujo público → confirmar → ocupación visible
