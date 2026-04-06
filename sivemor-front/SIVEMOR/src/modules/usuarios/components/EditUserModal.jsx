import { useEffect, useState } from "react";
import Modal from "bootstrap/js/dist/modal";

export default function EditUserModal({ user, onSave }) {
  const [formData, setFormData] = useState(user || {});
  const [originalData, setOriginalData] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData(user);
      setOriginalData(user);
      setError("");
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedClass = formData.estadoClass;

    if (name === "estado") {
      updatedClass = value === "Activo" ? "status-success" : "status-neutral";
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      estadoClass: updatedClass,
    }));

    if (error) {
      setError("");
    }
  };

  const isSameData = (cleanedData) => {
    return (
      cleanedData.nombre === String(originalData.nombre || "").trim() &&
      cleanedData.email === String(originalData.email || "").trim() &&
      cleanedData.rol === String(originalData.rol || "").trim() &&
      cleanedData.estado === String(originalData.estado || "").trim()
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanedData = {
      ...formData,
      nombre: String(formData.nombre || "").trim(),
      email: String(formData.email || "").trim(),
      rol: String(formData.rol || "").trim(),
      estado: String(formData.estado || "").trim(),
    };

    if (
      !cleanedData.nombre ||
      !cleanedData.email ||
      !cleanedData.rol ||
      !cleanedData.estado
    ) {
      setError("Faltan campos obligatorios por llenar.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanedData.email)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    if (isSameData(cleanedData)) {
      setError("No se realizaron cambios en el usuario.");
      return;
    }

    onSave(cleanedData);

    const editModalElement = document.getElementById("editUserModal");
    const successModalElement = document.getElementById("updateUserSuccessModal");

    if (!editModalElement || !successModalElement) return;

    const editModalInstance = Modal.getOrCreateInstance(editModalElement);
    const successModalInstance = Modal.getOrCreateInstance(successModalElement);

    editModalElement.addEventListener(
      "hidden.bs.modal",
      () => {
        setError("");
        successModalInstance.show();
      },
      { once: true }
    );

    editModalInstance.hide();
  };

  if (!user) return null;

  return (
    <div
      className="modal fade"
      id="editUserModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="user-avatar"
                    style={{ backgroundColor: formData.color }}
                  >
                    {formData.iniciales}
                  </div>

                  <div>
                    <h4 className="mb-0">{formData.nombre}</h4>
                    <p className="text-muted mb-0">{formData.email}</p>
                  </div>
                </div>

                <div style={{ minWidth: "170px" }}>
                  <label className="form-label">Estado</label>
                  <select
                    className="form-control"
                    name="estado"
                    value={formData.estado || "Activo"}
                    onChange={handleChange}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Nombre de usuario</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={formData.nombre || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Tipo de usuario</label>
                <input
                  type="text"
                  className="form-control"
                  name="rol"
                  value={formData.rol || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="user-extra-box">
                <div className="d-flex justify-content-between mb-3">
                  <span>Último acceso</span>
                  <strong>{formData.ultimoAcceso}</strong>
                </div>
              </div>

              <div className="modal-footer px-0 pb-0 mt-4">
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
                  Guardar cambios
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}