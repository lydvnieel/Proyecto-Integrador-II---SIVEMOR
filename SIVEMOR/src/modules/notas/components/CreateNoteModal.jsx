import { useState } from "react";

export default function CreateNoteModal({ onCreate }) {
  const [formData, setFormData] = useState({
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
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "Pagado" : "Pendiente") : value,
      ...(name === "pagadoCheck"
        ? {
            pagado: checked ? "Pagado" : "Pendiente",
            pagadoClass: checked ? "status-success" : "status-warning",
          }
        : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
    setFormData({
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
    });
  };

  return (
    <div className="modal fade" id="createNoteModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Nueva Nota</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Folio</label>
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
                  placeholder="Nombre del cliente"
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
                  placeholder="Ej. Verificentro Norte"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tipo de Pago *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="metodo"
                    value={formData.metodo}
                    onChange={handleChange}
                    placeholder="Ej. Efectivo"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Núm. Verificaciones *</label>
                  <input
                    type="number"
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
                  placeholder="Ej. $420"
                />
              </div>

              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="pagadoCheck"
                  name="pagadoCheck"
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="pagadoCheck">
                  Pagado Completo
                </label>
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
                    placeholder="Ej. Alberto Fuentes"
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
                    placeholder="Ej. Mario Castaño"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Comentario</label>
                <textarea
                  className="form-control"
                  rows="3"
                  name="comentario"
                  value={formData.comentario}
                  onChange={handleChange}
                  placeholder="Ingrese un comentario opcional"
                ></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-light" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Crear nota
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}