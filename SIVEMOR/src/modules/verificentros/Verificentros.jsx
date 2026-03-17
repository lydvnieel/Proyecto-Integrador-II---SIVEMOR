import { useState } from "react";
import Admin from "../../components/Admin";
import VerificentroRow from "./components/VerificentroRow";
import CreateVerificentroModal from "./components/CreateVerificentroModal";
import EditVerificentroModal from "./components/EditVerificentroModal";
import CreateSuccessModal from "./components/CreateSuccessModal";
import UpdateSuccessModal from "./components/UpdateSuccessModal";
import DeleteVerificentroModal from "./components/DeleteVerificentroModal";

export default function Verificentros() {
  const [verificentros, setVerificentros] = useState([
    {
      id: 1,
      nombre: "Verificentro Norte",
      clave: "VER-001",
      direccion: "Av. Revolución 123, Col. Centro",
      region: "Norte",
      responsable: "Carlos Mendoza",
      telefonoPrincipal: "81-1234-5678",
      telefonoAlternativo: "81-8765-4321",
      correo: "carlos@verificentro.com",
      horario: "Lunes a Viernes: 8:00 AM - 6:00 PM, Sábados: 9:00 AM - 2:00 PM",
    },
    {
      id: 2,
      nombre: "Verificentro Sur",
      clave: "VER-002",
      direccion: "Calle Morelos 456, Col. Sur",
      region: "Sur",
      responsable: "María López",
      telefonoPrincipal: "81-4321-9876",
      telefonoAlternativo: "81-1122-3344",
      correo: "maria@verificentro.com",
      horario: "Lunes a Viernes: 8:00 AM - 6:00 PM, Sábados: 9:00 AM - 2:00 PM",
    },
    {
      id: 3,
      nombre: "Verificentro Este",
      clave: "VER-003",
      direccion: "Blvd. Las Torres 789, Col. Este",
      region: "Este",
      responsable: "Juan Pérez",
      telefonoPrincipal: "81-7788-9900",
      telefonoAlternativo: "81-4455-6677",
      correo: "juan@verificentro.com",
      horario: "Lunes a Viernes: 8:00 AM - 6:00 PM, Sábados: 9:00 AM - 2:00 PM",
    },
  ]);

  const [selectedRows, setSelectedRows] = useState({});
  const [selectedVerificentro, setSelectedVerificentro] = useState(null);

  const handleSelectAll = () => {
    const allSelected = verificentros.every((item) => selectedRows[item.id]);
    const newSelected = {};

    verificentros.forEach((item) => {
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
    setSelectedVerificentro(item);
  };

  const handleCreate = (newItem) => {
    setVerificentros((prev) => [
      ...prev,
      {
        ...newItem,
        id: Date.now(),
      },
    ]);
  };

  const handleSaveEdit = (updatedItem) => {
    setVerificentros((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const handleDeleteSelected = () => {
    const idsToDelete = Object.keys(selectedRows)
      .filter((id) => selectedRows[id])
      .map(Number);

    setVerificentros((prev) =>
      prev.filter((item) => !idsToDelete.includes(item.id))
    );

    setSelectedRows({});
  };

  const isAllSelected =
    verificentros.length > 0 &&
    verificentros.every((item) => selectedRows[item.id]);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  return (
    <Admin>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Gestión de Verificentros</h2>
          <p className="page-title">
            Administración y control de verificentros
          </p>
        </div>

        <div className={selectedCount > 0 ? "selection-toolbar" : "d-flex gap-2"}>
          {selectedCount === 0 ? (
            <>
              <button className="outline-btn">
                <i className="bi bi-funnel"></i> Filtros Avanzados
              </button>

              <button
                className="primary-btn"
                data-bs-toggle="modal"
                data-bs-target="#createVerificentroModal"
              >
                <i className="bi bi-plus-lg"></i>&nbsp;Nuevo Verificentro
              </button>
            </>
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
                data-bs-target="#deleteVerificentroModal"
              >
                <i className="bi bi-trash"></i>
                {selectedCount === verificentros.length
                  ? "¡BORRAR TODO!"
                  : selectedCount === 1
                  ? "Borrar Seleccionada"
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
              placeholder="Buscar por nombre, clave, responsable..."
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
                <th>CLAVE</th>
                <th>DIRECCIÓN</th>
                <th>REGIÓN</th>
                <th>RESPONSABLE</th>
                <th>CORREO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>

            <tbody>
              {verificentros.map((item) => (
                <VerificentroRow
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

        <div className="d-flex justify-content-between align-items-center mt-3">
          <small>Mostrando {verificentros.length} registros</small>

          <div className="d-flex gap-2">
            <button className="btn btn-light" disabled>
              Anterior
            </button>
            <button className="btn btn-light">Siguiente</button>
          </div>
        </div>
      </div>

      <CreateVerificentroModal onCreate={handleCreate} />
      <EditVerificentroModal
        item={selectedVerificentro}
        onSave={handleSaveEdit}
      />
      <CreateSuccessModal />
      <UpdateSuccessModal />
      <DeleteVerificentroModal
        selectedCount={selectedCount}
        totalCount={verificentros.length}
        onDelete={handleDeleteSelected}
      />
    </Admin>
  );
}