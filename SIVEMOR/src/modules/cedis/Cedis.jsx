import Admin from  "../../components/Admin"

function Cedis() {
  const rows = [
    ["CEDIS Monterrey Norte", "Av. Constitución 1234, Monterrey, N.L.", "Carlos Méndez", "carlos.mendez@empresa.com", "81-1234-5678"],
    ["CEDIS Guadalajara Sur", "Periférico Sur 5678, Guadalajara, JAL.", "María González", "maria.gonzalez@empresa.com", "33-2345-6789"],
    ["CEDIS CDMX Centro", "Calzada Ignacio Zaragoza 9876, CDMX", "Roberto Silva", "roberto.silva@empresa.com", "55-3456-7890"],
  ];

  return (
    <Admin>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Gestión de CEDIS</h2>
          <p className="page-title">Centros de Distribución por región y cliente</p>
        </div>

        <button className="primary-btn">
          <i className="bi bi-plus-lg"></i>
          Nuevo CEDIS
        </button>
      </div>

      <div className="panel-card">
        <div className="toolbar-row">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input type="text" placeholder="Buscar por nombre, dirección, encargado..." />
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
                <th>NOMBRE</th>
                <th>DIRECCIÓN</th>
                <th>ENCARGADO</th>
                <th>CORREO</th>
                <th>TELÉFONO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td className="checkbox-cell"><input type="checkbox" /></td>
                  <td><i className="bi bi-file-earmark-text me-2 text-primary"></i>{row[0]}</td>
                  <td><i className="bi bi-geo-alt me-2"></i>{row[1]}</td>
                  <td><i className="bi bi-person me-2"></i>{row[2]}</td>
                  <td><i className="bi bi-envelope me-2"></i>{row[3]}</td>
                  <td><i className="bi bi-telephone me-2"></i>{row[4]}</td>
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
          <span>Mostrando 3 CEDIS activos</span>
        </div>
      </div>
    </Admin>
  );
}

export default Cedis;