import { useState } from "react";
import Modal from "bootstrap/js/dist/modal";

export default function CreateUserModal({ onCreate }) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    rol: "Técnico",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "radio" ? value : value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const cleanedData = {
    nombre: formData.nombre.trim(),
    email: formData.email.trim(),
    rol: formData.rol.trim(),
  };

  if (!cleanedData.nombre || !cleanedData.email || !cleanedData.rol) {
    setError("Faltan campos obligatorios por llenar.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(cleanedData.email)) {
    setError("Ingresa un correo electrónico válido.");
    return;
  }

  try {
    await onCreate(cleanedData);

    const createModalElement = document.getElementById("createUserModal");
    const successModalElement = document.getElementById("createUserSuccessModal");

    if (!createModalElement || !successModalElement) return;

    const createModalInstance = Modal.getOrCreateInstance(createModalElement);
    const successModalInstance = Modal.getOrCreateInstance(successModalElement);

    createModalElement.addEventListener(
      "hidden.bs.modal",
      () => {
        setFormData({
          nombre: "",
          email: "",
          rol: "Técnico",
        });

        setError("");

        successModalInstance.show();
      },
      { once: true }
    );

    createModalInstance.hide();

  } catch (err) {
    setError(err.message);
  }
};

  return (
    <div
      className="modal fade"
      id="createUserModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Registrar Nuevo Usuario</h5>
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
                <label className="form-label">Nombre de usuario *</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej. Roberto Martínez"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="correo@empresa.com"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Tipo de usuario *</label>

                <div className="d-flex gap-4 mt-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="rol"
                      id="tecnico"
                      value="Técnico"
                      checked={formData.rol === "Técnico"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="tecnico">
                      Técnico
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="rol"
                      id="administrador"
                      value="Admin"
                      checked={formData.rol === "Admin"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="administrador">
                      Administrador
                    </label>
                  </div>
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
                Crear Usuario
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}