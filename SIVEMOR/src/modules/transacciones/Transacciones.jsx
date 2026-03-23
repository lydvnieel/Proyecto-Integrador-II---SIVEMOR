import { useState } from "react";
import Admin from "../../components/Admin";
import TransactionRow from "./components/TransactionRow";
import CreateTransactionModal from "./components/CreateTransactionModal";
import EditTransactionModal from "./components/EditTransactionModal";
import UpdateTransactionSuccessModal from "./components/UpdateTransactionSuccessModal";
import DeleteTransactionsModal from "./components/DeleteTransactionsModal";
import MarkPaidTransactionsModal from "./components/MarkPaidTransactionsModal";

export default function Transacciones() {
  const [transacciones, setTransacciones] = useState([
    {
      id: 1,
      nota: "N-1001",
      tipoPago: "TRANSFERENCIA",
      monto: "$1,200",
      cuentaDeposito: "BBVA-1234",
      factura: "F-900",
      pagado: "Sí",
      pagadoClass: "status-success",
      fechaPedido: "2026-02-15",
      cotizacion: "C-500",
      reviso: "Carlos Mendoza",
      atendio: "Ana García",
      pendiente: "No",
      pendienteClass: "status-success",
      comentario: "Pago completo verificado",
    },
    {
      id: 2,
      nota: "N-1002",
      tipoPago: "EFECTIVO",
      monto: "$800",
      cuentaDeposito: "-",
      factura: "F-901",
      pagado: "No",
      pagadoClass: "status-warning",
      fechaPedido: "2026-02-16",
      cotizacion: "C-501",
      reviso: "María López",
      atendio: "Juan Pérez",
      pendiente: "Sí",
      pendienteClass: "status-warning",
      comentario: "Pendiente de validación",
    },
    {
      id: 3,
      nota: "N-1001",
      tipoPago: "DEPOSITO",
      monto: "$500",
      cuentaDeposito: "Santander-5678",
      factura: "F-902",
      pagado: "Sí",
      pagadoClass: "status-success",
      fechaPedido: "2026-02-17",
      cotizacion: "C-500",
      reviso: "Carlos Mendoza",
      atendio: "Ana García",
      pendiente: "No",
      pendienteClass: "status-success",
      comentario: "Segundo pago de la nota N-1001",
    },
  ]);

  const [selectedRows, setSelectedRows] = useState({});
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleSelectAll = () => {
    const allSelected = transacciones.every((item) => selectedRows[item.id]);
    const newSelected = {};

    transacciones.forEach((item) => {
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
  };

  const handleCreate = (newTransaction) => {
    setTransacciones((prev) => [
      ...prev,
      {
        ...newTransaction,
        id: Date.now(),
      },
    ]);
  };

  const handleSaveEdit = (updatedTransaction) => {
    setTransacciones((prev) =>
      prev.map((item) =>
        item.id === updatedTransaction.id ? updatedTransaction : item
      )
    );
  };

  const handleDeleteSelected = () => {
    const idsToDelete = Object.keys(selectedRows)
      .filter((id) => selectedRows[id])
      .map(Number);

    setTransacciones((prev) =>
      prev.filter((item) => !idsToDelete.includes(item.id))
    );
    setSelectedRows({});
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
  };

  const isAllSelected =
    transacciones.length > 0 &&
    transacciones.every((item) => selectedRows[item.id]);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  return (
    <Admin>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Gestión de Transacciones</h2>
          <p className="page-title">
            Movimientos financieros asociados a notas
          </p>
        </div>

        <div className={selectedCount > 0 ? "selection-toolbar" : ""}>
          {selectedCount === 0 ? (
            <button
              className="primary-btn"
              data-bs-toggle="modal"
              data-bs-target="#createTransactionModal"
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
                data-bs-toggle="modal"
                data-bs-target="#markPaidTransactionsModal"
              >
                <i className="bi bi-check-circle"></i>
                {selectedCount === 1
                  ? "Marcar como Pagado"
                  : "Marcar como Pagado"}
              </button>

              <button
                className="selection-delete"
                data-bs-toggle="modal"
                data-bs-target="#deleteTransactionsModal"
              >
                <i className="bi bi-trash"></i>
                {selectedCount === transacciones.length
                  ? "¡BORRAR TODO!"
                  : selectedCount === 1
                  ? "Borrar Seleccionada"
                  : "Borrar Seleccionadas"}
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
              placeholder="Buscar por nota, factura, empleado..."
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
              {transacciones.map((item) => (
                <TransactionRow
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

        <div className="table-footer">
          <span>Mostrando {transacciones.length} registros</span>

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
      <UpdateTransactionSuccessModal />
      <DeleteTransactionsModal
        selectedCount={selectedCount}
        totalCount={transacciones.length}
        onDelete={handleDeleteSelected}
      />
      <MarkPaidTransactionsModal
        selectedCount={selectedCount}
        onConfirm={handleMarkPaid}
      />
    </Admin>
  );
}