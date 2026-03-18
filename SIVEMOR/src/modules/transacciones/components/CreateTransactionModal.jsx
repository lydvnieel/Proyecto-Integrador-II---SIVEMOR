import { useState } from "react";

export default function CreateTransactionModal({ onCreate }) {
  const [formData, setFormData] = useState({
    nota: "",
    tipoPago: "",
    monto: "",
    cuentaDeposito: "",
    factura: "",
    pagado: "No",
    pagadoClass: "status-warning",
    fechaPedido: "2026-02-18",
    cotizacion: "",
    reviso: "Pendiente",
    atendio: "Pendiente",
    pendiente: "Sí",
    pendienteClass: "status-warning",
    comentario: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedData = {
      ...formData,
      [name]: value,
    };

    if (name === "pagado") {
      updatedData.pagadoClass = value === "Sí" ? "status-success" : "status-warning";
    }

    if (name === "pendiente") {
      updatedData.pendienteClass =
        value === "No" ? "status-success" : "status-warning";
    }

    setFormData(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);

    setFormData({
      nota: "",
      tipoPago: "",
      monto: "",
      cuentaDeposito: "",
      factura: "",
      pagado: "No",
      pagadoClass: "status-warning",
      fechaPedido: "2026-02-18",
      cotizacion: "",
      reviso: "Pendiente",
      atendio: "Pendiente",
      pendiente: "Sí",
      pendienteClass: "status-warning",
      comentario: "",
    });
  };

  return (
    <div
      className="modal fade"
      id="createTransactionModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Nueva Transacción</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Tipo de pago</label>
                <input
                  type="text"
                  className="form-control"
                  name="tipoPago"
                  value={formData.tipoPago}
                  onChange={handleChange}
                  placeholder="Ej. Transferencia"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Monto</label>
                <input
                  type="text"
                  className="form-control"
                  name="monto"
                  value={formData.monto}
                  onChange={handleChange}
                  placeholder="Ej. $1,200"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Cuenta de deposito</label>
                <input
                  type="text"
                  className="form-control"
                  name="cuentaDeposito"
                  value={formData.cuentaDeposito}
                  onChange={handleChange}
                  placeholder="Ej. BBVA-1234"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Número de factura</label>
                <input
                  type="text"
                  className="form-control"
                  name="factura"
                  value={formData.factura}
                  onChange={handleChange}
                  placeholder="Ej. F-900"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Pagado</label>
                  <select
                    className="form-control"
                    name="pagado"
                    value={formData.pagado}
                    onChange={handleChange}
                  >
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Pendiente</label>
                  <select
                    className="form-control"
                    name="pendiente"
                    value={formData.pendiente}
                    onChange={handleChange}
                  >
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Comentario</label>
                <textarea
                  className="form-control"
                  rows="2"
                  name="comentario"
                  value={formData.comentario}
                  onChange={handleChange}
                  placeholder="Ingresa un comentario opcional"
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
                data-bs-target="#updateTransactionSuccessModal"
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