import { useState } from "react";

export default function CreateCostModal({ onCreate }) {
  const [formData, setFormData] = useState({
    cliente: "",
    materia: "",
    costo: "",
    encargado: "",
    atiendeCobra: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);

    setFormData({
      cliente: "",
      materia: "",
      costo: "",
      encargado: "",
      atiendeCobra: "",
    });
  };

  return (
    <div
      className="modal fade"
      id="createCostModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Nuevo costo</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Cliente *</label>
                <input
                  type="text"
                  className="form-control"
                  name="cliente"
                  value={formData.cliente}
                  onChange={handleChange}
                  placeholder="Ej: Pedro Cabrera"
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
                  placeholder="Ej. Motriz"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Costo *</label>
                <input
                  type="text"
                  className="form-control"
                  name="costo"
                  value={formData.costo}
                  onChange={handleChange}
                  placeholder="Ej. $320"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Encargado *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="encargado"
                    value={formData.encargado}
                    onChange={handleChange}
                    placeholder="Ej. Renato Baez"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Atiende y cobra</label>
                  <input
                    type="text"
                    className="form-control"
                    name="atiendeCobra"
                    value={formData.atiendeCobra}
                    onChange={handleChange}
                    placeholder="Ej. Juan Carlos"
                  />
                </div>
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
              >
                Crear costo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}