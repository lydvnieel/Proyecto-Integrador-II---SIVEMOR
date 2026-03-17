import Admin from  "../../components/Admin"

function Transacciones() {
  const rows = [
    ["N-1001", "TRANSFERENCIA", "$1,200", "BBVA-1234", "F-900", "Sí", "2026-02-15", "C-500", "Carlos Mendoza", "Ana García", "No", "Pago completo verificado"],
    ["N-1002", "EFECTIVO", "$800", "Santander-8123", "F-901", "No", "2026-02-16", "C-501", "María López", "Juan Pérez", "Sí", "Pendiente de validación"],
    ["N-1001", "DEPOSITO", "$500", "Santander-5678", "F-902", "Sí", "2026-02-17", "C-500", "Carlos Mendoza", "Ana García", "No", "Segundo pago de la nota N-1001"],
  ];

  return (
    <Admin>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Gestión de Transacciones</h2>
          <p className="page-title">Movimientos financieros asociados a notas</p>
        </div>

        <button className="primary-btn">
          <i className="bi bi-plus-lg"></i>
          Nueva transacción
        </button>
      </div>

      <div className="panel-card">
        <div className="toolbar-row">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input type="text" placeholder="Buscar por nota, factura, empleado..." />
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
                <th>TIPO PAGO</th>
                <th>MONTO</th>
                <th>CUENTA DEPÓSITO</th>
                <th>FACTURA</th>
                <th>PAGADO</th>
                <th>FECHA PEDIDO</th>
                <th>COTIZACIÓN</th>
                <th>REVISÓ</th>
                <th>ATENDIÓ</th>
                <th>PENDIENTE</th>
                <th>COMENTARIO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, index) => (
                <tr key={index}>
                  <td className="checkbox-cell"><input type="checkbox" /></td>
                  <td>{item[0]}</td>
                  <td><span className="status-pill status-neutral">{item[1]}</span></td>
                  <td>{item[2]}</td>
                  <td>{item[3]}</td>
                  <td>{item[4]}</td>
                  <td><span className={`status-pill ${item[5] === "Sí" ? "status-success" : "status-warning"}`}>{item[5]}</span></td>
                  <td>{item[6]}</td>
                  <td>{item[7]}</td>
                  <td>{item[8]}</td>
                  <td>{item[9]}</td>
                  <td><span className={`status-pill ${item[10] === "Sí" ? "status-warning" : "status-success"}`}>{item[10]}</span></td>
                  <td>{item[11]}</td>
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

export default Transacciones;