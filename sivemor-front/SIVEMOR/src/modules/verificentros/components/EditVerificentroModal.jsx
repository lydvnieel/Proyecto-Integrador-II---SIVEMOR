import { useEffect, useState } from "react";

export default function EditVerificentroModal({ item, onSave, regiones = [] }) {
  const [formData, setFormData] = useState({
    nombre: "",
    clave: "",
    direccion: "",
    idRegion: "",
    responsable: "",
    telefonoPrincipal: "",
    telefonoAlternativo: "",
    correo: "",
    horario: "",
  });

  const [originalData, setOriginalData] = useState({
    nombre: "",
    clave: "",
    direccion: "",
    idRegion: "",
    responsable: "",
    telefonoPrincipal: "",
    telefonoAlternativo: "",
    correo: "",
    horario: "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (item) {
      const verificentroData = {
        nombre: item.nombre || "",
        clave: item.clave || "",
        direccion: item.direccion || "",
        idRegion: item.idRegion || "",
        responsable: item.responsable || "",
        telefonoPrincipal: item.telefonoPrincipal || "",
        telefonoAlternativo: item.telefonoAlternativo || "",
        correo: item.correo || "",
        horario: item.horario || "",
      };

      setFormData(verificentroData);
      setOriginalData(verificentroData);
      setError("");
      setSaving(false);
    }
  }, [item]);

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
    return JSON.stringify(cleanedData) === JSON.stringify(originalData);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const cleanedData = {
      nombre: formData.nombre.trim(),
      clave: formData.clave.trim(),
      direccion: formData.direccion.trim(),
      idRegion: formData.idRegion,
      responsable: formData.responsable.trim(),
      telefonoPrincipal: formData.telefonoPrincipal.trim(),
      telefonoAlternativo: formData.telefonoAlternativo.trim(),
      correo: formData.correo.trim(),
      horario: formData.horario.trim(),
    };

    if (
      !cleanedData.nombre ||
      !cleanedData.clave ||
      !cleanedData.direccion ||
      !cleanedData.idRegion ||
      !cleanedData.responsable ||
      !cleanedData.telefonoPrincipal ||
      !cleanedData.correo ||
      !cleanedData.horario
    ) {
      setError("Faltan campos obligatorios por llenar.");
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

    if (cleanedData.correo && !emailRegex.test(cleanedData.correo)) {
      setError("El correo electrónico no tiene un formato válido.");
      return;
    }

    if (isSameData(cleanedData)) {
      setError("No se realizaron cambios en el verificentro.");
      return;
    }

    try {
      setSaving(true);
      await onSave(cleanedData);
    } catch (err) {
      setError(err.message || "No se pudo actualizar el verificentro.");
    } finally {
      setSaving(false);
    }
  };

  if (!item) return null;

  return (
    <div
      className="modal fade"
      id="editVerificentroModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSave}>
            <div className="modal-header">
              <h5 className="modal-title">Editar verificentro</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                disabled={saving}
              ></button>
            </div>

            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">NOMBRE *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">CLAVE *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="clave"
                    value={formData.clave}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">DIRECCIÓN *</label>
                <input
                  type="text"
                  className="form-control"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">REGIÓN *</label>
                  <select
                    className="form-select"
                    name="idRegion"
                    value={formData.idRegion}
                    onChange={handleChange}
                    disabled={saving}
                  >
                    <option value="">Selecciona una región</option>
                    {regiones.map((region) => (
                      <option
                        key={region.id ?? region.idRegion}
                        value={region.id ?? region.idRegion}
                      >
                        {region.nombre ?? region.region ?? region.nombreRegion}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">RESPONSABLE *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="responsable"
                    value={formData.responsable}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">TELÉFONO PRINCIPAL *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="telefonoPrincipal"
                    value={formData.telefonoPrincipal}
                    onChange={handleChange}
                    inputMode="numeric"
                    disabled={saving}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">TELÉFONO ALTERNATIVO</label>
                  <input
                    type="text"
                    className="form-control"
                    name="telefonoAlternativo"
                    value={formData.telefonoAlternativo}
                    onChange={handleChange}
                    inputMode="numeric"
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">CORREO ELECTRÓNICO *</label>
                <input
                  type="text"
                  className="form-control"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">HORARIO *</label>
                <input
                  type="text"
                  className="form-control"
                  name="horario"
                  value={formData.horario}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light"
                data-bs-dismiss="modal"
                disabled={saving}
              >
                Cancelar
              </button>

              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}