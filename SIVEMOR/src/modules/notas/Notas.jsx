import { useState } from "react";
import Admin from "../../components/Admin";
import NoteRow from "./components/NoteRow";
import CreateNoteModal from "./components/CreateNoteModal";
import EditNoteModal from "./components/EditNoteModal";
import UpdateSuccessModal from "./components/UpdateSuccessModal";
import DeleteNotesModal from "./components/DeleteNotesModal";
import MarkPaidModal from "./components/MarkPaidModal";

function Notas() {
  const [notas, setNotas] = useState([
    {
      id: 1,
      nota: "N-1001",
      cliente: "Transportes del Norte SA de CV",
      verificaciones: 2,
      verificentro: "Pepsi",
      metodo: "Efectivo",
      anticipo: "-",
      pagado: "Pagado",
      pagadoClass: "status-success",
      reviso: "Ana Gómez",
      atendio: "Ana Gómez",
      comentario: "Todo en orden",
    },
    {
      id: 2,
      nota: "N-1002",
      cliente: "Logística Express",
      verificaciones: 5,
      verificentro: "Pepsi2",
      metodo: "Tarjeta",
      anticipo: "1",
      pagado: "Pendiente",
      pagadoClass: "status-warning",
      reviso: "Ana Gómez",
      atendio: "Ana Gómez",
      comentario: "Pendiente factura",
    },
  ]);

  const [selectedRows, setSelectedRows] = useState({});
  const [selectedNote, setSelectedNote] = useState(null);

  const handleSelectAll = () => {
    const allSelected = notas.every((nota) => selectedRows[nota.id]);
    const newSelected = {};

    notas.forEach((nota) => {
      newSelected[nota.id] = !allSelected;
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

  const handleOpenEdit = (note) => {
    setSelectedNote(note);
  };

  const handleSaveEdit = (updatedNote) => {
    setNotas((prev) =>
      prev.map((nota) => (nota.id === updatedNote.id ? updatedNote : nota))
    );
  };

  const handleCreateNote = (newNote) => {
    setNotas((prev) => [
      ...prev,
      {
        ...newNote,
        id: Date.now(),
      },
    ]);
  };

  const handleDeleteSelected = () => {
    const idsToDelete = Object.keys(selectedRows)
      .filter((id) => selectedRows[id])
      .map(Number);

    setNotas((prev) => prev.filter((nota) => !idsToDelete.includes(nota.id)));
    setSelectedRows({});
  };

  const handleMarkPaid = () => {
    const idsToUpdate = Object.keys(selectedRows)
      .filter((id) => selectedRows[id])
      .map(Number);

    setNotas((prev) =>
      prev.map((nota) =>
        idsToUpdate.includes(nota.id)
          ? {
              ...nota,
              pagado: "Pagado",
              pagadoClass: "status-success",
            }
          : nota
      )
    );

    setSelectedRows({});
  };

  const isAllSelected =
    notas.length > 0 && notas.every((nota) => selectedRows[nota.id]);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  return (
    <Admin>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Resumen de Notas</h2>
          <p className="page-title">Gestión y seguimiento de notas de servicio</p>
        </div>

        <div className={selectedCount > 0 ? "selection-toolbar" : "d-flex gap-2"}>
          {selectedCount === 0 ? (
            <button
              className="primary-btn"
              data-bs-toggle="modal"
              data-bs-target="#createNoteModal"
            >
              <i className="bi bi-plus-lg"></i>
              &nbsp;Nueva nota
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
                data-bs-toggle="modal"
                data-bs-target="#markPaidModal"
              >
                <i className="bi bi-check-circle"></i>
                {selectedCount === notas.length
                  ? "Marcar TODO Pagado"
                  : selectedCount === 1
                  ? "Marcar 1 nota pagada"
                  : `Marcar ${selectedCount} notas pagadas`}
              </button>

              <button
                className="selection-delete"
                data-bs-toggle="modal"
                data-bs-target="#deleteNotesModal"
              >
                <i className="bi bi-trash"></i>
                {selectedCount === notas.length
                  ? "¡BORRAR TODO!"
                  : selectedCount === 1
                  ? "Borrar 1 nota"
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
              placeholder="Buscar por nota, cliente, verificentro, método de pago, estado..."
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
                <th>NOTA</th>
                <th>CLIENTE</th>
                <th>NUM. VERIFICACIONES</th>
                <th>VERIFICENTRO</th>
                <th>METODO DE PAGO</th>
                <th>ANTICIPO</th>
                <th>PAGADO</th>
                <th>REVISO</th>
                <th>ATENDIÓ</th>
                <th>COMENTARIO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {notas.map((item) => (
                <NoteRow
                  key={item.id}
                  note={item}
                  isSelected={!!selectedRows[item.id]}
                  onSelect={() => handleSelectRow(item.id)}
                  onEdit={() => handleOpenEdit(item)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateNoteModal onCreate={handleCreateNote} />
      <EditNoteModal note={selectedNote} onSave={handleSaveEdit} />
      <UpdateSuccessModal />
      <DeleteNotesModal
        selectedCount={selectedCount}
        onDelete={handleDeleteSelected}
      />
      <MarkPaidModal
        selectedCount={selectedCount}
        onConfirm={handleMarkPaid}
      />
    </Admin>
  );
}

export default Notas;