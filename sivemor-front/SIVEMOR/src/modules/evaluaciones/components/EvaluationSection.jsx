import EvaluationStatusBadge from "./EvaluationStatusBadge";

export default function EvaluationSection({ title, icon, fields = [] }) {
  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          {icon ? <i className={`bi ${icon} text-primary`}></i> : null}
          <h5 className="mb-0 fw-semibold">{title}</h5>
        </div>

        <div className="d-flex flex-column gap-3">
          {fields.map((field, index) => (
            <div
              key={`${field.label}-${index}`}
              className="d-flex justify-content-between align-items-center gap-3 pb-2 border-bottom"
            >
              <div className="text-secondary fw-medium">{field.label}</div>
              <div className="text-end">
                {field.type === "badge" ? (
                  <EvaluationStatusBadge value={field.value} />
                ) : (
                  <span className="badge rounded-pill text-primary px-3 py-2 fw-semibold"
                    style={{ backgroundColor: "#E3F0FF", fontSize: "0.8rem" }}>
                    {field.value ?? "Sin dato"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}