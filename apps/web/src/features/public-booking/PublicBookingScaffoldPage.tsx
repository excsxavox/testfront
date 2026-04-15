import { ApiHealthPanel } from '@shared/ApiHealthPanel'

export default function PublicBookingScaffoldPage() {
  return (
    <div className="page">
      <header className="page__header">
        <p className="page__eyebrow">Reserva pública</p>
        <h1>Consulta y solicitud (scaffold)</h1>
        <p className="page__lede">
          Aquí vivirá la UI de disponibilidad, precio orientativo y formulario de solicitud según{' '}
          <code>openspec/specs/public-booking/spec.md</code>. Por ahora solo se valida el enlace
          monorepo → API mediante el healthcheck.
        </p>
      </header>
      <ApiHealthPanel description="Comprueba que el proceso del API responde antes de implementar los endpoints públicos." />
    </div>
  )
}
