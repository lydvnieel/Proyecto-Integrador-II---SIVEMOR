import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Admin from "../../components/Admin";
import { api } from "../../../server/api";
import EvaluationWizardNav from "./components/EvaluationWizardNav";

const TOTAL_STEPS = 8;

const OPTIONS_FUNCIONAMIENTO = [
  "APROBADO",
  "REPROBADO",
  "DERECHA_FUNDIDA",
  "IZQUIERDA_FUNDIDA",
  "AMBAS_FUNDIDAS",
];

const OPTIONS_REVISION = [
  "APROBADO",
  "REPROBADO",
  "DERECHA_CON_FUGA",
  "IZQUIERDA_CON_FUGA",
  "AMBAS_CON_FUGA",
  "FUGA",
  "UNA_ROTA",
  "ROTA",
  "FALTAN",
];

const toBackendEnum = (field, value) => {
  if (!value) return value;

  const v = String(value).trim().toUpperCase().replace(/\s+/g, "_");

  const map = {
    luces: { APROBADO: "APROBADAS" },
    lucesIndicadoras: { APROBADO: "APROBADAS" },
    rines: { APROBADO: "APROBADOS" },
    masas: { APROBADO: "APROBADAS" },
    birlos: { APROBADO: "APROBADOS" },
    tuercas: { APROBADO: "APROBADAS" },
    manijas: { APROBADO: "APROBADAS" },
    chavetas: { APROBADO: "APROBADAS" },
    fuga: { APROBADO: "APROBADA" },
  };

  if (field === "lucesIndicadoras") return map.lucesIndicadoras[v] || v;
  if (field === "luces") return map.luces[v] || v;
  if (field === "rines") return map.rines[v] || v;
  if (field === "masas") return map.masas[v] || v;
  if (field === "birlos") return map.birlos[v] || v;
  if (field === "tuercas") return map.tuercas[v] || v;
  if (field === "manijas") return map.manijas[v] || v;
  if (field === "chavetas") return map.chavetas[v] || v;
  if (field === "fuga") return map.fuga[v] || v;

  return v;
};

const normalizeSavedValue = (value) => {
  if (value === null || value === undefined) return "";

  return String(value).trim().toUpperCase().replace(/\s+/g, "_");
};

export default function EvaluacionEditar() {
  const { evaluationId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);

  const cargarEvaluacion = async () => {
    try {
      const res = await api.get(`/evaluaciones/${evaluationId}`);

      const data = res?.data?.data ?? res?.data ?? null;

      console.log("Evaluación cargada:", data);

      setFormData({
        ...data,
        idVerificacion: data?.idVerificacion ?? "",
        idTecnico: data?.idTecnico ?? "",
        fechaEvaluacion: data?.fechaEvaluacion ?? "",
        resultadoFinal: data?.resultadoFinal ?? data?.dictamen ?? "",
        comentarios: data?.comentarios ?? "",
        evidencias: data?.evidencias ?? [],

        lucesGalibo: normalizeSavedValue(data?.lucesGalibo),
        lucesAltas: normalizeSavedValue(data?.lucesAltas),
        lucesBajas: normalizeSavedValue(data?.lucesBajas),
        lucesDemarcadorasDelanteras: normalizeSavedValue(
          data?.lucesDemarcadorasDelanteras,
        ),
        lucesDemarcadorasTraseras: normalizeSavedValue(
          data?.lucesDemarcadorasTraseras,
        ),
        lucesIndicadoras: normalizeSavedValue(data?.lucesIndicadoras),
        faroIzquierdo: normalizeSavedValue(data?.faroIzquierdo),
        faroDerecho: normalizeSavedValue(data?.faroDerecho),
        lucesDireccionalesDelanteras: normalizeSavedValue(
          data?.lucesDireccionalesDelanteras,
        ),
        lucesDireccionalesTraseras: normalizeSavedValue(
          data?.lucesDireccionalesTraseras,
        ),

        llantasRinesDelanteros: normalizeSavedValue(
          data?.llantasRinesDelanteros,
        ),
        llantasRinesTraseros: normalizeSavedValue(data?.llantasRinesTraseros),
        llantasMasasDelanteras: normalizeSavedValue(
          data?.llantasMasasDelanteras,
        ),
        llantasMasasTraseras: normalizeSavedValue(data?.llantasMasasTraseras),

        brazoPitman: normalizeSavedValue(data?.brazoPitman),
        manijasDePuertas: normalizeSavedValue(data?.manijasDePuertas),
        chavetas: normalizeSavedValue(data?.chavetas),
        compresor: normalizeSavedValue(data?.compresor),
        tanquesDeAire: normalizeSavedValue(data?.tanquesDeAire),
        humo: normalizeSavedValue(data?.humo),
        gobernado: normalizeSavedValue(data?.gobernado),
        cajaDireccion: normalizeSavedValue(data?.cajaDireccion),
        depositoAceite: normalizeSavedValue(data?.depositoAceite),
        parabrisas: normalizeSavedValue(data?.parabrisas),
        limpiaparabrisas: normalizeSavedValue(data?.limpiaparabrisas),
        huelgo: normalizeSavedValue(data?.huelgo),
        escape: normalizeSavedValue(data?.escape),

        llantasBirlosDelanteraIzquierda: normalizeSavedValue(
          data?.llantasBirlosDelanteraIzquierda,
        ),
        llantasBirlosDelanteraDerecha: normalizeSavedValue(
          data?.llantasBirlosDelanteraDerecha,
        ),
        llantasBirlosTraseraIzquierda: normalizeSavedValue(
          data?.llantasBirlosTraseraIzquierda,
        ),
        llantasBirlosTraseraDerecha: normalizeSavedValue(
          data?.llantasBirlosTraseraDerecha,
        ),

        llantasTuercasDelanteraIzquierda: normalizeSavedValue(
          data?.llantasTuercasDelanteraIzquierda,
        ),
        llantasTuercasDelanteraDerecha: normalizeSavedValue(
          data?.llantasTuercasDelanteraDerecha,
        ),
        llantasTuercasTraseraIzquierda: normalizeSavedValue(
          data?.llantasTuercasTraseraIzquierda,
        ),
        llantasTuercasTraseraDerecha: normalizeSavedValue(
          data?.llantasTuercasTraseraDerecha,
        ),
        comentarios: data?.comentarios ?? "",
        evidencias: data?.evidencias ?? [],
      });
    } catch (error) {
      console.error("Error al cargar evaluación:", error);
      setFormData(null);
    }
  };

  useEffect(() => {
    cargarEvaluacion();
  }, [evaluationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSave = async () => {
    let payload = null;

    const toBackendEnum = (field, value) => {
      if (!value) return value;

      const v = String(value).trim().toUpperCase().replace(/\s+/g, "_");

      const map = {
        luces: { APROBADO: "APROBADAS" },
        lucesIndicadoras: { APROBADO: "APROBADAS" },
        rines: { APROBADO: "APROBADOS" },
        birlos: { APROBADO: "APROBADOS" },
        tuercas: { APROBADO: "APROBADAS" },
        manijas: { APROBADO: "APROBADAS" },
        chavetas: { APROBADO: "APROBADAS" },
        fuga: { APROBADO: "APROBADA" },
      };

      if (field.includes("luces")) return map.luces[v] || v;
      if (field.includes("Indicadoras")) return map.lucesIndicadoras[v] || v;
      if (field.includes("Rines")) return map.rines[v] || v;
      if (field.includes("Birlos")) return map.birlos[v] || v;
      if (field.includes("Tuercas")) return map.tuercas[v] || v;
      if (field.includes("manijas")) return map.manijas[v] || v;
      if (field.includes("chavetas")) return map.chavetas[v] || v;
      if (field.includes("caja") || field.includes("deposito"))
        return map.fuga[v] || v;

      return v;
    };

    try {
      setSaving(true);

      payload = {
        idVerificacion: formData.idVerificacion,
        idTecnico: formData.idTecnico,

        lucesGalibo: toBackendEnum("luces", formData.lucesGalibo),
        lucesAltas: toBackendEnum("luces", formData.lucesAltas),
        lucesBajas: toBackendEnum("luces", formData.lucesBajas),
        lucesDemarcadorasDelanteras: toBackendEnum(
          "luces",
          formData.lucesDemarcadorasDelanteras,
        ),
        lucesDemarcadorasTraseras: toBackendEnum(
          "luces",
          formData.lucesDemarcadorasTraseras,
        ),
        lucesIndicadoras: toBackendEnum(
          "lucesIndicadoras",
          formData.lucesIndicadoras,
        ),
        faroIzquierdo: normalizeSavedValue(formData.faroIzquierdo),
        faroDerecho: normalizeSavedValue(formData.faroDerecho),
        lucesDireccionalesDelanteras: toBackendEnum(
          "luces",
          formData.lucesDireccionalesDelanteras,
        ),
        lucesDireccionalesTraseras: toBackendEnum(
          "luces",
          formData.lucesDireccionalesTraseras,
        ),

        llantasRinesDelanteros: toBackendEnum(
          "rines",
          formData.llantasRinesDelanteros,
        ),
        llantasRinesTraseros: toBackendEnum(
          "rines",
          formData.llantasRinesTraseros,
        ),
        llantasMasasDelanteras: toBackendEnum(
          "masas",
          formData.llantasMasasDelanteras,
        ),
        llantasMasasTraseras: toBackendEnum(
          "masas",
          formData.llantasMasasTraseras,
        ),

        llantasPresionDelanteraIzquierda:
          formData.llantasPresionDelanteraIzquierda ?? 0,
        llantasPresionDelanteraDerecha:
          formData.llantasPresionDelanteraDerecha ?? 0,
        llantasPresionTraseraIzquierda1:
          formData.llantasPresionTraseraIzquierda1 ?? 0,
        llantasPresionTraseraIzquierda2:
          formData.llantasPresionTraseraIzquierda2 ?? 0,
        llantasPresionTraseraDerecha1:
          formData.llantasPresionTraseraDerecha1 ?? 0,
        llantasPresionTraseraDerecha2:
          formData.llantasPresionTraseraDerecha2 ?? 0,

        llantasProfundidadDelanteraIzquierda:
          formData.llantasProfundidadDelanteraIzquierda ?? 0,
        llantasProfundidadDelanteraDerecha:
          formData.llantasProfundidadDelanteraDerecha ?? 0,
        llantasProfundidadTraseraIzquierda1:
          formData.llantasProfundidadTraseraIzquierda1 ?? 0,
        llantasProfundidadTraseraIzquierda2:
          formData.llantasProfundidadTraseraIzquierda2 ?? 0,
        llantasProfundidadTraseraDerecha1:
          formData.llantasProfundidadTraseraDerecha1 ?? 0,
        llantasProfundidadTraseraDerecha2:
          formData.llantasProfundidadTraseraDerecha2 ?? 0,

        llantasBirlosDelanteraIzquierda: toBackendEnum(
          "birlos",
          formData.llantasBirlosDelanteraIzquierda,
        ),
        llantasBirlosDelanteraDerecha: toBackendEnum(
          "birlos",
          formData.llantasBirlosDelanteraDerecha,
        ),
        llantasBirlosTraseraIzquierda: toBackendEnum(
          "birlos",
          formData.llantasBirlosTraseraIzquierda,
        ),
        llantasBirlosTraseraDerecha: toBackendEnum(
          "birlos",
          formData.llantasBirlosTraseraDerecha,
        ),

        llantasBirlosDelanteraIzquierdaNum:
          formData.llantasBirlosDelanteraIzquierdaNum ?? 0,
        llantasBirlosDelanteraDerechaNum:
          formData.llantasBirlosDelanteraDerechaNum ?? 0,
        llantasBirlosTraseraIzquierdaNum:
          formData.llantasBirlosTraseraIzquierdaNum ?? 0,
        llantasBirlosTraseraDerechaNum:
          formData.llantasBirlosTraseraDerechaNum ?? 0,

        llantasTuercasDelanteraIzquierda: toBackendEnum(
          "tuercas",
          formData.llantasTuercasDelanteraIzquierda,
        ),
        llantasTuercasDelanteraDerecha: toBackendEnum(
          "tuercas",
          formData.llantasTuercasDelanteraDerecha,
        ),
        llantasTuercasTraseraIzquierda: toBackendEnum(
          "tuercas",
          formData.llantasTuercasTraseraIzquierda,
        ),
        llantasTuercasTraseraDerecha: toBackendEnum(
          "tuercas",
          formData.llantasTuercasTraseraDerecha,
        ),

        llantasTuercasDelanteraIzquierdaNum:
          formData.llantasTuercasDelanteraIzquierdaNum ?? 0,
        llantasTuercasDelanteraDerechaNum:
          formData.llantasTuercasDelanteraDerechaNum ?? 0,
        llantasTuercasTraseraIzquierdaNum:
          formData.llantasTuercasTraseraIzquierdaNum ?? 0,
        llantasTuercasTraseraDerechaNum:
          formData.llantasTuercasTraseraDerechaNum ?? 0,

        brazoPitman: normalizeSavedValue(formData.brazoPitman),
        manijasDePuertas: toBackendEnum("manijas", formData.manijasDePuertas),
        chavetas: toBackendEnum("chavetas", formData.chavetas),
        chavetasNum: formData.chavetasNum ?? 0,

        compresor: normalizeSavedValue(formData.compresor),
        tanquesDeAire: normalizeSavedValue(formData.tanquesDeAire),
        tiempoDeCargaPsi: formData.tiempoDeCargaPsi ?? 0,
        tiempoDeCargaTiempo: formData.tiempoDeCargaTiempo ?? 0,

        humo: normalizeSavedValue(formData.humo),
        gobernado: normalizeSavedValue(formData.gobernado),

        cajaDireccion: toBackendEnum("fuga", formData.cajaDireccion),
        depositoAceite: toBackendEnum("fuga", formData.depositoAceite),
        parabrisas: normalizeSavedValue(formData.parabrisas),
        limpiaparabrisas: normalizeSavedValue(formData.limpiaparabrisas),
        huelgo: normalizeSavedValue(formData.huelgo),
        huelgoCuanto: formData.huelgoCuanto ?? 0,
        escape: normalizeSavedValue(formData.escape),

        comentarios: formData.comentarios ?? "",
        evidencias: formData.evidencias ?? [],
      };

      console.log("Payload update evaluación:", payload);

      await api.put(`/evaluaciones/${evaluationId}`, payload);

      navigate(`/evaluaciones/${evaluationId}`);
    } catch (error) {
      console.error("Error al guardar evaluación:", error);
      console.error("Respuesta backend:", error?.message);
      console.error("Payload enviado:", payload);
      alert("No se pudo actualizar la evaluación.");
    } finally {
      setSaving(false);
    }
  };

  const formatOptionLabel = (value) => {
    if (!value) return "";
    return String(value).replace(/_/g, " ");
  };

  const renderSelect = (label, name, options = []) => {
    const currentValue = formData?.[name] ?? "";

    const mergedOptions =
      currentValue && !options.includes(currentValue)
        ? [currentValue, ...options]
        : options;

    return (
      <div className="mb-3">
        <label className="form-label fw-semibold">{label}</label>
        <select
          className="form-select"
          name={name}
          value={currentValue}
          onChange={handleChange}
        >
          <option value="" disabled>
            Selecciona una opción
          </option>

          {mergedOptions.map((op) => (
            <option key={op} value={op}>
              {formatOptionLabel(op)}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const renderNumber = (label, name) => (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>
      <input
        type="number"
        className="form-control"
        name={name}
        value={formData?.[name] ?? ""}
        onChange={handleNumberChange}
      />
    </div>
  );

  if (!formData) {
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
      <div className="container py-4" style={{ maxWidth: "980px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h3 className="mb-1 fw-bold" style={{ color: "#163A63" }}>
              Editar evaluación
            </h3>
            <p className="text-muted mb-0">
              Paso {step} de {TOTAL_STEPS}
            </p>
          </div>

          <button
            type="button"
            className="btn rounded-pill px-4"
            style={{
              border: "1px solid #D9E2EC",
              backgroundColor: "#FFFFFF",
              color: "#6B7280",
              fontWeight: 600,
            }}
            onClick={() => {
              const ok = window.confirm(
                "¿Deseas salir de la evaluación? Los cambios no guardados se perderán.",
              );
              if (ok) navigate("/vehiculos");
            }}
          >
            Salir
          </button>
        </div>

        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            {step === 1 && (
              <>
                <h5 className="mb-4">Información general</h5>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        ID Técnico
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="idTecnico"
                        value={formData.idTecnico || ""}
                        onChange={handleNumberChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Fecha de evaluación
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.fechaEvaluacion || ""}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Resultado final
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={
                          formData.resultadoFinal || formData.dictamen || ""
                        }
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h5 className="mb-4">Sistema de luces</h5>
                <div className="row">
                  <div className="col-md-6">
                    {renderSelect(
                      "Luces de gálibo",
                      "lucesGalibo",
                      OPTIONS_FUNCIONAMIENTO,
                    )}
                  </div>
                  <div className="col-md-6">
                    {renderSelect(
                      "Luces altas",
                      "lucesAltas",
                      OPTIONS_FUNCIONAMIENTO,
                    )}
                  </div>
                  <div className="col-md-6">
                    {renderSelect(
                      "Luces bajas",
                      "lucesBajas",
                      OPTIONS_FUNCIONAMIENTO,
                    )}
                  </div>
                  <div className="col-md-6">
                    {renderSelect(
                      "Luces demarcadoras delanteras",
                      "lucesDemarcadorasDelanteras",
                      OPTIONS_FUNCIONAMIENTO,
                    )}
                  </div>
                  <div className="col-md-6">
                    {renderSelect(
                      "Luces demarcadoras traseras",
                      "lucesDemarcadorasTraseras",
                      OPTIONS_FUNCIONAMIENTO,
                    )}
                  </div>
                  <div className="col-md-6">
                    {renderSelect(
                      "Luces indicadoras",
                      "lucesIndicadoras",
                      OPTIONS_FUNCIONAMIENTO,
                    )}
                  </div>
                  <div className="col-md-6">
                    {renderSelect(
                      "Faro izquierdo",
                      "faroIzquierdo",
                      OPTIONS_FUNCIONAMIENTO,
                    )}
                  </div>
                  <div className="col-md-6">
                    {renderSelect(
                      "Faro derecho",
                      "faroDerecho",
                      OPTIONS_FUNCIONAMIENTO,
                    )}
                  </div>
                  <div className="col-md-6">
                    {renderSelect(
                      "Direccionales delanteras",
                      "lucesDireccionalesDelanteras",
                      OPTIONS_FUNCIONAMIENTO,
                    )}
                  </div>
                  <div className="col-md-6">
                    {renderSelect(
                      "Direccionales traseras",
                      "lucesDireccionalesTraseras",
                      OPTIONS_FUNCIONAMIENTO,
                    )}
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h5 className="mb-4">Llantas y rines</h5>
                <div className="row">
                  {renderSelect("Rines delanteros", "llantasRinesDelanteros", [
                    "APROBADO",
                    "DERECHO_ROTO_O_SOLDADO",
                    "IZQUIERDO_ROTO_O_SOLDADO",
                    "AMBOS_ROTOS_O_SOLDADOS",
                  ])}
                  {renderSelect("Rines traseros", "llantasRinesTraseros", [
                    "APROBADO",
                    "DERECHO_ROTO_O_SOLDADO",
                    "IZQUIERDO_ROTO_O_SOLDADO",
                    "AMBOS_ROTOS_O_SOLDADOS",
                  ])}
                  {renderSelect("Masas delanteras", "llantasMasasDelanteras", [
                    "APROBADO",
                    "DERECHA_CON_FUGA",
                    "IZQUIERDA_CON_FUGA",
                    "AMBAS_CON_FUGA",
                  ])}
                  {renderSelect("Masas traseras", "llantasMasasTraseras", [
                    "APROBADO",
                    "DERECHA_CON_FUGA",
                    "IZQUIERDA_CON_FUGA",
                    "AMBAS_CON_FUGA",
                  ])}
                  
                </div>

                <h6 className="mt-3 mb-3">Presión de llantas (PSI)</h6>
                <div className="row">
                  <div className="col-md-4">
                    {renderNumber(
                      "Delantera izquierda",
                      "llantasPresionDelanteraIzquierda",
                    )}
                  </div>
                  <div className="col-md-4">
                    {renderNumber(
                      "Delantera derecha",
                      "llantasPresionDelanteraDerecha",
                    )}
                  </div>
                  <div className="col-md-4">
                    {renderNumber(
                      "Trasera izquierda 1",
                      "llantasPresionTraseraIzquierda1",
                    )}
                  </div>
                  <div className="col-md-4">
                    {renderNumber(
                      "Trasera izquierda 2",
                      "llantasPresionTraseraIzquierda2",
                    )}
                  </div>
                  <div className="col-md-4">
                    {renderNumber(
                      "Trasera derecha 1",
                      "llantasPresionTraseraDerecha1",
                    )}
                  </div>
                  <div className="col-md-4">
                    {renderNumber(
                      "Trasera derecha 2",
                      "llantasPresionTraseraDerecha2",
                    )}
                  </div>
                </div>

                <h6 className="mt-3 mb-3">Profundidad de llantas (mm)</h6>
                <div className="row">
                  <div className="col-md-4">
                    {renderNumber(
                      "Delantera izquierda",
                      "llantasProfundidadDelanteraIzquierda",
                    )}
                  </div>
                  <div className="col-md-4">
                    {renderNumber(
                      "Delantera derecha",
                      "llantasProfundidadDelanteraDerecha",
                    )}
                  </div>
                  <div className="col-md-4">
                    {renderNumber(
                      "Trasera izquierda 1",
                      "llantasProfundidadTraseraIzquierda1",
                    )}
                  </div>
                  <div className="col-md-4">
                    {renderNumber(
                      "Trasera izquierda 2",
                      "llantasProfundidadTraseraIzquierda2",
                    )}
                  </div>
                  <div className="col-md-4">
                    {renderNumber(
                      "Trasera derecha 1",
                      "llantasProfundidadTraseraDerecha1",
                    )}
                  </div>
                  <div className="col-md-4">
                    {renderNumber(
                      "Trasera derecha 2",
                      "llantasProfundidadTraseraDerecha2",
                    )}
                  </div>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h5 className="mb-4">Birlos y tuercas</h5>

                <h6 className="mb-3">Birlos</h6>
                <div className="row">
                  <div className="col-md-6">
                    {renderSelect(
                      "Birlos delantera izquierda",
                      "llantasBirlosDelanteraIzquierda",
                    )}
                  </div>
                  <div className="col-md-6">
                    {renderNumber(
                      "Cantidad faltante delantera izquierda",
                      "llantasBirlosDelanteraIzquierdaNum",
                    )}
                  </div>

                  <div className="col-md-6">
                    {renderSelect(
                      "Birlos delantera derecha",
                      "llantasBirlosDelanteraDerecha",
                    )}
                  </div>
                  <div className="col-md-6">
                    {renderNumber(
                      "Cantidad faltante delantera derecha",
                      "llantasBirlosDelanteraDerechaNum",
                    )}
                  </div>

                  <div className="col-md-6">
                    {renderSelect(
                      "Birlos trasera izquierda",
                      "llantasBirlosTraseraIzquierda",
                    )}
                  </div>
                  <div className="col-md-6">
                    {renderNumber(
                      "Cantidad faltante trasera izquierda",
                      "llantasBirlosTraseraIzquierdaNum",
                    )}
                  </div>

                  <div className="col-md-6">
                    {renderSelect(
                      "Birlos trasera derecha",
                      "llantasBirlosTraseraDerecha",
                    )}
                  </div>
                  <div className="col-md-6">
                    {renderNumber(
                      "Cantidad faltante trasera derecha",
                      "llantasBirlosTraseraDerechaNum",
                    )}
                  </div>
                </div>

                <h6 className="mb-3 mt-3">Tuercas</h6>
                <div className="row">
                  <div className="col-md-6">
                    {renderSelect(
                      "Tuercas delantera izquierda",
                      "llantasTuercasDelanteraIzquierda",
                    )}
                  </div>
                  <div className="col-md-6">
                    {renderNumber(
                      "Cantidad faltante delantera izquierda",
                      "llantasTuercasDelanteraIzquierdaNum",
                    )}
                  </div>

                  <div className="col-md-6">
                    {renderSelect(
                      "Tuercas delantera derecha",
                      "llantasTuercasDelanteraDerecha",
                    )}
                  </div>
                  <div className="col-md-6">
                    {renderNumber(
                      "Cantidad faltante delantera derecha",
                      "llantasTuercasDelanteraDerechaNum",
                    )}
                  </div>

                  <div className="col-md-6">
                    {renderSelect(
                      "Tuercas trasera izquierda",
                      "llantasTuercasTraseraIzquierda",
                    )}
                  </div>
                  <div className="col-md-6">
                    {renderNumber(
                      "Cantidad faltante trasera izquierda",
                      "llantasTuercasTraseraIzquierdaNum",
                    )}
                  </div>

                  <div className="col-md-6">
                    {renderSelect(
                      "Tuercas trasera derecha",
                      "llantasTuercasTraseraDerecha",
                    )}
                  </div>
                  <div className="col-md-6">
                    {renderNumber(
                      "Cantidad faltante trasera derecha",
                      "llantasTuercasTraseraDerechaNum",
                    )}
                  </div>
                </div>
              </>
            )}

            {step === 5 && (
              <>
                <h5 className="mb-4">Dirección y aire</h5>
                <div className="row">
                  <div className="col-md-6">
                    {renderSelect("Brazo Pitman", "brazoPitman")}
                  </div>
                  <div className="col-md-6">
                    {renderSelect(
                      "Manijas de puertas",
                      "manijasDePuertas",
                      OPTIONS_REVISION,
                    )}
                  </div>
                  <div className="col-md-6">
                    {renderSelect("Chavetas", "chavetas", OPTIONS_REVISION)}
                  </div>
                  <div className="col-md-6">
                    {renderNumber("Cantidad de chavetas", "chavetasNum")}
                  </div>

                  <div className="col-md-6">
                    {renderSelect("Compresor", "compresor")}
                  </div>
                  <div className="col-md-6">
                    {renderSelect("Tanques de aire", "tanquesDeAire")}
                  </div>
                  <div className="col-md-6">
                    {renderNumber("Tiempo de carga PSI", "tiempoDeCargaPsi")}
                  </div>
                  <div className="col-md-6">
                    {renderNumber(
                      "Tiempo de carga (segundos)",
                      "tiempoDeCargaTiempo",
                    )}
                  </div>
                </div>
              </>
            )}

            {step === 6 && (
              <>
                <h5 className="mb-4">Motor y otros sistemas</h5>
                <div className="row">
                  <div className="col-md-6">{renderSelect("Humo", "humo")}</div>
                  <div className="col-md-6">
                    {renderSelect("Gobernado", "gobernado")}
                  </div>

                  <div className="col-md-6">
                    {renderSelect(
                      "Caja de dirección",
                      "cajaDireccion",
                      OPTIONS_REVISION,
                    )}
                  </div>
                  <div className="col-md-6">
                    {renderSelect(
                      "Depósito de aceite",
                      "depositoAceite",
                      OPTIONS_REVISION,
                    )}
                  </div>
                  <div className="col-md-6">
                    {renderSelect("Parabrisas", "parabrisas")}
                  </div>
                  <div className="col-md-6">
                    {renderSelect("Limpiaparabrisas", "limpiaparabrisas")}
                  </div>
                  <div className="col-md-6">
                    {renderSelect("Huelgo", "huelgo")}
                  </div>
                  <div className="col-md-6">
                    {renderNumber("¿Cuánto huelgo?", "huelgoCuanto")}
                  </div>
                  <div className="col-md-6">
                    {renderSelect("Escape", "escape")}
                  </div>
                </div>
              </>
            )}

            {step === 7 && (
              <>
                <h5 className="mb-4">Comentarios y observaciones</h5>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Comentarios</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    name="comentarios"
                    value={formData.comentarios || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Observaciones
                  </label>
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

            {step === 8 && (
              <>
                <div className="small text-muted">
                  Evidencias actuales: {formData.evidencias?.length || 0}
                </div>
              </>
            )}
          </div>
        </div>

        <EvaluationWizardNav
          step={step}
          totalSteps={TOTAL_STEPS}
          onPrev={handlePrev}
          onNext={handleNext}
          onSave={handleSave}
        />

        {saving && <div className="mt-3 text-muted">Guardando cambios...</div>}
      </div>
    </Admin>
  );
}
