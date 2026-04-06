export default function EvaluationStatusBadge({ value }) {
  const text = String(value || "").trim();

  const normalized = text.toLowerCase();

  let className = "badge rounded-pill px-3 py-2 fw-semibold";
  let style = {
    fontSize: "0.8rem",
  };

  if (
    normalized.includes("aprobado") ||
    normalized.includes("aprobada") ||
    normalized.includes("aprobadas") ||
    normalized.includes("aprobados") ||
    normalized.includes("funcionando")
  ) {
    className += " text-success";
    style.backgroundColor = "#DDF7E7";
  } else if (
    normalized.includes("reprobado") ||
    normalized.includes("reprobada") ||
    normalized.includes("fundida") ||
    normalized.includes("roto") ||
    normalized.includes("rota") ||
    normalized.includes("faltante") ||
    normalized.includes("faltan") ||
    normalized.includes("fuga") ||
    normalized.includes("flojo") ||
    normalized.includes("no funciona") ||
    normalized.includes("estrellado")
  ) {
    className += " text-danger";
    style.backgroundColor = "#FCE4E4";
  } else {
    className += " text-primary";
    style.backgroundColor = "#E3F0FF";
  }

  return (
    <span className={className} style={style}>
      {text || "Sin dato"}
    </span>
  );
}