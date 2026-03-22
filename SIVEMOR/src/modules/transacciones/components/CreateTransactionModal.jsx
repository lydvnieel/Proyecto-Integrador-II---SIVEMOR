import { useEffect, useState } from "react";
import Modal from "bootstrap/js/dist/modal";

const initialForm = {
  nota: "",
  tipoPago: "",
  monto: "",
  cuentaDeposito: "",
  factura: "",
  pagado: "No",
  pagadoClass: "status-warning",
  fechaPedido: "",
  cotizacion: "",
  reviso: "",
  atendio: "",
  pendiente: "Sí",
  pendienteClass: "status-warning",
  comentario: "",
};

export default function CreateTransactionModal({ onCreate }) {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    const modalElement = document.getElementById("createTransactionModal");
    if (!modalElement) return;

    const handleHidden = () => {
      setFormData(initialForm);
      setError("");
    };

    modalElement.addEventListener("hidden.bs.modal", handleHidden);
    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedData = {
      ...formData,
      [name]: value,
    };

    if (name === "pagado") {
      updatedData.pagadoClass =
        value === "Sí" ? "status-success" : "status-warning";
    }

    if (name === "pendiente") {
      updatedData.pendienteClass =
        value === "No" ? "status-success" : "status-warning";
    }

    setFormData(updatedData);

    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanedData = {
      ...formData,
      nota: formData.nota.trim(),
      tipoPago: formData.tipoPago.trim(),
      monto: formData.monto.trim(),
      cuentaDeposito: formData.cuentaDeposito.trim(),
      factura: formData.factura.trim(),
      fechaPedido: formData.fechaPedido.trim(),
      cotizacion: formData.cotizacion.trim(),
      reviso: formData.reviso.trim(),
      atendio: formData.atendio.trim(),
      comentario: formData.comentario.trim(),
    };

    if (
      !cleanedData.nota ||
      !cleanedData.tipoPago ||
      !cleanedData.monto ||
      !cleanedData.factura ||
      !cleanedData.fechaPedido ||
      !cleanedData.cotizacion ||
      !cleanedData.reviso ||
      !cleanedData.atendio
    ) {
      setError("Faltan campos obligatorios por llenar.");
      return;
    }

    setError("");
    onCreate(cleanedData);
  };

  const handleClose = () => {
    const modalElement = document.getElementById("createTransactionModal");
    if (!modalElement) return;

    const modalInstance = Modal.getOrCreateInstance(modalElement);
    modalInstance.hide();
  };

  return (
    <div
      className="modal fade"
      id="createTransactionModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Nueva Transacción</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
              ></button>
            </div>

            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nota *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nota"
                    value={formData.nota}
                    onChange={handleChange}
                    placeholder="Ej. N-1002"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Tipo de pago *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tipoPago"
                    value={formData.tipoPago}
                    onChange={handleChange}
                    placeholder="Ej. Transferencia"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Monto *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="monto"
                    value={formData.monto}
                    onChange={handleChange}
                    placeholder="Ej. $1,200"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Cuenta de depósito</label>
                  <input
                    type="text"
                    className="form-control"
                    name="cuentaDeposito"
                    value={formData.cuentaDeposito}
                    onChange={handleChange}
                    placeholder="Ej. BBVA-1234"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Número de factura *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="factura"
                    value={formData.factura}
                    onChange={handleChange}
                    placeholder="Ej. F-900"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Fecha pedido *</label>
                  <input
                    type="date"
                    className="form-control"
                    name="fechaPedido"
                    value={formData.fechaPedido}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Cotización *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="cotizacion"
                    value={formData.cotizacion}
                    onChange={handleChange}
                    placeholder="Ej. C-500"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Revisó *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="reviso"
                    value={formData.reviso}
                    onChange={handleChange}
                    placeholder="Nombre de quien revisó"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Atendió *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="atendio"
                    value={formData.atendio}
                    onChange={handleChange}
                    placeholder="Nombre de quien atendió"
                  />
                </div>

                <div className="col-md-3 mb-3">
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

                <div className="col-md-3 mb-3">
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
                onClick={handleClose}
              >
                Cancelar
              </button>

              <button type="submit" className="btn btn-primary">
                Crear transacción
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}