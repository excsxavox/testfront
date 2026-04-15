# Propuesta: MVP lista de compras (cliente)

## Intent

Entregar la primera versión usable de la app de lista de compras descrita en el requerimiento global: una pantalla con añadir, listar, marcar comprado y borrar, priorizando móvil y persistencia local sin servidor.

## Scope

En alcance:

- Campo de texto + botón «Añadir».
- Lista con checkbox «comprado» y botón o acción «eliminar» por ítem.
- Persistencia por defecto en `localStorage` (sin cuenta).
- Diseño responsive para móvil.

Fuera de alcance (por ahora):

- Autenticación y multi-lista.
- Backend y tabla en servidor (solo si se incorpora infraestructura posteriormente; entonces un cambio aparte ampliará specs y diseño).

## Approach

Implementar como aplicación web de una sola página; estado de la lista en el cliente y serialización a `localStorage`. Si más adelante existe API en el repo, valorar un cambio concreto con delta bajo `openspec/specs/` y diseño de API.
