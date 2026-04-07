import { useEffect, useState } from "react";
import Modal from "bootstrap/js/dist/modal";

const ALLOWED_MATERIAS = ["MOTRIZ", "ARRASTRE", "GASOLINA", "HUMO"];

export default function EditVerificationModal({ verification, onSave }) {
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (verification) {
      setFormData({
        id: verification.id,
        materia: verification.materia || "",
        precio: String(verification.precio || "").replace(/[^0-9.]/g, ""),
        multa: String(verification.multa || "").replace(/[^0-9.]/g, ""),
      });
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

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (error) setError("");
  };

  const isSameData = (cleanedData) => {
    return (
      cleanedData.materia === String(originalData.materia || "").trim().toUpperCase() &&
      cleanedData.precio === String(originalData.precio || "").replace(/[^0-9.]/g, "").trim() &&
      cleanedData.multa === String(originalData.multa || "").replace(/[^0-9.]/g, "").trim()
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedData = {
      id: formData.id,
      materia: String(formData.materia || "").trim().toUpperCase(),
      precio: Number(String(formData.precio || "").trim()),
      multa: formData.multa === "" ? null : Number(String(formData.multa || "").trim()),
    };

    if (!cleanedData.materia || Number.isNaN(cleanedData.precio)) {
      setError("Faltan campos obligatorios por llenar.");
      return;
    }

    if (!ALLOWED_MATERIAS.includes(cleanedData.materia)) {
      setError("La materia solo puede ser: MOTRIZ, ARRASTRE, GASOLINA o HUMO.");
      return;
    }

    if (cleanedData.precio <= 0) {
      setError("El precio debe ser un valor numérico positivo mayor que cero.");
      return;
    }

    if (isSameData({
      materia: cleanedData.materia,
      precio: String(cleanedData.precio),
      multa: cleanedData.multa == null ? "" : String(cleanedData.multa),
    })) {
      setError("No se realizaron cambios en la verificación.");
      return;
    }

    try {
      setSaving(true);
      await onSave(cleanedData);

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
    } catch (err) {
      console.error("Error al editar verificación:", err);
      setError(
        err?.response?.data?.message || "No se pudo actualizar la verificación."
      );
    } finally {
      setSaving(false);
    }
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
                <select
                  className="form-select"
                  name="materia"
                  value={formData.materia || ""}
                  onChange={handleChange}
                >
                  <option value="">Selecciona una materia</option>
                  {ALLOWED_MATERIAS.map((materia) => (
                    <option key={materia} value={materia}>
                      {materia}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Precio *</label>
                <input
                  type="text"
                  className="form-control"
                  name="precio"
                  value={formData.precio || ""}
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
                  value={formData.multa || ""}
                  onChange={handleChange}
                  placeholder="Ej. 298"
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

              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 