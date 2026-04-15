import { ApiHealthPanel } from '@shared/ApiHealthPanel'
import { PersistenceSummaryPanel } from '@shared/PersistenceSummaryPanel'

export default function ReceptionScaffoldPage() {
  return (
    <div className="page">
      <header className="page__header">
        <p className="page__eyebrow">Recepción</p>
        <h1>Listados y acciones (scaffold)</h1>
        <p className="page__lede">
          Aquí vivirá el login, listados por estado, detalle y confirmar/cancelar según{' '}
          <code>openspec/specs/reception/spec.md</code>. El healthcheck y el resumen de persistencia
          ayudan a verificar el stack local mientras se implementa la autenticación y los endpoints
          de recepción.
        </p>
      </header>
      <ApiHealthPanel description="Misma comprobación de red que en reserva pública: un único API en el monorepo." />
      <PersistenceSummaryPanel description="Confirma que existen tablas para usuarios de recepción y reservas antes de cablear login y mutaciones." />
    </div>
  )
}
