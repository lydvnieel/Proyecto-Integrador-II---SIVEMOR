import { useEffect, useState } from "react";

export default function EditVerificationModal({ verification, onSave }) {
  const [formData, setFormData] = useState(verification || {});

  useEffect(() => {
    if (verification) {
      setFormData(verification);
    }
  }, [verification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };

    if (name === "precio") {
      updated.pendiente = value;
    }

    setFormData(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!verification) return null;

  return (
    <div
      className="modal fade"
      id="editVerificationModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Editar verificacion</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Materia</label>
                <input
                  type="text"
                  className="form-control"
                  name="materia"
                  value={formData.materia || ""}
                  onChange={handleChange}
                  placeholder="Ej. Humo"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Precio</label>
                <input
                  type="text"
                  className="form-control"
                  name="precio"
                  value={formData.precio || ""}
                  onChange={handleChange}
                  placeholder="Ej. $650"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Multa</label>
                <input
                  type="text"
                  className="form-control"
                  name="multa"
                  value={formData.multa || ""}
                  onChange={handleChange}
                  placeholder="Ej. $298"
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
                type="submit"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                data-bs-toggle="modal"
                data-bs-target="#updateVerificationSuccessModal"
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