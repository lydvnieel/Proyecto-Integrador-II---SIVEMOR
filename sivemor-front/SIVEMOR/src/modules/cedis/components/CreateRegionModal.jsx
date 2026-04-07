import { useState } from "react";
import Modal from "bootstrap/js/dist/modal";

export default function CreateRegionModal({ onCreate }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");

  const resetForm = () => {
    setNombre("");
    setDescripcion("");
    setError("");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const cleanedData = {
    nombre: nombre.trim(),
    descripcion: descripcion.trim(),
  };

  if (!cleanedData.nombre) {
    setError("El nombre de la región es obligatorio.");
    return;
  }

  try {
    await onCreate(cleanedData);

    const createModalElement = document.getElementById("createRegionModal");
    if (!createModalElement) return;

    const createModalInstance = Modal.getOrCreateInstance(createModalElement);

    createModalElement.addEventListener(
      "hidden.bs.modal",
      () => {
        resetForm();

        document.body.classList.remove("modal-open");
        document.body.style.removeProperty("padding-right");
        document.body.style.removeProperty("overflow");

        document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
          backdrop.remove();
        });
      },
      { once: true }
    );

    createModalInstance.hide();
  } catch (err) {
    console.error("Error al crear región:", err);
    setError("No se pudo crear la región.");
  }
};

  return (
    <div
      className="modal fade"
      id="createRegionModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Nueva Región</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Nombre de la región *</label>
                <input
                  type="text"
                  className="form-control"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Ej. Norte"
                />
              </div>

              <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea className="form-control" rows="3" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción de la región (opcional)"></textarea>
          </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-light" data-bs-dismiss="modal">
                Cancelar
              </button>

              <button type="submit" className="btn btn-primary">
                Crear región
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}