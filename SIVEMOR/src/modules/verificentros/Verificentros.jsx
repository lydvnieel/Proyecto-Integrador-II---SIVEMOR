import { useEffect, useState } from "react";
import Modal from "bootstrap/js/dist/modal";
import Admin from "../../components/Admin";
import VerificentroRow from "./components/VerificentroRow";
import CreateVerificentroModal from "./components/CreateVerificentroModal";
import EditVerificentroModal from "./components/EditVerificentroModal";
import DeleteVerificentroModal from "./components/DeleteVerificentroModal";
import DeleteAllVerificentrosModal from "./components/DeleteAllVerificentrosModal";
import CreateSuccessModal from "./components/CreateSuccessModal";
import DeleteSuccessModal from "./components/DeleteSuccessModal";
import EditSuccessModal from "./components/EditSuccessModal";
import verificentrosData from "../../data/verificentros.json";

export default function Verificentros() {
  const [verificentros, setVerificentros] = useState(() => {
    const saved = localStorage.getItem("verificentros");
    return saved ? JSON.parse(saved) : verificentrosData;
  });

  const [selectedRows, setSelectedRows] = useState({});
  const [currentItem, setCurrentItem] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [createMessage, setCreateMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("verificentros", JSON.stringify(verificentros));
  }, [verificentros]);

  const cleanupModalArtifacts = () => {
    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("padding-right");
    document.body.style.removeProperty("overflow");

    document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
      backdrop.remove();
    });
  };

  const showDeleteSuccessModal = (message, sourceId) => {
    setDeleteMessage(message);

    const source = document.getElementById(sourceId);
    const success = document.getElementById("deleteVerificentroSuccessModal");

    if (!source || !success) return;

    const sourceInstance = Modal.getOrCreateInstance(source);
    const successInstance = Modal.getOrCreateInstance(success);

    source.addEventListener(
      "hidden.bs.modal",
      () => {
        cleanupModalArtifacts();
        successInstance.show();
      },
      { once: true }
    );

    sourceInstance.hide();
  };

  const showEditSuccessModal = (message, sourceId) => {
    setEditMessage(message);

    const source = document.getElementById(sourceId);
    const success = document.getElementById("editVerificentroSuccessModal");

    if (!source || !success) return;

    const sourceInstance = Modal.getOrCreateInstance(source);
    const successInstance = Modal.getOrCreateInstance(success);

    source.addEventListener(
      "hidden.bs.modal",
      () => {
        cleanupModalArtifacts();
        successInstance.show();
      },
      { once: true }
    );

    sourceInstance.hide();
  };

  const handleSelectAll = () => {
    const allSelected =
      verificentros.length > 0 &&
      verificentros.every((item) => selectedRows[item.id]);

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
    setCurrentItem(item);
    setCurrentId(item.id);
  };

  const handleOpenDeleteOne = (item) => {
    setCurrentItem(item);
    setCurrentId(item.id);
  };

  const handleCreate = (newItem) => {
    const createdItem = {
      ...newItem,
      id: Date.now(),
    };

    setVerificentros((prev) => [...prev, createdItem]);
    setCreateMessage(`Se creó con éxito el verificentro ${createdItem.nombre}.`);
  };

  const handleSaveEdit = (updatedItem) => {
    if (currentId === null) return;

    setVerificentros((prev) =>
      prev.map((item) =>
        item.id === currentId ? { ...item, ...updatedItem } : item
      )
    );

    showEditSuccessModal(
      "Se actualizó el verificentro correctamente.",
      "editVerificentroModal"
    );
  };

  const handleDeleteOne = () => {
    if (currentId === null) return;

    const deletedName = currentItem?.nombre || "el verificentro";

    setVerificentros((prev) => prev.filter((item) => item.id !== currentId));

    setSelectedRows((prev) => {
      const updated = { ...prev };
      delete updated[currentId];
      return updated;
    });

    setCurrentItem(null);
    setCurrentId(null);

    showDeleteSuccessModal(
      `Se eliminó con éxito ${deletedName}.`,
      "deleteVerificentroModal"
    );
  };

  const handleDeleteSelected = () => {
    const idsToDelete = Object.keys(selectedRows)
      .filter((id) => selectedRows[id])
      .map(Number);

    const count = idsToDelete.length;

    setVerificentros((prev) =>
      prev.filter((item) => !idsToDelete.includes(item.id))
    );

    setSelectedRows({});
    setCurrentItem(null);
    setCurrentId(null);

    showDeleteSuccessModal(
      count === 1
        ? "Se eliminó con éxito 1 verificentro."
        : `Se eliminaron con éxito ${count} verificentros.`,
      "deleteVerificentroModal"
    );
  };

  const handleDeleteAll = () => {
    const total = verificentros.length;

    setVerificentros([]);
    setSelectedRows({});
    setCurrentItem(null);
    setCurrentId(null);

    showDeleteSuccessModal(
      total === 1
        ? "Se eliminó con éxito 1 verificentro."
        : `Se eliminaron con éxito ${total} verificentros.`,
      "deleteAllVerificentroModal"
    );
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
              <button className="outline-btn" type="button">
                <i className="bi bi-funnel"></i> Filtros Avanzados
              </button>

              <button
                className="primary-btn"
                data-bs-toggle="modal"
                data-bs-target="#createVerificentroModal"
                type="button"
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

              {selectedCount === verificentros.length ? (
                <button
                  className="selection-delete"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteAllVerificentroModal"
                  type="button"
                >
                  <i className="bi bi-trash"></i>
                  ¡BORRAR TODO!
                </button>
              ) : (
                <button
                  className="selection-delete"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteVerificentroModal"
                  type="button"
                  onClick={() => {
                    setCurrentItem(null);
                    setCurrentId(null);
                  }}
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
              placeholder="Buscar por nombre, clave, responsable..."
            />
          </div>

          <button className="outline-btn" type="button">
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
                  onDelete={() => handleOpenDeleteOne(item)}
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
      <EditVerificentroModal item={currentItem} onSave={handleSaveEdit} />

      <DeleteVerificentroModal
        item={currentItem}
        selectedCount={selectedCount}
        totalCount={verificentros.length}
        onDelete={currentItem ? handleDeleteOne : handleDeleteSelected}
      />

      <DeleteAllVerificentrosModal
        totalCount={verificentros.length}
        onConfirmDelete={handleDeleteAll}
      />

      <CreateSuccessModal message={createMessage} />
      <DeleteSuccessModal message={deleteMessage} />
      <EditSuccessModal message={editMessage} />
    </Admin>
  );
}