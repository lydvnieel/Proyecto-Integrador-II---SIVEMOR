import { useEffect, useState } from "react";
import Modal from "bootstrap/js/dist/modal";

export default function EditCedisModal({ cedis, onSave, clientes = [], regiones = [] }) {
  const [formData, setFormData] = useState({
    nombre: "",
    idCliente: "",
    idRegion: "",
    direccion: "",
    encargado: "",
    correo: "",
    telefonoPrincipal: "",
    telefonoAlternativo: "",
  });

  const [originalData, setOriginalData] = useState({
    nombre: "",
    idCliente: "",
    idRegion: "",
    direccion: "",
    encargado: "",
    correo: "",
    telefonoPrincipal: "",
    telefonoAlternativo: "",
  });

  const [error, setError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (cedis) {
      const cedisData = {
        nombre: cedis.nombre || "",
        idCliente: cedis.idCliente ?? "",
        idRegion: cedis.idRegion ?? "",
        direccion: cedis.direccion || "",
        encargado: cedis.encargado || "",
        correo: cedis.correo || "",
        telefonoPrincipal: cedis.telefonoPrincipal || "",
        telefonoAlternativo: cedis.telefonoAlternativo || "",
      };

      setFormData(cedisData);
      setOriginalData(cedisData);
      setError("");
    }
  }, [cedis]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "telefonoPrincipal" || name === "telefonoAlternativo") {
      newValue = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (error) setError("");
  };

  const isSameData = (cleanedData) => {
    return (
      cleanedData.nombre === String(originalData.nombre).trim() &&
      Number(cleanedData.idCliente) === Number(originalData.idCliente) &&
      Number(cleanedData.idRegion) === Number(originalData.idRegion) &&
      cleanedData.direccion === String(originalData.direccion).trim() &&
      cleanedData.encargado === String(originalData.encargado).trim() &&
      cleanedData.correo === String(originalData.correo).trim() &&
      cleanedData.telefonoPrincipal === String(originalData.telefonoPrincipal).trim() &&
      cleanedData.telefonoAlternativo === String(originalData.telefonoAlternativo).trim()
    );
  };

  const handleSave = async () => {
    const cleanedData = {
      nombre: formData.nombre.trim(),
      idCliente: formData.idCliente ? Number(formData.idCliente) : "",
      idRegion: formData.idRegion ? Number(formData.idRegion) : "",
      direccion: formData.direccion.trim(),
      encargado: formData.encargado.trim(),
      correo: formData.correo.trim(),
      telefonoPrincipal: formData.telefonoPrincipal.trim(),
      telefonoAlternativo: formData.telefonoAlternativo.trim(),
    };

    if (
      !cleanedData.nombre ||
      !cleanedData.idCliente ||
      !cleanedData.idRegion ||
      !cleanedData.direccion ||
      !cleanedData.encargado ||
      !cleanedData.telefonoPrincipal
    ) {
      setError("Faltan campos por llenar");
      return;
    }

    if (cleanedData.correo && !emailRegex.test(cleanedData.correo)) {
      setError("El correo electrónico no tiene un formato válido.");
      return;
    }

    if (!/^\d+$/.test(cleanedData.telefonoPrincipal)) {
      setError("El teléfono principal solo debe contener números.");
      return;
    }

    if (
      cleanedData.telefonoAlternativo &&
      !/^\d+$/.test(cleanedData.telefonoAlternativo)
    ) {
      setError("El teléfono alternativo solo debe contener números.");
      return;
    }

    if (isSameData(cleanedData)) {
      setError("No se realizaron cambios en el CEDIS");
      return;
    }

    try {
      await onSave(cleanedData);
      setError("");

      const editModalElement = document.getElementById("editCedisModal");
      const successModalElement = document.getElementById("updateCedisSuccessModal");

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
    } catch (err) {
      setError("No se pudo actualizar el CEDIS.");
      console.error(err);
    }
  };

  if (!cedis) return null;

  return (
    <div
      className="modal fade"
      id="editCedisModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar CEDIS</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div className="modal-body">
            {error && (
              <div className="alert alert-danger mt-3 mb-0" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-3">
                <label className="form-label">Nombre del CEDIS *</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Cliente *</label>
                <select
                  className="form-control"
                  name="idCliente"
                  value={formData.idCliente}
                  onChange={handleChange}
                >
                  <option value="">Selecciona un cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Región *</label>
                <select
                  className="form-control"
                  name="idRegion"
                  value={formData.idRegion}
                  onChange={handleChange}
                >
                  <option value="">Selecciona una región</option>
                  {regiones.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Dirección Completa *</label>
                <textarea
                  className="form-control"
                  rows="2"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">Encargado *</label>
                <input
                  type="text"
                  className="form-control"
                  name="encargado"
                  value={formData.encargado}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Correo Electrónico</label>
                <input
                  type="text"
                  className="form-control"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Teléfono Principal *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="telefonoPrincipal"
                    value={formData.telefonoPrincipal}
                    onChange={handleChange}
                    inputMode="numeric"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Teléfono Alternativo</label>
                  <input
                    type="text"
                    className="form-control"
                    name="telefonoAlternativo"
                    value={formData.telefonoAlternativo}
                    onChange={handleChange}
                    inputMode="numeric"
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-light" data-bs-dismiss="modal">
              Cancelar
            </button>

            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}