import { useEffect, useState } from "react";
import Modal from "bootstrap/js/dist/modal";

export default function EditNoteModal({ note, onSave, usuarios = [] }) {
  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (note) {
      const noteData = {
        tipoPago: note.metodo || "",
        anticipo: note.anticipo || "",
        pagadoCompleto: note.pagadoCompleto || false,
        atendio: note.atendioId || "",
        reviso: note.revisoId || "",
        comentario: note.comentario || "",
      };

      setFormData(noteData);
      setOriginalData(noteData);
      setError("");
    }
  }, [note]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error) setError("");
  };

  const isSameData = () => {
    return JSON.stringify(formData) === JSON.stringify(originalData);
  };

  const handleSave = async () => {
    if (!formData) return;

    if (!formData.tipoPago || !formData.atendio) {
      setError("Faltan campos obligatorios por llenar.");
      return;
    }

    if (isSameData()) {
      setError("No se realizaron cambios en la nota.");
      return;
    }

    const payload = {
      tipoPago: formData.tipoPago,
      anticipo: formData.anticipo === "" ? 0 : Number(formData.anticipo),
      pagadoCompleto: formData.pagadoCompleto,
      atendio: Number(formData.atendio),
      reviso: formData.reviso ? Number(formData.reviso) : null,
      comentario: formData.comentario.trim(),
    };

        try {
      setSaving(true);
      await onSave(payload);

      const editModalElement = document.getElementById("editNoteModal");
      const successModalElement = document.getElementById("updateSuccessModal");

      if (!editModalElement) return;

      const editModalInstance = Modal.getOrCreateInstance(editModalElement);

      const cleanupModalArtifacts = () => {
        document.body.classList.remove("modal-open");
        document.body.style.removeProperty("padding-right");
        document.body.style.removeProperty("overflow");

        document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
          backdrop.remove();
        });
      };

      if (successModalElement) {
        const successModalInstance = Modal.getOrCreateInstance(successModalElement);

        editModalElement.addEventListener(
          "hidden.bs.modal",
          () => {
            cleanupModalArtifacts();
            setError("");
            successModalInstance.show();
          },
          { once: true }
        );
      } else {
        editModalElement.addEventListener(
          "hidden.bs.modal",
          () => {
            cleanupModalArtifacts();
            setError("");
          },
          { once: true }
        );
      }

      editModalInstance.hide();
    } catch (err) {
      console.error("Error al actualizar nota:", err);
      setError(
        err?.response?.data?.message || "No se pudo actualizar la nota."
      );
    } finally {
      setSaving(false);
    }
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
              <select
                className="form-select"
                name="tipoPago"
                value={formData.tipoPago}
                onChange={handleChange}
              >
                <option value="">Selecciona un método</option>
                <option value="EFECTIVO">EFECTIVO</option>
                <option value="DEPOSITO">DEPOSITO</option>
                <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                <option value="TARJETA">TARJETA</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Anticipo</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                name="anticipo"
                value={formData.anticipo}
                onChange={handleChange}
              />
            </div>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="editPagadoCompleto"
                name="pagadoCompleto"
                checked={formData.pagadoCompleto}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="editPagadoCompleto">
                Pagado completo
              </label>
            </div>

            <div className="mb-3">
              <label className="form-label">Atendió *</label>
              <select
                className="form-select"
                name="atendio"
                value={formData.atendio}
                onChange={handleChange}
              >
                <option value="">Selecciona un usuario</option>
                {usuarios.map((usuario) => (
                  <option
                    key={usuario.id ?? usuario.idUsuario}
                    value={usuario.id ?? usuario.idUsuario}
                  >
                    {usuario.nombre ?? usuario.nombreUsuario}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Revisó</label>
              <select
                className="form-select"
                name="reviso"
                value={formData.reviso}
                onChange={handleChange}
              >
                <option value="">Selecciona un usuario</option>
                {usuarios.map((usuario) => (
                  <option
                    key={usuario.id ?? usuario.idUsuario}
                    value={usuario.id ?? usuario.idUsuario}
                  >
                    {usuario.nombre ?? usuario.nombreUsuario}
                  </option>
                ))}
              </select>
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
            <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}