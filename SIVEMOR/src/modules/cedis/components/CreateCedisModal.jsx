import { useState } from "react";
import Modal from "bootstrap/js/dist/modal";

export default function CreateCedisModal({ onCreate }) {
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    encargado: "",
    correo: "",
    telefonoPrincipal: "",
    telefonoAlternativo: "",
  });

  const [error, setError] = useState("");

  const resetForm = () => {
    setFormData({
      nombre: "",
      direccion: "",
      encargado: "",
      correo: "",
      telefonoPrincipal: "",
      telefonoAlternativo: "",
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

  const handleCreate = () => {
    const cleanedData = {
      nombre: formData.nombre.trim(),
      direccion: formData.direccion.trim(),
      encargado: formData.encargado.trim(),
      correo: formData.correo.trim(),
      telefonoPrincipal: formData.telefonoPrincipal.trim(),
      telefonoAlternativo: formData.telefonoAlternativo.trim(),
    };

    if (
      !cleanedData.nombre ||
      !cleanedData.direccion ||
      !cleanedData.encargado ||
      !cleanedData.correo ||
      !cleanedData.telefonoPrincipal
    ) {
      setError("Faltan campos por llenar");
      return;
    }

    onCreate(cleanedData);

    const createModalElement = document.getElementById("createCedisModal");
    const successModalElement = document.getElementById(
      "createCedisSuccessModal"
    );

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
      id="createCedisModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Nuevo CEDIS</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div className="modal-body">
            {error && (
              <div className="alert alert-danger mt-3 mb-0" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-3">
                <label className="form-label">Nombre del CEDIS *</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={formData.nombre}
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
                  value={formData.direccion}
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
                  value={formData.encargado}
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
                  value={formData.correo}
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
            </form>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-light" data-bs-dismiss="modal">
              Cancelar
            </button>

            <button type="button" className="btn btn-primary" onClick={handleCreate}>
              <i className="bi bi-file-earmark-plus"></i>&nbsp;Crear CEDIS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}