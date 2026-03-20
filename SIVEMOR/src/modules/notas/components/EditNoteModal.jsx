import { useEffect, useState } from "react";
import Modal from "bootstrap/js/dist/modal";

export default function EditNoteModal({ note, onSave }) {
  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (note) {
      const noteData = {
        ...note,
        metodo: note.metodo || "",
        anticipo: note.anticipo || "",
        atendio: note.atendio || "",
        reviso: note.reviso || "",
        comentario: note.comentario || "",
      };

      setFormData(noteData);
      setOriginalData(noteData);
      setError("");
    }
  }, [note]);

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
      formData.metodo.trim() === (originalData.metodo || "").trim() &&
      formData.anticipo.trim() === (originalData.anticipo || "").trim() &&
      formData.atendio.trim() === (originalData.atendio || "").trim() &&
      formData.reviso.trim() === (originalData.reviso || "").trim() &&
      formData.comentario.trim() === (originalData.comentario || "").trim()
    );
  };

  const handleSave = () => {
    if (!formData) return;

    const cleanedData = {
      ...formData,
      metodo: formData.metodo.trim(),
      anticipo: formData.anticipo.trim(),
      atendio: formData.atendio.trim(),
      reviso: formData.reviso.trim(),
      comentario: formData.comentario.trim(),
    };

    if (!cleanedData.metodo || !cleanedData.atendio || !cleanedData.reviso) {
      setError("Faltan campos obligatorios por llenar.");
      return;
    }

    if (isSameData()) {
      setError("No se realizaron cambios en la nota.");
      return;
    }

    onSave(cleanedData);

    const editModalElement = document.getElementById("editNoteModal");
    if (!editModalElement) return;

    const editModalInstance = Modal.getOrCreateInstance(editModalElement);
    editModalInstance.hide();
  };

  if (!note || !formData) return null;

  return (
    <div
      className="modal fade"
      id="editNoteModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar nota</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Método de pago *</label>
              <input
                type="text"
                className="form-control"
                name="metodo"
                value={formData.metodo}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Anticipo</label>
              <input
                type="text"
                className="form-control"
                name="anticipo"
                value={formData.anticipo}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Atendió *</label>
              <input
                type="text"
                className="form-control"
                name="atendio"
                value={formData.atendio}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Revisó *</label>
              <input
                type="text"
                className="form-control"
                name="reviso"
                value={formData.reviso}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Comentario</label>
              <textarea
                className="form-control"
                rows="3"
                name="comentario"
                value={formData.comentario}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-light" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}