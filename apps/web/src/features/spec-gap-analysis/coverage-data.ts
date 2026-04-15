/** Filas derivadas de `openspec/changes/piloto-reservas-recepcion/gap-analysis.md` (solo datos, sin JSX). */
export type CoverageLevel = 'C' | 'P' | 'H'

export type CoverageRow = {
  area: string
  spec: string
  level: CoverageLevel
  notes: string
}

export const COVERAGE_ROWS: CoverageRow[] = [
  {
    area: 'Alcance y exclusiones',
    spec: 'core',
    level: 'C',
    notes: 'Escenario explícito de exclusiones del piloto.',
  },
  {
    area: 'Zona horaria del hotel',
    spec: 'core',
    level: 'P',
    notes:
      'Coherencia en TZ no define formato API (fecha vs fecha-hora, medianoche, DST).',
  },
  {
    area: 'Email y teléfono',
    spec: 'core + public-booking',
    level: 'P',
    notes: '“Básico” sin reglas observables (regex, longitud, E.164).',
  },
  {
    area: 'README flujo E2E',
    spec: 'core',
    level: 'H',
    notes: 'Requisito existe; README raíz pendiente de implementación del repo.',
  },
  {
    area: 'Disponibilidad y precio orientativo',
    spec: 'public-booking',
    level: 'P',
    notes: 'Sin contrato de respuesta (cupos, moneda, impuestos).',
  },
  {
    area: 'Salida ≤ entrada',
    spec: 'public-booking',
    level: 'C',
    notes: 'Escenario en consulta y solicitud.',
  },
  {
    area: 'Solicitud → pendiente',
    spec: 'public-booking',
    level: 'P',
    notes: 'Campos y nombre JSON no listados; respuesta al crear no definida.',
  },
  {
    area: 'Sin cupo: consulta vs POST',
    spec: 'inventory + public-booking',
    level: 'H',
    notes:
      'Inventario habla de “consulta o solicitar”; ambigüedad si POST sin cupo se rechaza.',
  },
  {
    area: 'Listados recepción',
    spec: 'reception',
    level: 'P',
    notes: 'Sin orden, paginación ni forma mínima de fila.',
  },
  {
    area: 'Acceso sin autenticación',
    spec: 'reception',
    level: 'P',
    notes: 'Denegación sin HTTP/cuerpo acordado.',
  },
  {
    area: 'Motivo en confirmar/cancelar',
    spec: 'reception',
    level: 'P',
    notes: '“Cuando aplique política” no está en spec; confirm sin motivo en design.',
  },
  {
    area: 'Detalle e historial mínimo',
    spec: 'reception',
    level: 'P',
    notes: 'Eventos, marcas de tiempo y actor no fijados.',
  },
  {
    area: 'Capacidad fija por tipo',
    spec: 'inventory',
    level: 'P',
    notes: 'Configurable sin límites ni valores semilla en spec.',
  },
  {
    area: 'Anti-solape confirmadas / conflicto',
    spec: 'inventory + design',
    level: 'C',
    notes: 'Escenario de conflicto al confirmar; design fija Room + primera libre.',
  },
  {
    area: 'Criterio E2E post-confirmación',
    spec: 'delta core',
    level: 'C',
    notes: 'Falta endpoint observable unificado de “ocupación”.',
  },
]

export const ERROR_MATRIX_ROWS: {
  situation: string
  http: string
  spec: string
}[] = [
  {
    situation: 'Salida ≤ entrada',
    http: '400 (borrador)',
    spec: 'Sí — mensaje claro',
  },
  {
    situation: 'Email/teléfono inválidos',
    http: '400 (borrador)',
    spec: 'Parcial',
  },
  {
    situation: 'Sin disponibilidad (solo consulta)',
    http: '200 vs 404 — decisión',
    spec: 'Hueco',
  },
  {
    situation: 'POST público sin cupo',
    http: '409/422 (borrador)',
    spec: 'Hueco — ambigüedad',
  },
  {
    situation: 'Recepción sin sesión',
    http: '401 (borrador)',
    spec: 'Parcial',
  },
  {
    situation: 'Confirmar sin inventario',
    http: '409 (borrador)',
    spec: 'Sí — inventory',
  },
  {
    situation: 'Transición de estado ilegal',
    http: '409/422 (borrador)',
    spec: 'Hueco',
  },
]
