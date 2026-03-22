import { useEffect, useState } from "react";
import Modal from "bootstrap/js/dist/modal";
import Admin from "../../components/Admin";
import CedisRow from "./components/CedisRow";
import CreateCedisModal from "./components/CreateCedisModal";
import EditCedisModal from "./components/EditCedisModal";
import CreateCedisSuccessModal from "./components/CreateCedisSuccessModal";
import UpdateCedisSuccessModal from "./components/UpdateCedisSuccessModal";
import DeleteCedisModal from "./components/DeleteCedisModal";
import DeleteCedisSuccessModal from "./components/DeleteCedisSuccessModal.jsx";
import DeleteAllCedis from "./components/DeleteAllCedis";
import cedisData from "../../data/cedis.json";

export default function Cedis() {
  const [cedisList, setCedisList] = useState(() => {
    const savedCedis = localStorage.getItem("cedis");
    return savedCedis ? JSON.parse(savedCedis) : cedisData;
  });

  const [selectedRows, setSelectedRows] = useState({});
  const [selectedCedis, setSelectedCedis] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [createMessage, setCreateMessage] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("cedis", JSON.stringify(cedisList));
  }, [cedisList]);

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
    hideModal("createCedisModal", () => {
      openModal("createCedisSuccessModal");
    });
  };

  const showUpdateSuccessModal = (message) => {
    setUpdateMessage(message);
    hideModal("editCedisModal", () => {
      openModal("updateCedisSuccessModal");
    });
  };

  const showDeleteSuccessModal = (message, sourceModalId) => {
    setDeleteMessage(message);
    hideModal(sourceModalId, () => {
      openModal("deleteCedisSuccessModal");
    });
  };

  const handleSelectAll = () => {
    const allSelected =
      cedisList.length > 0 &&
      cedisList.every((item) => selectedRows[item.id]);

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

  const handleOpenEdit = (cedis) => {
    setSelectedCedis(cedis);
    setSelectedId(cedis.id);

    setTimeout(() => {
      openModal("editCedisModal");
    }, 0);
  };

  const handleOpenDeleteOne = (cedis) => {
  setSelectedRows({});
  setSelectedCedis(cedis);
  setSelectedId(cedis.id);

  setTimeout(() => {
    openModal("deleteCedisModal");
  }, 0);
};

  const handleOpenDeleteSelected = () => {
    setSelectedCedis(null);
    setSelectedId(null);
    openModal("deleteCedisModal");
  };

  const handleOpenDeleteAll = () => {
    setSelectedCedis(null);
    setSelectedId(null);
    openModal("deleteAllCedisModal");
  };

  const handleCreate = (newCedis) => {
    const createdCedis = {
      id: Date.now(),
      nombre: newCedis.nombre,
      direccion: newCedis.direccion,
      encargado: newCedis.encargado,
      correo: newCedis.correo,
      telefonoPrincipal: newCedis.telefonoPrincipal,
      telefonoAlternativo: newCedis.telefonoAlternativo,
    };

    setCedisList((prev) => [...prev, createdCedis]);

    showCreateSuccessModal(
      `Se creó con éxito el CEDIS ${createdCedis.nombre}.`
    );
  };

  const handleSaveEdit = (updatedCedis) => {
    if (selectedId === null) return;

    setCedisList((prev) =>
      prev.map((item) =>
        item.id === selectedId ? { ...item, ...updatedCedis } : item
      )
    );

    showUpdateSuccessModal(
      "Se actualizó correctamente la información del CEDIS."
    );
  };

  const handleDeleteOne = () => {
    if (selectedId === null) return;

    const deletedName = selectedCedis?.nombre || "el CEDIS";

    setCedisList((prev) => prev.filter((item) => item.id !== selectedId));

    setSelectedRows((prev) => {
      const updated = { ...prev };
      delete updated[selectedId];
      return updated;
    });

    setSelectedCedis(null);
    setSelectedId(null);

    showDeleteSuccessModal(`Se eliminó con éxito ${deletedName}.`, "deleteCedisModal");
  };

  const handleDeleteSelected = () => {
    const idsToDelete = Object.keys(selectedRows)
      .filter((id) => selectedRows[id])
      .map(Number);

    const count = idsToDelete.length;

    setCedisList((prev) =>
      prev.filter((item) => !idsToDelete.includes(item.id))
    );

    setSelectedRows({});
    setSelectedCedis(null);
    setSelectedId(null);

    showDeleteSuccessModal(
      count === 1
        ? "Se eliminó con éxito 1 CEDIS."
        : `Se eliminaron con éxito ${count} CEDIS.`,
      "deleteCedisModal"
    );
  };

  const handleDeleteAll = () => {
    const total = cedisList.length;

    setCedisList([]);
    setSelectedRows({});
    setSelectedCedis(null);
    setSelectedId(null);

    showDeleteSuccessModal(
      total === 1
        ? "Se eliminó con éxito 1 CEDIS."
        : `Se eliminaron con éxito ${total} CEDIS.`,
      "deleteAllCedisModal"
    );
  };

  const isAllSelected =
    cedisList.length > 0 &&
    cedisList.every((item) => selectedRows[item.id]);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  return (
    <Admin>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Gestión de CEDIS</h2>
          <p className="page-title">Administración y control de CEDIS</p>
        </div>

        <div className={selectedCount > 0 ? "selection-toolbar" : "d-flex gap-2"}>
          {selectedCount === 0 ? (
            <button
              className="primary-btn"
              onClick={() => openModal("createCedisModal")}
              type="button"
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
              {selectedCount === cedisList.length ? (
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
        <div className="toolbar-row">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Buscar por nombre, dirección o encargado..."
            />
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
                <th>NOMBRE</th>
                <th>DIRECCIÓN</th>
                <th>ENCARGADO</th>
                <th>CORREO</th>
                <th>TELÉFONOS</th>
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
                  onDelete={() => handleOpenDeleteOne(item)}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <small>Mostrando {cedisList.length} registros</small>

          <div className="d-flex gap-2">
            <button className="btn btn-light" disabled>
              Anterior
            </button>
            <button className="btn btn-light">Siguiente</button>
          </div>
        </div>
      </div>

      <CreateCedisModal onCreate={handleCreate} />
      <EditCedisModal cedis={selectedCedis} onSave={handleSaveEdit} />

      <DeleteCedisModal
        cedis={selectedCedis}
        selectedCount={selectedCount}
        onConfirmDelete={selectedCedis ? handleDeleteOne : handleDeleteSelected}
      />

      <DeleteAllCedis
        totalCount={cedisList.length}
        onConfirmDelete={handleDeleteAll}
      />

      <CreateCedisSuccessModal message={createMessage} />
      <UpdateCedisSuccessModal message={updateMessage} />
      <DeleteCedisSuccessModal message={deleteMessage} />
    </Admin>
  );
}