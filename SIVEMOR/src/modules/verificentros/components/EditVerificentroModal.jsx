import { useEffect, useState } from "react";

export default function EditVerificentroModal({ item, onSave }) {
  const [formData, setFormData] = useState({
    nombre: "",
    clave: "",
    direccion: "",
    region: "",
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
    region: "",
    responsable: "",
    telefonoPrincipal: "",
    telefonoAlternativo: "",
    correo: "",
    horario: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (item) {
      const verificentroData = {
        nombre: item.nombre || "",
        clave: item.clave || "",
        direccion: item.direccion || "",
        region: item.region || "",
        responsable: item.responsable || "",
        telefonoPrincipal: item.telefonoPrincipal || "",
        telefonoAlternativo: item.telefonoAlternativo || "",
        correo: item.correo || "",
        horario: item.horario || "",
      };

      setFormData(verificentroData);
      setOriginalData(verificentroData);
      setError("");
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const isSameData = () => {
    return (
      formData.nombre.trim() === originalData.nombre.trim() &&
      formData.clave.trim() === originalData.clave.trim() &&
      formData.direccion.trim() === originalData.direccion.trim() &&
      formData.region.trim() === originalData.region.trim() &&
      formData.responsable.trim() === originalData.responsable.trim() &&
      formData.telefonoPrincipal.trim() === originalData.telefonoPrincipal.trim() &&
      formData.telefonoAlternativo.trim() ===
        originalData.telefonoAlternativo.trim() &&
      formData.correo.trim() === originalData.correo.trim() &&
      formData.horario.trim() === originalData.horario.trim()
    );
  };

  const handleSave = (e) => {
    e.preventDefault();

    const cleanedData = {
      nombre: formData.nombre.trim(),
      clave: formData.clave.trim(),
      direccion: formData.direccion.trim(),
      region: formData.region.trim(),
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
      !cleanedData.region ||
      !cleanedData.responsable ||
      !cleanedData.telefonoPrincipal ||
      !cleanedData.correo ||
      !cleanedData.horario
    ) {
      setError("Faltan campos obligatorios por llenar.");
      return;
    }

    if (isSameData()) {
      setError("No se realizaron cambios en el verificentro.");
      return;
    }

    onSave(cleanedData);
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
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">REGIÓN *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">RESPONSABLE *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="responsable"
                    value={formData.responsable}
                    onChange={handleChange}
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
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">CORREO ELECTRÓNICO *</label>
                <input
                  type="email"
                  className="form-control"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
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
                />
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

              <button type="submit" className="btn btn-primary">
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}