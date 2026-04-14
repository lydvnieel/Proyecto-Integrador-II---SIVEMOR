import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Admin from "../../components/Admin";
import { api } from "../../../server/api";
import EvaluationSummaryCard from "./components/EvaluationSummaryCard";
import EvaluationSection from "./components/EvaluationSection";
import EvaluationEvidenceGrid from "./components/EvaluationEvidenceGrid";
import EvaluationCommentsCard from "./components/EvaluationCommentsCard";

export default function EvaluacionDetalle() {
  const { evaluationId } = useParams();
  const navigate = useNavigate();

  const [evaluacion, setEvaluacion] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarEvaluacion = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/evaluaciones/${evaluationId}`);
      console.log("Detalle evaluación:", res);
      setEvaluacion(res?.data ?? null);
    } catch (error) {
      console.error("Error al cargar evaluación:", error);
      setEvaluacion(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEvaluacion();
  }, [evaluationId]);

  const tecnicoNombre = useMemo(() => {
    if (!evaluacion) return "";
    return evaluacion.tecnico || evaluacion.nombreTecnico || evaluacion.correoTecnico || "";
  }, [evaluacion]);

  if (loading) {
    return (
      <Admin>
        <div className="container py-4">
          <p>Cargando evaluación...</p>
        </div>
      </Admin>
    );
  }

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
      <div className="container py-4" style={{ maxWidth: "760px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
  <div>
    <h3 className="mb-1 fw-bold" style={{ color: "#163A63" }}>
      Detalle de Evaluación
    </h3>
    <p className="text-muted mb-0">{evaluacion.placa || "Sin placa"}</p>
  </div>

  <div className="d-flex gap-2">
    <button
      className="btn rounded-pill px-4"
      style={{border: "1px solid #E0E6ED", backgroundColor: "#fff", color: "#6B7280", fontWeight: "500",}}
      onClick={() => navigate("/vehiculos")}
    >
      Salir
    </button>

    <button
      className="btn rounded-pill px-4"
      style={{
        backgroundColor: "#163A63",
        color: "#fff",
        border: "none",
      }}
      onClick={() => navigate(`/evaluaciones/${evaluacion.id}/editar`)}
    >
      Editar evaluación
    </button>
  </div>
</div>

        <EvaluationSummaryCard
          dictamen={evaluacion.dictamen || evaluacion.resultadoFinal}
          evaluationId={evaluacion.id}
        />

        <EvaluationSection
          title="Información General"
          icon="bi-file-earmark-text"
          fields={[
            {
              label: "Fecha de evaluación",
              value: evaluacion.fechaEvaluacion || evaluacion.fechaVerificacion || "Sin fecha",
              type: "info",
            },
            {
              label: "Técnico",
              value: tecnicoNombre || "Sin técnico",
              type: "info",
            },
            {
              label: "Vehículo",
              value: evaluacion.placa || "Sin placa",
              type: "info",
            },
            {
              label: "Tipo",
              value: evaluacion.tipo || "Sin tipo",
              type: "info",
            },
            {
              label: "Serie",
              value: evaluacion.serie || "Sin serie",
              type: "info",
            },
          ]}
        />

        <EvaluationSection
          title="Sistema de Luces"
          icon="bi-lightbulb"
          fields={[
            { label: "Luces de gálibo", value: evaluacion.lucesGalibo, type: "status" },
            { label: "Luces altas", value: evaluacion.lucesAltas, type: "status" },
            { label: "Luces bajas", value: evaluacion.lucesBajas, type: "status" },
            { label: "Luces demarcadoras delanteras", value: evaluacion.lucesDemarcadorasDelanteras, type: "status" },
            { label: "Luces demarcadoras traseras", value: evaluacion.lucesDemarcadorasTraseras, type: "status" },
            { label: "Luces indicadoras", value: evaluacion.lucesIndicadoras, type: "status" },
            { label: "Faro izquierdo", value: evaluacion.faroIzquierdo, type: "status" },
            { label: "Faro derecho", value: evaluacion.faroDerecho, type: "status" },
            { label: "Direccionales delanteras", value: evaluacion.lucesDireccionalesDelanteras, type: "status" },
            { label: "Direccionales traseras", value: evaluacion.lucesDireccionalesTraseras, type: "status" },
          ]}
        />

        <EvaluationSection
          title="Llantas y Rines"
          icon="bi-truck"
          fields={[
            { label: "Rines delanteros", value: evaluacion.llantasRinesDelanteros, type: "status" },
            { label: "Rines traseros", value: evaluacion.llantasRinesTraseros, type: "status" },
            { label: "Masas delanteras", value: evaluacion.llantasMasasDelanteras, type: "status" },
            { label: "Masas traseras", value: evaluacion.llantasMasasTraseras, type: "status" },
          ]}
        />

        <EvaluationSection
          title="Presión de Llantas (PSI)"
          icon="bi-speedometer2"
          fields={[
            { label: "Delantera izquierda", value: `${evaluacion.llantasPresionDelanteraIzquierda ?? "0"} PSI`, type: "info" },
            { label: "Delantera derecha", value: `${evaluacion.llantasPresionDelanteraDerecha ?? "0"} PSI`, type: "info" },
            { label: "Trasera izquierda 1", value: `${evaluacion.llantasPresionTraseraIzquierda1 ?? "0"} PSI`, type: "info" },
            { label: "Trasera izquierda 2", value: `${evaluacion.llantasPresionTraseraIzquierda2 ?? "0"} PSI`, type: "info" },
            { label: "Trasera derecha 1", value: `${evaluacion.llantasPresionTraseraDerecha1 ?? "0"} PSI`, type: "info" },
            { label: "Trasera derecha 2", value: `${evaluacion.llantasPresionTraseraDerecha2 ?? "0"} PSI`, type: "info" },
          ]}
        />

        <EvaluationSection
          title="Profundidad de Llantas (mm)"
          icon="bi-rulers"
          fields={[
            { label: "Delantera izquierda", value: `${evaluacion.llantasProfundidadDelanteraIzquierda ?? "0"} mm`, type: "info" },
            { label: "Delantera derecha", value: `${evaluacion.llantasProfundidadDelanteraDerecha ?? "0"} mm`, type: "info" },
            { label: "Trasera izquierda 1", value: `${evaluacion.llantasProfundidadTraseraIzquierda1 ?? "0"} mm`, type: "info" },
            { label: "Trasera izquierda 2", value: `${evaluacion.llantasProfundidadTraseraIzquierda2 ?? "0"} mm`, type: "info" },
            { label: "Trasera derecha 1", value: `${evaluacion.llantasProfundidadTraseraDerecha1 ?? "0"} mm`, type: "info" },
            { label: "Trasera derecha 2", value: `${evaluacion.llantasProfundidadTraseraDerecha2 ?? "0"} mm`, type: "info" },
          ]}
        />

        <EvaluationSection
          title="Birlos y Tuercas Faltantes"
          icon="bi-nut"
          fields={[
            { label: "Birlos delantera izquierda", value: `${evaluacion.llantasBirlosDelanteraIzquierdaNum ?? 0} faltantes`, type: "info" },
            { label: "Birlos delantera derecha", value: `${evaluacion.llantasBirlosDelanteraDerechaNum ?? 0} faltantes`, type: "info" },
            { label: "Birlos trasera izquierda", value: `${evaluacion.llantasBirlosTraseraIzquierdaNum ?? 0} faltantes`, type: "info" },
            { label: "Birlos trasera derecha", value: `${evaluacion.llantasBirlosTraseraDerechaNum ?? 0} faltantes`, type: "info" },
            { label: "Tuercas delantera izquierda", value: `${evaluacion.llantasTuercasDelanteraIzquierdaNum ?? 0} faltantes`, type: "info" },
            { label: "Tuercas delantera derecha", value: `${evaluacion.llantasTuercasDelanteraDerechaNum ?? 0} faltantes`, type: "info" },
            { label: "Tuercas trasera izquierda", value: `${evaluacion.llantasTuercasTraseraIzquierdaNum ?? 0} faltantes`, type: "info" },
            { label: "Tuercas trasera derecha", value: `${evaluacion.llantasTuercasTraseraDerechaNum ?? 0} faltantes`, type: "info" },
          ]}
        />

        <EvaluationSection
          title="Sistema de Dirección"
          icon="bi-sign-turn-right"
          fields={[
            { label: "Brazo Pitman", value: evaluacion.brazoPitman, type: "status" },
            { label: "Manijas de puertas", value: evaluacion.manijasDePuertas, type: "status" },
            { label: "Chavetas", value: evaluacion.chavetas, type: "status" },
          ]}
        />

        <EvaluationSection
          title="Sistema de Aire"
          icon="bi-wind"
          fields={[
            { label: "Compresor", value: evaluacion.compresor, type: "status" },
            { label: "Tanques de aire", value: evaluacion.tanquesDeAire, type: "status" },
            { label: "Tiempo de carga (PSI)", value: `${evaluacion.tiempoDeCargaPsi ?? 0} PSI`, type: "info" },
            { label: "Tiempo de carga (segundos)", value: `${evaluacion.tiempoDeCargaTiempo ?? 0} s`, type: "info" },
          ]}
        />

        <EvaluationSection
          title="Motor"
          icon="bi-gear-wide-connected"
          fields={[
            { label: "Humo", value: evaluacion.humo, type: "status" },
            { label: "Gobernado", value: evaluacion.gobernado, type: "status" },
          ]}
        />

        <EvaluationSection
          title="Otros Sistemas"
          icon="bi-file-earmark-medical"
          fields={[
            { label: "Caja de dirección", value: evaluacion.cajaDireccion, type: "status" },
            { label: "Depósito de aceite", value: evaluacion.depositoAceite, type: "status" },
            { label: "Parabrisas", value: evaluacion.parabrisas, type: "status" },
            { label: "Limpiaparabrisas", value: evaluacion.limpiaparabrisas, type: "status" },
            { label: "Huelgo", value: evaluacion.huelgo, type: "status" },
            { label: "Escape", value: evaluacion.escape, type: "status" },
          ]}
        />

        <EvaluationCommentsCard
          comments={evaluacion.comentarios}
          observations={evaluacion.observaciones}
        />

        <EvaluationEvidenceGrid evidences={evaluacion.evidencias || []} />
      </div>
    </Admin>
  );
}