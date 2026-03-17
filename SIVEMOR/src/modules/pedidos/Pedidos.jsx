import Admin from  "../../components/Admin"

function Pedidos() {
  const rows = [
    ["N-1001", "2026-02-15", "GU-20260215-001", "Carlos Mendoza", "evidencia-001.jpg", "ENTREGADO", "Entrega realizada sin incidencias"],
    ["N-1002", "2026-02-16", "GU-20260216-002", "María López", "evidencia-002.jpg", "ENVIADO", "En tránsito a sucursal norte"],
    ["N-1003", "2026-02-17", "GU-20260217-003", "-", "Sin foto", "PENDIENTE", "Esperando confirmación de dirección"],
  ];

  const getStatusClass = (status) => {
    if (status === "ENTREGADO") return "status-success";
    if (status === "PENDIENTE") return "status-warning";
    return "status-neutral";
  };

  return (
    <Admin>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Gestión de Pedidos</h2>
          <p className="page-title">Envíos físicos y entregas de documentación</p>
        </div>
      </div>

      <div className="panel-card">
        <div className="toolbar-row">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input type="text" placeholder="Buscar por nota, guía, receptor..." />
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
                <th>NOTA</th>
                <th>FECHA ENVÍO</th>
                <th>NÚMERO GUÍA</th>
                <th>RECIBIÓ</th>
                <th>FOTO</th>
                <th>ESTATUS ENVÍO</th>
                <th>COMENTARIO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, index) => (
                <tr key={index}>
                  <td className="checkbox-cell"><input type="checkbox" /></td>
                  <td>{item[0]}</td>
                  <td>{item[1]}</td>
                  <td>{item[2]}</td>
                  <td>{item[3]}</td>
                  <td>
                    {item[4] !== "Sin foto" ? (
                      <span className="text-primary">
                        <i className="bi bi-image me-2"></i>
                        {item[4]}
                      </span>
                    ) : (
                      <span className="text-muted">{item[4]}</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-pill ${getStatusClass(item[5])}`}>
                      {item[5]}
                    </span>
                  </td>
                  <td>{item[6]}</td>
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
    </Admin>
  );
}

export default Pedidos;