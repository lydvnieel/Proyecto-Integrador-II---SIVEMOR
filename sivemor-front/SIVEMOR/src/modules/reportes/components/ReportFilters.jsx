import { useEffect, useState } from "react";

export default function ReportFilters({
  onGenerate,
  onDownload,
  currentData,
  isGenerating,
  options,
}) {
  const [form, setForm] = useState({
    tipo: "cliente",
    clienteId: "",
    regionId: "",
    notaId: "",
    tipoVerificacion: "",
    estadoDictamen: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log("CAMBIO:", name, value);

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      console.log("FORM ACTUALIZADO:", updated);
      return updated;
    });
  };

  useEffect(() => {
    console.log("FORM EN RENDER:", form);
  }, [form]);

  return (
    <>
      <div className="form-grid-2">
        <div className="form-field">
          <label>Cliente</label>
          <select name="clienteId" value={form.clienteId} onChange={handleChange}>
            <option value="">Todos</option>
            {options?.clientes?.map((cliente) => (
              <option key={cliente.id} value={String(cliente.id)}>
                {cliente.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Región</label>
          <select name="regionId" value={form.regionId} onChange={handleChange}>
            <option value="">Todas</option>
            {options?.regiones?.map((region) => (
              <option key={region.id} value={String(region.id)}>
                {region.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Tipo de reporte</label>
          <select name="tipo" value={form.tipo} onChange={handleChange}>
            <option value="cliente">Por cliente</option>
            <option value="region">Por región</option>
            <option value="nota">Por nota</option>
          </select>
        </div>

        <div className="form-field">
          <label>Tipo de verificación</label>
          <select
            name="tipoVerificacion"
            value={form.tipoVerificacion}
            onChange={handleChange}
          >
            <option value="">Todos</option>
            {options?.tiposVerificacion?.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Estado del dictamen</label>
          <select
            name="estadoDictamen"
            value={form.estadoDictamen}
            onChange={handleChange}
          >
            <option value="">Todos</option>
            {options?.dictamenes?.map((dictamen) => (
              <option key={dictamen} value={dictamen}>
                {dictamen}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Nota</label>
          <select name="notaId" value={form.notaId} onChange={handleChange}>
            <option value="">Todas</option>
            {options?.notas?.map((nota) => (
              <option key={nota.id} value={String(nota.id)}>
                {nota.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Fecha inicio</label>
          <input
            type="date"
            name="fechaInicio"
            value={form.fechaInicio}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label>Fecha fin</label>
          <input
            type="date"
            name="fechaFin"
            value={form.fechaFin}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="report-submit d-flex gap-2 flex-wrap">
        <button
          className="primary-btn"
          type="button"
          onClick={() => {
            console.log("ENVIANDO FORM:", form);
            onGenerate(form, true);
          }}
          disabled={isGenerating}
        >
          <i className="bi bi-file-earmark-pdf"></i>
          {isGenerating ? "Generando PDF..." : "Generar Reporte PDF"}
        </button>

        <button
          className="outline-btn"
          type="button"
          onClick={() => onDownload()}
          disabled={!currentData || currentData.length === 0 || isGenerating}
        >
          <i className="bi bi-download"></i>
          Descargar PDF
        </button>
      </div>
    </>
  );
}