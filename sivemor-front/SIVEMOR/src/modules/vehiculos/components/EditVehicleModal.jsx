import { useEffect, useState } from "react";
import Modal from "bootstrap/js/dist/modal";

export default function EditVehicleModal({ vehicle, onSave }) {
  const [formData, setFormData] = useState({
    id: "",
    placa: "",
    serie: "",
    tipo: "",
    idCliente: null,
    idCedis: null
  });

  const [originalData, setOriginalData] = useState({
    placa: "",
    serie: "",
    tipo: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const placaRegex = /^[A-Z]{2,3}-\d{3}-[A-Z]{1,2}$/;
  const serieRegex = /^[A-HJ-NPR-Z0-9]{17}$/;

  useEffect(() => {
    if (vehicle) {
      const vehicleData = {
        id: vehicle.id || vehicle.idVehiculo || "",
        placa: (vehicle.placa || "").toUpperCase(),
        serie: (vehicle.serie || "").toUpperCase(),
        tipo: vehicle.tipo || "",
        idCliente: vehicle.idCliente || vehicle.cliente?.id || null,
        idCedis: vehicle.idCedis || vehicle.cedis?.id || null,
      };

      setFormData(vehicleData);
      setOriginalData({
        placa: vehicleData.placa,
        serie: vehicleData.serie,
        tipo: vehicleData.tipo,
      });
      setError("");
    }
  }, [vehicle]);

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

  const isSameData = (cleanedData) => {
    return (
      cleanedData.placa === originalData.placa.trim().toUpperCase() &&
      cleanedData.serie === originalData.serie.trim().toUpperCase() &&
      cleanedData.tipo === originalData.tipo.trim()
    );
  };

  const handleSave = () => {
    const cleanedData = {
      id: Number(formData.id),
      idCliente: Number(formData.idCliente),
    idCedis: Number(formData.idCedis),
      placa: formData.placa.trim().toUpperCase(),
      serie: formData.serie.trim().toUpperCase(),
      tipo: formData.tipo.trim(),
    };

    if(!cleanedData.id){
      setError("No se encontro el vehículo.")
    }

    if (!cleanedData.placa || !cleanedData.serie || !cleanedData.tipo) {
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

    if (isSameData(cleanedData)) {
      setError("No se realizaron cambios en el vehículo");
      return;
    }

    onSave(cleanedData);
    setError("");

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

            <form className="col mt-4" onSubmit={(e) => e.preventDefault()}>
              <div className="row mb-3">
                <div className="col">
                  <label><small>Placa</small></label>
                  <input
                    type="text"
                    name="placa"
                    className="form-control"
                    value={formData.placa}
                    onChange={handleChange}
                    placeholder="ABC-123-A"
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
                    placeholder="1HGCM82633A123456"
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
                        id="edit-rabon"
                        value="Camión Rabón"
                        checked={formData.tipo === "Camión Rabón"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="edit-rabon">
                        Camión Rabón
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="tipo"
                        id="edit-rigido"
                        value="Camión Rígido (4x2)"
                        checked={formData.tipo === "Camión Rígido (4x2)"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="edit-rigido">
                        Camión Rígido (4x2)
                      </label>
                    </div>
                  </div>
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