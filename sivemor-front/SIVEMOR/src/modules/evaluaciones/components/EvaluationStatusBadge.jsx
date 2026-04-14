export default function EvaluationStatusBadge({ value }) {
  const text = String(value || "").trim();
  const normalized = text.toLowerCase();

  let textColor = "#5E9CE6";
  let backgroundColor = "#E8F2FF";

  if (
    normalized.includes("aprobado") ||
    normalized.includes("aprobada") ||
    normalized.includes("funcionando") ||
    normalized.includes("funciona")
  ) {
    textColor = "#63C784";
    backgroundColor = "#E7F8EC";
  } else if (
    normalized.includes("reprobado") ||
    normalized.includes("reprobada") ||
    normalized.includes("fundida") ||
    normalized.includes("roto") ||
    normalized.includes("rota") ||
    normalized.includes("faltante") ||
    normalized.includes("faltan") ||
    normalized.includes("no funciona") ||
    normalized.includes("fuga") ||
    normalized.includes("flojo") ||
    normalized.includes("estrellado")
  ) {
    textColor = "#E06767";
    backgroundColor = "#FDECEC";
  }

  return (
    <span
      className="badge rounded-pill px-3 py-2 fw-semibold"
      style={{
        backgroundColor,
        color: textColor,
        fontSize: "0.85rem",
        minWidth: "96px",
      }}
    >
      {text || "Sin dato"}
    </span>
  );
}