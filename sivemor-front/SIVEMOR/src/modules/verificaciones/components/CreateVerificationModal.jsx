import { useEffect, useState } from "react";
import Modal from "bootstrap/js/dist/modal";
import { catalogosVerificacionService } from "../services/catalogosVerificacion";

const ALLOWED_MATERIAS = ["MOTRIZ", "ARRASTRE", "GASOLINA", "HUMO"];

const initialForm = {
  idNota: "",
  idVehiculo: "",
  materia: "",
  precio: "",
  multa: "",
};

export default function CreateVerificationModal({ onCreate }) {
  const [formData, setFormData] = useState(initialForm);
  const [notas, setNotas] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [error, setError] = useState("");
  const [loadingCatalogs, setLoadingCatalogs] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCatalogs();
  }, []);

  const loadCatalogs = async () => {
    try {
      setLoadingCatalogs(true);
      const [notasData, vehiculosData] = await Promise.all([
        catalogosVerificacionService.getNotas(),
        catalogosVerificacionService.getVehiculos(),
      ]);

      setNotas(notasData);
      setVehiculos(vehiculosData);
    } catch (err) {
      console.error("Error cargando catálogos:", err);
      setError("No se pudieron cargar notas y vehículos.");
    } finally {
      setLoadingCatalogs(false);
    }
  };

  const resetForm = () => {
    setFormData(initialForm);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "materia") {
      newValue = value.toUpperCase();
    }

    if (name === "precio" || name === "multa") {
      newValue = value.replace(/[^0-9.]/g, "");
      const parts = newValue.split(".");
      if (parts.length > 2) {
        newValue = `${parts[0]}.${parts.slice(1).join("")}`;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedData = {
      idNota: formData.idNota ? Number(formData.idNota) : null,
      idVehiculo: formData.idVehiculo ? Number(formData.idVehiculo) : null,
      materia: formData.materia.trim().toUpperCase(),
      precio: formData.precio ? Number(formData.precio) : null,
      multa: formData.multa ? Number(formData.multa) : null,
    };

    if (
      !cleanedData.idNota ||
      !cleanedData.idVehiculo ||
      !cleanedData.materia ||
      cleanedData.precio === null
    ) {
      setError("Faltan campos obligatorios por llenar.");
      return;
    }

    if (!ALLOWED_MATERIAS.includes(cleanedData.materia)) {
      setError("La materia solo puede ser: MOTRIZ, ARRASTRE, GASOLINA o HUMO.");
      return;
    }

    if (Number.isNaN(cleanedData.precio) || cleanedData.precio <= 0) {
      setError("El precio debe ser un valor numérico positivo mayor que cero.");
      return;
    }

    try {
      setSaving(true);
      await onCreate(cleanedData);

      const createModalElement = document.getElementById("createVerificationModal");
      const successModalElement = document.getElementById(
        "createVerificationSuccessModal"
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
      console.error("Error al crear verificación:", err);
      setError(
        err?.response?.data?.message || "No se pudo crear la verificación."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="createVerificationModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Nueva verificación</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {loadingCatalogs ? (
                <div className="text-center py-3">Cargando datos...</div>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="form-label">Nota *</label>
                    <select
                      className="form-select"
                      name="idNota"
                      value={formData.idNota}
                      onChange={handleChange}
                    >
                      <option value="">Selecciona una nota</option>
                      {notas.map((nota) => (
                        <option
                          key={nota.id ?? nota.idNota}
                          value={nota.id ?? nota.idNota}
                        >
                          {nota.folioNota ??
                            nota.numeroNota ??
                            `Nota #${nota.id ?? nota.idNota}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Vehículo *</label>
                    <select
                      className="form-select"
                      name="idVehiculo"
                      value={formData.idVehiculo}
                      onChange={handleChange}
                    >
                      <option value="">Selecciona un vehículo</option>
                      {vehiculos.map((vehiculo) => (
                        <option
                          key={vehiculo.id ?? vehiculo.idVehiculo}
                          value={vehiculo.id ?? vehiculo.idVehiculo}
                        >
                          {vehiculo.placa} - {vehiculo.serie}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Materia *</label>
                    <select
                      className="form-select"
                      name="materia"
                      value={formData.materia}
                      onChange={handleChange}
                    >
                      <option value="">Selecciona una materia</option>
                      {ALLOWED_MATERIAS.map((materia) => (
                        <option key={materia} value={materia}>
                          {materia}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Precio *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="precio"
                      value={formData.precio}
                      onChange={handleChange}
                      placeholder="Ej. 320"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Multa</label>
                    <input
                      type="text"
                      className="form-control"
                      name="multa"
                      value={formData.multa}
                      onChange={handleChange}
                      placeholder="Ej. 120"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>

              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Creando..." : "Crear verificación"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}