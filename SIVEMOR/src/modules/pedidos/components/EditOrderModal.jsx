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
    estatusClass: "status-warning",
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

  const isSameData = (cleanedData) => {
    return (
      cleanedData.nota === originalData.nota.trim() &&
      cleanedData.fechaEnvio === originalData.fechaEnvio.trim() &&
      cleanedData.numeroGuia === originalData.numeroGuia.trim() &&
      cleanedData.recibio === originalData.recibio.trim() &&
      cleanedData.foto === originalData.foto.trim() &&
      cleanedData.estatusEnvio === originalData.estatusEnvio &&
      cleanedData.comentario === originalData.comentario.trim()
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanedData = {
      ...formData,
      nota: formData.nota.trim(),
      fechaEnvio: formData.fechaEnvio.trim(),
      numeroGuia: formData.numeroGuia.trim(),
      recibio: formData.recibio.trim(),
      foto: formData.foto.trim(),
      estatusEnvio: formData.estatusEnvio.trim().toUpperCase(),
      comentario: formData.comentario.trim(),
    };

    if (
      !cleanedData.nota ||
      !cleanedData.fechaEnvio ||
      !cleanedData.numeroGuia ||
      !cleanedData.estatusEnvio
    ) {
      setError("Faltan campos obligatorios por llenar.");
      return;
    }

    if (!STATUS_OPTIONS.includes(cleanedData.estatusEnvio)) {
      setError(
        "El estatus de envío no es válido. Valores permitidos: PENDIENTE, ENVIADO, ENTREGADO, INCIDENCIA."
      );
      return;
    }

    cleanedData.estatusClass = getStatusClass(cleanedData.estatusEnvio);

    if (!cleanedData.recibio) cleanedData.recibio = "-";
    if (!cleanedData.foto) cleanedData.foto = "Sin foto";

    if (isSameData(cleanedData)) {
      setError("No se realizaron cambios en el pedido.");
      return;
    }

    onSave(cleanedData);
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
                <label className="form-label">Nota *</label>
                <input
                  type="text"
                  className="form-control"
                  name="nota"
                  value={formData.nota}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Fecha de envío *</label>
                <input
                  type="date"
                  className="form-control"
                  name="fechaEnvio"
                  value={formData.fechaEnvio}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Número de guía *</label>
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
                  type="text"
                  className="form-control"
                  name="foto"
                  value={formData.foto}
                  onChange={handleChange}
                />
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