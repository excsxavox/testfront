import { lazy, Suspense, useEffect, useMemo, useState } from 'react'

const SpecGapAnalysisPage = lazy(() => import('../features/spec-gap-analysis/SpecGapAnalysisPage'))
const PublicBookingScaffoldPage = lazy(() => import('../features/public-booking/PublicBookingScaffoldPage'))
const ReceptionScaffoldPage = lazy(() => import('../features/reception/ReceptionScaffoldPage'))

type AppRoute = 'home' | 'gap' | 'public-booking' | 'reception'

function routeFromHash(hash: string): AppRoute {
  const path = hash.replace(/^#/, '').replace(/^\//, '') || ''
  if (path === 'openspec-gap' || path === 'gap') return 'gap'
  if (path === 'public-booking' || path === 'booking') return 'public-booking'
  if (path === 'reception') return 'reception'
  return 'home'
}

export default function AppShell() {
  const [route, setRoute] = useState<AppRoute>(() => routeFromHash(window.location.hash))

  useEffect(() => {
    const syncFromLocation = () => setRoute(routeFromHash(window.location.hash))
    syncFromLocation()
    window.addEventListener('hashchange', syncFromLocation)
    return () => window.removeEventListener('hashchange', syncFromLocation)
  }, [])

  const content = useMemo(() => {
    switch (route) {
      case 'gap':
        return <SpecGapAnalysisPage />
      case 'public-booking':
        return <PublicBookingScaffoldPage />
      case 'reception':
        return <ReceptionScaffoldPage />
      default:
        return (
          <div className="page">
            <header className="page__header">
              <p className="page__eyebrow">Piloto · Monorepo</p>
              <h1>Reservas y recepción</h1>
              <p className="page__lede">
                Scaffold según <code>openspec/changes/piloto-reservas-recepcion/design.md</code>:{' '}
                <code>apps/web</code> (features) y <code>apps/api</code> (capas). Elige una vista de
                trabajo; las rutas usan hash para no depender de configuración del servidor en esta
                fase.
              </p>
            </header>
            <nav className="panel" aria-label="Vistas del piloto">
              <ul className="bullet-list">
                <li>
                  <a href="#/public-booking">Reserva pública (scaffold)</a>
                </li>
                <li>
                  <a href="#/reception">Recepción (scaffold)</a>
                </li>
                <li>
                  <a href="#/openspec-gap">Contraste OpenSpec / huecos</a>
                </li>
              </ul>
            </nav>
          </div>
        )
    }
  }, [route])

  return (
    <>
      <a className="skip-link" href="#main-content">
        Ir al contenido
      </a>
      <header className="app-topbar">
        <div className="app-topbar__inner">
          <span className="app-topbar__brand">Piloto hoteles</span>
          <nav className="app-topbar__nav" aria-label="Navegación principal">
            <a
              href="#/"
              className={route === 'home' ? 'app-topbar__link is-active' : 'app-topbar__link'}
              aria-current={route === 'home' ? 'page' : undefined}
            >
              Inicio
            </a>
            <a
              href="#/public-booking"
              className={route === 'public-booking' ? 'app-topbar__link is-active' : 'app-topbar__link'}
              aria-current={route === 'public-booking' ? 'page' : undefined}
            >
              Reserva pública
            </a>
            <a
              href="#/reception"
              className={route === 'reception' ? 'app-topbar__link is-active' : 'app-topbar__link'}
              aria-current={route === 'reception' ? 'page' : undefined}
            >
              Recepción
            </a>
            <a
              href="#/openspec-gap"
              className={route === 'gap' ? 'app-topbar__link is-active' : 'app-topbar__link'}
              aria-current={route === 'gap' ? 'page' : undefined}
            >
              OpenSpec
            </a>
          </nav>
        </div>
      </header>
      <main id="main-content" className="app-shell">
        <Suspense
          fallback={
            <div className="page" role="status" aria-live="polite">
              <p className="state state--loading">Cargando vista…</p>
            </div>
          }
        >
          {content}
        </Suspense>
      </main>
    </>
  )
}
