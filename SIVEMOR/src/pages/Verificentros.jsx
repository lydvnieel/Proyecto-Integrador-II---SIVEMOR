import AdminLayout from "../components/layout/AdminLayout";

function Verificentros() {
  const rows = [
    ["Verificentro Norte", "VER-001", "Av. Revolución 123, Col. Centro", "Norte", "Carlos Mendoza", "carlos@verificentro.com"],
    ["Verificentro Sur", "VER-002", "Calle Morelos 456, Col. Sur", "Sur", "María López", "maria@verificentro.com"],
    ["Verificentro Este", "VER-003", "Blvd. Las Torres 789, Col. Este", "Este", "Juan Pérez", "juan@verificentro.com"],
  ];

  return (
    <AdminLayout>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Gestión de Verificentros</h2>
          <p className="page-title">Administración y control de verificentros</p>
        </div>

        <div className="d-flex gap-3 flex-wrap">
          <button className="outline-btn">
            <i className="bi bi-funnel"></i>
            Filtros Avanzados
          </button>
          <button className="primary-btn">
            <i className="bi bi-plus-lg"></i>
            Nuevo Verificentro
          </button>
        </div>
      </div>

      <div className="panel-card">
        <div className="toolbar-row">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input type="text" placeholder="Buscar por nombre, clave, responsable..." />
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
                <th>CLAVE</th>
                <th>DIRECCIÓN</th>
                <th>REGIÓN</th>
                <th>RESPONSABLE</th>
                <th>CORREO</th>
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
                  <td>{row[4]}</td>
                  <td>{row[5]}</td>
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
          <span>Mostrando 3 registros</span>
          <div className="pagination-mini">
            <button disabled>Anterior</button>
            <button>Siguiente</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Verificentros;