# Tasks — Piloto reservas y recepción

## 1. Arranque técnico

- [ ] 1.1 Elegir e inicializar stack (frontend + backend o full-stack) y dependencias
- [ ] 1.2 Modelar persistencia (tipos de habitación, reservas, usuarios recepción, config timezone)

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
