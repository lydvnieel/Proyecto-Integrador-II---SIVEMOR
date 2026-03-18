import { useState } from "react";

export default function CreateClientModal({ onCreate }) {
  const [formData, setFormData] = useState({
    razonSocial: "",
    correo: "",
    telefonoPrincipal: "",
    telefonoAlternativo: "",
    gestor: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);

    setFormData({
      razonSocial: "",
      correo: "",
      telefonoPrincipal: "",
      telefonoAlternativo: "",
      gestor: "",
    });
  };

  return (
    <div className="modal fade" id="createClientModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Nuevo Cliente</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Razón Social *</label>
                <input
                  type="text"
                  className="form-control"
                  name="razonSocial"
                  value={formData.razonSocial}
                  onChange={handleChange}
                  placeholder="Ej: Transportes del Norte SA de CV"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Correo Electrónico *</label>
                <input
                  type="email"
                  className="form-control"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="contacto@empresa.com.mx"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Teléfono Principal *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="telefonoPrincipal"
                    value={formData.telefonoPrincipal}
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
                    value={formData.telefonoAlternativo}
                    onChange={handleChange}
                    placeholder="81-8765-4321"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Gestor Responsable *</label>
                <input
                  type="text"
                  className="form-control"
                  name="gestor"
                  value={formData.gestor}
                  onChange={handleChange}
                  placeholder="Nombre del responsable de la oficina"
                />
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
                data-bs-target="#createClientSuccessModal"
              >
                <i className="bi bi-file-earmark-plus"></i>&nbsp;Crear Cliente
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}