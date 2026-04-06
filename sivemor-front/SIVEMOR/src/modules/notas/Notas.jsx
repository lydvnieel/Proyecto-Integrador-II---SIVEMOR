import { useEffect, useState } from "react";
import Modal from "bootstrap/js/dist/modal";
import Admin from "../../components/Admin";
import NoteRow from "./components/NoteRow";
import CreateNoteModal from "./components/CreateNoteModal";
import EditNoteModal from "./components/EditNoteModal";
import DeleteNotesModal from "./components/DeleteNotesModal";
import DeleteAllNotesModal from "./components/DeleteAllNotesModal";
import CreateSuccessModal from "./components/CreateSuccessModal";
import DeleteSuccessModal from "./components/DeleteSuccessModal";
import notasData from "../../data/notas.json";

export default function Notas() {
  const [notas, setNotas] = useState(() => {
    const savedNotas = localStorage.getItem("notas");
    return savedNotas ? JSON.parse(savedNotas) : notasData;
  });

  const [selectedRows, setSelectedRows] = useState({});
  const [currentNote, setCurrentNote] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [createMessage, setCreateMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("notas", JSON.stringify(notas));
  }, [notas]);

  const cleanupModalArtifacts = () => {
    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("padding-right");
    document.body.style.removeProperty("overflow");

    document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
      backdrop.remove();
    });
  };

  const showDeleteSuccessModal = (message, sourceModalId) => {
    setDeleteMessage(message);

    const sourceModalElement = document.getElementById(sourceModalId);
    const successModalElement = document.getElementById(
      "successfulDeleteNoteModal",
    );

    if (!sourceModalElement || !successModalElement) return;

    const sourceModalInstance = Modal.getOrCreateInstance(sourceModalElement);
    const successModalInstance = Modal.getOrCreateInstance(successModalElement);

    sourceModalElement.addEventListener(
      "hidden.bs.modal",
      () => {
        cleanupModalArtifacts();
        successModalInstance.show();
      },
      { once: true },
    );

    sourceModalInstance.hide();
  };

  const handleSelectAll = () => {
    const allSelected =
      notas.length > 0 && notas.every((note) => selectedRows[note.id]);

    const newSelected = {};
    notas.forEach((note) => {
      newSelected[note.id] = !allSelected;
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

  const handleOpenDeleteOne = (note) => {
    setCurrentNote(note);
    setCurrentId(note.id);
  };

  const handleOpenEdit = (note) => {
    setCurrentNote(note);
    setCurrentId(note.id);
  };

  const handleCreateNote = (newNote) => {
    const createdNote = {
      ...newNote,
      id: Date.now(),
    };

    setNotas((prev) => [...prev, createdNote]);
    setCreateMessage(`Se creó con éxito la nota ${createdNote.nota}.`);
  };
  
  const handleMarkPaid = () => {
  const idsToUpdate = Object.keys(selectedRows)
    .filter((id) => selectedRows[id])
    .map(Number);

  setNotas((prev) =>
    prev.map((note) =>
      idsToUpdate.includes(note.id)
        ? {
            ...note,
            pagado: "Pagado",
            pagadoClass: "status-success",
          }
        : note
    )
  );

  setSelectedRows({});
};

  const handleUpdateNote = (updatedNote) => {
    if (currentId === null) return;

    const updatedNotes = notas.map((note) =>
      note.id === currentId ? { ...note, ...updatedNote } : note,
    );

    setNotas(updatedNotes);
    setCurrentNote(updatedNotes.find((note) => note.id === currentId) || null);
  };

  const handleDeleteOne = () => {
    if (currentId === null) return;

    const deletedNote = currentNote?.nota || "la nota";

    setNotas((prev) => prev.filter((note) => note.id !== currentId));

    setSelectedRows((prev) => {
      const updated = { ...prev };
      delete updated[currentId];
      return updated;
    });

    setCurrentNote(null);
    setCurrentId(null);

    showDeleteSuccessModal(
      `Se eliminó con éxito la nota ${deletedNote}.`,
      "deleteNotesModal",
    );
  };

  const handleDeleteSelected = () => {
    const idsToDelete = Object.keys(selectedRows)
      .filter((id) => selectedRows[id])
      .map(Number);

    const count = idsToDelete.length;

    setNotas((prev) => prev.filter((note) => !idsToDelete.includes(note.id)));
    setSelectedRows({});
    setCurrentNote(null);
    setCurrentId(null);

    showDeleteSuccessModal(
      count === 1
        ? "Se eliminó con éxito 1 nota seleccionada."
        : `Se eliminaron con éxito ${count} notas seleccionadas.`,
      "deleteNotesModal",
    );
  };

  const handleDeleteAll = () => {
    const total = notas.length;

    setNotas([]);
    setSelectedRows({});
    setCurrentNote(null);
    setCurrentId(null);

    showDeleteSuccessModal(
      total === 1
        ? "Se eliminó con éxito 1 nota."
        : `Se eliminaron con éxito ${total} notas.`,
      "deleteAllNotesModal",
    );
  };

  const isAllSelected =
    notas.length > 0 && notas.every((note) => selectedRows[note.id]);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  return (
    <Admin>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Resumen de Notas</h2>
          <p className="page-title">
            Gestión y seguimiento de notas de servicio
          </p>
        </div>

        <div
          className={selectedCount > 0 ? "selection-toolbar" : "d-flex gap-2"}
        >
          {selectedCount === 0 ? (
            <button
              className="primary-btn"
              data-bs-toggle="modal"
              data-bs-target="#createNoteModal"
              type="button"
            >
              <i className="bi bi-plus-lg"></i>&nbsp;Nueva nota
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
                className="selection-paid"
                type="button"
                onClick={handleMarkPaid}
              >
                <i className="bi bi-check-circle"></i>
                {selectedCount === 1
                  ? " Marcar 1 nota pagada"
                  : ` Marcar ${selectedCount} notas pagadas`}
              </button>

              {selectedCount === notas.length ? (
                <button
                  className="btn btn-danger"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteAllNotesModal"
                >
                  <i className="bi bi-trash"></i> ¡BORRAR TODO!
                </button>
              ) : (
                <button
                  className="btn btn-danger"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteNotesModal"
                  onClick={() => {
                    setCurrentNote(null);
                    setCurrentId(null);
                  }}
                >
                  <i className="bi bi-trash"></i>
                  {selectedCount === 1
                    ? " Borrar seleccionada"
                    : ` Borrar (${selectedCount}) seleccionadas`}
                </button>
              )}

              <button
                className="btn btn-outline-secondary"
                onClick={handleCancelSelection}
                type="button"
              >
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
            <input
              type="text"
              placeholder="Buscar por nota, cliente, verificentro..."
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
                <th>NOTA</th>
                <th>CLIENTE</th>
                <th>NUM. VERIFICACIONES</th>
                <th>VERIFICENTRO</th>
                <th>MÉTODO DE PAGO</th>
                <th>ANTICIPO</th>
                <th>PAGADO</th>
                <th>REVISÓ</th>
                <th>ATENDIÓ</th>
                <th>COMENTARIO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>

            <tbody>
              {notas.map((note) => (
                <NoteRow
                  key={note.id}
                  note={note}
                  isSelected={!!selectedRows[note.id]}
                  onSelect={() => handleSelectRow(note.id)}
                  onEditClick={() => handleOpenEdit(note)}
                  onDeleteClick={() => handleOpenDeleteOne(note)}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <small>Mostrando {notas.length} registros</small>

          <div className="d-flex gap-2">
            <button className="btn btn-light" disabled>
              Anterior
            </button>
            <button className="btn btn-light">Siguiente</button>
          </div>
        </div>
      </div>

      <CreateNoteModal onCreate={handleCreateNote} />
      <EditNoteModal note={currentNote} onSave={handleUpdateNote} />
      <DeleteNotesModal
        note={currentNote}
        selectedCount={selectedCount}
        onConfirmDelete={currentNote ? handleDeleteOne : handleDeleteSelected}
      />
      <DeleteAllNotesModal
        totalCount={notas.length}
        onConfirmDelete={handleDeleteAll}
      />
      <CreateSuccessModal message={createMessage} />
      <DeleteSuccessModal message={deleteMessage} />
    </Admin>
  );
}
