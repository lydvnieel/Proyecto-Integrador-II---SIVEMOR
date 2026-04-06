import { useEffect, useMemo, useState } from "react";
import Modal from "bootstrap/js/dist/modal";
import Admin from "../../components/Admin";
import TransactionRow from "./components/TransactionRow";
import CreateTransactionModal from "./components/CreateTransactionModal";
import EditTransactionModal from "./components/EditTransactionModal";
import UpdateTransactionSuccessModal from "./components/UpdateTransactionSuccessModal";
import DeleteTransactionsModal from "./components/DeleteTransactionsModal";
import MarkPaidTransactionsModal from "./components/MarkPaidTransactionsModal";
import CreateTransactionSuccessModal from "./components/CreateTransactionSuccessModal";
import DeleteTransactionSuccessModal from "./components/DeleteTransactionSuccessModal";
import DeleteAllTransactionsModal from "./components/DeleteAllTransactionsModal";
import transaccionesData from "../../data/transacciones.json";

export default function Transacciones() {
  const [transacciones, setTransacciones] = useState(() => {
    const saved = localStorage.getItem("transacciones");
    return saved ? JSON.parse(saved) : transaccionesData;
  });

  const [selectedRows, setSelectedRows] = useState({});
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [createMessage, setCreateMessage] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem("transacciones", JSON.stringify(transacciones));
  }, [transacciones]);

  const filteredTransactions = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return transacciones;

    return transacciones.filter((item) => {
      const cliente = String(
        item.cliente ||
          item.razonSocial ||
          item.nombreCliente ||
          ""
      ).toLowerCase();

      const tipoVerificacion = String(
        item.tipoVerificacion ||
          item.tipo_verificacion ||
          item.verificacion ||
          item.tipo ||
          ""
      ).toLowerCase();

      const encargado = String(
        item.encargado ||
          item.responsable ||
          ""
      ).toLowerCase();

      const empleado = String(
        item.atendio ||
          item.empleado ||
          item.empleadoAtiende ||
          item.empleadoCobra ||
          item.atiendeYCobra ||
          ""
      ).toLowerCase();

      return (
        cliente.includes(search) ||
        tipoVerificacion.includes(search) ||
        encargado.includes(search) ||
        empleado.includes(search)
      );
    });
  }, [transacciones, searchTerm]);

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
    hideModal("createTransactionModal", () => {
      openModal("createTransactionSuccessModal");
    });
  };

  const showUpdateSuccessModal = (message) => {
    setUpdateMessage(message);
    hideModal("editTransactionModal", () => {
      openModal("updateTransactionSuccessModal");
    });
  };

  const showDeleteSuccessModal = (message, sourceModalId) => {
    setDeleteMessage(message);
    hideModal(sourceModalId, () => {
      openModal("deleteTransactionSuccessModal");
    });
  };

  const handleSelectAll = () => {
    const allSelected =
      filteredTransactions.length > 0 &&
      filteredTransactions.every((item) => selectedRows[item.id]);

    const newSelected = { ...selectedRows };
    filteredTransactions.forEach((item) => {
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
    setSelectedTransaction(item);
    setSelectedId(item.id);

    setTimeout(() => {
      openModal("editTransactionModal");
    }, 0);
  };

  const handleOpenDeleteOne = (item) => {
    setSelectedRows({});
    setSelectedTransaction(item);
    setSelectedId(item.id);

    setTimeout(() => {
      openModal("deleteTransactionsModal");
    }, 0);
  };

  const handleOpenDeleteSelected = () => {
    setSelectedTransaction(null);
    setSelectedId(null);
    openModal("deleteTransactionsModal");
  };

  const handleOpenDeleteAll = () => {
    setSelectedTransaction(null);
    setSelectedId(null);
    openModal("deleteAllTransactionsModal");
  };

  const handleOpenMarkPaid = () => {
    openModal("markPaidTransactionsModal");
  };

  const handleCreate = (newTransaction) => {
    const createdTransaction = {
      ...newTransaction,
      id: Date.now(),
    };

    setTransacciones((prev) => [...prev, createdTransaction]);

    showCreateSuccessModal(
      `Se creó correctamente la transacción ${createdTransaction.factura}.`
    );
  };

  const handleSaveEdit = (updatedTransaction) => {
    if (selectedId === null) return;

    setTransacciones((prev) =>
      prev.map((item) =>
        item.id === selectedId ? { ...item, ...updatedTransaction } : item
      )
    );

    showUpdateSuccessModal(
      "Se actualizó correctamente la información de la transacción."
    );
  };

  const handleDeleteOne = () => {
    if (selectedId === null) return;

    const deletedName = selectedTransaction?.factura || "la transacción";

    setTransacciones((prev) => prev.filter((item) => item.id !== selectedId));

    setSelectedRows((prev) => {
      const updated = { ...prev };
      delete updated[selectedId];
      return updated;
    });

    setSelectedTransaction(null);
    setSelectedId(null);

    showDeleteSuccessModal(
      `Se eliminó con éxito ${deletedName}.`,
      "deleteTransactionsModal"
    );
  };

  const handleDeleteSelected = () => {
    const idsToDelete = Object.keys(selectedRows)
      .filter((id) => selectedRows[id])
      .map(Number);

    const count = idsToDelete.length;

    setTransacciones((prev) =>
      prev.filter((item) => !idsToDelete.includes(item.id))
    );

    setSelectedRows({});
    setSelectedTransaction(null);
    setSelectedId(null);

    showDeleteSuccessModal(
      count === 1
        ? "Se eliminó con éxito 1 transacción."
        : `Se eliminaron con éxito ${count} transacciones.`,
      "deleteTransactionsModal"
    );
  };

  const handleDeleteAll = () => {
    const total = transacciones.length;

    setTransacciones([]);
    setSelectedRows({});
    setSelectedTransaction(null);
    setSelectedId(null);

    showDeleteSuccessModal(
      total === 1
        ? "Se eliminó con éxito 1 transacción."
        : `Se eliminaron con éxito ${total} transacciones.`,
      "deleteAllTransactionsModal"
    );
  };

  const handleMarkPaid = () => {
    const idsToUpdate = Object.keys(selectedRows)
      .filter((id) => selectedRows[id])
      .map(Number);

    setTransacciones((prev) =>
      prev.map((item) =>
        idsToUpdate.includes(item.id)
          ? {
              ...item,
              pagado: "Sí",
              pagadoClass: "status-success",
              pendiente: "No",
              pendienteClass: "status-success",
            }
          : item
      )
    );

    setSelectedRows({});

    hideModal("markPaidTransactionsModal", () => {
      cleanupModalArtifacts();
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const isAllSelected =
    filteredTransactions.length > 0 &&
    filteredTransactions.every((item) => selectedRows[item.id]);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;
  const hasActiveSearch = searchTerm.trim() !== "";

  return (
    <Admin>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Gestión de Transacciones</h2>
          <p className="page-title">
            Movimientos financieros asociados a notas
          </p>
        </div>

        <div className={selectedCount > 0 ? "selection-toolbar" : "d-flex gap-2"}>
          {selectedCount === 0 ? (
            <>
              <button
                className="primary-btn"
                onClick={() => openModal("createTransactionModal")}
                type="button"
              >
                <i className="bi bi-plus-lg"></i>&nbsp;Nueva transacción
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
                className="selection-paid"
                onClick={handleOpenMarkPaid}
                type="button"
              >
                <i className="bi bi-check-circle"></i>
                Marcar como Pagado
              </button>

              {selectedCount === filteredTransactions.length &&
              filteredTransactions.length > 0 ? (
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
                    ? " Borrar Seleccionada"
                    : " Borrar Seleccionadas"}
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
              placeholder="Buscar por cliente, tipo de verificación, encargado o empleado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                <th>TIPO PAGO</th>
                <th>MONTO</th>
                <th>CUENTA DEPÓSITO</th>
                <th>FACTURA</th>
                <th>PAGADO</th>
                <th>FECHA PEDIDO</th>
                <th>COTIZACIÓN</th>
                <th>REVISÓ</th>
                <th>ATENDIÓ</th>
                <th>PENDIENTE</th>
                <th>COMENTARIO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((item) => (
                  <TransactionRow
                    key={item.id}
                    item={item}
                    isSelected={!!selectedRows[item.id]}
                    onSelect={() => handleSelectRow(item.id)}
                    onEdit={() => handleOpenEdit(item)}
                    onDelete={() => handleOpenDeleteOne(item)}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="14" className="text-center py-4">
                    No se encontraron transacciones con la búsqueda aplicada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>
            Mostrando {filteredTransactions.length} de {transacciones.length} registros
          </span>

          <div className="pagination-mini">
            <button disabled>Anterior</button>
            <button>Siguiente</button>
          </div>
        </div>
      </div>

      <CreateTransactionModal onCreate={handleCreate} />
      <EditTransactionModal
        transaction={selectedTransaction}
        onSave={handleSaveEdit}
      />

      <DeleteTransactionsModal
        transaction={selectedTransaction}
        selectedCount={selectedCount}
        onConfirmDelete={
          selectedTransaction ? handleDeleteOne : handleDeleteSelected
        }
      />

      <DeleteAllTransactionsModal
        totalCount={transacciones.length}
        onConfirmDelete={handleDeleteAll}
      />

      <MarkPaidTransactionsModal
        selectedCount={selectedCount}
        onConfirm={handleMarkPaid}
      />

      <CreateTransactionSuccessModal message={createMessage} />
      <UpdateTransactionSuccessModal message={updateMessage} />
      <DeleteTransactionSuccessModal message={deleteMessage} />
    </Admin>
  );
}