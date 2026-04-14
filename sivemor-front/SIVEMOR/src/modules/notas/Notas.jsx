import { useEffect, useMemo, useState } from "react";
import Modal from "bootstrap/js/dist/modal";
import Admin from "../../components/Admin";
import NoteRow from "./components/NoteRow";
import CreateNoteModal from "./components/CreateNoteModal";
import EditNoteModal from "./components/EditNoteModal";
import DeleteNotesModal from "./components/DeleteNotesModal";
import DeleteAllNotesModal from "./components/DeleteAllNotesModal";
import CreateSuccessModal from "./components/CreateSuccessModal";
import DeleteSuccessModal from "./components/DeleteSuccessModal";
import UpdateSuccessModal from "./components/UpdateSuccessModal";
import { notasService } from "./services/notasServices";
import { api } from "../../../server/api";

export default function Notas() {
  const [notas, setNotas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [verificentros, setVerificentros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [selectedRows, setSelectedRows] = useState({});
  const [currentNote, setCurrentNote] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [createMessage, setCreateMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      const [notasData, clientesRes, verificentrosRes, usuariosRes] =
        await Promise.all([
          notasService.getAll(),
          api.get("/clientes"),
          api.get("/verificentros"),
          api.get("/usuarios"),
        ]);

      setNotas(notasData);

      setClientes(
        Array.isArray(clientesRes.data?.data)
          ? clientesRes.data.data
          : Array.isArray(clientesRes.data)
          ? clientesRes.data
          : []
      );

      setVerificentros(
        Array.isArray(verificentrosRes.data?.data)
          ? verificentrosRes.data.data
          : Array.isArray(verificentrosRes.data)
          ? verificentrosRes.data
          : []
      );

      setUsuarios(
        Array.isArray(usuariosRes.data?.data)
          ? usuariosRes.data.data
          : Array.isArray(usuariosRes.data)
          ? usuariosRes.data
          : []
      );
    } catch (error) {
      console.error("Error al cargar notas:", error);
    } finally {
      setLoading(false);
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

  const showDeleteSuccessModal = (message, sourceModalId) => {
    setDeleteMessage(message);

    const sourceModalElement = document.getElementById(sourceModalId);
    const successModalElement = document.getElementById(
      "successfulDeleteNoteModal"
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
      { once: true }
    );

    sourceModalInstance.hide();
  };

  const filteredNotas = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return notas;

    return notas.filter((note) =>
      [
        note.nota,
        note.cliente,
        note.verificentro,
        note.metodo,
        note.atendio,
        note.reviso,
        note.comentario,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [notas, search]);

  const handleSelectAll = () => {
    const allSelected =
      filteredNotas.length > 0 &&
      filteredNotas.every((note) => selectedRows[note.id]);

    const newSelected = {};
    filteredNotas.forEach((note) => {
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

  const handleCreateNote = async (formData) => {
    try {
      const createdNote = await notasService.create(formData);
      setNotas((prev) => [...prev, createdNote]);
      setCreateMessage(`Se creó con éxito la nota ${createdNote.nota}.`);
    } catch (error) {
      console.error("Error al crear nota:", error);
      throw error;
    }
  };

  const handleMarkPaid = async () => {
    try {
      const selectedNotes = notas.filter((note) => selectedRows[note.id]);

      const updatedNotes = await Promise.all(
        selectedNotes.map((note) => notasService.markAsPaid(note.id, note))
      );

      setNotas((prev) =>
        prev.map((note) => {
          const updated = updatedNotes.find((u) => u.id === note.id);
          return updated || note;
        })
      );

      setSelectedRows({});
    } catch (error) {
      console.error("Error al marcar notas como pagadas:", error);
    }
  };

  const handleUpdateNote = async (updatedPayload) => {
  if (currentId === null) return;

  try {
    await notasService.update(currentId, updatedPayload);
    await loadInitialData();

    const refreshedNote = await notasService.getById(currentId);
    setCurrentNote(refreshedNote);
  } catch (error) {
    console.error("Error al actualizar nota:", error);
    throw error;
  }
};

  const handleDeleteOne = async () => {
    if (currentId === null) return;

    try {
      const deletedNote = currentNote?.nota || "la nota";

      await notasService.remove(currentId);

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
        "deleteNotesModal"
      );
    } catch (error) {
      console.error("Error al eliminar nota:", error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const idsToDelete = Object.keys(selectedRows)
        .filter((id) => selectedRows[id])
        .map(Number);

      await Promise.all(idsToDelete.map((id) => notasService.remove(id)));

      const count = idsToDelete.length;

      setNotas((prev) => prev.filter((note) => !idsToDelete.includes(note.id)));
      setSelectedRows({});
      setCurrentNote(null);
      setCurrentId(null);

      showDeleteSuccessModal(
        count === 1
          ? "Se eliminó con éxito 1 nota seleccionada."
          : `Se eliminaron con éxito ${count} notas seleccionadas.`,
        "deleteNotesModal"
      );
    } catch (error) {
      console.error("Error al eliminar notas:", error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      const idsToDelete = notas.map((note) => note.id);
      await Promise.all(idsToDelete.map((id) => notasService.remove(id)));

      const total = notas.length;

      setNotas([]);
      setSelectedRows({});
      setCurrentNote(null);
      setCurrentId(null);

      showDeleteSuccessModal(
        total === 1
          ? "Se eliminó con éxito 1 nota."
          : `Se eliminaron con éxito ${total} notas.`,
        "deleteAllNotesModal"
      );
    } catch (error) {
      console.error("Error al eliminar todas las notas:", error);
    }
  };

  const isAllSelected =
    filteredNotas.length > 0 &&
    filteredNotas.every((note) => selectedRows[note.id]);

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

              {selectedCount === filteredNotas.length ? (
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
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
              {loading ? (
                <tr>
                  <td colSpan="12" className="text-center py-4">
                    Cargando notas...
                  </td>
                </tr>
              ) : filteredNotas.length === 0 ? (
                <tr>
                  <td colSpan="12" className="text-center py-4">
                    No hay notas registradas.
                  </td>
                </tr>
              ) : (
                filteredNotas.map((note) => (
                  <NoteRow
                    key={note.id}
                    note={note}
                    isSelected={!!selectedRows[note.id]}
                    onSelect={() => handleSelectRow(note.id)}
                    onEditClick={() => handleOpenEdit(note)}
                    onDeleteClick={() => handleOpenDeleteOne(note)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <small>Mostrando {filteredNotas.length} registros</small>

          <div className="d-flex gap-2">
            <button className="btn btn-light" disabled>
              Anterior
            </button>
            <button className="btn btn-light">Siguiente</button>
          </div>
        </div>
      </div>

      <CreateNoteModal
        onCreate={handleCreateNote}
        clientes={clientes}
        verificentros={verificentros}
        usuarios={usuarios}
      />

      <EditNoteModal
        note={currentNote}
        onSave={handleUpdateNote}
        usuarios={usuarios}
      />

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
      <UpdateSuccessModal />
    </Admin>
  );
}