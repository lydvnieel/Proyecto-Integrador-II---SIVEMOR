import { useEffect, useState } from "react";
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
import vehiclesData from "../../data/vehicles.json";

export default function Vehiculos() {
  const [vehicles, setVehicles] = useState(() => {
    const savedVehicles = localStorage.getItem("vehicles");
    return savedVehicles ? JSON.parse(savedVehicles) : vehiclesData;
  });

  const [selectedRows, setSelectedRows] = useState({});
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
  }, [vehicles]);

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
    const allSelected =
      vehicles.length > 0 && vehicles.every((_, i) => selectedRows[i]);

    const newSelected = {};
    vehicles.forEach((_, i) => {
      newSelected[i] = !allSelected;
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

  const handleDeleteOne = () => {
    if (currentIndex === null) return;

    const deletedPlate = currentVehicle?.placa || "el vehículo";

    const updatedVehicles = vehicles.filter((_, index) => index !== currentIndex);
    setVehicles(updatedVehicles);

    const updatedSelectedRows = {};
    updatedVehicles.forEach((_, newIndex) => {
      const oldIndex = newIndex >= currentIndex ? newIndex + 1 : newIndex;
      if (selectedRows[oldIndex]) {
        updatedSelectedRows[newIndex] = true;
      }
    });

    setSelectedRows(updatedSelectedRows);
    setCurrentVehicle(null);
    setCurrentIndex(null);

    showDeleteSuccessModal(
      `Se eliminó con éxito el vehículo ${deletedPlate}.`,
      "deleteVehicleModal"
    );
  };

  const handleDeleteSelected = () => {
    const count = Object.values(selectedRows).filter(Boolean).length;

    const updatedVehicles = vehicles.filter((_, index) => !selectedRows[index]);

    setVehicles(updatedVehicles);
    setSelectedRows({});
    setCurrentVehicle(null);
    setCurrentIndex(null);

    showDeleteSuccessModal(
      count === 1
        ? "Se eliminó con éxito 1 vehículo seleccionado."
        : `Se eliminaron con éxito ${count} vehículos seleccionados.`,
      "deleteVehicleModal"
    );
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

  const handleUpdateVehicle = (updatedVehicle) => {
    if (currentIndex === null) return;

    const updatedVehicles = [...vehicles];
    updatedVehicles[currentIndex] = {
      ...updatedVehicles[currentIndex],
      placa: updatedVehicle.placa,
      serie: updatedVehicle.serie,
      tipo: updatedVehicle.tipo,
    };

    setVehicles(updatedVehicles);
    setCurrentVehicle(updatedVehicles[currentIndex]);
  };

  const handleCreateVehicle = (newVehicle) => {
    setVehicles((prev) => [...prev, newVehicle]);
  };

  const isAllSelected =
    vehicles.length > 0 && vehicles.every((_, i) => selectedRows[i]);

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
            <input type="text" placeholder="Buscar por placa o serie..." />
          </div>

          <button className="outline-btn" type="button">
            <i className="bi bi-funnel"></i> Filtros
          </button>
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
              {vehicles.map((vehicle, index) => (
                <VehicleRow
                  key={index}
                  vehicle={vehicle}
                  index={index}
                  isSelected={!!selectedRows[index]}
                  onSelect={() => handleSelectRow(index)}
                  onDeleteClick={() => handleOpenDeleteOne(vehicle, index)}
                  onEditClick={() => handleOpenEdit(vehicle, index)}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <small>Mostrando {vehicles.length} registros</small>

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
      <EditVehicleModal
        vehicle={currentVehicle}
        onSave={handleUpdateVehicle}
      />
      <SuccessfulUpdateModal />
      <SuccessfulCreationModal />
      <SuccessfulDeleteModal message={deleteMessage} />
    </Admin>
  );
}