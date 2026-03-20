import { useState } from "react";
import Modal from "bootstrap/js/dist/modal";

const initialForm = {
  nota: "",
  cliente: "",
  verificaciones: 1,
  verificentro: "",
  metodo: "",
  anticipo: "",
  pagado: "Pendiente",
  pagadoClass: "status-warning",
  reviso: "",
  atendio: "",
  comentario: "",
};

export default function CreateNoteModal({ onCreate }) {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");

  const resetForm = () => {
    setFormData(initialForm);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "pagadoCheck") {
      setFormData((prev) => ({
        ...prev,
        pagado: checked ? "Pagado" : "Pendiente",
        pagadoClass: checked ? "status-success" : "status-warning",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));

    if (error) setError("");
  };

  const handleCreate = () => {
    const cleanedData = {
      ...formData,
      nota: formData.nota.trim(),
      cliente: formData.cliente.trim(),
      verificentro: formData.verificentro.trim(),
      metodo: formData.metodo.trim(),
      anticipo: formData.anticipo.trim(),
      reviso: formData.reviso.trim(),
      atendio: formData.atendio.trim(),
      comentario: formData.comentario.trim(),
    };

    if (
      !cleanedData.nota ||
      !cleanedData.cliente ||
      !cleanedData.verificentro ||
      !cleanedData.metodo ||
      !cleanedData.reviso ||
      !cleanedData.atendio ||
      !cleanedData.verificaciones
    ) {
      setError("Faltan campos obligatorios por llenar.");
      return;
    }

    onCreate(cleanedData);

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
              <label className="form-label">Folio *</label>
              <input
                type="text"
                className="form-control"
                name="nota"
                value={formData.nota}
                onChange={handleChange}
                placeholder="Ej. N-1003"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Cliente *</label>
              <input
                type="text"
                className="form-control"
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Verificentro *</label>
              <input
                type="text"
                className="form-control"
                name="verificentro"
                value={formData.verificentro}
                onChange={handleChange}
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Método de pago *</label>
                <input
                  type="text"
                  className="form-control"
                  name="metodo"
                  value={formData.metodo}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Verificaciones *</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  name="verificaciones"
                  value={formData.verificaciones}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Anticipo</label>
              <input
                type="text"
                className="form-control"
                name="anticipo"
                value={formData.anticipo}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Atendió *</label>
              <input
                type="text"
                className="form-control"
                name="atendio"
                value={formData.atendio}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Revisó *</label>
              <input
                type="text"
                className="form-control"
                name="reviso"
                value={formData.reviso}
                onChange={handleChange}
              />
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
            <button type="button" className="btn btn-primary" onClick={handleCreate}>
              Crear nota
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}