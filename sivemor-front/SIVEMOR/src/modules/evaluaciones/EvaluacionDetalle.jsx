import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Admin from "../../components/Admin";
import evaluacionesData from "../../data/evaluaciones.json";
import usuariosData from "../../data/usuarios.json";
import EvaluationSummaryCard from "./components/EvaluationSummaryCard";
import EvaluationSection from "./components/EvaluationSection";
import EvaluationEvidenceGrid from "./components/EvaluationEvidenceGrid";
import EvaluationCommentsCard from "./components/EvaluationCommentsCard";

export default function EvaluacionDetalle() {
  const { evaluationId } = useParams();
  const navigate = useNavigate();

  const evaluacion = useMemo(() => {
    const saved = localStorage.getItem("evaluaciones");
    const data = saved ? JSON.parse(saved) : evaluacionesData;
    return data.find((item) => String(item.id) === String(evaluationId));
  }, [evaluationId]);

  const tecnicoNombre = useMemo(() => {
    if (!evaluacion) return "";
    const tecnico = usuariosData.find(
      (user) => user.email === evaluacion.tecnico
    );
    return tecnico ? tecnico.nombre : evaluacion.tecnico;
  }, [evaluacion]);

  if (!evaluacion) {
    return (
      <Admin>
        <div className="container py-4">
          <p>No se encontró la evaluación.</p>
        </div>
      </Admin>
    );
  }

  return (
    <Admin>
      <div className="container py-4" style={{ maxWidth: "950px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="mb-1 fw-bold">Detalle de Evaluación</h3>
            <p className="text-muted mb-0">{evaluacion.placa}</p>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary rounded-pill px-4"
              onClick={() => navigate("/vehiculos")}
            >
              Volver
            </button>

            <button
              className="btn btn-primary rounded-pill px-4"
              onClick={() => navigate(`/evaluaciones/${evaluacion.id}/editar`)}
            >
              Editar evaluación
            </button>
          </div>
        </div>

        <EvaluationSummaryCard
          dictamen={evaluacion.dictamen}
          evaluationId={evaluacion.id}
        />

        <EvaluationSection
          title="Información General"
          icon="bi-file-earmark-text"
          fields={[
            {
              label: "Fecha de evaluación",
              value: evaluacion.fechaEvaluacion,
              type: "badge",
            },
            { label: "Técnico", value: tecnicoNombre, type: "badge" },
            { label: "Vehículo", value: evaluacion.placa, type: "badge" },
            { label: "Tipo", value: evaluacion.tipo, type: "badge" },
            { label: "Serie", value: evaluacion.serie, type: "badge" },
          ]}
        />

        <EvaluationSection
          title="Sistema de Luces"
          icon="bi-lightbulb"
          fields={[
            { label: "Luces de gálibo", value: evaluacion.luces_galibo, type: "badge" },
            { label: "Luces altas", value: evaluacion.luces_altas, type: "badge" },
            { label: "Luces bajas", value: evaluacion.luces_bajas, type: "badge" },
            {
              label: "Luces demarcadoras delanteras",
              value: evaluacion.luces_demarcadoras_delanteras,
              type: "badge",
            },
            {
              label: "Luces demarcadoras traseras",
              value: evaluacion.luces_demarcadoras_traseras,
              type: "badge",
            },
            { label: "Luces indicadoras", value: evaluacion.luces_indicadoras, type: "badge" },
            { label: "Faro izquierdo", value: evaluacion.faro_izquierdo, type: "badge" },
            { label: "Faro derecho", value: evaluacion.faro_derecho, type: "badge" },
            {
              label: "Direccionales delanteras",
              value: evaluacion.luces_direccionales_delanteras,
              type: "badge",
            },
            {
              label: "Direccionales traseras",
              value: evaluacion.luces_direccionales_traseras,
              type: "badge",
            },
          ]}
        />

        <EvaluationSection
          title="Llantas y Rines"
          icon="bi-circle-square"
          fields={[
            {
              label: "Rines delanteros",
              value: evaluacion.llantas_rines_delanteros,
              type: "badge",
            },
            {
              label: "Rines traseros",
              value: evaluacion.llantas_rines_traseros,
              type: "badge",
            },
            {
              label: "Masas delanteras",
              value: evaluacion.llantas_masas_delanteras,
              type: "badge",
            },
            {
              label: "Masas traseras",
              value: evaluacion.llantas_masas_traseras,
              type: "badge",
            },
          ]}
        />

        <EvaluationSection
          title="Presión de Llantas (PSI)"
          icon="bi-speedometer2"
          fields={[
            {
              label: "Delantera izquierda",
              value: evaluacion.llantas_presion_delantera_izquierda,
              type: "badge",
            },
            {
              label: "Delantera derecha",
              value: evaluacion.llantas_presion_delantera_derecha,
              type: "badge",
            },
            {
              label: "Trasera izquierda 1",
              value: evaluacion.llantas_presion_trasera_izquierda_1,
              type: "badge",
            },
            {
              label: "Trasera izquierda 2",
              value: evaluacion.llantas_presion_trasera_izquierda_2,
              type: "badge",
            },
            {
              label: "Trasera derecha 1",
              value: evaluacion.llantas_presion_trasera_derecha_1,
              type: "badge",
            },
            {
              label: "Trasera derecha 2",
              value: evaluacion.llantas_presion_trasera_derecha_2,
              type: "badge",
            },
          ]}
        />

        <EvaluationSection
          title="Profundidad de Llantas (mm)"
          icon="bi-disc"
          fields={[
            {
              label: "Delantera izquierda",
              value: evaluacion.llantas_profundidad_delantera_izquierda,
              type: "badge",
            },
            {
              label: "Delantera derecha",
              value: evaluacion.llantas_profundidad_delantera_derecha,
              type: "badge",
            },
            {
              label: "Trasera izquierda 1",
              value: evaluacion.llantas_profundidad_trasera_izquierda_1,
              type: "badge",
            },
            {
              label: "Trasera izquierda 2",
              value: evaluacion.llantas_profundidad_trasera_izquierda_2,
              type: "badge",
            },
            {
              label: "Trasera derecha 1",
              value: evaluacion.llantas_profundidad_trasera_derecha_1,
              type: "badge",
            },
            {
              label: "Trasera derecha 2",
              value: evaluacion.llantas_profundidad_trasera_derecha_2,
              type: "badge",
            },
          ]}
        />

        <EvaluationSection
          title="Dirección, estructura y accesos"
          icon="bi-diagram-3"
          fields={[
            { label: "Brazo pitman", value: evaluacion.brazo_pitman, type: "badge" },
            {
              label: "Manijas de puertas",
              value: evaluacion.manijas_de_puertas,
              type: "badge",
            },
            {
              label: "Chavetas",
              value: `${evaluacion.chavetas} (${evaluacion.chavetas_num})`,
              type: "badge",
            },
          ]}
        />

        <EvaluationSection
          title="Sistema de aire / frenos"
          icon="bi-wrench-adjustable-circle"
          fields={[
            { label: "Compresor", value: evaluacion.compresor, type: "badge" },
            {
              label: "Tanques de aire",
              value: evaluacion.tanques_de_aire,
              type: "badge",
            },
            {
              label: "Tiempo de carga PSI",
              value: evaluacion.tiempo_de_carga_psi,
              type: "badge",
            },
            {
              label: "Tiempo de carga tiempo",
              value: evaluacion.tiempo_de_carga_tiempo,
              type: "badge",
            },
          ]}
        />

        <EvaluationSection
          title="Motor y otros"
          icon="bi-tools"
          fields={[
            { label: "Humo", value: evaluacion.humo, type: "badge" },
            { label: "Gobernado", value: evaluacion.gobernado, type: "badge" },
            {
              label: "Caja de dirección",
              value: evaluacion.caja_direccion,
              type: "badge",
            },
            {
              label: "Depósito de aceite",
              value: evaluacion.deposito_aceite,
              type: "badge",
            },
            { label: "Parabrisas", value: evaluacion.parabrisas, type: "badge" },
            {
              label: "Limpiaparabrisas",
              value: evaluacion.limpiaparabrisas,
              type: "badge",
            },
            { label: "Huelgo", value: evaluacion.huelgo, type: "badge" },
            {
              label: "Huelgo (mm)",
              value: evaluacion.huelgo_cuanto,
              type: "badge",
            },
            { label: "Escape", value: evaluacion.escape, type: "badge" },
          ]}
        />

        <EvaluationEvidenceGrid evidences={evaluacion.evidencias || []} />

        <EvaluationCommentsCard
          comments={evaluacion.comentarios}
          observations={evaluacion.observaciones}
        />
      </div>
    </Admin>
  );
}