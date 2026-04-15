# Especificación núcleo — Piloto hotel único

## Purpose

Definir el marco del módulo web de **reservas (público)** y **recepción (autenticado)** para un piloto en un solo establecimiento, con inventario simple por tipo de habitación, sin pagos en línea ni multi-propiedad.

## Requirements

### Requirement: Alcance y exclusiones del piloto

El sistema SHALL ofrecer solo las capacidades descritas en `openspec/specs/public-booking/spec.md`, `openspec/specs/reception/spec.md` e `openspec/specs/inventory/spec.md` para un único hotel piloto.

#### Scenario: Fuera de alcance explícito

- GIVEN un usuario o integrador
- WHEN se consultan las capacidades del producto
- THEN el sistema MUST NOT anunciar ni depender de pagos en línea, channel manager, multi-propiedad o aplicación móvil nativa como parte del piloto

### Requirement: Zona horaria del establecimiento

El sistema SHALL interpretar fechas de estancia y cortes operativos según una **zona horaria del hotel** configurable, con valor por defecto acorde al país del piloto.

#### Scenario: Configuración por defecto

- GIVEN la instalación inicial del piloto
- WHEN no se ha definido zona horaria personalizada
- THEN el sistema SHALL usar la zona horaria por defecto documentada en despliegue
- AND las fechas de entrada y salida SHALL evaluarse de forma coherente en esa zona

### Requirement: Validación básica de datos de contacto

El sistema MUST validar formato de correo electrónico y de teléfono en formularios de solicitud de reserva y en datos requeridos por recepción según las reglas del dominio público.

#### Scenario: Email inválido en solicitud pública

- GIVEN un visitante en el formulario de solicitud
- WHEN el email no cumple validación básica
- THEN el sistema SHALL rechazar el envío con mensaje claro
- AND no SHALL crear la solicitud

### Requirement: Documentación de verificación del piloto

El proyecto SHALL documentar en README cómo reproducir el flujo completo con datos de ejemplo: solicitud pública → recepción confirma → la habitación queda ocupada en el rango de fechas.

#### Scenario: Consultor ejecuta la guía

- GIVEN un desarrollador o consultor con el entorno local o de prueba
- WHEN sigue la sección de prueba del README
- THEN SHALL poder completar el flujo extremo a extremo sin pagos en línea ni integraciones externas
