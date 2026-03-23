import { useState } from "react";

export default function CreateVerificentroModal({ onCreate }) {
  const [formData, setFormData] = useState({
    nombre: "",
    clave: "",
    direccion: "",
    region: "",
    responsable: "",
    telefonoPrincipal: "",
    telefonoAlternativo: "",
    correo: "",
    horario: "",
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
      nombre: "",
      clave: "",
      direccion: "",
      region: "",
      responsable: "",
      telefonoPrincipal: "",
      telefonoAlternativo: "",
      correo: "",
      horario: "",
    });
  };

  return (
    <div
      className="modal fade"
      id="createVerificentroModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Nuevo verificentro</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">CLAVE VERIFICENTRO</label>
                  <input
                    type="text"
                    className="form-control"
                    name="clave"
                    value={formData.clave}
                    onChange={handleChange}
                    placeholder="Ej VN-2024-001"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">REGIÓN</label>
                  <input
                    type="text"
                    className="form-control"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    placeholder="Ej Norte"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">NOMBRE</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej Verificentro Norte"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">DIRECCIÓN</label>
                <input
                  type="text"
                  className="form-control"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Ej Av. Insurgentes Norte #1500, Col. Lindavista, Monterrey, N.L., CP 64530"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">RESPONSABLE</label>
                <input
                  type="text"
                  className="form-control"
                  name="responsable"
                  value={formData.responsable}
                  onChange={handleChange}
                  placeholder="Ej María García López"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">TELÉFONO PRINCIPAL</label>
                  <input
                    type="text"
                    className="form-control"
                    name="telefonoPrincipal"
                    value={formData.telefonoPrincipal}
                    onChange={handleChange}
                    placeholder="Ej 81-1234-5678"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">TELÉFONO ALTERNATIVO</label>
                  <input
                    type="text"
                    className="form-control"
                    name="telefonoAlternativo"
                    value={formData.telefonoAlternativo}
                    onChange={handleChange}
                    placeholder="Ej 81-8765-4321"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">CORREO ELECTRÓNICO</label>
                <input
                  type="email"
                  className="form-control"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="Ej contacto@verificentronorte.com"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">HORARIO DE ATENCIÓN</label>
                <input
                  type="text"
                  className="form-control"
                  name="horario"
                  value={formData.horario}
                  onChange={handleChange}
                  placeholder="Ej Lunes a Viernes: 8:00 AM - 6:00 PM, Sábados: 9:00 AM - 2:00 PM"
                />
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
                data-bs-target="#createVerificentroSuccessModal"
              >
                <i className="bi bi-file-earmark-plus"></i>&nbsp;Crear Verificentro
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}