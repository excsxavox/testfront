import { useCallback, useId, useState } from 'react'
import { COVERAGE_ROWS, ERROR_MATRIX_ROWS } from './coverage-data'

type HealthState =
  | { status: 'pending' }
  | { status: 'loading' }
  | { status: 'success'; body: string }
  | { status: 'error'; message: string }

/** Alineado con `apps/api` scaffold (`GET /health`). */
const HEALTH_PATH = '/health'

function levelLabel(level: string): string {
  switch (level) {
    case 'C':
      return 'Cubierto'
    case 'P':
      return 'Parcial'
    case 'H':
      return 'Hueco'
    default:
      return level
  }
}

export default function SpecGapAnalysisPage() {
  const statusId = useId()
  const [health, setHealth] = useState<HealthState>({ status: 'pending' })

  const checkApi = useCallback(async () => {
    setHealth({ status: 'loading' })
    try {
      const res = await fetch(HEALTH_PATH, {
        headers: { Accept: 'application/json' },
      })
      const text = await res.text()
      if (!res.ok) {
        setHealth({
          status: 'error',
          message: `HTTP ${res.status}: ${text.slice(0, 200)}`,
        })
        return
      }
      setHealth({ status: 'success', body: text })
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setHealth({
        status: 'error',
        message: `${message}. ¿Está el API en marcha y Vite configurado con proxy a ese origen?`,
      })
    }
  }, [])

  return (
    <div className="page">
      <header className="page__header">
        <p className="page__eyebrow">OpenSpec · Piloto reservas</p>
        <h1>Contraste de requisitos y huecos (tarea 2)</h1>
        <p className="page__lede">
          Vista de trabajo para alinear REST y UI con los specs antes de
          implementar contratos definitivos. Fuente canónica del análisis:{' '}
          <code>openspec/changes/piloto-reservas-recepcion/gap-analysis.md</code>
          .
        </p>
      </header>

      <section
        className="panel"
        aria-labelledby={statusId}
        aria-live="polite"
        aria-busy={health.status === 'loading'}
      >
        <h2 id={statusId}>Comprobación del API (scaffold)</h2>
        <p className="panel__hint">
          Petición a <code>{HEALTH_PATH}</code>. En desarrollo, Vite reenvía al
          origen configurado en <code>vite.config.ts</code> (variable{' '}
          <code>VITE_DEV_API_ORIGIN</code>, por defecto{' '}
          <code>http://127.0.0.1:3000</code>).
        </p>
        {health.status === 'pending' ? (
          <p className="state state--muted" role="status">
            Aún no se ha comprobado el API. Use el botón para lanzar la petición
            (evita peticiones automáticas al cargar la página).
          </p>
        ) : null}
        {health.status === 'loading' ? (
          <p className="state state--loading">Comprobando conexión…</p>
        ) : null}
        {health.status === 'success' ? (
          <pre className="state state--ok" tabIndex={0}>
            {health.body}
          </pre>
        ) : null}
        {health.status === 'error' ? (
          <div className="state state--err" role="alert">
            {health.message}
          </div>
        ) : null}
        <button type="button" className="btn" onClick={() => void checkApi()}>
          {health.status === 'pending' ? 'Comprobar API' : 'Reintentar comprobación'}
        </button>
      </section>

      <section className="panel" aria-labelledby="coverage-heading">
        <h2 id="coverage-heading">Cobertura requisito ↔ escenario</h2>
        <p className="panel__hint">
          C = cubierto · P = parcial · H = hueco (ver documento en{' '}
          <code>openspec/changes/…/gap-analysis.md</code>).
        </p>
        <div className="table-wrap">
          <table className="data-table">
            <caption className="visually-hidden">
              Cobertura de escenarios por área y especificación
            </caption>
            <thead>
              <tr>
                <th scope="col">Área</th>
                <th scope="col">Spec</th>
                <th scope="col">Nivel</th>
                <th scope="col">Notas</th>
              </tr>
            </thead>
            <tbody>
              {COVERAGE_ROWS.map((row) => (
                <tr key={row.area}>
                  <td>{row.area}</td>
                  <td>{row.spec}</td>
                  <td>
                    <span
                      className={`badge badge--${row.level.toLowerCase()}`}
                      title={levelLabel(row.level)}
                    >
                      {row.level}
                    </span>
                  </td>
                  <td>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel" aria-labelledby="errors-heading">
        <h2 id="errors-heading">Matriz previa de errores HTTP (borrador)</h2>
        <p className="panel__hint">
          Propuesta de implementación; el spec no fija códigos salvo implicación
          de rechazo con mensaje claro.
        </p>
        <div className="table-wrap">
          <table className="data-table">
            <caption className="visually-hidden">
              Situaciones de error y alineación con spec
            </caption>
            <thead>
              <tr>
                <th scope="col">Situación</th>
                <th scope="col">HTTP (borrador)</th>
                <th scope="col">¿Spec?</th>
              </tr>
            </thead>
            <tbody>
              {ERROR_MATRIX_ROWS.map((row) => (
                <tr key={row.situation}>
                  <td>{row.situation}</td>
                  <td>{row.http}</td>
                  <td>{row.spec}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel panel--muted" aria-labelledby="next-heading">
        <h2 id="next-heading">Próximos pasos sugeridos</h2>
        <ul className="bullet-list">
          <li>
            Fijar formato de <code>check_in</code> / <code>check_out</code> y
            TZ del hotel en request/response.
          </li>
          <li>
            Decidir comportamiento del <code>POST</code> público cuando no hay
            cupo (rechazo vs solicitud pendiente).
          </li>
          <li>
            Definir payload de disponibilidad, respuesta al crear reserva y
            detalle con habitación asignada tras confirmar.
          </li>
          <li>
            Resolver ítems 22–23 del workflow (política de cancelación; precio
            fijo vs variable) mediante delta OpenSpec antes de cambiar
            comportamiento observable.
          </li>
        </ul>
      </section>
    </div>
  )
}
