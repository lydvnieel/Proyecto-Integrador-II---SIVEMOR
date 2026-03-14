import AdminLayout from "../components/layout/AdminLayout";

function Notas() {
  const notas = [
    {
      nota: "N-1001",
      cliente: "Transportes del Norte SA de CV",
      verificaciones: 2,
      verificentro: "Pepsi",
      metodo: "Efectivo",
      anticipo: "-",
      pagado: "Pagado",
      pagadoClass: "status-success",
      reviso: "Ana Gómez",
      atendio: "Ana Gómez",
      comentario: "Todo en orden",
    },
    {
      nota: "N-1002",
      cliente: "Logística Express",
      verificaciones: 5,
      verificentro: "Pepsi2",
      metodo: "Tarjeta",
      anticipo: "1",
      pagado: "Pendiente",
      pagadoClass: "status-warning",
      reviso: "Ana Gómez",
      atendio: "Ana Gómez",
      comentario: "Pendiente factura",
    },
  ];

  return (
    <AdminLayout>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Resumen de Notas</h2>
          <p className="page-title">Gestión y seguimiento de notas de servicio</p>
        </div>

        <button className="primary-btn">
          <i className="bi bi-plus-lg"></i>
          Nueva nota
        </button>
      </div>

      <div className="panel-card">
        <div className="table-shell">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="checkbox-cell"><input type="checkbox" /></th>
                <th>NOTA</th>
                <th>CLIENTE</th>
                <th>NUM. VERIFICACIONES</th>
                <th>VERIFICENTRO</th>
                <th>METODO DE PAGO</th>
                <th>ANTICIPO</th>
                <th>PAGADO</th>
                <th>REVISO</th>
                <th>ATENDIÓ</th>
                <th>COMENTARIO</th>
              </tr>
            </thead>
            <tbody>
              {notas.map((item, index) => (
                <tr key={index}>
                  <td className="checkbox-cell"><input type="checkbox" /></td>
                  <td>{item.nota}</td>
                  <td>{item.cliente}</td>
                  <td>{item.verificaciones}</td>
                  <td>{item.verificentro}</td>
                  <td>{item.metodo}</td>
                  <td>{item.anticipo}</td>
                  <td>
                    <span className={`status-pill ${item.pagadoClass}`}>
                      {item.pagado}
                    </span>
                  </td>
                  <td>{item.reviso}</td>
                  <td>{item.atendio}</td>
                  <td><em>{item.comentario}</em></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Notas;