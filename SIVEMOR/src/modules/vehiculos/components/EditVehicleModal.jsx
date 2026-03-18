import { useEffect, useState } from "react";
import Modal from "bootstrap/js/dist/modal";

export default function EditVehicleModal({ vehicle, onSave }) {
  const [formData, setFormData] = useState({
    placa: "",
    serie: "",
    tipo: "",
  });

  const [originalData, setOriginalData] = useState({
    placa: "",
    serie: "",
    tipo: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (vehicle) {
      const vehicleData = {
        placa: vehicle.placa || "",
        serie: vehicle.serie || "",
        tipo: vehicle.tipo || "",
      };

      setFormData(vehicleData);
      setOriginalData(vehicleData);
      setError("");
    }
  }, [vehicle]);

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

  const handleSave = () => {
    const cleanedData = {
      placa: formData.placa.trim(),
      serie: formData.serie.trim(),
      tipo: formData.tipo.trim(),
    };

    if (!cleanedData.placa || !cleanedData.serie || !cleanedData.tipo) {
      setError("Faltan campos por llenar");
      return;
    }

    const noChanges =
      cleanedData.placa === originalData.placa &&
      cleanedData.serie === originalData.serie &&
      cleanedData.tipo === originalData.tipo;

    if (noChanges) {
      setError("No hiciste ningún cambio");
      return;
    }

    setError("");
    onSave(cleanedData);

    const editModalElement = document.getElementById("editVehicleModal");
    const successModalElement = document.getElementById(
      "successfulUpdateVehicleModal"
    );

    if (!editModalElement || !successModalElement) return;

    const editModalInstance = Modal.getOrCreateInstance(editModalElement);
    const successModalInstance = Modal.getOrCreateInstance(successModalElement);

    editModalElement.addEventListener(
      "hidden.bs.modal",
      () => {
        successModalInstance.show();
      },
      { once: true }
    );

    editModalInstance.hide();
  };

  return (
    <div
      className="modal fade"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      id="editVehicleModal"
      tabIndex={-1}
      aria-labelledby="editVehicleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-3">
          <div className="modal-body">
            <h4 id="editVehicleModalLabel">
              <strong>Editar vehículo</strong>
            </h4>

            {error && (
              <div className="alert alert-danger mt-3 mb-0" role="alert">
                {error}
              </div>
            )}

            <form className="col mt-4">
              <div className="row mb-3">
                <div className="col">
                  <label>
                    <small>Placa</small>
                  </label>
                  <input
                    type="text"
                    name="placa"
                    className="form-control"
                    value={formData.placa}
                    onChange={handleChange}
                    placeholder="AB-123-CD"
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label>
                    <small>Serie</small>
                  </label>
                  <input
                    type="text"
                    name="serie"
                    className="form-control"
                    value={formData.serie}
                    onChange={handleChange}
                    placeholder="XYZ987654321"
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label>
                    <small>Tipo</small>
                  </label>
                  <input
                    type="text"
                    name="tipo"
                    className="form-control"
                    value={formData.tipo}
                    onChange={handleChange}
                    placeholder="Camión rabón / Camión rígido"
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
                onClick={handleSave}
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}