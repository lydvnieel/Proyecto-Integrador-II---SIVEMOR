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
import { getTransacciones, createTransaccion, updateTransaccion, deleteTransaccion,} from "../transacciones/services/transacccionesService";
import { api } from "../../../server/api";

export default function Transacciones() {
  const [transacciones, setTransacciones] = useState([]);
  const [notas, setNotas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRows, setSelectedRows] = useState({});
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [createMessage, setCreateMessage] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [txData, notasRes, usuariosRes] = await Promise.all([
        getTransacciones(),
        api.get("/notas"),
        api.get("/usuarios"),
      ]);

      setTransacciones(txData);

      setNotas(
        Array.isArray(notasRes?.data?.data)
          ? notasRes.data.data
          : Array.isArray(notasRes?.data)
          ? notasRes.data
          : []
      );

      setUsuarios(
        Array.isArray(usuariosRes?.data?.data)
          ? usuariosRes.data.data
          : Array.isArray(usuariosRes?.data)
          ? usuariosRes.data
          : []
      );
    } catch (error) {
      console.error("Error cargando transacciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return transacciones;

    return transacciones.filter((item) => {
      const nota = String(item.nota || "").toLowerCase();
      const tipoPago = String(item.tipoPago || "").toLowerCase();
      const factura = String(item.factura || "").toLowerCase();
      const reviso = String(item.reviso || "").toLowerCase();
      const atendio = String(item.atendio || "").toLowerCase();
      const comentario = String(item.comentario || "").toLowerCase();

      return (
        nota.includes(search) ||
        tipoPago.includes(search) ||
        factura.includes(search) ||
        reviso.includes(search) ||
        atendio.includes(search) ||
        comentario.includes(search)
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

  const handleCreate = async (newTransaction) => {
    try {
      const createdTransaction = await createTransaccion(newTransaction);

      setTransacciones((prev) => [...prev, createdTransaction]);

      showCreateSuccessModal(
        `Se creó correctamente la transacción ${createdTransaction.factura}.`
      );

      return createdTransaction;
    } catch (error) {
      console.error("Error creando transacción:", error);
      throw error;
    }
  };

  const handleSaveEdit = async (updatedTransaction) => {
    if (selectedId === null) return;

    try {
      const updated = await updateTransaccion(selectedId, updatedTransaction);

      setTransacciones((prev) =>
        prev.map((item) => (item.id === selectedId ? updated : item))
      );

      setSelectedTransaction(updated);

      showUpdateSuccessModal(
        "Se actualizó correctamente la información de la transacción."
      );
    } catch (error) {
      console.error("Error actualizando transacción:", error);
      alert(error.message || "No se pudo actualizar la transacción.");
    }
  };

  const handleDeleteOne = async () => {
    if (selectedId === null) return;

    try {
      const deletedName = selectedTransaction?.factura || "la transacción";

      await deleteTransaccion(selectedId);

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
    } catch (error) {
      console.error("Error eliminando transacción:", error);
      alert(error.message || "No se pudo eliminar la transacción.");
    }
  };

  const handleDeleteSelected = async () => {
    const idsToDelete = Object.keys(selectedRows)
      .filter((id) => selectedRows[id])
      .map(Number);

    try {
      await Promise.all(idsToDelete.map((id) => deleteTransaccion(id)));

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
    } catch (error) {
      console.error("Error eliminando transacciones:", error);
      alert(error.message || "No se pudieron eliminar las transacciones.");
    }
  };

  const handleDeleteAll = async () => {
    try {
      const ids = transacciones.map((t) => t.id);

      await Promise.all(ids.map((id) => deleteTransaccion(id)));

      const total = transacciones.length;

      setTransacciones([]);
      setSelectedRows({});
      setSelectedTransaction(null);
      setSelectedId(null);

      showDeleteSuccessModal(
        total === 1
          ? "Se eliminó con éxito 1 transacción."
          : `Se eliminó con éxito ${total} transacciones.`,
        "deleteAllTransactionsModal"
      );
    } catch (error) {
      console.error("Error eliminando todas las transacciones:", error);
      alert(error.message || "No se pudieron eliminar todas las transacciones.");
    }
  };

  const handleMarkPaid = async () => {
    const idsToUpdate = Object.keys(selectedRows)
      .filter((id) => selectedRows[id])
      .map(Number);

    try {
      const selectedTx = transacciones.filter((t) => idsToUpdate.includes(t.id));

      const updatedItems = await Promise.all(
        selectedTx.map((item) =>
          updateTransaccion(item.id, {
            ...item,
            pagado: "Sí",
            pendiente: "No",
            reviso: item.revisoId,
            atendio: item.atendioId,
          })
        )
      );

      setTransacciones((prev) =>
        prev.map((item) => {
          const updated = updatedItems.find((u) => u.id === item.id);
          return updated || item;
        })
      );

      setSelectedRows({});

      hideModal("markPaidTransactionsModal", () => {
        cleanupModalArtifacts();
      });
    } catch (error) {
      console.error("Error marcando transacciones como pagadas:", error);
      alert(error.message || "No se pudieron marcar como pagadas.");
    }
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
            <button
              className="primary-btn"
              onClick={() => openModal("createTransactionModal")}
              type="button"
            >
              <i className="bi bi-plus-lg"></i>&nbsp;Nueva transacción
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
              placeholder="Buscar por nota, tipo de pago, factura, revisó o atendió..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {hasActiveSearch && (
            <button className="btn btn-light" onClick={clearSearch} type="button">
              Reiniciar búsqueda
            </button>
          )}
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
              {loading ? (
                <tr>
                  <td colSpan="14" className="text-center py-4">
                    Cargando transacciones...
                  </td>
                </tr>
              ) : filteredTransactions.length > 0 ? (
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

      <CreateTransactionModal
        onCreate={handleCreate}
        notas={notas}
        usuarios={usuarios}
      />

      <EditTransactionModal
        transaction={selectedTransaction}
        onSave={handleSaveEdit}
        notas={notas}
        usuarios={usuarios}
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