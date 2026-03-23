import { useState } from "react";
import Admin from "../../components/Admin";
import CedisRow from "./components/CedisRow";
import CreateCedisModal from "./components/CreateCedisModal";
import EditCedisModal from "./components/EditCedisModal";
import CreateCedisSuccessModal from "./components/CreateCedisSuccessModal";
import UpdateCedisSuccessModal from "./components/UpdateCedisSuccessModal";
import DeleteCedisModal from "./components/DeleteCedisModal";

export default function Cedis() {
  const [cedisList, setCedisList] = useState([
    {
      id: 1,
      nombre: "CEDIS Monterrey Norte",
      direccion: "Av. Constitución 1234, Monterrey, N.L.",
      encargado: "Carlos Méndez",
      correo: "carlos.mendez@empresa.com",
      telefonoPrincipal: "81-1234-5678",
      telefonoAlternativo: "81-8765-4321",
    },
    {
      id: 2,
      nombre: "CEDIS Guadalajara Sur",
      direccion: "Periférico Sur 5678, Guadalajara, JAL.",
      encargado: "María González",
      correo: "maria.gonzalez@empresa.com",
      telefonoPrincipal: "33-2345-6789",
      telefonoAlternativo: "33-9876-5432",
    },
    {
      id: 3,
      nombre: "CEDIS CDMX Centro",
      direccion: "Calzada Ignacio Zaragoza 9876, CDMX",
      encargado: "Roberto Silva",
      correo: "roberto.silva@empresa.com",
      telefonoPrincipal: "55-3456-7890",
      telefonoAlternativo: "55-0987-6543",
    },
  ]);

  const [selectedRows, setSelectedRows] = useState({});
  const [selectedCedis, setSelectedCedis] = useState(null);

  const handleSelectAll = () => {
    const allSelected = cedisList.every((item) => selectedRows[item.id]);
    const newSelected = {};

    cedisList.forEach((item) => {
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
    setSelectedCedis(item);
  };

  const handleCreate = (newCedis) => {
    setCedisList((prev) => [
      ...prev,
      {
        ...newCedis,
        id: Date.now(),
      },
    ]);
  };

  const handleSaveEdit = (updatedCedis) => {
    setCedisList((prev) =>
      prev.map((item) => (item.id === updatedCedis.id ? updatedCedis : item))
    );
  };

  const handleDeleteSelected = () => {
    const idsToDelete = Object.keys(selectedRows)
      .filter((id) => selectedRows[id])
      .map(Number);

    setCedisList((prev) => prev.filter((item) => !idsToDelete.includes(item.id)));
    setSelectedRows({});
  };

  const isAllSelected =
    cedisList.length > 0 && cedisList.every((item) => selectedRows[item.id]);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  return (
    <Admin>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Gestión de CEDIS</h2>
          <p className="page-title">Centros de Distribución por región y cliente</p>
        </div>

        <div className={selectedCount > 0 ? "selection-toolbar" : ""}>
          {selectedCount === 0 ? (
            <button
              className="primary-btn"
              data-bs-toggle="modal"
              data-bs-target="#createCedisModal"
            >
              <i className="bi bi-plus-lg"></i>&nbsp;Nuevo CEDIS
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
                data-bs-target="#deleteCedisModal"
              >
                <i className="bi bi-trash"></i>
                {selectedCount === cedisList.length
                  ? "¡BORRAR TODO!"
                  : selectedCount === 1
                  ? "Borrar seleccionado"
                  : `Borrar (${selectedCount})`}
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
              placeholder="Buscar por nombre, dirección, encargado..."
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
                <th>NOMBRE</th>
                <th>DIRECCIÓN</th>
                <th>ENCARGADO</th>
                <th>CORREO</th>
                <th>TELÉFONO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>

            <tbody>
              {cedisList.map((item) => (
                <CedisRow
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

        <div className="mt-3">
          <small>Mostrando {cedisList.length} CEDIS activos</small>
        </div>
      </div>

      <CreateCedisModal onCreate={handleCreate} />
      <EditCedisModal cedis={selectedCedis} onSave={handleSaveEdit} />
      <CreateCedisSuccessModal />
      <UpdateCedisSuccessModal />
      <DeleteCedisModal
        selectedCount={selectedCount}
        totalCount={cedisList.length}
        onDelete={handleDeleteSelected}
      />
    </Admin>
  );
}