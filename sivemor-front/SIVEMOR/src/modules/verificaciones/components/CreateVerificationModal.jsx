import { useState } from "react";
import Modal from "bootstrap/js/dist/modal";

const ALLOWED_MATERIAS = ["MOTRIZ", "ARRASTRE", "GASOLINA", "HUMO"];

const initialForm = {
  gestor: "Pendiente",
  razonSocial: "Pendiente",
  placa: "Pendiente",
  serie: "Pendiente",
  materia: "",
  verificentro: "Pendiente",
  precio: "",
  tipoPago: "Pendiente",
  numeroNota: "",
  cotizacion: "Pendiente",
  fechaFolio: "",
  folio: `V-${Date.now()}`,
  cuentaDeposito: "Pendiente",
  numeroFactura: "Pendiente",
  pagado: "No",
  pagadoClass: "status-warning",
  pendiente: "",
  pendienteClass: "text-danger fw-semibold",
  fechaPedido: "",
  multa: "",
  vehiculo: "",
  dictamen: "",
};

export default function CreateVerificationModal({ onCreate }) {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanedData = {
      ...formData,
      numeroNota: formData.numeroNota.trim(),
      vehiculo: formData.vehiculo.trim(),
      materia: formData.materia.trim().toUpperCase(),
      precio: formData.precio.trim(),
      multa: formData.multa.trim(),
      fechaFolio: formData.fechaFolio.trim(),
      dictamen: formData.dictamen.trim(),
    };

    if (
      !cleanedData.numeroNota ||
      !cleanedData.vehiculo ||
      !cleanedData.materia ||
      !cleanedData.precio
    ) {
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

    cleanedData.precio = `$${precioNumber}`;
    cleanedData.pendiente = `$${precioNumber}`;

    onCreate(cleanedData);

    const createModalElement = document.getElementById("createVerificationModal");
    const successModalElement = document.getElementById(
      "createVerificationSuccessModal"
    );

    if (!createModalElement || !successModalElement) return;

    const createModalInstance = Modal.getOrCreateInstance(createModalElement);
    const successModalInstance = Modal.getOrCreateInstance(successModalElement);

    createModalElement.addEventListener(
      "hidden.bs.modal",
      () => {
        setFormData({
          ...initialForm,
          folio: `V-${Date.now()}`,
        });
        setError("");
        successModalInstance.show();
      },
      { once: true }
    );

    createModalInstance.hide();
  };

  return (
    <div
      className="modal fade"
      id="createVerificationModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Nueva verificación</h5>
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
                <label className="form-label">Nota *</label>
                <input
                  type="text"
                  className="form-control"
                  name="numeroNota"
                  value={formData.numeroNota}
                  onChange={handleChange}
                  placeholder="Ej: N-1002"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Vehículo *</label>
                <input
                  type="text"
                  className="form-control"
                  name="vehiculo"
                  value={formData.vehiculo}
                  onChange={handleChange}
                  placeholder="Ej. Camión Rígido"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Materia *</label>
                <input
                  type="text"
                  className="form-control"
                  name="materia"
                  value={formData.materia}
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
                  value={formData.precio}
                  onChange={handleChange}
                  placeholder="Ej. 320"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Multa</label>
                  <input
                    type="text"
                    className="form-control"
                    name="multa"
                    value={formData.multa}
                    onChange={handleChange}
                    placeholder="Ej. 120"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Fecha de verificación</label>
                  <input
                    type="date"
                    className="form-control"
                    name="fechaFolio"
                    value={formData.fechaFolio}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Dictamen</label>
                <textarea
                  className="form-control"
                  rows="2"
                  name="dictamen"
                  value={formData.dictamen}
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
                Crear verificación
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}