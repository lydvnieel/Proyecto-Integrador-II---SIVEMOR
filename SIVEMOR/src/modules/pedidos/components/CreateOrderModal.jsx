import { useEffect, useState } from "react";
import Modal from "bootstrap/js/dist/modal";

const initialForm = {
  nota: "",
  fechaEnvio: "",
  numeroGuia: "",
  recibio: "",
  foto: "",
  estatusEnvio: "PENDIENTE",
  estatusClass: "status-warning",
  comentario: "",
};

export default function CreateOrderModal({ onCreate }) {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    const modalElement = document.getElementById("createOrderModal");
    if (!modalElement) return;

    const handleHidden = () => {
      setFormData(initialForm);
      setError("");
    };

    modalElement.addEventListener("hidden.bs.modal", handleHidden);
    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedData = {
      ...formData,
      [name]: value,
    };

    if (name === "estatusEnvio") {
      if (value === "ENTREGADO") updatedData.estatusClass = "status-success";
      else if (value === "PENDIENTE") updatedData.estatusClass = "status-warning";
      else updatedData.estatusClass = "status-neutral";
    }

    setFormData(updatedData);

    if (error) setError("");
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

    if (!cleanedData.recibio) cleanedData.recibio = "-";
    if (!cleanedData.foto) cleanedData.foto = "Sin foto";

    setError("");
    onCreate(cleanedData);
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
                  placeholder="Ej. N-1004"
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
                  placeholder="Ej. GU-20260216-001"
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
                  placeholder="Ej. evidencia-004.jpg"
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
                  <option value="ENTREGADO">ENTREGADO</option>
                  <option value="ENVIADO">ENVIADO</option>
                  <option value="PENDIENTE">PENDIENTE</option>
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
                ></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-light" onClick={handleClose}>
                Cancelar
              </button>

              <button type="submit" className="btn btn-primary">
                Crear pedido
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}