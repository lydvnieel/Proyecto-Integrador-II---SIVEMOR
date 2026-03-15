import Admin from  "../../components/Admin"

function Clientes() {
  const rows = [
    ["Transportes del Norte SA de CV", "contacto@transportesnorte.com.mx", "81-1234-5678", "María García López"],
    ["Logística Occidente SC", "info@logisticaoccidente.com", "33-2345-6789", "Carlos Méndez Ruiz"],
    ["Distribuidora Central SA", "ventas@distribuidoracentral.mx", "55-3456-7890", "Roberto Silva Hernández"],
    ["Grupo Transportista del Bajío SA de CV", "admin@grupotransportistabajio.com", "44-4567-8901", "Ana Martínez Torres"],
  ];

  return (
    <Admin>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Gestión de Clientes</h2>
          <p className="page-title">Administración de empresas y contactos</p>
        </div>

        <button className="primary-btn">
          <i className="bi bi-plus-lg"></i>
          Nuevo Cliente
        </button>
      </div>

      <div className="panel-card">
        <div className="toolbar-row">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input type="text" placeholder="Buscar por razón social, email, gestor..." />
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
                <th>RAZÓN SOCIAL</th>
                <th>CORREO</th>
                <th>TELÉFONO</th>
                <th>GESTOR</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, index) => (
                <tr key={index}>
                  <td className="checkbox-cell"><input type="checkbox" /></td>
                  <td><i className="bi bi-building me-2 text-primary"></i>{item[0]}</td>
                  <td><i className="bi bi-envelope me-2"></i>{item[1]}</td>
                  <td><i className="bi bi-telephone me-2"></i>{item[2]}</td>
                  <td><i className="bi bi-person me-2"></i>{item[3]}</td>
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
          <span>Mostrando 4 clientes activos</span>
        </div>
      </div>
    </Admin>
  );
}

export default Clientes;