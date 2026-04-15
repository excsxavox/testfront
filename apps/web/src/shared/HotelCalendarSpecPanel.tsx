import { useCallback, useId, useMemo, useState } from 'react'
import type { PilotoApiPersistenceSummaryResponse } from '@piloto/shared-types'
import {
  hotelStayHalfOpenIntervalsOverlap,
  isValidIanaTimeZoneId,
  validateStayHalfOpenInterval,
} from '@piloto/shared-types'

const SUMMARY_PATH = '/api/internal/persistence-summary'

type SummaryState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: PilotoApiPersistenceSummaryResponse }
  | { status: 'error'; message: string }

/** Mensaje UX para códigos de dominio compartidos api ↔ web. */
function intervalErrorMessage(code: string): string {
  switch (code) {
    case 'INVALID_TIMEZONE':
      return 'La zona horaria IANA no es reconocida por el motor (valor de hotel_settings o campo manual).'
    case 'INVALID_DATE_FORMAT':
      return 'Las fechas deben tener formato YYYY-MM-DD.'
    case 'INVALID_CALENDAR_DATE':
      return 'La fecha no existe en el calendario (ej.: mes/día inválidos).'
    case 'CHECK_OUT_NOT_AFTER_CHECK_IN':
      return 'La salida debe ser estrictamente posterior a la entrada (intervalo [entrada, salida)).'
    default:
      return `Error de calendario: ${code}`
  }
}

export function HotelCalendarSpecPanel() {
  const panelId = useId()
  const summaryHeadingId = `${panelId}-summary`
  const demoHeadingId = `${panelId}-demo`

  const [summaryState, setSummaryState] = useState<SummaryState>({ status: 'idle' })
  const [manualTz, setManualTz] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [otherIn, setOtherIn] = useState('')
  const [otherOut, setOtherOut] = useState('')

  const fetchSummary = useCallback(async () => {
    setSummaryState({ status: 'loading' })
    try {
      const res = await fetch(SUMMARY_PATH, { headers: { Accept: 'application/json' } })
      const json = (await res.json()) as PilotoApiPersistenceSummaryResponse
      if (!res.ok) {
        const message =
          'ok' in json && json.ok === false && 'message' in json
            ? String(json.message)
            : `HTTP ${res.status}`
        setSummaryState({ status: 'error', message })
        return
      }
      setSummaryState({ status: 'success', data: json })
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setSummaryState({
        status: 'error',
        message: `${message}. ¿Está el API en marcha y migrado?`,
      })
    }
  }, [])

  const hotelTzFromApi = useMemo(() => {
    if (summaryState.status !== 'success' || !summaryState.data.ok) return ''
    return summaryState.data.summary.hotelTimezoneIana.trim()
  }, [summaryState])

  const effectiveTimezone = manualTz.trim() || hotelTzFromApi

  const manualTzInvalid =
    manualTz.trim().length > 0 && !isValidIanaTimeZoneId(manualTz.trim())

  const mainStay = useMemo(() => {
    if (!effectiveTimezone) {
      return {
        stage: 'needs_tz' as const,
        message:
          'Indica una zona IANA válida o carga el resumen de base de datos para leer hotel_settings.',
      }
    }
    if (!checkIn && !checkOut) {
      return { stage: 'empty' as const }
    }
    const v = validateStayHalfOpenInterval(effectiveTimezone, checkIn, checkOut)
    if (!v.ok) {
      return { stage: 'invalid' as const, code: v.code }
    }
    return { stage: 'ok' as const }
  }, [checkIn, checkOut, effectiveTimezone])

  const overlapDemo = useMemo(() => {
    if (!effectiveTimezone) return { stage: 'needs_tz' as const }
    const primary = { checkIn, checkOut }
    const other = { checkIn: otherIn, checkOut: otherOut }
    const hasAny = checkIn || checkOut || otherIn || otherOut
    if (!hasAny) return { stage: 'empty' as const }
    const r = hotelStayHalfOpenIntervalsOverlap(effectiveTimezone, primary, other)
    if (!r.ok) {
      return { stage: 'invalid' as const, code: r.code, detail: r.message }
    }
    return { stage: 'ok' as const, overlap: r.overlap }
  }, [checkIn, checkOut, effectiveTimezone, otherIn, otherOut])

  return (
    <section className="panel" aria-labelledby={demoHeadingId}>
      <h2 id={demoHeadingId}>Calendario del hotel (contrato de fechas)</h2>
      <p className="panel__hint">
        Las fechas de estancia se envían y persisten como <code>YYYY-MM-DD</code>; la semántica de
        ocupación y solapes es <strong>medio abierta</strong> <code>[entrada, salida)</code>, usando la
        misma zona IANA que <code>hotel_settings.timezone_iana</code>. Esta vista replica las reglas
        en el cliente para feedback inmediato; la API seguirá siendo la fuente de verdad.
      </p>

      <section
        className="hotel-cal__subsection"
        aria-labelledby={summaryHeadingId}
        aria-live="polite"
      >
        <h3 id={summaryHeadingId}>Zona horaria desde persistencia</h3>
        <p className="panel__hint">
          <button type="button" className="btn" onClick={fetchSummary} disabled={summaryState.status === 'loading'}>
            {summaryState.status === 'loading' ? 'Cargando…' : 'Cargar TZ desde resumen interno'}
          </button>{' '}
          <code>{SUMMARY_PATH}</code>
        </p>
        {summaryState.status === 'error' ? (
          <p className="state state--err" role="alert">
            {summaryState.message}
          </p>
        ) : null}
        {summaryState.status === 'success' && summaryState.data.ok ? (
          <p className="state state--muted" role="status">
            Zona actual en base de datos: <strong>{summaryState.data.summary.hotelTimezoneIana}</strong>
          </p>
        ) : null}
      </section>

      <div className="hotel-cal__grid">
        <div className="hotel-cal__field">
          <label htmlFor={`${panelId}-tz`} className="hotel-cal__label">
            Zona IANA (opcional, anula la leída de BD)
          </label>
          <input
            id={`${panelId}-tz`}
            className="hotel-cal__input"
            type="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="Ej.: Europe/Madrid"
            value={manualTz}
            onChange={(e) => setManualTz(e.target.value)}
            aria-invalid={manualTzInvalid}
            aria-describedby={manualTzInvalid ? `${panelId}-tz-err` : undefined}
          />
          {manualTzInvalid ? (
            <p id={`${panelId}-tz-err`} className="state state--err" role="alert">
              Identificador IANA no reconocido.
            </p>
          ) : null}
        </div>
        <p className="hotel-cal__tz-effective" role="status">
          <span className="visually-hidden">Zona horaria efectiva para las comprobaciones: </span>
          Efectiva:{' '}
          <strong>
            {effectiveTimezone ? (
              effectiveTimezone
            ) : (
              <span className="hotel-cal__placeholder">(sin zona todavía)</span>
            )}
          </strong>
        </p>
      </div>

      <fieldset className="hotel-cal__fieldset">
        <legend>Intervalo principal (como en solicitud / reserva)</legend>
        <div className="hotel-cal__dates">
          <div className="hotel-cal__field">
            <label htmlFor={`${panelId}-in`} className="hotel-cal__label">
              Entrada
            </label>
            <input
              id={`${panelId}-in`}
              className="hotel-cal__input"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          <div className="hotel-cal__field">
            <label htmlFor={`${panelId}-out`} className="hotel-cal__label">
              Salida
            </label>
            <input
              id={`${panelId}-out`}
              className="hotel-cal__input"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>
        {mainStay.stage === 'needs_tz' ? (
          <p className="state state--muted" role="status">
            {mainStay.message}
          </p>
        ) : null}
        {mainStay.stage === 'empty' ? (
          <p className="state state--muted">Elige fechas para validar el intervalo.</p>
        ) : null}
        {mainStay.stage === 'invalid' ? (
          <p className="state state--err" role="alert">
            {intervalErrorMessage(mainStay.code)}
          </p>
        ) : null}
        {mainStay.stage === 'ok' ? (
          <p className="state state--success" role="status">
            Intervalo válido: noches del <code>{checkIn}</code> al <code>{checkOut}</code> (la noche del
            día de salida <strong>no</strong> cuenta: <code>[{checkIn}, {checkOut})</code>).
          </p>
        ) : null}
      </fieldset>

      <fieldset className="hotel-cal__fieldset">
        <legend>Comparar con un segundo intervalo (solape en confirmadas)</legend>
        <div className="hotel-cal__dates">
          <div className="hotel-cal__field">
            <label htmlFor={`${panelId}-o-in`} className="hotel-cal__label">
              Otra entrada
            </label>
            <input
              id={`${panelId}-o-in`}
              className="hotel-cal__input"
              type="date"
              value={otherIn}
              onChange={(e) => setOtherIn(e.target.value)}
            />
          </div>
          <div className="hotel-cal__field">
            <label htmlFor={`${panelId}-o-out`} className="hotel-cal__label">
              Otra salida
            </label>
            <input
              id={`${panelId}-o-out`}
              className="hotel-cal__input"
              type="date"
              value={otherOut}
              onChange={(e) => setOtherOut(e.target.value)}
            />
          </div>
        </div>
        {overlapDemo.stage === 'needs_tz' ? (
          <p className="state state--muted">Define la zona horaria para evaluar solapes.</p>
        ) : null}
        {overlapDemo.stage === 'empty' ? (
          <p className="state state--muted">
            Introduce el segundo intervalo para ver si se solapa con el principal (misma regla que dos
            estancias confirmadas en la misma habitación).
          </p>
        ) : null}
        {overlapDemo.stage === 'invalid' ? (
          <p className="state state--err" role="alert">
            {overlapDemo.detail}: {intervalErrorMessage(overlapDemo.code)}
          </p>
        ) : null}
        {overlapDemo.stage === 'ok' ? (
          <p className={overlapDemo.overlap ? 'state state--err' : 'state state--muted'} role="status">
            {overlapDemo.overlap
              ? 'Hay solape: los intervalos comparten al menos una noche de calendario.'
              : 'No hay solape entre los dos intervalos [entrada, salida).'}
          </p>
        ) : null}
      </fieldset>
    </section>
  )
}
