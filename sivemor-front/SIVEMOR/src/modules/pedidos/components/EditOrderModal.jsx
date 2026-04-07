import { useEffect, useState } from "react";
import Modal from "bootstrap/js/dist/modal";

const STATUS_OPTIONS = ["PENDIENTE", "ENVIADO", "ENTREGADO", "INCIDENCIA"];

export default function EditOrderModal({ order, onSave }) {
  const [formData, setFormData] = useState({
    id: null,
    nota: "",
    fechaEnvio: "",
    numeroGuia: "",
    recibio: "",
    foto: "",
    fotoBase64: null,
    fotoNombreArchivo: "",
    fotoMimeType: "",
    clearFoto: false,
    estatusEnvio: "PENDIENTE",
    estatusClass: "status-warning",
    comentario: "",
  });

  const [originalData, setOriginalData] = useState({
    id: null,
    nota: "",
    fechaEnvio: "",
    numeroGuia: "",
    recibio: "",
    foto: "",
    estatusEnvio: "PENDIENTE",
    comentario: "",
  });

  const [error, setError] = useState("");

  const getStatusClass = (status) => {
    if (status === "ENTREGADO") return "status-success";
    if (status === "PENDIENTE") return "status-warning";
    return "status-neutral";
  };

  useEffect(() => {
    if (order) {
      const orderData = {
        id: order.id,
        nota: order.nota || "",
        fechaEnvio: order.fechaEnvio || "",
        numeroGuia: order.numeroGuia || "",
        recibio: order.recibio || "",
        foto: order.foto || "",
        fotoBase64: null,
        fotoNombreArchivo: "",
        fotoMimeType: "",
        clearFoto: false,
        estatusEnvio: (order.estatusEnvio || "PENDIENTE").toUpperCase(),
        estatusClass: order.estatusClass || "status-warning",
        comentario: order.comentario || "",
      };

      setFormData(orderData);
      setOriginalData(orderData);
      setError("");
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updated = {
      ...formData,
      [name]: value,
    };

    if (name === "estatusEnvio") {
      updated.estatusClass = getStatusClass(value);
    }

    setFormData(updated);

    if (error) setError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setFormData((prev) => ({
        ...prev,
        fotoBase64: null,
        fotoNombreArchivo: "",
        fotoMimeType: "",
        clearFoto: false,
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
        clearFoto: false,
      }));
    };
    reader.readAsDataURL(file);

    if (error) setError("");
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      foto: "",
      fotoBase64: "",
      fotoNombreArchivo: "",
      fotoMimeType: "",
      clearFoto: true,
    }));
  };

  const isSameData = (cleanedData) => {
    return (
      cleanedData.fechaEnvio === originalData.fechaEnvio.trim() &&
      cleanedData.numeroGuia === originalData.numeroGuia.trim() &&
      cleanedData.recibio === originalData.recibio.trim() &&
      cleanedData.estatusEnvio === originalData.estatusEnvio &&
      cleanedData.comentario === originalData.comentario.trim() &&
      !cleanedData.fotoBase64 &&
      !cleanedData.clearFoto
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedData = {
      ...formData,
      fechaEnvio: formData.fechaEnvio.trim(),
      numeroGuia: formData.numeroGuia.trim(),
      recibio: formData.recibio.trim(),
      estatusEnvio: formData.estatusEnvio.trim().toUpperCase(),
      comentario: formData.comentario.trim(),
    };

    if (!cleanedData.estatusEnvio) {
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

    if (isSameData(cleanedData)) {
      setError("No se realizaron cambios en el pedido.");
      return;
    }

    try {
      await onSave(cleanedData);
    } catch (err) {
      setError(err.message || "No se pudo actualizar el pedido.");
    }
  };

  const handleClose = () => {
    const modalElement = document.getElementById("editOrderModal");
    if (!modalElement) return;

    const modalInstance = Modal.getOrCreateInstance(modalElement);
    modalInstance.hide();
  };

  if (!order) return null;

  return (
    <div
      className="modal fade"
      id="editOrderModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Editar Pedido</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
              ></button>
            </div>

            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Nota</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.nota}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Fecha de envío</label>
                <input
                  type="date"
                  className="form-control"
                  name="fechaEnvio"
                  value={formData.fechaEnvio}
                  onChange={handleChange}
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
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Foto</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {(formData.foto || formData.fotoNombreArchivo) && (
                  <div className="mt-2 d-flex gap-2 align-items-center">
                    <small className="text-muted">
                      {formData.fotoNombreArchivo || formData.foto}
                    </small>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={handleRemovePhoto}
                    >
                      Quitar foto
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Estatus de envío *</label>
                <select
                  className="form-control"
                  name="estatusEnvio"
                  value={formData.estatusEnvio}
                  onChange={handleChange}
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
                ></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-light" onClick={handleClose}>
                Cancelar
              </button>

              <button type="submit" className="btn btn-primary">
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}