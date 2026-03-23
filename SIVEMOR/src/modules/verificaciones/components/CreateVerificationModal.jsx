import { useState } from "react";
import Modal from "bootstrap/js/dist/modal";

export default function CreateVerificationModal({ onCreate }) {
  const initialState = {
    gestor: "Pendiente",
    razonSocial: "Pendiente",
    placa: "Sin placa",
    serie: "Sin serie",
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

  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (name === "precio") {
        updated.pendiente = value;
      }

      return updated;
    });
  };

  const resetForm = () => {
    setFormData({
      ...initialState,
      folio: `V-${Date.now()}`,
    });
    setError("");
    setIsSubmitting(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (
      !formData.numeroNota.trim() ||
      !formData.vehiculo.trim() ||
      !formData.materia.trim() ||
      !formData.precio.trim() ||
      !formData.multa.trim() ||
      !formData.fechaFolio.trim()
    ) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const newVerification = {
      ...formData,
      precio: formData.precio.startsWith("$") ? formData.precio : `$${formData.precio}`,
      multa: formData.multa.startsWith("$") ? formData.multa : `$${formData.multa}`,
      pendiente: formData.precio.startsWith("$") ? formData.precio : `$${formData.precio}`,
    };

    onCreate(newVerification);

    const createModalElement = document.getElementById("createVerificationModal");
    const successModalElement = document.getElementById("createVerificationSuccessModal");

    const createModalInstance = Modal.getInstance(createModalElement) || new Modal(createModalElement);
    const successModalInstance = new Modal(successModalElement);

    createModalElement.addEventListener(
      "hidden.bs.modal",
      () => {
        successModalInstance.show();
        resetForm();
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
                onClick={resetForm}
              ></button>
            </div>

            <div className="modal-body">
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
                  placeholder="Ej. Humo"
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
                  <label className="form-label">Multa *</label>
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
                  <label className="form-label">Fecha de verificación *</label>
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
                  placeholder="Escribe el dictamen"
                ></textarea>
              </div>

              {error && <div className="text-danger small">{error}</div>}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light"
                data-bs-dismiss="modal"
                onClick={resetForm}
                disabled={isSubmitting}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creando..." : "Crear verificación"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}