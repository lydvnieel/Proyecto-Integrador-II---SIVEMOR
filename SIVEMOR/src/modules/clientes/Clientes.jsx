import { useEffect, useMemo, useState } from "react";
import Modal from "bootstrap/js/dist/modal";
import Admin from "../../components/Admin";
import ClientRow from "./components/ClientRow";
import CreateClientModal from "./components/CreateClientModal";
import CreateClientSuccessModal from "./components/CreateClientSuccessModal";
import DeleteClientsModal from "./components/DeleteClientsModal";
import DeleteAllClientsModal from "./components/DeleteAllClientsModal";
import DeleteClientSuccessModal from "./components/DeleteClientSuccessModal";
import EditClientModal from "./components/EditClientModal";
import UpdateClientSuccessModal from "./components/UpdateClientSuccessModal";
import clientesData from "../../data/clientes.json";

export default function Clientes() {
  const [clientes, setClientes] = useState(() => {
    const saved = localStorage.getItem("clientes");
    return saved ? JSON.parse(saved) : clientesData;
  });

  const [selectedRows, setSelectedRows] = useState({});
  const [currentClient, setCurrentClient] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [createMessage, setCreateMessage] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [searchRazonSocial, setSearchRazonSocial] = useState("");
  const [searchGestor, setSearchGestor] = useState("");

  useEffect(() => {
    localStorage.setItem("clientes", JSON.stringify(clientes));
  }, [clientes]);

  const cleanupModalArtifacts = () => {
    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("padding-right");
    document.body.style.removeProperty("overflow");

    document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
      backdrop.remove();
    });
  };

  const openModal = (modalId) => {
    const modalElement = document.getElementById(modalId);
    if (!modalElement) return;

    cleanupModalArtifacts();

    const modalInstance = Modal.getOrCreateInstance(modalElement);
    modalInstance.show();
  };

  const hideModal = (modalId, callback) => {
    const modalElement = document.getElementById(modalId);
    if (!modalElement) return;

    const modalInstance = Modal.getOrCreateInstance(modalElement);

    modalElement.addEventListener(
      "hidden.bs.modal",
      () => {
        cleanupModalArtifacts();
        if (callback) callback();
      },
      { once: true }
    );

    modalInstance.hide();
  };

  const showCreateSuccessModal = (message) => {
    setCreateMessage(message);
    hideModal("createClientModal", () => {
      openModal("createClientSuccessModal");
    });
  };

  const showUpdateSuccessModal = (message) => {
    setUpdateMessage(message);
    hideModal("editClientModal", () => {
      openModal("updateClientSuccessModal");
    });
  };

  const showDeleteSuccessModal = (message, sourceId) => {
    setDeleteMessage(message);
    hideModal(sourceId, () => {
      openModal("deleteClientSuccessModal");
    });
  };

  const filteredClientes = useMemo(() => {
    return clientes.filter((client) => {
      const razonSocial = (client.nombre || "").toLowerCase();
      const gestor = (client.direccion || "").toLowerCase();

      const matchesRazonSocial = razonSocial.includes(
        searchRazonSocial.trim().toLowerCase()
      );

      const matchesGestor = gestor.includes(
        searchGestor.trim().toLowerCase()
      );

      return matchesRazonSocial && matchesGestor;
    });
  }, [clientes, searchRazonSocial, searchGestor]);

  const handleSelectAll = () => {
    const allSelected =
      filteredClientes.length > 0 &&
      filteredClientes.every((client) => selectedRows[client.id]);

    const newSelected = { ...selectedRows };

    filteredClientes.forEach((client) => {
      newSelected[client.id] = !allSelected;
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

  const handleOpenCreate = () => {
    openModal("createClientModal");
  };

  const handleOpenEdit = (client) => {
    setCurrentClient(client);
    setCurrentId(client.id);

    setTimeout(() => {
      openModal("editClientModal");
    }, 0);
  };

  const handleOpenDeleteOne = (client) => {
    setCurrentClient(client);
    setCurrentId(client.id);

    setTimeout(() => {
      openModal("deleteClientModal");
    }, 0);
  };

  const handleOpenDeleteSelected = () => {
    setCurrentClient(null);
    setCurrentId(null);
    openModal("deleteClientModal");
  };

  const handleOpenDeleteAll = () => {
    openModal("deleteAllClientsModal");
  };

  const handleCreate = (newClient) => {
    const createdClient = {
      id: Date.now(),
      nombre: newClient.razonSocial,
      rfc: "SIN RFC",
      telefono: newClient.telefonoPrincipal,
      correo: newClient.correo,
      direccion: newClient.gestor,
      telefonoAlternativo: newClient.telefonoAlternativo,
    };

    setClientes((prev) => [...prev, createdClient]);

    showCreateSuccessModal(
      `Se creó con éxito el cliente ${createdClient.nombre}.`
    );
  };

  const handleSaveEdit = (updatedClient) => {
    if (currentId === null) return;

    setClientes((prev) =>
      prev.map((client) =>
        client.id === currentId ? { ...client, ...updatedClient } : client
      )
    );

    showUpdateSuccessModal(
      "Se actualizó correctamente la información del cliente."
    );
  };

  const handleDeleteOne = () => {
    if (currentId === null) return;

    const deletedName = currentClient?.nombre || "el cliente";

    setClientes((prev) => prev.filter((client) => client.id !== currentId));

    setSelectedRows((prev) => {
      const updated = { ...prev };
      delete updated[currentId];
      return updated;
    });

    setCurrentClient(null);
    setCurrentId(null);

    showDeleteSuccessModal(
      `Se eliminó con éxito ${deletedName}.`,
      "deleteClientModal"
    );
  };

  const handleDeleteSelected = () => {
    const idsToDelete = Object.keys(selectedRows)
      .filter((id) => selectedRows[id])
      .map(Number);

    const count = idsToDelete.length;

    setClientes((prev) =>
      prev.filter((client) => !idsToDelete.includes(client.id))
    );

    setSelectedRows({});
    setCurrentClient(null);
    setCurrentId(null);

    showDeleteSuccessModal(
      count === 1
        ? "Se eliminó con éxito 1 cliente."
        : `Se eliminaron con éxito ${count} clientes.`,
      "deleteClientModal"
    );
  };

  const handleDeleteAll = () => {
    const total = clientes.length;

    setClientes([]);
    setSelectedRows({});
    setCurrentClient(null);
    setCurrentId(null);

    showDeleteSuccessModal(
      total === 1
        ? "Se eliminó con éxito 1 cliente."
        : `Se eliminaron con éxito ${total} clientes.`,
      "deleteAllClientsModal"
    );
  };

  const clearFilters = () => {
    setSearchRazonSocial("");
    setSearchGestor("");
  };

  const isAllSelected =
    filteredClientes.length > 0 &&
    filteredClientes.every((client) => selectedRows[client.id]);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;
  const hasActiveFilters =
    searchRazonSocial.trim() !== "" || searchGestor.trim() !== "";

  return (
    <Admin>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Gestión de Clientes</h2>
          <p className="page-title">Administración y control de clientes</p>
        </div>

        <div className={selectedCount > 0 ? "selection-toolbar" : "d-flex gap-2"}>
          {selectedCount === 0 ? (
            <>
              <button className="primary-btn" onClick={handleOpenCreate} type="button">
                <i className="bi bi-plus-lg"></i>&nbsp;Nuevo Cliente
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

              {selectedCount === clientes.length ? (
                <button
                  className="selection-delete"
                  onClick={handleOpenDeleteAll}
                  type="button"
                >
                  <i className="bi bi-trash"></i> ¡BORRAR TODO!
                </button>
              ) : (
                <button
                  className="selection-delete"
                  onClick={handleOpenDeleteSelected}
                  type="button"
                >
                  <i className="bi bi-trash"></i>
                  {selectedCount === 1
                    ? " Borrar seleccionado"
                    : ` Borrar (${selectedCount})`}
                </button>
              )}

              <button
                className="selection-cancel"
                onClick={handleCancelSelection}
                type="button"
              >
                <i className="bi bi-x-lg"></i>
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      <div className="panel-card">
        <div className="toolbar-row flex-wrap gap-2">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Filtrar por razón social..."
              value={searchRazonSocial}
              onChange={(e) => setSearchRazonSocial(e.target.value)}
            />
          </div>

          <input
            type="text"
            className="form-control"
            style={{ maxWidth: "260px" }}
            placeholder="Filtrar por gestor..."
            value={searchGestor}
            onChange={(e) => setSearchGestor(e.target.value)}
          />
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
                <th>RFC</th>
                <th>TELÉFONO</th>
                <th>CORREO</th>
                <th>DIRECCIÓN</th>
                <th>ACCIONES</th>
              </tr>
            </thead>

            <tbody>
              {filteredClientes.length > 0 ? (
                filteredClientes.map((client) => (
                  <ClientRow
                    key={client.id}
                    client={client}
                    isSelected={!!selectedRows[client.id]}
                    onSelect={() => handleSelectRow(client.id)}
                    onEdit={() => handleOpenEdit(client)}
                    onDelete={() => handleOpenDeleteOne(client)}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No se encontraron clientes con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <small>
            Mostrando {filteredClientes.length} de {clientes.length} registros
          </small>

          <div className="d-flex gap-2">
            <button className="btn btn-light" disabled>
              Anterior
            </button>
            <button className="btn btn-light">Siguiente</button>
          </div>
        </div>
      </div>

      <CreateClientModal onCreate={handleCreate} />
      <EditClientModal client={currentClient} onSave={handleSaveEdit} />

      <DeleteClientsModal
        client={currentClient}
        selectedCount={selectedCount}
        onConfirmDelete={currentClient ? handleDeleteOne : handleDeleteSelected}
      />

      <DeleteAllClientsModal
        totalCount={clientes.length}
        onConfirmDelete={handleDeleteAll}
      />

      <CreateClientSuccessModal message={createMessage} />
      <UpdateClientSuccessModal message={updateMessage} />
      <DeleteClientSuccessModal message={deleteMessage} />
    </Admin>
  );
}