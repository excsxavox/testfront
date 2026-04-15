# Especificación: lista de compras (núcleo)

## Purpose

Aplicación web de lista de compras en la que el usuario añade ítems de texto, ve la lista en una sola pantalla, marca ítems como comprados y puede eliminarlos. Los datos deben persistir en el dispositivo sin cuenta obligatoria; si en el futuro existe un backend en el repositorio, puede ampliarse la persistencia a una tabla mínima con una sola lista por dispositivo. La interfaz debe ser usable en móvil.

## Requirements

### Requirement: Añadir ítems

El sistema SHALL permitir introducir texto en un campo y añadirlo a la lista mediante una acción explícita (por ejemplo un botón «Añadir»).

#### Scenario: Añadir ítem válido

- GIVEN una pantalla con el campo de texto vacío o con contenido
- WHEN el usuario introduce un texto no vacío y confirma «Añadir»
- THEN el ítem aparece en la lista debajo del formulario

#### Scenario: Entrada vacía

- GIVEN un campo de texto sin contenido significativo (solo espacios)
- WHEN el usuario intenta añadir
- THEN el sistema no añade un ítem nuevo a la lista (comportamiento predecible y sin duplicados vacíos)

### Requirement: Lista con estado comprado

El sistema SHALL mostrar cada ítem con un control de «comprado» (por ejemplo checkbox) que el usuario puede alternar.

#### Scenario: Marcar como comprado

- GIVEN un ítem visible en la lista
- WHEN el usuario marca el control de comprado
- THEN el ítem queda reflejado como comprado de forma observable en la interfaz

#### Scenario: Desmarcar

- GIVEN un ítem marcado como comprado
- WHEN el usuario desmarca el control
- THEN el ítem deja de mostrarse como comprado

### Requirement: Eliminar ítems

El sistema SHALL ofrecer por cada ítem una acción para eliminarlo de la lista.

#### Scenario: Eliminar un ítem

- GIVEN un ítem en la lista
- WHEN el usuario activa la acción de eliminar
- THEN el ítem deja de aparecer en la lista

### Requirement: Pantalla única y uso en móvil

El sistema SHALL presentar en una sola vista el campo de entrada, el control de añadir y la lista con comprado y eliminar. La disposición SHALL ser usable en viewports estrechos (móvil), con controles accesibles al tacto.

#### Scenario: Vista móvil

- GIVEN un viewport típico de teléfono
- WHEN el usuario utiliza la aplicación
- THEN puede añadir, marcar comprado y eliminar sin necesidad de otra pantalla

### Requirement: Persistencia de datos

El sistema SHALL persistir la lista de forma que una recarga de la página conserve los ítems y su estado comprado cuando no exista flujo de autenticación ni servidor requerido. Si el proyecto incorpora un backend, el sistema MAY persistir en almacenamiento servidor una sola lista asociada al dispositivo o sesión según se defina en ese dominio; en ausencia de backend, el sistema SHALL usar almacenamiento en cliente (por ejemplo `localStorage`).

#### Scenario: Recarga en modo solo cliente

- GIVEN una lista con ítems y estados guardados en cliente
- WHEN el usuario recarga la página
- THEN la lista restaurada coincide con la guardada previamente
