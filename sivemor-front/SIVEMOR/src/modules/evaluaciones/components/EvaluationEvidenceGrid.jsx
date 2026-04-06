export default function EvaluationEvidenceGrid({ evidences = [] }) {
  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <i className="bi bi-camera text-primary"></i>
          <h5 className="mb-0 fw-semibold">Evidencias Fotográficas</h5>
        </div>

        <div className="row g-3">
          {evidences.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-light border mb-0">
                No hay evidencias disponibles.
              </div>
            </div>
          ) : (
            evidences.map((img, index) => (
              <div className="col-md-3 col-6" key={index}>
                <div className="border rounded-4 overflow-hidden h-100 bg-light">
                  <img
                    src={img}
                    alt={`Evidencia ${index + 1}`}
                    className="img-fluid"
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}