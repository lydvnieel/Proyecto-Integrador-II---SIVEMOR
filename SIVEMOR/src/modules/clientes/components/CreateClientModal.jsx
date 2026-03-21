import { useEffect, useState } from "react";
import Modal from "bootstrap/js/dist/modal";

const initialForm = {
  razonSocial: "",
  correo: "",
  telefonoPrincipal: "",
  telefonoAlternativo: "",
  gestor: "",
};

export default function CreateClientModal({ onCreate }) {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    const modalElement = document.getElementById("createClientModal");
    if (!modalElement) return;

    const handleHidden = () => {
      setFormData(initialForm);
      setError("");
    };

    modalElement.addEventListener("hidden.bs.modal", handleHidden);
    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanedData = {
      razonSocial: formData.razonSocial.trim(),
      correo: formData.correo.trim(),
      telefonoPrincipal: formData.telefonoPrincipal.trim(),
      telefonoAlternativo: formData.telefonoAlternativo.trim(),
      gestor: formData.gestor.trim(),
    };

    if (
      !cleanedData.razonSocial ||
      !cleanedData.correo ||
      !cleanedData.telefonoPrincipal ||
      !cleanedData.telefonoAlternativo ||
      !cleanedData.gestor
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setError("");
    onCreate(cleanedData);
  };

  const handleClose = () => {
    const modalElement = document.getElementById("createClientModal");
    if (!modalElement) return;

    const modalInstance = Modal.getOrCreateInstance(modalElement);
    modalInstance.hide();
  };

  return (
    <div
      className="modal fade"
      id="createClientModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Nuevo Cliente</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
              ></button>
            </div>

            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

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
                  <label className="form-label">Teléfono Alternativo *</label>
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
              <button
                type="button"
                className="btn btn-light"
                onClick={handleClose}
              >
                Cancelar
              </button>

              <button type="submit" className="btn btn-primary">
                <i className="bi bi-file-earmark-plus"></i>&nbsp;Crear Cliente
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}