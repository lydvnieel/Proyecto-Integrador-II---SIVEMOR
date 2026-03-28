export default function RecentReportsList({ reports, onDownload }) {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="section-title m-0">Reportes Recientes</h3>
        <span className="text-link">{reports.length} reportes</span>
      </div>

      {reports.length === 0 ? (
        <div className="text-muted">Aún no hay reportes generados.</div>
      ) : (
        reports.map((reporte) => (
          <div className="report-item" key={reporte.id}>
            <div className="report-item-left">
              <div className="report-doc-icon">
                <i className="bi bi-file-earmark-pdf"></i>
              </div>

              <div>
                <div className="report-item-title">{reporte.nombre}</div>
                <div className="report-item-sub">{reporte.fecha}</div>

                <div className="report-item-meta small text-muted mt-1">
                  <div>
                    <strong>Tipo:</strong> {reporte.filters?.tipo || "-"}
                  </div>
                  <div>
                    <strong>Cliente:</strong> {reporte.filters?.cliente || "Todos"}
                  </div>
                  <div>
                    <strong>Región:</strong> {reporte.filters?.region || "Todas"}
                  </div>
                  <div>
                    <strong>Nota:</strong> {reporte.filters?.nota || "Todas"}
                  </div>
                  <div>
                    <strong>Registros:</strong> {reporte.data?.length || 0}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-link text-secondary p-0"
              onClick={() => onDownload(reporte)}
              title="Descargar PDF"
            >
              <i className="bi bi-download fs-5"></i>
            </button>
          </div>
        ))
      )}
    </>
  );
}