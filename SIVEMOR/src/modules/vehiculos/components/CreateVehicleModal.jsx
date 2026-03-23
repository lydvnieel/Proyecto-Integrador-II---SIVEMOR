import { useState } from "react";
import Modal from "bootstrap/js/dist/modal";

export default function CrearVehiculoModal({ onSave }) {
  const [formData, setFormData] = useState({
    placa: "",
    serie: "",
    tipo: "",
    cedis: "",
    region: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleCreate = () => {
    const placa = formData.placa.trim();
    const serie = formData.serie.trim();
    const tipo = formData.tipo.trim();
    const cedis = formData.cedis.trim();
    const region = formData.region.trim();

    if (!placa || !serie || !tipo || !cedis || !region) {
      setError("Faltan campos por llenar");
      return;
    }

    onSave({
      placa,
      serie,
      tipo,
      cedis,
      region,
    });

    const createModalElement = document.getElementById("createVehicleModal");
    const createModalInstance = Modal.getOrCreateInstance(createModalElement);

    const handleHidden = () => {
      createModalElement.removeEventListener("hidden.bs.modal", handleHidden);

      setFormData({
        placa: "",
        serie: "",
        tipo: "",
        cedis: "",
        region: "",
      });

      const successModalElement = document.getElementById(
        "successfulCreateVehicleModal"
      );

      if (successModalElement) {
        const successModalInstance =
          Modal.getOrCreateInstance(successModalElement);
        successModalInstance.show();
      }
    };

    createModalElement.addEventListener("hidden.bs.modal", handleHidden);
    createModalInstance.hide();
  };

  return (
    <div
      className="modal fade"
      id="createVehicleModal"
      tabIndex={-1}
      aria-labelledby="createVehicleModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-3">
          <div className="modal-body">
            <h4 id="createVehicleModalLabel">Nuevo vehículo</h4>

            {error && (
              <div className="alert alert-danger mt-3 mb-0" role="alert">
                {error}
              </div>
            )}

            <form className="col mt-4" onSubmit={(e) => e.preventDefault()}>
              <div className="row mb-3">
                <div className="col">
                  <label><small>Placa</small></label>
                  <input
                    type="text"
                    name="placa"
                    className="form-control"
                    placeholder="Ej. AB-123-CD"
                    value={formData.placa}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label><small>Serie</small></label>
                  <input
                    type="text"
                    name="serie"
                    className="form-control"
                    placeholder="Ej. ABC123456789"
                    value={formData.serie}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label className="form-label"><small>Tipo</small></label>

                  <div className="d-flex gap-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="tipo"
                        id="rabon"
                        value="Camión Rabón"
                        checked={formData.tipo === "Camión Rabón"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="rabon">
                        Camión Rabón
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="tipo"
                        id="rigido"
                        value="Camión Rígido (4x2)"
                        checked={formData.tipo === "Camión Rígido (4x2)"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="rigido">
                        Camión Rígido (4x2)
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label><small>CEDIS</small></label>
                  <input
                    type="text"
                    name="cedis"
                    className="form-control"
                    placeholder="Ej. Monterrey Norte"
                    value={formData.cedis}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label><small>Región</small></label>
                  <input
                    type="text"
                    name="region"
                    className="form-control"
                    placeholder="Ej. Norte"
                    value={formData.region}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </form>

            <div className="text-end mt-3">
              <button
                type="button"
                className="btn btn-light me-2 border border-secondary-subtle mt-3"
                data-bs-dismiss="modal"
                style={{ width: 99, height: 40 }}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn btn-primary mt-3"
                onClick={handleCreate}
            >
                Crear vehículo
            </button>
            </div>
        </div>
        </div>
    </div>
    </div>
);
}