import { useState } from "react";
import Admin from "../../components/Admin";
import CostRow from "./components/CostRow";
import EditCostModal from "./components/EditCostModal";
import UpdateCostSuccessModal from "./components/UpdateCostSuccessModal";
import DeleteCostsModal from "./components/DeleteCostsModal";
import CreateCostModal from "./components/CreateCostModal";

export default function Costos() {
  const [costos, setCostos] = useState([
    {
      id: 1,
      cliente: "Juan Pérez",
      materia: "Humo",
      encargado: "Vanessa Tabado",
      atiendeCobra: "Luis Castro",
      costo: "$320",
    },
    {
      id: 2,
      cliente: "María López",
      materia: "Logística Humo",
      encargado: "Julian Tabado",
      atiendeCobra: "Christian Fuenzalida",
      costo: "$450",
    },
  ]);

  const [selectedRows, setSelectedRows] = useState({});
  const [selectedCost, setSelectedCost] = useState(null);

  const handleSelectAll = () => {
    const allSelected = costos.every((item) => selectedRows[item.id]);
    const newSelected = {};

    costos.forEach((item) => {
      newSelected[item.id] = !allSelected;
    });

    setSelectedRows(newSelected);
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCancelSelection = () => {
    setSelectedRows({});
  };

  const handleOpenEdit = (item) => {
    setSelectedCost(item);
  };

  const handleSaveEdit = (updatedCost) => {
    setCostos((prev) =>
      prev.map((item) => (item.id === updatedCost.id ? updatedCost : item))
    );
  };

  const handleDeleteSelected = () => {
    const idsToDelete = Object.keys(selectedRows)
      .filter((id) => selectedRows[id])
      .map(Number);

    setCostos((prev) => prev.filter((item) => !idsToDelete.includes(item.id)));
    setSelectedRows({});
  };

  const isAllSelected =
    costos.length > 0 && costos.every((item) => selectedRows[item.id]);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  const handleCreateCost = (newCost) => {
  setCostos((prev) => [
    ...prev,
    {
      ...newCost,
      id: Date.now(),
    },
  ]);
};

  return (
    <Admin>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Resumen de Costos</h2>
          <p className="page-title">Control detallado de procesos y pagos</p>
        </div>

        <div className={selectedCount > 0 ? "selection-toolbar" : ""}>
{selectedCount === 0 ? (
  <button
    className="primary-btn"
    data-bs-toggle="modal"
    data-bs-target="#createCostModal"
  >
    <i className="bi bi-plus-lg"></i>&nbsp;Nuevo costo
  </button>
) : (
            <>
              {isAllSelected && (
                <div className="selection-info">
                  <i className="bi bi-info-circle"></i>
                  ¡Seleccionaste todo!
                </div>
              )}

              <button
                className="selection-delete"
                data-bs-toggle="modal"
                data-bs-target="#deleteCostsModal"
              >
                <i className="bi bi-trash"></i>
                {selectedCount === costos.length
                  ? "¡BORRAR TODO!"
                  : "Borrar seleccionados"}
              </button>

              <button
                className="selection-cancel"
                onClick={handleCancelSelection}
              >
                <i className="bi bi-x-lg"></i>
                Cancelar
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
              placeholder="Buscar por cliente, placa, folio..."
            />
          </div>

          <button className="outline-btn">
            <i className="bi bi-funnel"></i> Filtros Avanzados
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
                <th>CLIENTE</th>
                <th>MATERIA</th>
                <th>ENCARGADO</th>
                <th>ATIENDE Y COBRA</th>
                <th>ACCIONES</th>
              </tr>
            </thead>

            <tbody>
              {costos.map((item) => (
                <CostRow
                  key={item.id}
                  item={item}
                  isSelected={!!selectedRows[item.id]}
                  onSelect={() => handleSelectRow(item.id)}
                  onEdit={() => handleOpenEdit(item)}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>Mostrando {costos.length} registros</span>

          <div className="pagination-mini">
            <button disabled>Anterior</button>
            <button>Siguiente</button>
          </div>
        </div>
      </div>

      <EditCostModal cost={selectedCost} onSave={handleSaveEdit} />
      <UpdateCostSuccessModal />
      <DeleteCostsModal
        selectedCount={selectedCount}
        totalCount={costos.length}
        onDelete={handleDeleteSelected}
      />
      <CreateCostModal onCreate={handleCreateCost} />
    </Admin>
  );
}