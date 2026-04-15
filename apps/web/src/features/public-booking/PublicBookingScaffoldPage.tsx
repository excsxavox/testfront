import { ApiHealthPanel } from '@shared/ApiHealthPanel'
import { PersistenceSummaryPanel } from '@shared/PersistenceSummaryPanel'

export default function PublicBookingScaffoldPage() {
  return (
    <div className="page">
      <header className="page__header">
        <p className="page__eyebrow">Reserva pública</p>
        <h1>Consulta y solicitud (scaffold)</h1>
        <p className="page__lede">
          Aquí vivirá la UI de disponibilidad, precio orientativo y formulario de solicitud según{' '}
          <code>openspec/specs/public-booking/spec.md</code>. Por ahora se valida el enlace monorepo
          → API (healthcheck) y el modelo persistido en SQLite (resumen interno).
        </p>
      </header>
      <ApiHealthPanel description="Comprueba que el proceso del API responde antes de implementar los endpoints públicos." />
      <PersistenceSummaryPanel description="Verifica que las tablas del piloto existan tras las migraciones Drizzle (recuentos; TZ por defecto Europe/Madrid si no hay fila en hotel_settings)." />
    </div>
  )
}
