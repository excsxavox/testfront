# Diseño: MVP lista de compras

## Technical Approach

SPA o página única con estado en memoria sincronizado con `localStorage` (clave estable, por ejemplo `shopping-list`). Sin backend en el estado actual del repositorio.

## Architecture Decisions

### Decisión: Solo cliente en MVP

No hay manifiesto de app en el repositorio todavía; el MVP asume stack web a elegir en implementación (React, Vue, vanilla, etc.) sin acoplar aún el spec a una librería concreta.

### Decisión: Una lista por origen

Un único arreglo de ítems `{ id, text, purchased }` (o equivalente) en persistencia local.

## Data Flow

```
Usuario → input + Añadir → estado lista → render filas (checkbox, eliminar)
                ↓
         serializar → localStorage
                ↑
         deserializar al cargar
```

## File Changes

Por definir cuando exista el esqueleto del proyecto (dependencias, `src/`, etc.).
