import { useState } from "react";

export default function CreateVerificationModal({ onCreate }) {
  const [formData, setFormData] = useState({
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
  });

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
    onCreate(formData);

    setFormData({
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
    });
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
              <h5 className="modal-title">Nueva verificacion</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
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
                <label className="form-label">Vehiculo *</label>
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
                  placeholder="Ej. $320"
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
                    placeholder="Ej. $120"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Fecha de verificación</label>
                  <input
                    type="text"
                    className="form-control"
                    name="fechaFolio"
                    value={formData.fechaFolio}
                    onChange={handleChange}
                    placeholder="Ej. 09-04-2026"
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
                data-bs-dismiss="modal"
                data-bs-toggle="modal"
                data-bs-target="#createVerificationSuccessModal"
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