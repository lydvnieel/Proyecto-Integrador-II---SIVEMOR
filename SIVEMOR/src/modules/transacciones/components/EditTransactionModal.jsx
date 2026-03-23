import { useEffect, useState } from "react";
import Modal from "bootstrap/js/dist/modal";

const PAYMENT_TYPES = ["EFECTIVO", "TARJETA", "DEPÓSITO", "TRANSFERENCIA"];

export default function EditTransactionModal({ transaction, onSave }) {
  const [formData, setFormData] = useState({
    id: null,
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
  });

  const [originalData, setOriginalData] = useState({
    id: null,
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
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (transaction) {
      const txData = {
        id: transaction.id,
        nota: transaction.nota || "",
        tipoPago: (transaction.tipoPago || "").toUpperCase(),
        monto: String(transaction.monto || ""),
        cuentaDeposito: transaction.cuentaDeposito || "",
        factura: transaction.factura || "",
        pagado: transaction.pagado || "No",
        pagadoClass: transaction.pagadoClass || "status-warning",
        fechaPedido: transaction.fechaPedido || "",
        cotizacion: transaction.cotizacion || "",
        reviso: transaction.reviso || "",
        atendio: transaction.atendio || "",
        pendiente: transaction.pendiente || "Sí",
        pendienteClass: transaction.pendienteClass || "status-warning",
        comentario: transaction.comentario || "",
      };

      setFormData(txData);
      setOriginalData(txData);
      setError("");
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "monto") {
      newValue = value.replace(/[^0-9.]/g, "");

      const parts = newValue.split(".");
      if (parts.length > 2) {
        newValue = `${parts[0]}.${parts.slice(1).join("")}`;
      }
    }

    const updatedData = {
      ...formData,
      [name]: newValue,
    };

    if (name === "tipoPago" && !["DEPÓSITO", "TRANSFERENCIA"].includes(newValue)) {
      updatedData.cuentaDeposito = "";
    }

    if (name === "pagado") {
      updatedData.pagadoClass =
        newValue === "Sí" ? "status-success" : "status-warning";
    }

    if (name === "pendiente") {
      updatedData.pendienteClass =
        newValue === "No" ? "status-success" : "status-warning";
    }

    setFormData(updatedData);

    if (error) setError("");
  };

  const isSameData = (cleanedData) => {
    return (
      cleanedData.nota === originalData.nota.trim() &&
      cleanedData.tipoPago === originalData.tipoPago.trim().toUpperCase() &&
      cleanedData.monto === String(originalData.monto).trim() &&
      cleanedData.cuentaDeposito === originalData.cuentaDeposito.trim() &&
      cleanedData.factura === originalData.factura.trim() &&
      cleanedData.pagado === originalData.pagado &&
      cleanedData.fechaPedido === originalData.fechaPedido.trim() &&
      cleanedData.cotizacion === originalData.cotizacion.trim() &&
      cleanedData.reviso === originalData.reviso.trim() &&
      cleanedData.atendio === originalData.atendio.trim() &&
      cleanedData.pendiente === originalData.pendiente &&
      cleanedData.comentario === originalData.comentario.trim()
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanedData = {
      ...formData,
      nota: formData.nota.trim(),
      tipoPago: formData.tipoPago.trim().toUpperCase(),
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

    if (!PAYMENT_TYPES.includes(cleanedData.tipoPago)) {
      setError("El tipo de pago no es válido.");
      return;
    }

    const montoNumber = Number(cleanedData.monto);
    if (Number.isNaN(montoNumber) || montoNumber <= 0) {
      setError("El monto debe ser un valor numérico positivo mayor que cero.");
      return;
    }

    if (
      ["DEPÓSITO", "TRANSFERENCIA"].includes(cleanedData.tipoPago) &&
      !cleanedData.cuentaDeposito
    ) {
      setError(
        "La cuenta de depósito es obligatoria cuando el tipo de pago es DEPÓSITO o TRANSFERENCIA."
      );
      return;
    }

    cleanedData.monto = montoNumber.toString();

    if (isSameData(cleanedData)) {
      setError("No se realizaron cambios en la transacción.");
      return;
    }

    onSave(cleanedData);
  };

  const handleClose = () => {
    const modalElement = document.getElementById("editTransactionModal");
    if (!modalElement) return;

    const modalInstance = Modal.getOrCreateInstance(modalElement);
    modalInstance.hide();
  };

  if (!transaction) return null;

  return (
    <div
      className="modal fade"
      id="editTransactionModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Editar Transacción</h5>
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
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Tipo de pago *</label>
                  <select
                    className="form-control"
                    name="tipoPago"
                    value={formData.tipoPago}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona una opción</option>
                    {PAYMENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Monto *</label>
                  <input
                    type="number"
                    className="form-control"
                    name="monto"
                    value={formData.monto}
                    onChange={handleChange}
                    min="0.01"
                    step="0.01"
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
                    disabled={
                      !["DEPÓSITO", "TRANSFERENCIA"].includes(formData.tipoPago)
                    }
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
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}