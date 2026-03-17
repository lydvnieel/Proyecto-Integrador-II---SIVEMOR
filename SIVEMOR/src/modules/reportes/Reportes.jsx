import Admin from  "../../components/Admin"

function Reportes() {
  const reportes = [
    "Reporte_Mensual_Feb.pdf",
    "Reporte_Mensual_Feb.pdf",
    "Reporte_Mensual_Feb.pdf",
  ];

  return (
    <Admin>
      <div>
        <h2 className="page-heading">Centro de Reportes</h2>
        <p className="page-title">Generación de informes ejecutivos y operativos</p>
      </div>

      <div className="reports-grid mt-4">
        <div className="report-form-card">
          <h3 className="section-title">
            <i className="bi bi-funnel text-primary"></i>
            Configuración del Reporte
          </h3>

          <div className="form-grid-2">
            <div className="form-field">
              <label>Cliente</label>
              <input type="text" />
            </div>

            <div className="form-field">
              <label>Región</label>
              <input type="text" />
            </div>

            <div className="form-field">
              <label>Estado del pago</label>
              <input type="text" />
            </div>

            <div className="form-field">
              <label>Rango de Fechas</label>
              <input type="text" />
            </div>
          </div>

          <div className="report-submit">
            <button className="primary-btn">
              <i className="bi bi-file-earmark-pdf"></i>
              Generar Reporte PDF
            </button>
          </div>
        </div>

        <div className="report-list-card">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="section-title m-0">Reportes Recientes</h3>
            <span className="text-link">Ver todo</span>
          </div>

          {reportes.map((reporte, index) => (
            <div className="report-item" key={index}>
              <div className="report-item-left">
                <div className="report-doc-icon">
                  <i className="bi bi-file-earmark-pdf"></i>
                </div>
                <div>
                  <div className="report-item-title">{reporte}</div>
                  <div className="report-item-sub">Generado hace 2h</div>
                </div>
              </div>

              <i className="bi bi-download text-secondary"></i>
            </div>
          ))}
        </div>
      </div>
    </Admin>
  );
}

export default Reportes;