import { useEffect, useState } from "react";
import Modal from "bootstrap/js/dist/modal";

const STATUS_OPTIONS = ["PENDIENTE", "ENVIADO", "ENTREGADO", "INCIDENCIA"];

const initialForm = {
  idNota: "",
  fechaEnvio: "",
  numeroGuia: "",
  recibio: "",
  fotoBase64: "",
  fotoNombreArchivo: "",
  fotoMimeType: "",
  estatusEnvio: "PENDIENTE",
  estatusClass: "status-warning",
  comentario: "",
};

export default function CreateOrderModal({ onCreate, notas = [] }) {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const modalElement = document.getElementById("createOrderModal");
    if (!modalElement) return;

    const handleHidden = () => {
      setFormData(initialForm);
      setError("");
      setSaving(false);
    };

    modalElement.addEventListener("hidden.bs.modal", handleHidden);
    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, []);

  const getStatusClass = (status) => {
    if (status === "ENTREGADO") return "status-success";
    if (status === "PENDIENTE") return "status-warning";
    return "status-neutral";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedData = {
      ...formData,
      [name]: value,
    };

    if (name === "estatusEnvio") {
      updatedData.estatusClass = getStatusClass(value);
    }

    setFormData(updatedData);

    if (error) setError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setFormData((prev) => ({
        ...prev,
        fotoBase64: "",
        fotoNombreArchivo: "",
        fotoMimeType: "",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result || "";
      const base64 = String(result).includes(",")
        ? String(result).split(",")[1]
        : "";

      setFormData((prev) => ({
        ...prev,
        fotoBase64: base64,
        fotoNombreArchivo: file.name,
        fotoMimeType: file.type,
      }));
    };
    reader.readAsDataURL(file);

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedData = {
      ...formData,
      idNota: formData.idNota,
      fechaEnvio: formData.fechaEnvio.trim(),
      numeroGuia: formData.numeroGuia.trim(),
      recibio: formData.recibio.trim(),
      estatusEnvio: formData.estatusEnvio.trim().toUpperCase(),
      comentario: formData.comentario.trim(),
    };

    if (!cleanedData.idNota || !cleanedData.estatusEnvio) {
      setError("Faltan campos obligatorios por llenar.");
      return;
    }

    if (!STATUS_OPTIONS.includes(cleanedData.estatusEnvio)) {
      setError(
        "El estatus de envío no es válido. Valores permitidos: PENDIENTE, ENVIADO, ENTREGADO, INCIDENCIA."
      );
      return;
    }

    if (
      cleanedData.estatusEnvio === "ENVIADO" &&
      !cleanedData.numeroGuia
    ) {
      setError("El número de guía es obligatorio cuando el estatus es ENVIADO.");
      return;
    }

    if (
      cleanedData.estatusEnvio === "ENTREGADO" &&
      !cleanedData.recibio
    ) {
      setError("La persona que recibió es obligatoria cuando el estatus es ENTREGADO.");
      return;
    }

    cleanedData.estatusClass = getStatusClass(cleanedData.estatusEnvio);

    try {
      setSaving(true);
      await onCreate(cleanedData);
    } catch (err) {
      setError(err.message || "No se pudo crear el pedido.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    const modalElement = document.getElementById("createOrderModal");
    if (!modalElement) return;

    const modalInstance = Modal.getOrCreateInstance(modalElement);
    modalInstance.hide();
  };

  return (
    <div
      className="modal fade"
      id="createOrderModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Nuevo Pedido</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                disabled={saving}
              ></button>
            </div>

            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Nota *</label>
                <select
                  className="form-control"
                  name="idNota"
                  value={formData.idNota}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="">Selecciona una nota</option>
                  {notas.map((nota) => (
                    <option
                      key={nota.id ?? nota.idNota}
                      value={nota.id ?? nota.idNota}
                    >
                      {nota.folioNota ?? nota.nota ?? `Nota ${nota.id ?? nota.idNota}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Fecha de envío</label>
                <input
                  type="date"
                  className="form-control"
                  name="fechaEnvio"
                  value={formData.fechaEnvio}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Número de guía</label>
                <input
                  type="text"
                  className="form-control"
                  name="numeroGuia"
                  value={formData.numeroGuia}
                  onChange={handleChange}
                  placeholder="Ej. GU-20260216-001"
                  disabled={saving}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Recibió</label>
                <input
                  type="text"
                  className="form-control"
                  name="recibio"
                  value={formData.recibio}
                  onChange={handleChange}
                  placeholder="Ej. Carlos Mendoza"
                  disabled={saving}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Foto</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={saving}
                />
                {formData.fotoNombreArchivo && (
                  <small className="text-muted">{formData.fotoNombreArchivo}</small>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Estatus de envío *</label>
                <select
                  className="form-control"
                  name="estatusEnvio"
                  value={formData.estatusEnvio}
                  onChange={handleChange}
                  disabled={saving}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Comentario</label>
                <textarea
                  className="form-control"
                  rows="2"
                  name="comentario"
                  value={formData.comentario}
                  onChange={handleChange}
                  placeholder="Ingresa un comentario opcional"
                  disabled={saving}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-light" onClick={handleClose} disabled={saving}>
                Cancelar
              </button>

              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Creando..." : "Crear pedido"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}