import { useEffect, useState } from "react";
import Modal from "bootstrap/js/dist/modal";

const initialForm = {
  razonSocial: "",
  email: "",
  telefono: "",
  telefonoAlternativo: "",
  gestor: "",
};

export default function EditClientModal({ client, onSave }) {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (client) {
      setFormData({
        razonSocial: client.razonSocial || "",
        email: client.email || "",
        telefono: client.telefono || "",
        telefonoAlternativo: client.telefonoAlternativo || "",
        gestor: client.gestor || "",
      });
      setError("");
    }
  }, [client]);

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

  const isSameData = (cleanedData) => {
  return (
    cleanedData.razonSocial === String(client?.razonSocial || "").trim() &&
    cleanedData.email === String(client?.email || "").trim() &&
    cleanedData.telefono === String(client?.telefono || "").trim() &&
    cleanedData.telefonoAlternativo === String(client?.telefonoAlternativo || "").trim() &&
    cleanedData.gestor === String(client?.gestor || "").trim()
  );
};

  const handleSubmit = (e) => {
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

  if (
    cleanedData.razonSocial === String(client?.razonSocial || "").trim() &&
    cleanedData.email === String(client?.email || "").trim() &&
    cleanedData.telefono === String(client?.telefono || "").trim() &&
    cleanedData.telefonoAlternativo === String(client?.telefonoAlternativo || "").trim() &&
    cleanedData.gestor === String(client?.gestor || "").trim()
  ) {
    setError("No se realizaron cambios en el cliente.");
    return;
  }

  setError("");
  onSave(cleanedData);
};

  const handleClose = () => {
    const modalElement = document.getElementById("editClientModal");
    if (!modalElement) return;
    const modalInstance = Modal.getOrCreateInstance(modalElement);
    modalInstance.hide();
  };

  if (!client) return null;

  return (
    <div
      className="modal fade"
      id="editClientModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Editar Cliente</h5>
              <button type="button" className="btn-close" onClick={handleClose}></button>
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
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-light" onClick={handleClose}>
                Cancelar
              </button>

              <button type="submit" className="btn btn-primary">
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}