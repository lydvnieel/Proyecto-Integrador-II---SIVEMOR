import { useEffect, useState } from "react";
import Modal from "bootstrap/js/dist/modal";

export default function EditVerificationModal({ verification, onSave }) {
  const [formData, setFormData] = useState(verification || {});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (verification) {
      setFormData(verification);
      setIsSubmitting(false);
    }
  }, [verification]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "precio") {
        updated.pendiente = value.startsWith("$") ? value : `$${value}`;
      }

      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    onSave({
      ...formData,
      precio:
        String(formData.precio).startsWith("$")
          ? formData.precio
          : `$${formData.precio}`,
      multa:
        String(formData.multa).startsWith("$")
          ? formData.multa
          : `$${formData.multa}`,
    });

    const editModalElement = document.getElementById("editVerificationModal");
    const successModalElement = document.getElementById("updateVerificationSuccessModal");

    const editModalInstance =
      Modal.getInstance(editModalElement) || new Modal(editModalElement);
    const successModalInstance = new Modal(successModalElement);

    editModalElement.addEventListener(
      "hidden.bs.modal",
      () => {
        successModalInstance.show();
        setIsSubmitting(false);
      },
      { once: true }
    );

    editModalInstance.hide();
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
              <h5 className="modal-title">Editar verificación</h5>
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
                disabled={isSubmitting}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}