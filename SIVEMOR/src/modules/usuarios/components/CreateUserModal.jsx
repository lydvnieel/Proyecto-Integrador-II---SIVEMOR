import { useState } from "react";

export default function CreateUserModal({ onCreate }) {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    verificentro: "",
    email: "",
    rol: "Técnico",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "radio" ? value : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);

    setFormData({
      nombre: "",
      telefono: "",
      verificentro: "",
      email: "",
      rol: "Técnico",
    });
  };

  return (
    <div className="modal fade" id="createUserModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Registrar Nuevo Usuario</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nombre Completo</label>
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
                <label className="form-label">Telefono</label>
                <input
                  type="text"
                  className="form-control"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Ej. 52 777 983 7362"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Verificentro</label>
                <input
                  type="text"
                  className="form-control"
                  name="verificentro"
                  value={formData.verificentro}
                  onChange={handleChange}
                  placeholder="Ej. Monterrey Norte"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Correo Electrónico</label>
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
                <label className="form-label">Cargo</label>

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
              <button type="button" className="btn btn-light" data-bs-dismiss="modal">
                Cancelar
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                data-bs-toggle="modal"
                data-bs-target="#createUserSuccessModal"
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