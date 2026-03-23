import { useEffect, useState } from "react";

export default function EditOrderModal({ order, onSave }) {
  const [formData, setFormData] = useState(order || {});

  useEffect(() => {
    if (order) {
      setFormData(order);
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updated = {
      ...formData,
      [name]: value,
    };

    if (name === "estatusEnvio") {
      if (value === "ENTREGADO") updated.estatusClass = "status-success";
      else if (value === "PENDIENTE") updated.estatusClass = "status-warning";
      else updated.estatusClass = "status-neutral";
    }

    setFormData(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!order) return null;

  return (
    <div
      className="modal fade"
      id="editOrderModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Editar Pedido</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Fecha de envío</label>
                <input
                  type="text"
                  className="form-control"
                  name="fechaEnvio"
                  value={formData.fechaEnvio || ""}
                  onChange={handleChange}
                  placeholder="Ej. 29-03-2026"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Número de guía</label>
                <input
                  type="text"
                  className="form-control"
                  name="numeroGuia"
                  value={formData.numeroGuia || ""}
                  onChange={handleChange}
                  placeholder="Ej. GU-20260216-001"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Recibio</label>
                <input
                  type="text"
                  className="form-control"
                  name="recibio"
                  value={formData.recibio || ""}
                  onChange={handleChange}
                  placeholder="Ej. Carlos Mendoza"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Foto</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    name="foto"
                    value={formData.foto || ""}
                    onChange={handleChange}
                    placeholder="Pulsa en el icono para tomar una foto"
                  />
                  <span className="input-group-text">
                    <i className="bi bi-camera"></i>
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Estatus de envio</label>
                <select
                  className="form-control"
                  name="estatusEnvio"
                  value={formData.estatusEnvio || "PENDIENTE"}
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
                  value={formData.comentario || ""}
                  onChange={handleChange}
                  placeholder="Ingresa un comentario opcional"
                ></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                data-bs-toggle="modal"
                data-bs-target="#updateOrderSuccessModal"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}