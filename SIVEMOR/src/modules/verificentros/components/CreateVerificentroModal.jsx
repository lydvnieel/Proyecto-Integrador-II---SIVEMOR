import { useState } from "react";
import Modal from "bootstrap/js/dist/modal";

const initialForm = {
  nombre: "",
  clave: "",
  direccion: "",
  region: "",
  responsable: "",
  telefonoPrincipal: "",
  telefonoAlternativo: "",
  correo: "",
  horario: "",
};

export default function CreateVerificentroModal({ onCreate }) {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const resetForm = () => {
    setFormData(initialForm);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "telefonoPrincipal" || name === "telefonoAlternativo") {
      newValue = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (error) setError("");
  };

  const handleCreate = () => {
    const cleanedData = {
      nombre: formData.nombre.trim(),
      clave: formData.clave.trim(),
      direccion: formData.direccion.trim(),
      region: formData.region.trim(),
      responsable: formData.responsable.trim(),
      telefonoPrincipal: formData.telefonoPrincipal.trim(),
      telefonoAlternativo: formData.telefonoAlternativo.trim(),
      correo: formData.correo.trim(),
      horario: formData.horario.trim(),
    };

    if (
      !cleanedData.nombre ||
      !cleanedData.clave ||
      !cleanedData.direccion ||
      !cleanedData.region ||
      !cleanedData.responsable ||
      !cleanedData.telefonoPrincipal ||
      !cleanedData.correo ||
      !cleanedData.horario
    ) {
      setError("Faltan campos obligatorios por llenar.");
      return;
    }

    if (!/^\d+$/.test(cleanedData.telefonoPrincipal)) {
      setError("El teléfono principal solo debe contener números.");
      return;
    }

    if (
      cleanedData.telefonoAlternativo &&
      !/^\d+$/.test(cleanedData.telefonoAlternativo)
    ) {
      setError("El teléfono alternativo solo debe contener números.");
      return;
    }

    if (cleanedData.correo && !emailRegex.test(cleanedData.correo)) {
      setError("El correo electrónico no tiene un formato válido.");
      return;
    }

    onCreate(cleanedData);

    const createModalElement = document.getElementById("createVerificentroModal");
    const successModalElement = document.getElementById(
      "createVerificentroSuccessModal"
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
      id="createVerificentroModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Nuevo verificentro</h5>
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

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">CLAVE VERIFICENTRO *</label>
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
                <label className="form-label">REGIÓN *</label>
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
              <label className="form-label">NOMBRE *</label>
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
              <label className="form-label">DIRECCIÓN *</label>
              <input
                type="text"
                className="form-control"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Ej Av. Insurgentes Norte #1500"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">RESPONSABLE *</label>
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
                <label className="form-label">TELÉFONO PRINCIPAL *</label>
                <input
                  type="text"
                  className="form-control"
                  name="telefonoPrincipal"
                  value={formData.telefonoPrincipal}
                  onChange={handleChange}
                  placeholder="Ej 8112345678"
                  inputMode="numeric"
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
                  placeholder="Ej 8187654321"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">CORREO ELECTRÓNICO *</label>
              <input
                type="text"
                className="form-control"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="Ej contacto@verificentro.com"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">HORARIO DE ATENCIÓN *</label>
              <input
                type="text"
                className="form-control"
                name="horario"
                value={formData.horario}
                onChange={handleChange}
                placeholder="Ej Lunes a Viernes: 8:00 AM - 6:00 PM"
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
              type="button"
              className="btn btn-primary"
              onClick={handleCreate}
            >
              <i className="bi bi-file-earmark-plus"></i>&nbsp;Crear Verificentro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}