import { useId } from 'react'

export function DemoDataGuidePanel() {
  const headingId = useId()
  return (
    <section className="panel" aria-labelledby={headingId}>
      <h2 id={headingId}>Datos de ejemplo (seed)</h2>
      <p className="panel__hint">
        Tras <code>npm run db:migrate -w @piloto/api</code>, ejecuta{' '}
        <code>npm run db:seed -w @piloto/api</code> para cargar el inventario fijo, un usuario de
        recepción y reservas en distintos estados. El script no corre si <code>NODE_ENV=production</code>
        .
      </p>
      <div className="table-wrap" role="region" aria-label="Contenido del seed">
        <table className="data-table">
          <caption className="visually-hidden">Resumen de datos insertados por el seed</caption>
          <tbody>
            <tr>
              <th scope="row">Tipos de habitación</th>
              <td>
                <code>single</code>, <code>double</code>, <code>suite</code> (precio orientativo en
                céntimos en base de datos).
              </td>
            </tr>
            <tr>
              <th scope="row">Habitaciones físicas</th>
              <td>
                2 individuales (<code>IND-101</code>, <code>IND-102</code>), 2 dobles (
                <code>DBL-201</code>, <code>DBL-202</code>), 1 suite (<code>STE-301</code>).
              </td>
            </tr>
            <tr>
              <th scope="row">Recepción (login futuro)</th>
              <td>
                Usuario <code>reception</code> · contraseña de demo <code>piloto2026</code> (solo
                entornos no productivos; ver README en la raíz del monorepo).
              </td>
            </tr>
            <tr>
              <th scope="row">Zona horaria del hotel</th>
              <td>
                <code>Europe/Madrid</code> en <code>hotel_settings</code>.
              </td>
            </tr>
            <tr>
              <th scope="row">Reservas de ejemplo</th>
              <td>
                Una <strong>pendiente</strong> en tipo doble (sin <code>room_id</code>), dos{' '}
                <strong>confirmadas</strong> en <code>IND-101</code> e <code>IND-102</code> con
                estancias que no se solapan en la misma habitación, y una <strong>cancelada</strong> en
                suite con motivo breve.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="panel__hint">
        En <a href="#/public-booking">Reserva pública</a> puedes comprobar los recuentos vía{' '}
        <code>GET /api/internal/persistence-summary</code> tras migrar y sembrar.
      </p>
    </section>
  )
}
