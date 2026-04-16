import { useCallback, useId, useState } from 'react'

type HealthState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; body: string }
  | { status: 'error'; message: string }

const HEALTH_PATH = '/health'

type ApiHealthPanelProps = {
  /** Texto breve encima del botón (accesible y contextual). */
  description: string
}

export function ApiHealthPanel({ description }: ApiHealthPanelProps) {
  const headingId = useId()
  const [health, setHealth] = useState<HealthState>({ status: 'idle' })

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
        message: `${message}. Comprueba que el API esté en marcha y el proxy de Vite apunte al origen correcto (VITE_DEV_API_ORIGIN).`,
      })
    }
  }, [])

  return (
    <section
      className="panel"
      aria-labelledby={headingId}
      aria-live="polite"
      aria-busy={health.status === 'loading'}
    >
      <h2 id={headingId}>Comprobación del API (scaffold)</h2>
      <p className="panel__hint">{description}</p>
      <p className="panel__hint">
        Petición a <code>{HEALTH_PATH}</code>. En desarrollo, Vite reenvía a{' '}
        <code>vite.config.ts</code> (variable <code>VITE_DEV_API_ORIGIN</code>, por defecto{' '}
        <code>http://127.0.0.1:3000</code>).
      </p>
      <button type="button" className="btn" onClick={checkApi} disabled={health.status === 'loading'}>
        {health.status === 'loading' ? 'Comprobando…' : 'Comprobar GET /health'}
      </button>
      {health.status === 'loading' ? (
        <p className="state state--loading" role="status">
          Cargando respuesta del API…
        </p>
      ) : null}
      {health.status === 'error' ? (
        <p className="state state--err" role="alert">
          {health.message}
        </p>
      ) : null}
      {health.status === 'success' ? (
        <pre className="state state--ok" tabIndex={0}>
          {health.body}
        </pre>
      ) : null}
    </section>
  )
}
