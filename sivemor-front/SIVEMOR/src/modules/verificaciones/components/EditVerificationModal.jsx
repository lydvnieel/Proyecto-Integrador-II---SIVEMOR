import { useEffect, useState } from "react";
import Modal from "bootstrap/js/dist/modal";

const ALLOWED_MATERIAS = ["MOTRIZ", "ARRASTRE", "GASOLINA", "HUMO"];

export default function EditVerificationModal({ verification, onSave }) {
  const [formData, setFormData] = useState(verification || {});
  const [originalData, setOriginalData] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (verification) {
      setFormData(verification);
      setOriginalData(verification);
      setError("");
    }
  }, [verification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "materia") {
      newValue = value.toUpperCase();
    }

    if (name === "precio" || name === "multa") {
      newValue = value.replace(/[^0-9.]/g, "");
      const parts = newValue.split(".");
      if (parts.length > 2) {
        newValue = `${parts[0]}.${parts.slice(1).join("")}`;
      }
    }

    const updated = { ...formData, [name]: newValue };

    if (name === "precio") {
      updated.pendiente = newValue ? `$${newValue}` : "";
    }

    setFormData(updated);

    if (error) setError("");
  };

  const isSameData = (cleanedData) => {
    return (
      cleanedData.materia === String(originalData.materia || "").trim().toUpperCase() &&
      cleanedData.precio ===
        String(originalData.precio || "").replace(/[^0-9.]/g, "").trim() &&
      cleanedData.multa ===
        String(originalData.multa || "").replace(/[^0-9.]/g, "").trim() &&
      cleanedData.fechaFolio === String(originalData.fechaFolio || "").trim() &&
      cleanedData.dictamen === String(originalData.dictamen || "").trim()
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanedData = {
      ...formData,
      materia: String(formData.materia || "").trim().toUpperCase(),
      precio: String(formData.precio || "").replace(/[^0-9.]/g, "").trim(),
      multa: String(formData.multa || "").replace(/[^0-9.]/g, "").trim(),
      fechaFolio: String(formData.fechaFolio || "").trim(),
      dictamen: String(formData.dictamen || "").trim(),
    };

    if (!cleanedData.materia || !cleanedData.precio) {
      setError("Faltan campos obligatorios por llenar.");
      return;
    }

    if (!ALLOWED_MATERIAS.includes(cleanedData.materia)) {
      setError("La materia solo puede ser: MOTRIZ, ARRASTRE, GASOLINA o HUMO.");
      return;
    }

    const precioNumber = Number(cleanedData.precio);
    if (Number.isNaN(precioNumber) || precioNumber <= 0) {
      setError("El precio debe ser un valor numérico positivo mayor que cero.");
      return;
    }

    if (isSameData(cleanedData)) {
      setError("No se realizaron cambios en la verificación.");
      return;
    }

    const finalData = {
      ...cleanedData,
      precio: `$${precioNumber}`,
      pendiente: `$${precioNumber}`,
    };

    onSave(finalData);

    const editModalElement = document.getElementById("editVerificationModal");
    const successModalElement = document.getElementById(
      "updateVerificationSuccessModal"
    );

    if (!editModalElement || !successModalElement) return;

    const editModalInstance = Modal.getOrCreateInstance(editModalElement);
    const successModalInstance = Modal.getOrCreateInstance(successModalElement);

    editModalElement.addEventListener(
      "hidden.bs.modal",
      () => {
        setError("");
        successModalInstance.show();
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
      data-bs-backdrop="static"
      data-bs-keyboard="false"
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
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Materia *</label>
                <input
                  type="text"
                  className="form-control"
                  name="materia"
                  value={formData.materia || ""}
                  onChange={handleChange}
                  placeholder="Ej. HUMO"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Precio *</label>
                <input
                  type="text"
                  className="form-control"
                  name="precio"
                  value={String(formData.precio || "").replace(/[^0-9.]/g, "")}
                  onChange={handleChange}
                  placeholder="Ej. 650"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Multa</label>
                <input
                  type="text"
                  className="form-control"
                  name="multa"
                  value={String(formData.multa || "").replace(/[^0-9.]/g, "")}
                  onChange={handleChange}
                  placeholder="Ej. 298"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Fecha de verificación</label>
                <input
                  type="date"
                  className="form-control"
                  name="fechaFolio"
                  value={formData.fechaFolio || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Dictamen</label>
                <textarea
                  className="form-control"
                  rows="2"
                  name="dictamen"
                  value={formData.dictamen || ""}
                  onChange={handleChange}
                  placeholder="Puede quedar vacío hasta que el técnico lo capture"
                ></textarea>
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