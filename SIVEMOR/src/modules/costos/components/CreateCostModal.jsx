import { useState } from "react";
import Modal from "bootstrap/js/dist/modal";

const ALLOWED_MATERIAS = ["ARRASTRE", "HUMO", "GASOLINA", "MOTRIZ"];

export default function CreateCostModal({ onCreate, costos = [] }) {
  const [formData, setFormData] = useState({
    cliente: "",
    materia: "",
    costo: "",
    encargado: "",
    atiendeCobra: "",
  });

  const [error, setError] = useState("");

  const resetForm = () => {
    setFormData({
      cliente: "",
      materia: "",
      costo: "",
      encargado: "",
      atiendeCobra: "",
    });
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "materia") {
      newValue = value.toUpperCase();
    }

    if (name === "costo") {
      newValue = value.replace(/[^0-9.]/g, "");
      const parts = newValue.split(".");
      if (parts.length > 2) {
        newValue = `${parts[0]}.${parts.slice(1).join("")}`;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleaned = {
      cliente: formData.cliente.trim(),
      materia: formData.materia.trim().toUpperCase(),
      costo: String(formData.costo).trim(),
      encargado: formData.encargado.trim(),
      atiendeCobra: formData.atiendeCobra.trim(),
    };

    if (
      !cleaned.cliente ||
      !cleaned.materia ||
      !cleaned.costo ||
      !cleaned.encargado ||
      !cleaned.atiendeCobra
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (!ALLOWED_MATERIAS.includes(cleaned.materia)) {
      setError("La materia solo puede ser: ARRASTRE, HUMO, GASOLINA o MOTRIZ.");
      return;
    }

    const costoNumber = Number(cleaned.costo);
    if (Number.isNaN(costoNumber) || costoNumber <= 0) {
      setError("El costo debe ser un valor numérico positivo mayor que cero.");
      return;
    }

    const duplicated = costos.some(
      (item) =>
        String(item.cliente || "").trim().toLowerCase() === cleaned.cliente.toLowerCase() &&
        String(item.materia || "").trim().toUpperCase() === cleaned.materia
    );

    if (duplicated) {
      setError("Para este cliente ya existe un costo registrado con esa materia.");
      return;
    }

    onCreate({
      ...cleaned,
      costo: costoNumber,
    });

    const modalElement = document.getElementById("createCostModal");
    const successElement = document.getElementById("createCostSuccessModal");

    if (!modalElement || !successElement) return;

    const modalInstance = Modal.getOrCreateInstance(modalElement);
    const successInstance = Modal.getOrCreateInstance(successElement);

    modalElement.addEventListener(
      "hidden.bs.modal",
      () => {
        resetForm();
        successInstance.show();
      },
      { once: true }
    );

    modalInstance.hide();
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
                  placeholder="Ej. MOTRIZ"
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
                  placeholder="Ej. 320"
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
                  <label className="form-label">Atiende y cobra *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="atiendeCobra"
                    value={formData.atiendeCobra}
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