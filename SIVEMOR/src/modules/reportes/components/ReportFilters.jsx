import { useState } from "react";

export default function ReportFilters({ onGenerate, onDownload, currentData }) {
  const [form, setForm] = useState({
    tipo: "cliente",
    cliente: "",
    region: "",
    nota: "",
    tipoVerificacion: "",
    estadoDictamen: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="form-grid-2">

         <div className="form-field">
          <label>Cliente</label>
          <input
            type="text"
            name="cliente"
            value={form.cliente}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label>Región</label>
          <input
            type="text"
            name="region"
            value={form.region}
            onChange={handleChange}
          />
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
          <input
            type="text"
            name="tipoVerificacion"
            value={form.tipoVerificacion}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label>Estado del dictamen</label>
          <input
            type="text"
            name="estadoDictamen"
            value={form.estadoDictamen}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label>Nota</label>
          <input
            type="text"
            name="nota"
            value={form.nota}
            onChange={handleChange}
          />
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
          onClick={() => onGenerate(form)}
        >
          <i className="bi bi-file-earmark-pdf"></i>
          Generar Reporte PDF
        </button>

        <button
          className="outline-btn"
          type="button"
          onClick={() => onDownload()}
          disabled={!currentData || currentData.length === 0}
        >
          <i className="bi bi-download"></i>
          Descargar PDF
        </button>
      </div>
    </>
  );
}