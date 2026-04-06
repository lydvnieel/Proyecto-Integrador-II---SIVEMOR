import { useState } from "react";
import Modal from "bootstrap/js/dist/modal";

export default function CreateCostModal() {
  const [formData, setFormData] = useState({
    cliente: "",
    materia: "",
    costo: "",
    encargado: "",
    atiende: "",
  });

  const [error, setError] = useState("");

  const resetForm = () => {
    setFormData({
      cliente: "",
      materia: "",
      costo: "",
      encargado: "",
      atiende: "",
    });
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanedData = {
      cliente: formData.cliente.trim(),
      materia: formData.materia.trim(),
      costo: formData.costo.trim(),
      encargado: formData.encargado.trim(),
      atiende: formData.atiende.trim(),
    };

    if (
      !cleanedData.cliente ||
      !cleanedData.materia ||
      !cleanedData.costo ||
      !cleanedData.encargado
    ) {
      setError("Faltan campos obligatorios por llenar.");
      return;
    }

    const createModalElement = document.getElementById("createCostModal");
    const successModalElement = document.getElementById("createCostSuccessModal");

    if (!createModalElement || !successModalElement) return;

    const createModalInstance = Modal.getOrCreateInstance(createModalElement);
    const successModalInstance = Modal.getOrCreateInstance(successModalElement);

    createModalElement.addEventListener(
      "hidden.bs.modal",
      () => {
        resetForm();
        successModalInstance.show();
      },
      { once: true }
    );

    createModalInstance.hide();
  };

  return (
    <div
      className="modal fade"
      id="createCostModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Nuevo costo</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Cliente *</label>
                <input
                  type="text"
                  className="form-control"
                  name="cliente"
                  value={formData.cliente}
                  onChange={handleChange}
                  placeholder="Ej: Pedro Cabrera"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Materia *</label>
                <input
                  type="text"
                  className="form-control"
                  name="materia"
                  value={formData.materia}
                  onChange={handleChange}
                  placeholder="Ej. Motriz"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Costo *</label>
                <input
                  type="text"
                  className="form-control"
                  name="costo"
                  value={formData.costo}
                  onChange={handleChange}
                  placeholder="Ej. $320"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Encargado *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="encargado"
                    value={formData.encargado}
                    onChange={handleChange}
                    placeholder="Ej. Renato Baez"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Atiende y cobra</label>
                  <input
                    type="text"
                    className="form-control"
                    name="atiende"
                    value={formData.atiende}
                    onChange={handleChange}
                    placeholder="Ej. Juan Carlos"
                  />
                </div>
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
              >
                Crear costo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}