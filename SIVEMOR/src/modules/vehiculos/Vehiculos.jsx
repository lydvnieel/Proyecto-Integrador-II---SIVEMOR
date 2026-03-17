import Admin from "../../components/Admin";
import CreateVehicleModal from "../vehiculos/components/CreateVehicleModal";
import VehicleRow from "../vehiculos/components/VehicleRow";
import vehicles from "../../../public/data/vehicles.json";
import { useState } from "react";

export default function Vehiculos() {
  // Estado para guardar qué filas están seleccionadas
  const [selectedRows, setSelectedRows] = useState({});

  // Función para manejar "Seleccionar todo"
  const handleSelectAll = () => {
    const allSelected = vehicles.every((v, i) => selectedRows[i]);
    const newSelected = {};

    vehicles.forEach((v, i) => {
      newSelected[i] = !allSelected;
    });

    setSelectedRows(newSelected);
  };

  // Función para manejar selección individual
  const handleSelectRow = (index) => {
    setSelectedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Cancelar selección
  const handleCancelSelection = () => {
    setSelectedRows({});
  };

  // Determinar si el checkbox del encabezado debe estar marcado
  const isAllSelected =
    vehicles.length > 0 && vehicles.every((v, i) => selectedRows[i]);

  // Contar filas seleccionadas
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

      <button className="btn btn-danger" data-bs-toggle = "modal" data-bs-target = "#deleteAllVehicleModal">
        <i className="bi bi-trash"></i>
        {selectedCount === vehicles.length
          ? "¡BORRAR TODO!"
          : selectedCount === 1
          ? "Borrar seleccionado"
          : `Borrar (${selectedCount}) seleccionados`}
      </button>

      <button className="btn btn-outline-secondary" onClick={handleCancelSelection}>
        <i className="bi bi-x-lg"></i>&nbsp; Cancelar </button>
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

          <button className="outline-btn">
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
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateVehicleModal />
    </Admin>
  );
}