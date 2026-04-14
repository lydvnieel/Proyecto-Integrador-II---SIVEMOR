import { useEffect, useMemo, useState } from "react";
import Modal from "bootstrap/js/dist/modal";
import { api } from "../../../../server/api";

export default function CreateVehicleModal({ onSave }) {
  const [clientes, setClientes] = useState([]);
  const [cedisList, setCedisList] = useState([]);

  const [formData, setFormData] = useState({
    idCliente: "",
    idCedis: "",
    placa: "",
    serie: "",
    tipo: "",
  });

  const [error, setError] = useState("");

  const placaRegex = /^[A-Z]{2,3}-\d{3}-[A-Z]{1,2}$/;
  const serieRegex = /^[A-HJ-NPR-Z0-9]{17}$/;

  const resetForm = () => {
    setFormData({
      idCliente: "",
      idCedis: "",
      placa: "",
      serie: "",
      tipo: "",
    });
    setError("");
  };

  useEffect(() => {
    cargarClientes();
    cargarCedis();
  }, []);

  const cargarClientes = async () => {
    try {
      const res = await api.get("/clientes");
      console.log("CLIENTES:", res.data);
      setClientes(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Error al cargar clientes:", err);
    }
  };

  const cargarCedis = async () => {
    try {
      const res = await api.get("/cedis");
      console.log("CEDIS:", res.data);
      setCedisList(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Error al cargar CEDIS:", err);
    }
  };

  const cedisFiltrados = useMemo(() => {
    if (!formData.idCliente) return [];

    return cedisList.filter((cedis) => {
      const clienteId =
        cedis?.cliente?.id ??
        cedis?.idCliente ??
        cedis?.clienteId ??
        cedis?.cliente_id;

      return Number(clienteId) === Number(formData.idCliente);
    });
  }, [cedisList, formData.idCliente]);

  const cedisSeleccionado = useMemo(() => {
  return cedisList.find(
    (cedis) => Number(cedis.id || cedis.idCedis) === Number(formData.idCedis)
  );
}, [cedisList, formData.idCedis]);

  const regionMostrada =
    cedisSeleccionado?.region?.nombre || cedisSeleccionado?.region || "";

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "placa" || name === "serie") {
      newValue = value.toUpperCase();
    }

    if (name === "idCliente") {
      setFormData((prev) => ({
        ...prev,
        idCliente: value,
        idCedis: "",
      }));
      if (error) setError("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (error) setError("");
  };

  const handleCreate = async () => {
    const cleanedData = {
      idCliente: Number(formData.idCliente),
      idCedis: Number(formData.idCedis),
      placa: formData.placa.trim().toUpperCase(),
      serie: formData.serie.trim().toUpperCase(),
      tipo: formData.tipo.trim(),
    };

    if (
      !cleanedData.idCliente ||
      !cleanedData.idCedis ||
      !cleanedData.placa ||
      !cleanedData.serie ||
      !cleanedData.tipo
    ) {
      setError("Faltan campos obligatorios por llenar");
      return;
    }

    if (!placaRegex.test(cleanedData.placa)) {
      setError(
        "La placa no tiene un formato válido. Ejemplo: ABC-123-A o AB-123-CD",
      );
      return;
    }

    if (!serieRegex.test(cleanedData.serie)) {
      setError(
        "La serie debe tener 17 caracteres alfanuméricos y no puede incluir I, O o Q",
      );
      return;
    }

    const payload = {
      idCliente: cleanedData.idCliente,
      idCedis: cleanedData.idCedis,
      placa: cleanedData.placa,
      serie: cleanedData.serie,
      tipo: cleanedData.tipo,
    };

    try {
      await onSave(payload);
    } catch (err) {
      console.error("Error al guardar vehículo:", err);
      setError(
        err?.response?.data?.message || "No se pudo guardar el vehículo",
      );
      return;
    }

    const createModalElement = document.getElementById("createVehicleModal");
    const successModalElement = document.getElementById(
      "successfulCreateVehicleModal",
    );

    if (!createModalElement || !successModalElement) {
      resetForm();
      return;
    }

    const createModalInstance = Modal.getOrCreateInstance(createModalElement);
    const successModalInstance = Modal.getOrCreateInstance(successModalElement);

    const cleanupModalArtifacts = () => {
    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("padding-right");
    document.body.style.removeProperty("overflow");

    document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
      backdrop.remove();
    });
  };

  createModalElement.addEventListener(
    "hidden.bs.modal",
    () => {
      cleanupModalArtifacts();
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
                  <label>
                    <small>Cliente</small>
                  </label>
                  <select
                    name="idCliente"
                    className="form-control"
                    value={formData.idCliente}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona un cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.razonSocial ||
                          cliente.nombre ||
                          `Cliente ${cliente.id}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label>
                    <small>CEDIS</small>
                  </label>
                  <select
                    name="idCedis"
                    className="form-control"
                    value={formData.idCedis}
                    onChange={handleChange}
                    disabled={!formData.idCliente}
                  >
                    <option value="">
                      {!formData.idCliente
                        ? "Primero selecciona un cliente"
                        : "Selecciona un CEDIS"}
                    </option>
                    {cedisFiltrados.map((cedis) => (
                      <option
                        key={cedis.id || cedis.idCedis}
                        value={cedis.id || cedis.idCedis}
                      >
                        {cedis.nombre || cedis.nombreCedis}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label>
                    <small>Región</small>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={regionMostrada}
                    placeholder="Se completa al seleccionar un CEDIS"
                    readOnly
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label>
                    <small>Placa</small>
                  </label>
                  <input
                    type="text"
                    name="placa"
                    className="form-control"
                    placeholder="Ej. ABC-123-A"
                    value={formData.placa}
                    onChange={handleChange}
                    maxLength={10}
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
                    placeholder="Ej. 1HGCM82633A123456"
                    value={formData.serie}
                    onChange={handleChange}
                    maxLength={17}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">
                    <small>Tipo</small>
                  </label>

                  <div className="d-flex gap-4 flex-wrap">
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
                        value="Camión rígido de dos ejes (4x2) con doble rodada trasera"
                        checked={
                          formData.tipo ===
                          "Camión rígido de dos ejes (4x2) con doble rodada trasera"
                        }
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="rigido">
                        Camión rígido de dos ejes (4x2)
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
                onClick={resetForm}
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
