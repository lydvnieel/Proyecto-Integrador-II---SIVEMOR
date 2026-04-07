import { useEffect, useState } from "react";
import Modal from "bootstrap/js/dist/modal";

const PAYMENT_TYPES = ["EFECTIVO", "TARJETA", "DEPOSITO", "TRANSFERENCIA"];

const initialForm = {
  idNota: "",
  tipoPago: "",
  monto: "",
  cuentaDeposito: "",
  factura: "",
  pagado: "No",
  pagadoClass: "status-warning",
  cotizacion: "",
  reviso: "",
  atendio: "",
  pendiente: "Sí",
  pendienteClass: "status-warning",
  comentario: "",
};

export default function CreateTransactionModal({
  onCreate,
  notas = [],
  usuarios = [],
}) {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const modalElement = document.getElementById("createTransactionModal");
    if (!modalElement) return;

    const handleHidden = () => {
      setFormData(initialForm);
      setError("");
      setSaving(false);
    };

    modalElement.addEventListener("hidden.bs.modal", handleHidden);
    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, []);

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

    if (name === "tipoPago" && !["DEPOSITO", "TRANSFERENCIA"].includes(newValue)) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedData = {
      ...formData,
      idNota: formData.idNota,
      tipoPago: formData.tipoPago.trim().toUpperCase(),
      monto: formData.monto.trim(),
      cuentaDeposito: formData.cuentaDeposito.trim(),
      factura: formData.factura.trim(),
      cotizacion: formData.cotizacion.trim(),
      reviso: formData.reviso,
      atendio: formData.atendio,
      comentario: formData.comentario.trim(),
    };

    if (
      !cleanedData.idNota ||
      !cleanedData.tipoPago ||
      !cleanedData.monto ||
      !cleanedData.factura ||
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
      ["DEPOSITO", "TRANSFERENCIA"].includes(cleanedData.tipoPago) &&
      !cleanedData.cuentaDeposito
    ) {
      setError(
        "La cuenta de depósito es obligatoria cuando el tipo de pago es DEPOSITO o TRANSFERENCIA."
      );
      return;
    }

    try {
      setSaving(true);
      await onCreate(cleanedData);
    } catch (err) {
      setError(err.message || "No se pudo crear la transacción.");
    } finally {
      setSaving(false);
    }
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
                disabled={saving}
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
                  <select
                    className="form-control"
                    name="idNota"
                    value={formData.idNota}
                    onChange={handleChange}
                    disabled={saving}
                  >
                    <option value="">Selecciona una nota</option>
                    {notas.map((nota) => (
                      <option
                        key={nota.id ?? nota.idNota}
                        value={nota.id ?? nota.idNota}
                      >
                        {nota.folioNota ?? nota.nota ?? `Nota ${nota.id ?? nota.idNota}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Tipo de pago *</label>
                  <select
                    className="form-control"
                    name="tipoPago"
                    value={formData.tipoPago}
                    onChange={handleChange}
                    disabled={saving}
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
                    placeholder="Ej. 1200"
                    min="0.01"
                    step="0.01"
                    disabled={saving}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Cuenta de depósito</label>
                  <input type="text" className="form-control" name="cuentaDeposito"value={formData.cuentaDeposito}onChange={handleChange}
                    placeholder="Ej. BBVA-1234"
                    disabled={!["DEPOSITO", "TRANSFERENCIA"].includes(formData.tipoPago)}/>
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
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Cotización</label>
                  <input
                    type="text"
                    className="form-control"
                    name="cotizacion"
                    value={formData.cotizacion}
                    onChange={handleChange}
                    placeholder="Ej. C-500"
                    disabled={saving}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Revisó *</label>
                  <select
                    className="form-control"
                    name="reviso"
                    value={formData.reviso}
                    onChange={handleChange}
                    disabled={saving}
                  >
                    <option value="">Selecciona un usuario</option>
                    {usuarios.map((usuario) => (
                      <option
                        key={usuario.id ?? usuario.idUsuario}
                        value={usuario.id ?? usuario.idUsuario}
                      >
                        {usuario.nombre ?? usuario.nombreUsuario}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Atendió *</label>
                  <select
                    className="form-control"
                    name="atendio"
                    value={formData.atendio}
                    onChange={handleChange}
                    disabled={saving}
                  >
                    <option value="">Selecciona un usuario</option>
                    {usuarios.map((usuario) => (
                      <option
                        key={usuario.id ?? usuario.idUsuario}
                        value={usuario.id ?? usuario.idUsuario}
                      >
                        {usuario.nombre ?? usuario.nombreUsuario}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3 mb-3">
                  <label className="form-label">Pagado</label>
                  <select
                    className="form-control"
                    name="pagado"
                    value={formData.pagado}
                    onChange={handleChange}
                    disabled={saving}
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
                    disabled={saving}
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
                  disabled={saving}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light"
                onClick={handleClose}
                disabled={saving}
              >
                Cancelar
              </button>

              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Creando..." : "Crear transacción"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}