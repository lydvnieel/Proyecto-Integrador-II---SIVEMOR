import { useEffect, useState } from "react";
import Modal from "bootstrap/js/dist/modal";

export default function EditClientModal({ client, onSave }) {
  const [formData, setFormData] = useState({
    nombre: "",
    rfc: "",
    telefono: "",
    correo: "",
    direccion: "",
  });

  const [originalData, setOriginalData] = useState({
    nombre: "",
    rfc: "",
    telefono: "",
    correo: "",
    direccion: "",
  });

  const [error, setError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (client) {
      const clientData = {
        nombre: client.nombre || "",
        rfc: client.rfc || "",
        telefono: client.telefono || "",
        correo: client.correo || "",
        direccion: client.direccion || "",
      };

      setFormData(clientData);
      setOriginalData(clientData);
      setError("");
    }
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "telefono") {
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
      cleanedData.nombre === originalData.nombre.trim() &&
      cleanedData.rfc === originalData.rfc.trim() &&
      cleanedData.telefono === originalData.telefono.trim() &&
      cleanedData.correo === originalData.correo.trim() &&
      cleanedData.direccion === originalData.direccion.trim()
    );
  };

  const handleSave = (e) => {
    e.preventDefault();

    const cleanedData = {
      nombre: formData.nombre.trim(),
      rfc: formData.rfc.trim(),
      telefono: formData.telefono.trim(),
      correo: formData.correo.trim(),
      direccion: formData.direccion.trim(),
    };

    if (
      !cleanedData.nombre ||
      !cleanedData.rfc ||
      !cleanedData.telefono ||
      !cleanedData.correo ||
      !cleanedData.direccion
    ) {
      setError("Faltan campos obligatorios por llenar.");
      return;
    }

    if (cleanedData.correo && !emailRegex.test(cleanedData.correo)) {
      setError("El correo electrónico no tiene un formato válido.");
      return;
    }

    if (!/^\d+$/.test(cleanedData.telefono)) {
      setError("El teléfono solo debe contener números.");
      return;
    }

    if (isSameData(cleanedData)) {
      setError("No se realizaron cambios en el cliente.");
      return;
    }

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
          <form onSubmit={handleSave}>
            <div className="modal-header">
              <h5 className="modal-title">Editar cliente</h5>
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
                <label className="form-label">NOMBRE *</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">RFC *</label>
                <input
                  type="text"
                  className="form-control"
                  name="rfc"
                  value={formData.rfc}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">TELÉFONO *</label>
                <input
                  type="text"
                  className="form-control"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  inputMode="numeric"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">CORREO *</label>
                <input
                  type="text"
                  className="form-control"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
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