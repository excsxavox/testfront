import { useCallback, useId, useState } from 'react'
import type { PilotoApiPersistenceSummaryResponse } from '@piloto/shared-types'

type PanelState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: PilotoApiPersistenceSummaryResponse }
  | { status: 'error'; message: string }

const SUMMARY_PATH = '/api/internal/persistence-summary'

type PersistenceSummaryPanelProps = {
  description: string
}

export function PersistenceSummaryPanel({ description }: PersistenceSummaryPanelProps) {
  const headingId = useId()
  const [state, setState] = useState<PanelState>({ status: 'idle' })

  const loadSummary = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const res = await fetch(SUMMARY_PATH, {
        headers: { Accept: 'application/json' },
      })
      const json = (await res.json()) as PilotoApiPersistenceSummaryResponse
      if (!res.ok) {
        const message =
          'ok' in json && json.ok === false && 'message' in json
            ? String(json.message)
            : `HTTP ${res.status}`
        setState({ status: 'error', message })
        return
      }
      setState({ status: 'success', data: json })
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setState({
        status: 'error',
        message: `${message}. Comprueba migraciones (npm run db:migrate -w @piloto/api) y que el API esté en marcha.`,
      })
    }
  }, [])

  return (
    <section
      className="panel panel--muted"
      aria-labelledby={headingId}
      aria-live="polite"
      aria-busy={state.status === 'loading'}
    >
      <h2 id={headingId}>Persistencia SQLite (piloto)</h2>
      <p className="panel__hint">{description}</p>
      <p className="panel__hint">
        Lectura de <code>{SUMMARY_PATH}</code>: tablas <code>room_types</code>, <code>rooms</code>,{' '}
        <code>reservations</code>, <code>users</code> (recepción) y <code>hotel_settings</code> (TZ
        IANA). Las fechas de estancia se guardan como <code>check_in_date</code> /{' '}
        <code>check_out_date</code> en formato <code>YYYY-MM-DD</code> para interpretarse con la zona
        del hotel en dominio.
      </p>
      <button type="button" className="btn" onClick={loadSummary} disabled={state.status === 'loading'}>
        {state.status === 'loading' ? 'Consultando…' : 'Consultar resumen de base de datos'}
      </button>
      {state.status === 'loading' ? (
        <p className="state state--loading" role="status">
          Cargando metadatos de persistencia…
        </p>
      ) : null}
      {state.status === 'error' ? (
        <p className="state state--err" role="alert">
          {state.message}
        </p>
      ) : null}
      {state.status === 'success' && state.data.ok ? (
        <div className="table-wrap" role="region" aria-label="Conteos por tabla">
          <table className="data-table">
            <caption className="visually-hidden">Resumen de persistencia del piloto</caption>
            <tbody>
              <tr>
                <th scope="row">Motor</th>
                <td>{state.data.summary.engine}</td>
              </tr>
              <tr>
                <th scope="row">Ruta base de datos</th>
                <td>
                  <code>{state.data.summary.databasePath}</code>
                </td>
              </tr>
              <tr>
                <th scope="row">Zona horaria del hotel (IANA)</th>
                <td>{state.data.summary.hotelTimezoneIana}</td>
              </tr>
              <tr>
                <th scope="row">Tipos de habitación</th>
                <td>{state.data.summary.counts.roomTypes}</td>
              </tr>
              <tr>
                <th scope="row">Habitaciones físicas</th>
                <td>{state.data.summary.counts.rooms}</td>
              </tr>
              <tr>
                <th scope="row">Reservas</th>
                <td>{state.data.summary.counts.reservations}</td>
              </tr>
              <tr>
                <th scope="row">Usuarios recepción</th>
                <td>{state.data.summary.counts.receptionUsers}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}
      {state.status === 'success' && !state.data.ok ? (
        <p className="state state--err" role="alert">
          {state.data.message}
        </p>
      ) : null}
    </section>
  )
}
