import AdminLayout from "../components/layout/AdminLayout";

function Vehiculos() {
  const rows = [
    ["AB-123-CD", "XYZ987654321", "Monterrey Norte", "Norte"],
    ["XY-987-ZZ", "ABC123456789", "Guadalajara Sur", "Bajío"],
    ["MN-456-OP", "DEF456789123", "CDMX Centro", "Centro"],
  ];

  const getRegionClass = (region) => {
    if (region === "Norte") return "status-neutral";
    if (region === "Bajío") return "status-neutral";
    if (region === "Centro") return "status-neutral";
    return "status-blue";
  };

  return (
    <AdminLayout>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Gestión de Vehículos</h2>
          <p className="page-title">Administración y control de parque vehicular</p>
        </div>

        <button className="primary-btn">
          <i className="bi bi-plus-lg"></i>
          Nuevo Vehículo
        </button>
      </div>

      <div className="panel-card">
        <div className="toolbar-row">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input type="text" placeholder="Buscar por placa o serie..." />
          </div>

          <button className="outline-btn">
            <i className="bi bi-funnel"></i>
            Filtros
          </button>
        </div>

        <div className="table-shell">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="checkbox-cell"><input type="checkbox" /></th>
                <th>PLACA</th>
                <th>SERIE</th>
                <th>CEDIS</th>
                <th>REGIÓN</th>
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
                  <td>
                    <span className={`status-pill ${getRegionClass(row[3])}`}>
                      {row[3]}
                    </span>
                  </td>
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
      </div>
    </AdminLayout>
  );
}

export default Vehiculos;