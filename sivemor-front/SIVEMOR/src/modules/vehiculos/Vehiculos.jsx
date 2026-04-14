import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "bootstrap/js/dist/modal";
import Admin from "../../components/Admin";
import CreateVehicleModal from "../vehiculos/components/CreateVehicleModal";
import DeleteVehicleModal from "../vehiculos/components/DeleteVehicleModal";
import DeleteAllModal from "../vehiculos/components/DeleteAllModal";
import EditVehicleModal from "../vehiculos/components/EditVehicleModal";
import SuccessfulDeleteModal from "../vehiculos/components/SuccessfulDeleteModal";
import SuccessfulCreationModal from "../vehiculos/components/SuccessfulCreationModal";
import SuccessfulUpdateModal from "../vehiculos/components/SuccessfulUpdateModal";
import VehicleRow from "../vehiculos/components/VehicleRow";
import {api} from "../../../server/api"

export default function Vehiculos() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);

  const [selectedRows, setSelectedRows] = useState({});
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
  cargarVehiculos();
}, []);

const extractArray = (res) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.data?.content)) return res.data.content;
  return [];
};

const cargarVehiculos = async () => {
  try {
    const res = await api.get("/vehiculos");
    const lista = extractArray(res);
    console.log("Vehículos cargados:", lista);
    setVehicles(lista);
  } catch (error) {
    console.error("Error al cargar vehículos:", error);
    setVehicles([]);
  }
};

  const filteredVehicles = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return vehicles;

    return vehicles.filter((vehicle) => {
      return (
        vehicle.placa?.toLowerCase().includes(term) ||
        vehicle.serie?.toLowerCase().includes(term) ||
        vehicle.cedis?.toLowerCase().includes(term) ||
        vehicle.region?.toLowerCase().includes(term)
      );
    });
  }, [vehicles, search]);

  const cleanupModalArtifacts = () => {
    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("padding-right");
    document.body.style.removeProperty("overflow");

    document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
      backdrop.remove();
    });
  };

  const showDeleteSuccessModal = (message, sourceModalId) => {
    setDeleteMessage(message);

    const sourceModalElement = document.getElementById(sourceModalId);
    const successModalElement = document.getElementById(
      "successfulDeleteVehicleModal"
    );

    if (!sourceModalElement || !successModalElement) return;

    const sourceModalInstance = Modal.getOrCreateInstance(sourceModalElement);
    const successModalInstance = Modal.getOrCreateInstance(successModalElement);

    sourceModalElement.addEventListener(
      "hidden.bs.modal",
      () => {
        cleanupModalArtifacts();
        successModalInstance.show();
      },
      { once: true }
    );

    sourceModalInstance.hide();
  };

  const handleSelectAll = () => {
    const visibleIndexes = filteredVehicles.map((vehicle) =>
      vehicles.findIndex((v) => v.id === vehicle.id)
    );

    const allVisibleSelected =
      visibleIndexes.length > 0 &&
      visibleIndexes.every((realIndex) => selectedRows[realIndex]);

    const newSelected = { ...selectedRows };

    visibleIndexes.forEach((realIndex) => {
      newSelected[realIndex] = !allVisibleSelected;
    });

    setSelectedRows(newSelected);
  };

  const handleSelectRow = (index) => {
    setSelectedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleCancelSelection = () => {
    setSelectedRows({});
  };

  const handleOpenDeleteOne = (vehicle, index) => {
    setCurrentVehicle(vehicle);
    setCurrentIndex(index);
  };

  const handleOpenEdit = (vehicle, index) => {
    setCurrentVehicle(vehicle);
    setCurrentIndex(index);
  };

 const handleOpenHistory = async (vehicle) => {
  try {
    console.log("TIPO:", Array.isArray(vehicle) ? "ARRAY" : "OBJETO");
    console.log("VALOR:", vehicle);

    const res = await api.get(`/evaluaciones/vehiculo/${vehicle.id}`);

    console.log("RESPUESTA COMPLETA:", res);
    console.log("RESPUESTA DATA:", res.data);

    const evaluaciones = Array.isArray(res?.data) ? res.data : [];

    console.log("Evaluaciones encontradas:", evaluaciones);

    if (evaluaciones.length > 0) {
      const evaluacion = evaluaciones[0];
      navigate(`/evaluaciones/${evaluacion.id}`);
      return;
    }

    alert(`El vehículo ${vehicle.placa} no tiene evaluación registrada.`);
  } catch (error) {
    console.error("Error al consultar historial:", error);
    console.error("Detalle:", error?.response?.data);
    alert("Error al consultar historial del vehículo.");
  }
};

  const handleDeleteSelected = async () => {
  try {
    const selected = vehicles.filter((_, index) => selectedRows[index]);

    for (const v of selected) {
      await api.delete(`/vehiculos/${v.id}`);
    }

    cargarVehiculos();

    showDeleteSuccessModal(
      `Se eliminaron ${selected.length} vehículos.`,
      "deleteVehicleModal"
    );
  } catch (error) {
    console.error(error);
  }
};

  const handleDeleteAll = () => {
    const total = vehicles.length;

    setVehicles([]);
    setSelectedRows({});
    setCurrentVehicle(null);
    setCurrentIndex(null);

    showDeleteSuccessModal(
      total === 1
        ? "Se eliminó con éxito 1 vehículo."
        : `Se eliminaron con éxito ${total} vehículos.`,
      "deleteAllVehicleModal"
    );
  };

  const handleCreateVehicle = async (newVehicle) => {
  try {
    const payload = {
      idCliente: Number(newVehicle.idCliente),
      idCedis: Number(newVehicle.idCedis),
      placa: String(newVehicle.placa || "").trim().toUpperCase(),
      serie: String(newVehicle.serie || "").trim().toUpperCase(),
      tipo: String(newVehicle.tipo || "").trim(),
    };

    console.log("Payload vehículo:", payload);

    const res = await api.post("/vehiculos", payload);
    console.log("Respuesta crear vehículo:", res?.data);

    await cargarVehiculos();
  } catch (error) {
    console.error("Error al crear vehículo:", error);
    console.error("Detalle backend:", error?.response?.data);
    throw error;
  }
};

  const handleUpdateVehicle = async (updatedVehicle) => {
  try {
    const payload = {
      id: updatedVehicle.id,
      idCliente: Number(updatedVehicle.idCliente),
      idCedis: Number(updatedVehicle.idCedis),
      placa: String(updatedVehicle.placa || "").trim().toUpperCase(),
      serie: String(updatedVehicle.serie || "").trim().toUpperCase(),
      tipo: String(updatedVehicle.tipo || "").trim(),
    };

    console.log("Payload actualizar vehículo:", payload);

    await api.put(`/vehiculos/${updatedVehicle.id}`, payload);
    await cargarVehiculos();
    setCurrentVehicle(null);
    setCurrentIndex(null);
  } catch (error) {
    console.error("Error al actualizar vehículo:", error);
    console.error("Detalle backend:", error?.response?.data);
    throw error;
  }
};

const handleDeleteOne = async () => {
  try {
    await api.delete(`/vehiculos/${currentVehicle.id}`);
    cargarVehiculos();

    showDeleteSuccessModal(
      `Se eliminó con éxito el vehículo ${currentVehicle.placa}.`,
      "deleteVehicleModal"
    );
  } catch (error) {
    console.error("Error al eliminar:", error);
  }
};


  const visibleIndexes = filteredVehicles.map((vehicle) =>
    vehicles.findIndex((v) => v.id === vehicle.id)
  );

  const isAllSelected =
    visibleIndexes.length > 0 &&
    visibleIndexes.every((realIndex) => selectedRows[realIndex]);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  return (
    <Admin>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Gestión de Vehículos</h2>
          <p className="page-title">
            Administración y control de parque vehicular
          </p>
        </div>

        <div className={selectedCount > 0 ? "selection-toolbar" : "d-flex gap-2"}>
          {selectedCount === 0 ? (
            <button
              className="primary-btn"
              data-bs-toggle="modal"
              data-bs-target="#createVehicleModal"
              type="button"
            >
              <i className="bi bi-plus-lg"></i>&nbsp;Nuevo Vehículo
            </button>
          ) : (
            <>
              {isAllSelected && (
                <div className="selection-info">
                  <i className="bi bi-info-circle"></i>
                  ¡Seleccionaste todo!
                </div>
              )}

              {selectedCount === vehicles.length ? (
                <button
                  className="btn btn-danger"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteAllVehicleModal"
                >
                  <i className="bi bi-trash"></i> ¡BORRAR TODO!
                </button>
              ) : (
                <button
                  className="btn btn-danger"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteVehicleModal"
                  onClick={() => {
                    setCurrentVehicle(null);
                    setCurrentIndex(null);
                  }}
                >
                  <i className="bi bi-trash"></i>
                  {selectedCount === 1
                    ? " Borrar seleccionado"
                    : ` Borrar (${selectedCount}) seleccionados`}
                </button>
              )}

              <button
                className="btn btn-outline-secondary"
                onClick={handleCancelSelection}
                type="button"
              >
                <i className="bi bi-x-lg"></i>&nbsp;Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      <div className="panel-card">
        <div className="toolbar-row">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Buscar por placa o serie..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-shell">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="checkbox-cell">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>PLACA</th>
                <th>SERIE</th>
                <th>CEDIS</th>
                <th>REGIÓN</th>
                <th>ACCIONES</th>
              </tr>
            </thead>

            <tbody>
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No hay vehículos para mostrar.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => {
                const realIndex = vehicles.findIndex((v) => v.id === vehicle.id);

                return (
                  <VehicleRow
                    key={vehicle.id ?? vehicle.placa}
                    vehicle={vehicle}
                    index={realIndex}
                    isSelected={!!selectedRows[realIndex]}
                    onSelect={() => handleSelectRow(realIndex)}
                    onDeleteClick={() => handleOpenDeleteOne(vehicle, realIndex)}
                    onEditClick={() => handleOpenEdit(vehicle, realIndex)}
                    onHistoryClick={() => handleOpenHistory(vehicle)}
                  />
                );
              })
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <small>Mostrando {filteredVehicles.length} registros</small>

          <div className="d-flex gap-2">
            <button className="btn btn-light" disabled>
              Anterior
            </button>
            <button className="btn btn-light">Siguiente</button>
          </div>
        </div>
      </div>

      <CreateVehicleModal onSave={handleCreateVehicle} />
      <DeleteAllModal
        totalCount={vehicles.length}
        onConfirmDelete={handleDeleteAll}
      />
      <DeleteVehicleModal
        vehicle={currentVehicle}
        selectedCount={selectedCount}
        onConfirmDelete={currentVehicle ? handleDeleteOne : handleDeleteSelected}
      />
      <EditVehicleModal vehicle={currentVehicle} onSave={handleUpdateVehicle} />
      <SuccessfulUpdateModal />
      <SuccessfulCreationModal />
      <SuccessfulDeleteModal message={deleteMessage} />
    </Admin>
  );
}