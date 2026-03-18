import Admin from "../../components/Admin"
import CreateVehicleModal from "../vehiculos/components/CreateVehicleModal";
import DeleteVehicleModal from "../vehiculos/components/DeleteVehicleModal";
import DeleteAllModal from "../vehiculos/components/DeleteAllModal";
import EditVehicleModal from "../vehiculos/components/EditVehicleModal";
import SuccessfulUpdateModal from "../vehiculos/components/SuccessfulUpdateModal";
import SuccessfulCreationModal from "../vehiculos/components/SuccessfulCreationModal";
import VehicleRow from "../vehiculos/components/VehicleRow";
import vehiclesData from "../../data/vehicles.json";
import { useEffect, useState } from "react";

export default function Vehiculos() {
  const [vehicles, setVehicles] = useState(() => {
    const savedVehicles = localStorage.getItem("vehicles");
    return savedVehicles ? JSON.parse(savedVehicles) : vehiclesData;
  });

  const [selectedRows, setSelectedRows] = useState({});
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
  }, [vehicles]);

  const handleSelectAll = () => {
    const allSelected =
      vehicles.length > 0 && vehicles.every((v, i) => selectedRows[i]);

    const newSelected = {};

    vehicles.forEach((v, i) => {
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
  };

  const handleDeleteSelected = () => {
    const updatedVehicles = vehicles.filter((_, index) => !selectedRows[index]);
    setVehicles(updatedVehicles);
    setSelectedRows({});
    setCurrentVehicle(null);
    setCurrentIndex(null);
  };

  const handleUpdateVehicle = (updatedVehicle) => {
    if (currentIndex === null) return;

    const updatedVehicles = [...vehicles];
    updatedVehicles[currentIndex] = {
      ...updatedVehicles[currentIndex],
      ...updatedVehicle,
    };

    setVehicles(updatedVehicles);
    setCurrentVehicle(updatedVehicles[currentIndex]);
  };

  const handleCreateVehicle = (newVehicle) => {
    setVehicles((prev) => [...prev, newVehicle]);
  };

  const isAllSelected =
    vehicles.length > 0 && vehicles.every((v, i) => selectedRows[i]);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  return (
    <Admin>
    <div className="page-header">
        <div>
        <h2 className="page-heading">Gestión de Vehículos</h2>
        <p className="page-title">Administración y control de parque vehicular</p>
        </div>

        <div className={selectedCount > 0 ? "selection-toolbar" : "d-flex gap-2"}>
        {selectedCount === 0 ? (
            <button className="primary-btn" data-bs-toggle="modal" data-bs-target="#createVehicleModal"type="button">
            <i className="bi bi-plus-lg"></i>&nbsp;Nuevo Vehículo</button>
        ) : (
            <>
            {isAllSelected && (
                <div className="selection-info">
                <i className="bi bi-info-circle"></i>
                ¡Seleccionaste todo!
                </div>
            )}

            <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteAllVehicleModal" type="button">
                <i className="bi bi-trash"></i>
                {selectedCount === vehicles.length
                ? " ¡BORRAR TODO!"
                : selectedCount === 1
                ? " Borrar seleccionado"
                : ` Borrar (${selectedCount}) seleccionados`}
            </button>

            <button className="btn btn-outline-secondary" onClick={handleCancelSelection} type="button">
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

        <button className="outline-btn" type="button"> <i className="bi bi-funnel"></i> Filtros</button>
        </div>

        <div className="table-shell">
        <table className="admin-table">
            <thead>
            <tr>
            <th className="checkbox-cell">
            <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll}/>
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
                <VehicleRow key={index} vehicle={vehicle} index={index} isSelected={!!selectedRows[index]}
                onSelect={() => handleSelectRow(index)}
                onDeleteClick={() => handleOpenDeleteOne(vehicle, index)}
                onEditClick={() => handleOpenEdit(vehicle, index)}
                />
                ))}
            </tbody>
        </table>
    </div>
    </div>

    <CreateVehicleModal onSave={handleCreateVehicle} />

    <DeleteAllModal
    selectedCount={selectedCount}
    onConfirmDelete={handleDeleteSelected}
    />

    <DeleteVehicleModal
    vehicle={currentVehicle}
    onConfirmDelete={handleDeleteOne}
    />

    <EditVehicleModal
    vehicle={currentVehicle}
    onSave={handleUpdateVehicle}
    />

    <SuccessfulUpdateModal />
    <SuccessfulCreationModal />
    </Admin>
);
}