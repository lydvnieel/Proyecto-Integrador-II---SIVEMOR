import { useEffect, useState } from "react";
import Modal from "bootstrap/js/dist/modal";

const initialForm = {
  idCliente: "",
  idVerificentro: "",
  tipoPago: "",
  anticipo: "",
  pagadoCompleto: false,
  atendio: "",
  reviso: "",
  comentario: "",
};

export default function CreateNoteModal({
  onCreate,
  clientes = [],
  verificentros = [],
  usuarios = [],
}) {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setFormData(initialForm);
    setError("");
    setSaving(false);
  };

  useEffect(() => {
    const modalEl = document.getElementById("createNoteModal");
    if (!modalEl) return;

    const handleHidden = () => resetForm();
    modalEl.addEventListener("hidden.bs.modal", handleHidden);

    return () => {
      modalEl.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error) setError("");
  };

  const handleCreate = async () => {
    if (
      !formData.idCliente ||
      !formData.idVerificentro ||
      !formData.tipoPago ||
      !formData.atendio
    ) {
      setError("Faltan campos obligatorios por llenar.");
      return;
    }

    const payload = {
      idCliente: Number(formData.idCliente),
      idVerificentro: Number(formData.idVerificentro),
      tipoPago: formData.tipoPago,
      anticipo:
        formData.anticipo === "" ? 0 : Number(formData.anticipo),
      pagadoCompleto: formData.pagadoCompleto,
      atendio: Number(formData.atendio),
      reviso: formData.reviso ? Number(formData.reviso) : null,
      comentario: formData.comentario.trim(),
    };

    try {
      setSaving(true);
      await onCreate(payload);

      const createModalElement = document.getElementById("createNoteModal");
      const successModalElement = document.getElementById(
        "successfulCreateNoteModal"
      );

      if (!createModalElement || !successModalElement) return;

      const createModalInstance = Modal.getOrCreateInstance(createModalElement);
      const successModalInstance = Modal.getOrCreateInstance(successModalElement);

      createModalElement.addEventListener(
        "hidden.bs.modal",
        () => {
          resetForm();
          successModalInstance.show();
        },
        { once: true }
      );

      createModalInstance.hide();
    } catch (err) {
      console.error("Error al crear nota:", err);
      setError(
        err?.response?.data?.message || "No se pudo crear la nota."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="createNoteModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Nueva Nota</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Cliente *</label>
              <select
                className="form-select"
                name="idCliente"
                value={formData.idCliente}
                onChange={handleChange}
              >
                <option value="">Selecciona un cliente</option>
                {clientes.map((cliente) => (
                  <option
                    key={cliente.id ?? cliente.idCliente}
                    value={cliente.id ?? cliente.idCliente}
                  >
                    {cliente.razonSocial ?? cliente.nombre ?? cliente.nombreCliente}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Verificentro *</label>
              <select
                className="form-select"
                name="idVerificentro"
                value={formData.idVerificentro}
                onChange={handleChange}
              >
                <option value="">Selecciona un verificentro</option>
                {verificentros.map((verificentro) => (
                  <option
                    key={verificentro.id ?? verificentro.idVerificentro}
                    value={verificentro.id ?? verificentro.idVerificentro}
                  >
                    {verificentro.nombre ?? verificentro.nombreVerificentro}
                  </option>
                ))}
              </select>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Método de pago *</label>
                <select
                  className="form-select"
                  name="tipoPago"
                  value={formData.tipoPago}
                  onChange={handleChange}
                >
                  <option value="">Selecciona un método</option>
                  <option value="EFECTIVO">EFECTIVO</option>
                  <option value="DEPOSITO">DEPOSITO</option>
                  <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                  <option value="TARJETA">TARJETA</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Anticipo</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-control"
                  name="anticipo"
                  value={formData.anticipo}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Atendió *</label>
              <select
                className="form-select"
                name="atendio"
                value={formData.atendio}
                onChange={handleChange}
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

            <div className="mb-3">
              <label className="form-label">Revisó</label>
              <select
                className="form-select"
                name="reviso"
                value={formData.reviso}
                onChange={handleChange}
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

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="pagadoCompleto"
                name="pagadoCompleto"
                checked={formData.pagadoCompleto}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="pagadoCompleto">
                Pagado completo
              </label>
            </div>

            <div className="mb-3">
              <label className="form-label">Comentario</label>
              <textarea
                className="form-control"
                rows="3"
                name="comentario"
                value={formData.comentario}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-light" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button type="button" className="btn btn-primary" onClick={handleCreate} disabled={saving}>
              {saving ? "Creando..." : "Crear nota"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}