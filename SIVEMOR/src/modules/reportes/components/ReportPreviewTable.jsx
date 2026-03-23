export default function ReportPreviewTable({ data }) {
  return (
    <div className="panel-card mt-4">
      <div className="table-shell">
        <table className="admin-table">
          <thead>
            <tr>
              <th>AGRUPACIÓN</th>
              <th>REGIÓN</th>
              <th>CLIENTE</th>
              <th>VEHÍCULO</th>
              <th>VERIFICACIONES</th>
              <th>APROBADAS</th>
              <th>REPROBADAS</th>
              <th>% APROBACIÓN</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.agrupacion}</td>
                <td>{item.region}</td>
                <td>{item.cliente}</td>
                <td>{item.vehiculo}</td>
                <td>{item.numeroVerificaciones}</td>
                <td>{item.aprobadas}</td>
                <td>{item.reprobadas}</td>
                <td>{item.porcentajeAprobacion}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}