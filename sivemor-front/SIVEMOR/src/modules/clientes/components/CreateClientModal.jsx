import { useEffect, useState } from "react";
import Modal from "bootstrap/js/dist/modal";

const initialForm = {
  razonSocial: "",
  email: "",
  telefono: "",
  telefonoAlternativo: "",
  gestor: "",
};

export default function CreateClientModal({ onCreate }) {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    const modalElement = document.getElementById("createClientModal");
    if (!modalElement) return;

    const handleHidden = () => {
      setFormData(initialForm);
      setError("");
      setSaving(false);
    };

    modalElement.addEventListener("hidden.bs.modal", handleHidden);
    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "telefono" || name === "telefonoAlternativo") {
      newValue = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedData = {
      razonSocial: formData.razonSocial.trim(),
      email: formData.email.trim(),
      telefono: formData.telefono.trim(),
      telefonoAlternativo: formData.telefonoAlternativo.trim(),
      gestor: formData.gestor.trim(),
    };

    if (
      !cleanedData.razonSocial ||
      !cleanedData.email ||
      !cleanedData.telefono ||
      !cleanedData.gestor
    ) {
      setError("Razón social, correo, teléfono y gestor son obligatorios.");
      return;
    }

    if (!emailRegex.test(cleanedData.email)) {
      setError("El correo electrónico no tiene un formato válido.");
      return;
    }

    if (!/^\d+$/.test(cleanedData.telefono)) {
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

    try {
      setSaving(true);
      setError("");

      await onCreate(cleanedData);

      const modalElement = document.getElementById("createClientModal");
      if (!modalElement) return;

      const modalInstance = Modal.getOrCreateInstance(modalElement);
      modalInstance.hide();
    } catch (err) {
      setError(err.message || "No se pudo crear el cliente.");
    } finally {
      setSaving(false);
    }
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
                disabled={saving}
              ></button>
            </div>

            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-3">
                <label className="form-label">Razón Social *</label>
                <input
                  type="text"
                  className="form-control"
                  name="razonSocial"
                  value={formData.razonSocial}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Correo Electrónico *</label>
                <input
                  type="text"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Teléfono Principal *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    inputMode="numeric"
                    disabled={saving}
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
                    inputMode="numeric"
                    disabled={saving}
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
                  disabled={saving}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-light" onClick={handleClose} disabled={saving}>
                Cancelar
              </button>

              <button type="submit" className="btn btn-primary" disabled={saving}>
                <i className="bi bi-file-earmark-plus"></i>&nbsp;
                {saving ? "Creando..." : "Crear Cliente"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}