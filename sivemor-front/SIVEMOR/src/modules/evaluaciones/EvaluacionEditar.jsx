import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Admin from "../../components/Admin";
import evaluacionesData from "../../data/evaluaciones.json";
import EvaluationWizardNav from "./components/EvaluationWizardNav";

const TOTAL_STEPS = 7;

export default function EvaluacionEditar() {
  const { evaluationId } = useParams();
  const navigate = useNavigate();

  const evaluacionBase = useMemo(() => {
    const saved = localStorage.getItem("evaluaciones");
    const data = saved ? JSON.parse(saved) : evaluacionesData;
    return data.find((item) => String(item.id) === String(evaluationId));
  }, [evaluationId]);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (evaluacionBase) {
      setFormData(evaluacionBase);
    }
  }, [evaluacionBase]);

  if (!formData) {
    return (
      <Admin>
        <div className="container py-4">
          <p>No se encontró la evaluación.</p>
        </div>
      </Admin>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSave = () => {
    const saved = localStorage.getItem("evaluaciones");
    const data = saved ? JSON.parse(saved) : evaluacionesData;

    const updated = data.map((item) =>
      String(item.id) === String(evaluationId)
        ? {
            ...formData,
            updatedAt: new Date().toISOString(),
          }
        : item
    );

    localStorage.setItem("evaluaciones", JSON.stringify(updated));
    navigate(`/evaluaciones/${evaluationId}`);
  };

  return (
    <Admin>
      <div className="container py-4" style={{ maxWidth: "900px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="mb-1">Editar evaluación</h3>
            <p className="text-muted mb-0">
              Paso {step} de {TOTAL_STEPS}
            </p>
          </div>
        </div>

        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body">
            {step === 1 && (
              <>
                <h5 className="mb-3">Información general</h5>

                <div className="mb-3">
                  <label className="form-label">Técnico</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tecnico"
                    value={formData.tecnico || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Fecha de evaluación</label>
                  <input
                    type="text"
                    className="form-control"
                    name="fechaEvaluacion"
                    value={formData.fechaEvaluacion || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Dictamen</label>
                  <select
                    className="form-select"
                    name="dictamen"
                    value={formData.dictamen || ""}
                    onChange={handleChange}
                  >
                    <option value="APROBADO">APROBADO</option>
                    <option value="REPROBADO">REPROBADO</option>
                  </select>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h5 className="mb-3">Luces</h5>

                {[
                  "luces_galibo",
                  "luces_altas",
                  "luces_bajas",
                  "luces_demarcadoras_delanteras",
                  "luces_demarcadoras_traseras",
                  "luces_indicadoras",
                  "faro_izquierdo",
                  "faro_derecho",
                  "luces_direccionales_delanteras",
                  "luces_direccionales_traseras",
                ].map((field) => (
                  <div className="mb-3" key={field}>
                    <label className="form-label">{field}</label>
                    <input
                      type="text"
                      className="form-control"
                      name={field}
                      value={formData[field] || ""}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </>
            )}

            {step === 3 && (
              <>
                <h5 className="mb-3">Llantas I</h5>

                {[
                  "llantas_rines_delanteros",
                  "llantas_rines_traseros",
                  "llantas_masas_delanteras",
                  "llantas_masas_traseras",
                  "llantas_presion_delantera_izquierda",
                  "llantas_presion_delantera_derecha",
                  "llantas_presion_trasera_izquierda_1",
                  "llantas_presion_trasera_izquierda_2",
                  "llantas_presion_trasera_derecha_1",
                  "llantas_presion_trasera_derecha_2",
                ].map((field) => (
                  <div className="mb-3" key={field}>
                    <label className="form-label">{field}</label>
                    <input
                      type="text"
                      className="form-control"
                      name={field}
                      value={formData[field] || ""}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </>
            )}

            {step === 4 && (
              <>
                <h5 className="mb-3">Llantas II</h5>

                {[
                  "llantas_profundidad_delantera_izquierda",
                  "llantas_profundidad_delantera_derecha",
                  "llantas_profundidad_trasera_izquierda_1",
                  "llantas_profundidad_trasera_izquierda_2",
                  "llantas_profundidad_trasera_derecha_1",
                  "llantas_profundidad_trasera_derecha_2",
                  "llantas_birlos_delantera_izquierda",
                  "llantas_birlos_delantera_derecha",
                  "llantas_birlos_trasera_izquierda",
                  "llantas_birlos_trasera_derecha",
                  "llantas_tuercas_delantera_izquierda",
                  "llantas_tuercas_delantera_derecha",
                  "llantas_tuercas_trasera_izquierda",
                  "llantas_tuercas_trasera_derecha",
                ].map((field) => (
                  <div className="mb-3" key={field}>
                    <label className="form-label">{field}</label>
                    <input
                      type="text"
                      className="form-control"
                      name={field}
                      value={formData[field] || ""}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </>
            )}

            {step === 5 && (
              <>
                <h5 className="mb-3">Dirección, estructura y frenos</h5>

                {[
                  "brazo_pitman",
                  "manijas_de_puertas",
                  "chavetas",
                  "chavetas_num",
                  "compresor",
                  "tanques_de_aire",
                  "tiempo_de_carga_psi",
                  "tiempo_de_carga_tiempo",
                ].map((field) => (
                  <div className="mb-3" key={field}>
                    <label className="form-label">{field}</label>
                    <input
                      type="text"
                      className="form-control"
                      name={field}
                      value={formData[field] || ""}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </>
            )}

            {step === 6 && (
              <>
                <h5 className="mb-3">Motor y otros</h5>

                {[
                  "humo",
                  "gobernado",
                  "caja_direccion",
                  "deposito_aceite",
                  "parabrisas",
                  "limpiaparabrisas",
                  "huelgo",
                  "huelgo_cuanto",
                  "escape",
                ].map((field) => (
                  <div className="mb-3" key={field}>
                    <label className="form-label">{field}</label>
                    <input
                      type="text"
                      className="form-control"
                      name={field}
                      value={formData[field] || ""}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </>
            )}

            {step === 7 && (
              <>
                <h5 className="mb-3">Comentarios y observaciones</h5>

                <div className="mb-3">
                  <label className="form-label">Comentarios</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    name="comentarios"
                    value={formData.comentarios || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Observaciones</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    name="observaciones"
                    value={formData.observaciones || ""}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <EvaluationWizardNav
  step={step}
  totalSteps={TOTAL_STEPS}
  onPrev={handlePrev}
  onNext={handleNext}
  onSave={handleSave}
/>
    </Admin>
  );
}