import EvaluationStatusBadge from "./EvaluationStatusBadge";

export default function EvaluationSection({ title, icon, fields = [] }) {
  const visibleFields = fields.filter(
    (field) => field && field.label && field.value !== undefined && field.value !== null && field.value !== ""
  );

  return (
    <div
      className="mb-4"
      style={{
        background: "#FFFFFF",
        borderRadius: "22px",
        border: "1px solid #E9EEF5",
        boxShadow: "0 8px 24px rgba(15, 50, 90, 0.06)",
      }}
    >
      <div className="p-4 p-md-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "28px",
              height: "28px",
              backgroundColor: "#F2F8FF",
              color: "#69A7E8",
              fontSize: "14px",
            }}
          >
            <i className={`bi ${icon}`}></i>
          </div>

          <h5
            className="mb-0 fw-bold"
            style={{
              color: "#1B1F24",
              fontSize: "1.65rem",
            }}
          >
            {title}
          </h5>
        </div>

        <div className="d-flex flex-column">
          {visibleFields.map((field, index) => (
            <div
              key={`${field.label}-${index}`}
              className={`d-flex justify-content-between align-items-center gap-3 py-3 ${
                index !== visibleFields.length - 1 ? "border-bottom" : ""
              }`}
              style={{ borderColor: "#F1F4F8" }}
            >
              <div
                style={{
                  color: "#4B5563",
                  fontWeight: 500,
                  fontSize: "1rem",
                }}
              >
                {field.label}
              </div>

              <div className="text-end">
                {field.type === "status" ? (
                  <EvaluationStatusBadge value={field.value} />
                ) : (
                  <span
                    className="badge rounded-pill px-3 py-2 fw-semibold"
                    style={{
                      backgroundColor: "#E8F2FF",
                      color: "#5E9CE6",
                      fontSize: "0.85rem",
                      minWidth: "96px",
                    }}
                  >
                    {field.value}
                  </span>
                )}
              </div>
            </div>
          ))}

          {visibleFields.length === 0 && (
            <div className="py-2 text-muted">Sin datos disponibles.</div>
          )}
        </div>
      </div>
    </div>
  );
}