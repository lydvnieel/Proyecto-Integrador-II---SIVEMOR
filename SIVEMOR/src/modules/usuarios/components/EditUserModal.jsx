import { useEffect, useState } from "react";

export default function EditUserModal({ user, onSave }) {
  const [formData, setFormData] = useState(user || {});

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;
    let updatedClass = formData.estadoClass;

    if (name === "estado") {
      updatedClass = value === "Activo" ? "status-success" : "status-neutral";
    }

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
      estadoClass: updatedClass,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!user) return null;

  return (
    <div className="modal fade" id="editUserModal" tabIndex="-1" aria-hidden="true">
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

              <div className="mb-3">
                <label className="form-label">Nombre completo</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={formData.nombre || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Teléfono</label>
                <input
                  type="text"
                  className="form-control"
                  name="telefono"
                  value={formData.telefono || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tipo de usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    name="rol"
                    value={formData.rol || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Verificentro</label>
                  <input
                    type="text"
                    className="form-control"
                    name="verificentro"
                    value={formData.verificentro || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="user-extra-box">
                <div className="d-flex justify-content-between mb-3">
                  <span>Último acceso</span>
                  <strong>{formData.ultimoAcceso}</strong>
                </div>

                <div className="d-flex justify-content-between">
                  <span>ID de usuario</span>
                  <strong>{formData.id}</strong>
                </div>
              </div>

              <div className="modal-footer px-0 pb-0 mt-4">
                <button type="button" className="btn btn-light" data-bs-dismiss="modal">
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  data-bs-toggle="modal"
                  data-bs-target="#updateUserSuccessModal"
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