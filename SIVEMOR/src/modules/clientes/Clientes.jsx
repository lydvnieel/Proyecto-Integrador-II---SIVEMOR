import { useState } from "react";
import Admin from "../../components/Admin";
import ClientRow from "./components/ClientRow";
import CreateClientModal from "./components/CreateClientModal";
import EditClientModal from "./components/EditClientModal";
import CreateClientSuccessModal from "./components/CreateClientSuccessModal";
import UpdateClientSuccessModal from "./components/UpdateClientSuccessModal";
import DeleteClientsModal from "./components/DeleteClientsModal";

export default function Clientes() {
  const [clientes, setClientes] = useState([
    {
      id: 1,
      razonSocial: "Transportes del Norte SA de CV",
      correo: "contacto@transportesnorte.com.mx",
      telefonoPrincipal: "81-1234-5678",
      telefonoAlternativo: "81-8765-4321",
      gestor: "María García López",
    },
    {
      id: 2,
      razonSocial: "Logística Occidente SC",
      correo: "info@logisticaoccidente.com",
      telefonoPrincipal: "33-2345-6789",
      telefonoAlternativo: "33-9876-5432",
      gestor: "Carlos Méndez Ruiz",
    },
    {
      id: 3,
      razonSocial: "Distribuidora Central SA",
      correo: "ventas@distribuidoracentral.mx",
      telefonoPrincipal: "55-3456-7890",
      telefonoAlternativo: "55-0987-6543",
      gestor: "Roberto Silva Hernández",
    },
    {
      id: 4,
      razonSocial: "Grupo Transportista del Bajío SA de CV",
      correo: "admin@grupotransportistabajio.com",
      telefonoPrincipal: "44-4567-8901",
      telefonoAlternativo: "",
      gestor: "Ana Martínez Torres",
    },
  ]);

  const [selectedRows, setSelectedRows] = useState({});
  const [selectedClient, setSelectedClient] = useState(null);

  const handleSelectAll = () => {
    const allSelected = clientes.every((item) => selectedRows[item.id]);
    const newSelected = {};

    clientes.forEach((item) => {
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

  const handleOpenEdit = (client) => {
    setSelectedClient(client);
  };

  const handleCreate = (newClient) => {
    setClientes((prev) => [
      ...prev,
      {
        ...newClient,
        id: Date.now(),
      },
    ]);
  };

  const handleSaveEdit = (updatedClient) => {
    setClientes((prev) =>
      prev.map((item) => (item.id === updatedClient.id ? updatedClient : item))
    );
  };

  const handleDeleteSelected = () => {
    const idsToDelete = Object.keys(selectedRows)
      .filter((id) => selectedRows[id])
      .map(Number);

    setClientes((prev) => prev.filter((item) => !idsToDelete.includes(item.id)));
    setSelectedRows({});
  };

  const isAllSelected =
    clientes.length > 0 && clientes.every((item) => selectedRows[item.id]);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  return (
    <Admin>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Gestión de Clientes</h2>
          <p className="page-title">Administración de empresas y contactos</p>
        </div>

        <div className={selectedCount > 0 ? "selection-toolbar" : ""}>
          {selectedCount === 0 ? (
            <button
              className="primary-btn"
              data-bs-toggle="modal"
              data-bs-target="#createClientModal"
            >
              <i className="bi bi-plus-lg"></i>&nbsp;Nuevo Cliente
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
                data-bs-target="#deleteClientsModal"
              >
                <i className="bi bi-trash"></i>
                {selectedCount === clientes.length
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
              placeholder="Buscar por razón social, email, gestor..."
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
                <th>RAZÓN SOCIAL</th>
                <th>CORREO</th>
                <th>TELÉFONO</th>
                <th>GESTOR</th>
                <th>ACCIONES</th>
              </tr>
            </thead>

            <tbody>
              {clientes.map((item) => (
                <ClientRow
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
          <small>Mostrando {clientes.length} clientes activos</small>
        </div>
      </div>

      <CreateClientModal onCreate={handleCreate} />
      <EditClientModal client={selectedClient} onSave={handleSaveEdit} />
      <CreateClientSuccessModal />
      <UpdateClientSuccessModal />
      <DeleteClientsModal
        selectedCount={selectedCount}
        totalCount={clientes.length}
        onDelete={handleDeleteSelected}
      />
    </Admin>
  );
}