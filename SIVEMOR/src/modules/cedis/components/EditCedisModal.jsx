import { useEffect, useState } from "react";

export default function EditCedisModal({ cedis, onSave }) {
  const [formData, setFormData] = useState(cedis || {});

  useEffect(() => {
    if (cedis) {
      setFormData(cedis);
    }
  }, [cedis]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!cedis) return null;

  return (
    <div className="modal fade" id="editCedisModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Editar CEDIS</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nombre del CEDIS *</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={formData.nombre || ""}
                  onChange={handleChange}
                  placeholder="Ej: CEDIS Monterrey Norte"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Dirección Completa *</label>
                <textarea
                  className="form-control"
                  rows="2"
                  name="direccion"
                  value={formData.direccion || ""}
                  onChange={handleChange}
                  placeholder="Calle, número, colonia, ciudad, estado"
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">Encargado *</label>
                <input
                  type="text"
                  className="form-control"
                  name="encargado"
                  value={formData.encargado || ""}
                  onChange={handleChange}
                  placeholder="Nombre completo"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Correo Electrónico *</label>
                <input
                  type="email"
                  className="form-control"
                  name="correo"
                  value={formData.correo || ""}
                  onChange={handleChange}
                  placeholder="contacto@empresa.com"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Teléfono Principal *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="telefonoPrincipal"
                    value={formData.telefonoPrincipal || ""}
                    onChange={handleChange}
                    placeholder="81-1234-5678"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Teléfono Alternativo</label>
                  <input
                    type="text"
                    className="form-control"
                    name="telefonoAlternativo"
                    value={formData.telefonoAlternativo || ""}
                    onChange={handleChange}
                    placeholder="81-8765-4321"
                  />
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
                data-bs-target="#updateCedisSuccessModal"
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