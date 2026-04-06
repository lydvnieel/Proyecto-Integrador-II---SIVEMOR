export default function EvaluationSummaryCard({
  dictamen = "Sin dictamen",
  evaluationId = "Sin ID",
}) {
  const isApproved =
    String(dictamen).toLowerCase().includes("aprobado") &&
    !String(dictamen).toLowerCase().includes("reprobado");

  return (
    <div
      className="rounded-4 p-4 mb-4 text-white"
      style={{
        background: "linear-gradient(135deg, #163A63 0%, #1F4E85 100%)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "54px",
              height: "54px",
              backgroundColor: isApproved ? "#2DBE60" : "#D9534F",
            }}
          >
            <i className={`bi ${isApproved ? "bi-check-lg" : "bi-x-lg"} fs-4`}></i>
          </div>

          <div>
            <div className="small opacity-75">Dictamen Final</div>
            <div className="fs-4 fw-bold">{dictamen}</div>
          </div>
        </div>

        <div className="text-md-end">
          <div className="small opacity-75">ID Evaluación</div>
          <div className="fs-5 fw-semibold">{evaluationId}</div>
        </div>
      </div>
    </div>
  );
}