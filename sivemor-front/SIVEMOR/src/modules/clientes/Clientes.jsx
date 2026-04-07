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
import { getClientes,  createCliente, updateCliente, deleteCliente} from "../clientes/services/clienteService";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);

  const [selectedRows, setSelectedRows] = useState({});
  const [currentClient, setCurrentClient] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [createMessage, setCreateMessage] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [searchRazonSocial, setSearchRazonSocial] = useState("");
  const [searchGestor, setSearchGestor] = useState("");

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
    }
  };

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
      { once: true },
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
      const razonSocial = (client.razonSocial || "").toLowerCase();
      const gestor = (client.gestor || "").toLowerCase();

      const matchesRazonSocial = razonSocial.includes(
        searchRazonSocial.trim().toLowerCase(),
      );

      const matchesGestor = gestor.includes(searchGestor.trim().toLowerCase());

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

  const handleCreateCliente = async (nuevoCliente) => {
  try {
    const created = await createCliente(nuevoCliente);

    setClientes((prev) => [...prev, created]);
    setCreateMessage(`Se creó correctamente el cliente ${created.razonSocial}.`);

    setTimeout(() => {
      openModal("createClientSuccessModal");
    }, 250);

    return created;
  } catch (error) {
    console.error("Error creando cliente:", error);
    throw error;
  }
};

  const handleSaveEdit = async (updatedCliente) => {
  try {
    const updated = await updateCliente(currentId, updatedCliente);

    setClientes((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );

    setCurrentClient(updated);
    showUpdateSuccessModal("Cliente actualizado correctamente.");
  } catch (error) {
    console.error("Error actualizando cliente:", error);
    alert(error.message || "No se pudo actualizar el cliente.");
  }
};

  const handleDeleteOne = async () => {
  if (currentId === null) return;

  try {
    await deleteCliente(currentId);

    const deletedName = currentClient?.razonSocial || "el cliente";

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
  } catch (error) {
    console.error("Error eliminando cliente:", error);
    alert(error.message || "No se pudo eliminar el cliente.");
  }
};

 const handleDeleteSelected = async () => {
  const idsToDelete = Object.keys(selectedRows)
    .filter((id) => selectedRows[id])
    .map(Number);

  try {
    await Promise.all(idsToDelete.map((id) => deleteCliente(id)));

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
  } catch (error) {
    console.error("Error eliminando múltiples clientes:", error);
    alert(error.message || "No se pudieron eliminar los clientes.");
  }
};

  const handleDeleteAll = async () => {
  try {
    const ids = clientes.map((c) => c.id);

    await Promise.all(ids.map((id) => deleteCliente(id)));

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
  } catch (error) {
    console.error("Error eliminando todos los clientes:", error);
    alert(error.message || "No se pudieron eliminar todos los clientes.");
  }
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

        <div
          className={selectedCount > 0 ? "selection-toolbar" : "d-flex gap-2"}
        >
          {selectedCount === 0 ? (
            <>
              <button
                className="primary-btn"
                onClick={handleOpenCreate}
                type="button"
              >
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
                <th>Razon social</th>
                <th>CORREO</th>
                <th>TELÉFONO</th>
                <th>TELEFONO ALTERNATIVO</th>
                <th>GESTOR</th>
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
                    No se encontraron clientes.
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

      <CreateClientModal onCreate={handleCreateCliente} />
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
