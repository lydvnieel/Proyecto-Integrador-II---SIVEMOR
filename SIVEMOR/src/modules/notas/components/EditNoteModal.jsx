import { useEffect, useState } from "react";

export default function EditNoteModal({ note, onSave }) {
  const [formData, setFormData] = useState(note || {});

  useEffect(() => {
    if (note) {
      setFormData(note);
    }
  }, [note]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!note) return null;

  return (
    <div className="modal fade" id="editNoteModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Editar nota</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Tipo de Pago *</label>
                <input
                  type="text"
                  className="form-control"
                  name="metodo"
                  value={formData.metodo || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Anticipo</label>
                <input
                  type="text"
                  className="form-control"
                  name="anticipo"
                  value={formData.anticipo || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Atendió *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="atendio"
                    value={formData.atendio || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Revisó *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="reviso"
                    value={formData.reviso || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Comentario</label>
                <textarea
                  className="form-control"
                  rows="3"
                  name="comentario"
                  value={formData.comentario || ""}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-light" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                data-bs-toggle="modal"
                data-bs-target="#updateSuccessModal"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}