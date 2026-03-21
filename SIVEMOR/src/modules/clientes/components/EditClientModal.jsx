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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const isSameData = () => {
    return (
      formData.nombre.trim() === originalData.nombre.trim() &&
      formData.rfc.trim() === originalData.rfc.trim() &&
      formData.telefono.trim() === originalData.telefono.trim() &&
      formData.correo.trim() === originalData.correo.trim() &&
      formData.direccion.trim() === originalData.direccion.trim()
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

    if (isSameData()) {
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
                />
              </div>

              <div className="mb-3">
                <label className="form-label">CORREO *</label>
                <input
                  type="email"
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