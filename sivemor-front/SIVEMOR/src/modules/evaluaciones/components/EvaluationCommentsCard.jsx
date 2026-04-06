export default function EvaluationCommentsCard({
  comments = "",
  observations = "",
}) {
  return (
    <>
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <i className="bi bi-chat-left-text text-primary"></i>
            <h5 className="mb-0 fw-semibold">Comentarios del Técnico</h5>
          </div>

          <div className="rounded-4 border p-3 bg-white">
            {comments || "Sin comentarios."}
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <i className="bi bi-card-text text-primary"></i>
            <h5 className="mb-0 fw-semibold">Observaciones</h5>
          </div>

          <div
            className="rounded-4 border p-3"
            style={{ backgroundColor: "#FFF6E8" }}
          >
            {observations || "Sin observaciones."}
          </div>
        </div>
      </div>
    </>
  );
}