# Design: Piloto reservas y recepción

## Technical approach

El repositorio actual es un contenedor mínimo (`readme.txt`). La implementación concreta (framework web, API, persistencia) la fijarán los agentes Backend/Frontend sobre la base de los `spec.md` en `openspec/specs/`.

## Architecture decisions

### Decision: Modelo de datos mínimo

- Entidades sugeridas: **RoomType** (cupos fijos), **Reservation** (fechas, tipo, estado, datos de contacto, notas, motivo cancelación si aplica), **User** o equivalente para recepción.
- Asignación: al confirmar, asociar una unidad lógica o slot por tipo de forma que no existan dos confirmadas solapadas en la misma unidad.

### Decision: Zona horaria

- Almacenar fechas en UTC o fecha-local explícita con `timezone` configurable a nivel establecimiento (una fila de configuración o env).

### Decision: Autenticación recepción

- Mecanismo de login acorde al stack elegido (sesión o JWT); fuera de alcance SSO avanzado en el piloto.

## Data flow (resumen)

```text
Visitante → consulta cupos/precio → POST solicitud (pendiente)
Recepción → lista pendientes → confirmar → inventario actualizado (ocupado)
```

## File changes (previsto, no vinculante)

A definir al crear la aplicación: API de disponibilidad y reservas, UI pública, UI recepción, migraciones, README.
