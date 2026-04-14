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
        background: "linear-gradient(135deg, #173B67 0%, #224F83 100%)",
        boxShadow: "0 12px 28px rgba(23, 59, 103, 0.18)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "56px",
              height: "56px",
              backgroundColor: isApproved ? "#7BE495" : "#F16C6C",
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