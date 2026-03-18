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
      const data = {
        placa: vehicle.placa || "",
        serie: vehicle.serie || "",
        tipo: vehicle.tipo || "",
      };

      setFormData(data);
      setOriginalData(data);
      setError("");
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isSameData = () => {
    return (
      formData.placa.trim() === originalData.placa.trim() &&
      formData.serie.trim() === originalData.serie.trim() &&
      formData.tipo.trim() === originalData.tipo.trim()
    );
  };

  const handleSave = () => {
    if (
      !formData.placa.trim() ||
      !formData.serie.trim() ||
      !formData.tipo.trim()
    ) {
      setError("Faltan campos por llenar");
      return;
    }

    if (isSameData()) {
      setError("No se realizaron cambios en el vehículo");
      return;
    }

    setError("");
    onSave(formData);

    const editModalElement = document.getElementById("editVehicleModal");
    const editModalInstance = Modal.getOrCreateInstance(editModalElement);
    editModalInstance.hide();

    setTimeout(() => {
      const successModalElement = document.getElementById(
        "successfulUpdateVehicleModal"
      );

      if (successModalElement) {
        const successModalInstance =
          Modal.getOrCreateInstance(successModalElement);
        successModalInstance.show();
      }
    }, 200);
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
                  <label><small>Placa</small></label>
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
                  <label><small>Serie</small></label>
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
                  <label><small>Tipo</small></label>
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