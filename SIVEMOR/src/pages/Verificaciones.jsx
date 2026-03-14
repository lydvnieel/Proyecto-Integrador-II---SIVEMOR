import AdminLayout from "../components/layout/AdminLayout";

function Verificaciones() {
  const rows = [
    ["Juan Pérez", "Humo", "Vanessa Tabado", "Luis Castro"],
    ["María López", "Logística Humo", "Julian Tabado", "Christian Fuenzalida"],
  ];

  return (
    <AdminLayout>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Resumen de Costos</h2>
        </div>

        <button className="outline-btn">Volver</button>
      </div>

      <div className="panel-card">
        <div className="toolbar-row">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input type="text" placeholder="Buscar por cliente, placa, folio..." />
          </div>

          <button className="outline-btn">
            <i className="bi bi-funnel"></i>
            Filtros Avanzados
          </button>
        </div>

        <div className="table-shell">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="checkbox-cell"><input type="checkbox" /></th>
                <th>CLIENTE</th>
                <th>MATERIA</th>
                <th>ENCARGADO</th>
                <th>ATIENDE Y COBRA</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td className="checkbox-cell"><input type="checkbox" /></td>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                  <td>{row[3]}</td>
                  <td>
                    <div className="action-icons">
                      <i className="bi bi-pencil-square edit"></i>
                      <i className="bi bi-trash delete"></i>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>Mostrando 2 registros</span>
          <div className="pagination-mini">
            <button disabled>Anterior</button>
            <button>Siguiente</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Verificaciones;