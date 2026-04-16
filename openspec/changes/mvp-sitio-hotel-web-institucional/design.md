# Design: MVP sitio hotelero (notas de alineación)

## Fuente de datos en este repo

- **Disponibilidad y precios:** API interna `@piloto/api` (SQLite en piloto). Cualquier integración PMS/channel manager sería un cambio de arquitectura documentado en otro change.
- **Confirmación al huésped:** el piloto actual enfatiza solicitud pendiente y flujo recepción; email transaccional real queda fuera hasta definir proveedor y secretos (no en cliente).

## Mapa sugerido requerimiento global → specs

| Área requerimiento | Spec / nota |
|--------------------|-------------|
| Motor reserva (fechas, capacidad, precio desglosado, estados UI) | Ampliar vía delta sobre `public-booking` e `inventory` cuando se cierre redacción |
| Recepción operativa | `reception` (fuera del MVP “solo web” del cliente, pero presente en piloto) |
| Sitio institucional (páginas, CMS) | Nuevo dominio bajo `openspec/specs/` cuando se acuerde |
