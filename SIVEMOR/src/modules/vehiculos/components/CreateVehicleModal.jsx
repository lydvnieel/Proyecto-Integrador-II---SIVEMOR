import { useState } from "react";
import Modal from "bootstrap/js/dist/modal";

export default function CreateVehicleModal({ onSave }) {
  const [formData, setFormData] = useState({
    placa: "",
    serie: "",
    tipo: "",
    cedis: "",
    region: "",
  });

  const [error, setError] = useState("");

  const resetForm = () => {
    setFormData({
      placa: "",
      serie: "",
      tipo: "",
      cedis: "",
      region: "",
    });
    setError("");
  };

  const placaRegex = /^[A-Z]{2,3}-\d{3}-[A-Z]{1,2}$/;
  const serieRegex = /^[A-HJ-NPR-Z0-9]{17}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "placa" || name === "serie") {
      newValue = value.toUpperCase();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (error) setError("");
  };

  const handleCreate = () => {
    const cleanedData = {
      placa: formData.placa.trim().toUpperCase(),
      serie: formData.serie.trim().toUpperCase(),
      tipo: formData.tipo.trim(),
      cedis: formData.cedis.trim(),
      region: formData.region.trim(),
    };

    if (
      !cleanedData.placa ||
      !cleanedData.serie ||
      !cleanedData.tipo ||
      !cleanedData.cedis ||
      !cleanedData.region
    ) {
      setError("Faltan campos por llenar");
      return;
    }

    if (!placaRegex.test(cleanedData.placa)) {
      setError("La placa no tiene un formato válido. Ejemplo: ABC-123-A o AB-123-CD");
      return;
    }

    if (!serieRegex.test(cleanedData.serie)) {
      setError("La serie debe tener 17 caracteres alfanuméricos y no puede incluir I, O o Q");
      return;
    }

    onSave(cleanedData);

    const createModalElement = document.getElementById("createVehicleModal");
    const successModalElement = document.getElementById(
      "successfulCreateVehicleModal"
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
            <h4 id="createVehicleModalLabel">
              <strong>Nuevo vehículo</strong>
            </h4>

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
                    placeholder="Ej. ABC-123-A"
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
                    placeholder="Ej. 1HGCM82633A123456"
                    value={formData.serie}
                    onChange={handleChange}
                    maxLength={17}
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
                <i className="bi bi-file-earmark-plus"></i>&nbsp;Crear Vehículo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}