export default function AllReportsModal({ isOpen, reports, onClose, onDownload }) {
  if (!isOpen) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        background: "rgba(0,0,0,0.45)",
        zIndex: 2000,
      }}
    >
      <div
        className="bg-white rounded-4 shadow-lg p-4"
        style={{
          width: "min(900px, 92vw)",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="m-0">Todos los reportes</h3>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>

        {reports.length === 0 ? (
          <div className="text-muted">No hay reportes disponibles.</div>
        ) : (
          reports.map((reporte) => (
            <div className="report-item mb-3" key={reporte.id}>
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
                      <strong>Cliente:</strong> {reporte.filters?.clienteId || "Todos"}
                    </div>
                    <div>
                      <strong>Región:</strong> {reporte.filters?.regionId || "Todas"}
                    </div>
                    <div>
                      <strong>Nota:</strong> {reporte.filters?.notaId || "Todas"}
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
      </div>
    </div>
  );
}