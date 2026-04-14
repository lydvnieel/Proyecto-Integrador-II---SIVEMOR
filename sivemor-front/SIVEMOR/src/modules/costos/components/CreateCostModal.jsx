import { useState } from "react";
import Modal from "bootstrap/js/dist/modal";

const ALLOWED_MATERIAS = ["ARRASTRE", "HUMO", "GASOLINA", "MOTRIZ"];

export default function CreateCostModal({ onCreate, costos = [], clientes = [], usuarios = [] }) {
  const [formData, setFormData] = useState({
    idCliente: "",
    materia: "",
    costo: "",
    encargado: "",
    atiendeYCobra: "",
  });

  const [error, setError] = useState("");

  const resetForm = () => {
    setFormData({
      idCliente: "",
      materia: "",
      costo: "",
      encargado: "",
      atiendeYCobra: "",
    });
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "costo") {
      newValue = value.replace(/[^0-9.]/g, "");
      const parts = newValue.split(".");
      if (parts.length > 2) {
        newValue = `${parts[0]}.${parts.slice(1).join("")}`;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleaned = {
      idCliente: formData.idCliente,
      materia: formData.materia,
      costo: String(formData.costo).trim(),
      encargado: formData.encargado,
      atiendeYCobra: formData.atiendeYCobra,
    };

    if (
      !cleaned.idCliente ||
      !cleaned.materia ||
      !cleaned.costo ||
      !cleaned.encargado ||
      !cleaned.atiendeYCobra
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const costoNumber = Number(cleaned.costo);
    if (Number.isNaN(costoNumber) || costoNumber <= 0) {
      setError("El costo debe ser un valor numérico positivo mayor que cero.");
      return;
    }

    const duplicated = costos.some(
      (item) =>
        Number(item.idCliente) === Number(cleaned.idCliente) &&
        String(item.materia || "").trim().toUpperCase() === cleaned.materia
    );

    if (duplicated) {
      setError("Para este cliente ya existe un costo registrado con esa materia.");
      return;
    }

    onCreate({ ...cleaned, costo: costoNumber });

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
                onClick={resetForm}
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
                <select
                  className="form-select"
                  name="idCliente"
                  value={formData.idCliente}
                  onChange={handleChange}
                >
                  <option value="">Selecciona un cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.razonSocial}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Materia *</label>
                <select
                  className="form-select"
                  name="materia"
                  value={formData.materia}
                  onChange={handleChange}
                >
                  <option value="">Selecciona una materia</option>
                  {ALLOWED_MATERIAS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
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
                  <select
                    className="form-select"
                    name="encargado"
                    value={formData.encargado}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona un usuario</option>
                    {usuarios.map((usuario) => (
                      <option key={usuario.id} value={usuario.id}>
                        {usuario.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Atiende y cobra *</label>
                  <select
                    className="form-select"
                    name="atiendeYCobra"
                    value={formData.atiendeYCobra}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona un usuario</option>
                    {usuarios.map((usuario) => (
                      <option key={usuario.id} value={usuario.id}>
                        {usuario.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light"
                data-bs-dismiss="modal"
                onClick={resetForm}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Crear costo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}