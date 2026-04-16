# Tasks — Usuario huésped en reserva pública

## 1. Modelo y persistencia

- [ ] 1.1 Definir entidad usuario huésped (campos mínimos, unicidad por email o política explícita) y relación con `reservations`
- [ ] 1.2 Aplicar migración y seed de demostración coherentes con recepción existente

## 2. API canal público

- [ ] 2.1 En el endpoint de creación de solicitud pública, crear/vincular usuario en la misma transacción que la reserva
- [ ] 2.2 Documentar forma de respuesta (p. ej. `guest_user_id`) en OpenAPI o `design.md` de este change

## 3. Frontend

- [ ] 3.1 Tras envío exitoso, reflejar en estado de UI que la identidad quedó registrada (sin usar rutas `openspec/` como copy)

## 4. Verificación

- [ ] 4.1 Test o script que compruebe usuario + reserva pendiente tras `POST` público
