import { useState } from "react";
import Admin from "../../components/Admin";
import OrderRow from "./components/OrderRow";
import EditOrderModal from "./components/EditOrderModal";
import UpdateOrderSuccessModal from "./components/UpdateOrderSuccessModal";
import DeleteOrdersModal from "./components/DeleteOrdersModal";
import MarkDeliveredOrdersModal from "./components/MarkDeliveredOrdersModal";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([
    {
      id: 1,
      nota: "N-1001",
      fechaEnvio: "2026-02-15",
      numeroGuia: "GU-20260215-001",
      recibio: "Carlos Mendoza",
      foto: "evidencia-001.jpg",
      estatusEnvio: "ENTREGADO",
      estatusClass: "status-success",
      comentario: "Entrega realizada sin incidencias",
    },
    {
      id: 2,
      nota: "N-1002",
      fechaEnvio: "2026-02-16",
      numeroGuia: "GU-20260216-002",
      recibio: "María López",
      foto: "evidencia-002.jpg",
      estatusEnvio: "ENVIADO",
      estatusClass: "status-neutral",
      comentario: "En tránsito a sucursal norte",
    },
    {
      id: 3,
      nota: "N-1003",
      fechaEnvio: "2026-02-17",
      numeroGuia: "GU-20260217-003",
      recibio: "-",
      foto: "Sin foto",
      estatusEnvio: "PENDIENTE",
      estatusClass: "status-warning",
      comentario: "Esperando confirmación de dirección",
    },
  ]);

  const [selectedRows, setSelectedRows] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleSelectAll = () => {
    const allSelected = pedidos.every((item) => selectedRows[item.id]);
    const newSelected = {};

    pedidos.forEach((item) => {
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
    setSelectedOrder(item);
  };

  const handleSaveEdit = (updatedOrder) => {
    setPedidos((prev) =>
      prev.map((item) => (item.id === updatedOrder.id ? updatedOrder : item))
    );
  };

  const handleDeleteSelected = () => {
    const idsToDelete = Object.keys(selectedRows)
      .filter((id) => selectedRows[id])
      .map(Number);

    setPedidos((prev) => prev.filter((item) => !idsToDelete.includes(item.id)));
    setSelectedRows({});
  };

  const handleMarkDelivered = () => {
    const idsToUpdate = Object.keys(selectedRows)
      .filter((id) => selectedRows[id])
      .map(Number);

    setPedidos((prev) =>
      prev.map((item) =>
        idsToUpdate.includes(item.id)
          ? {
              ...item,
              estatusEnvio: "ENTREGADO",
              estatusClass: "status-success",
            }
          : item
      )
    );

    setSelectedRows({});
  };

  const isAllSelected =
    pedidos.length > 0 && pedidos.every((item) => selectedRows[item.id]);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  return (
    <Admin>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Gestión de Pedidos</h2>
          <p className="page-title">Envíos físicos y entregas de documentación</p>
        </div>

        {selectedCount > 0 && (
          <div className="selection-toolbar">
            {isAllSelected ? (
              <div className="selection-info">
                <i className="bi bi-info-circle"></i>
                ¡Seleccionaste todo!
              </div>
            ) : (
              <div className="selection-info">
                <i className="bi bi-info-circle"></i>
                {selectedCount} nota(s) seleccionada(s)
              </div>
            )}

            <button
              className="selection-paid"
              data-bs-toggle="modal"
              data-bs-target="#markDeliveredOrdersModal"
            >
              <i className="bi bi-check-circle"></i>
              {selectedCount === 1
                ? "Marcar como Entregado"
                : "Marcar como Entregado"}
            </button>

            <button
              className="selection-delete"
              data-bs-toggle="modal"
              data-bs-target="#deleteOrdersModal"
            >
              <i className="bi bi-trash"></i>
              {selectedCount === pedidos.length
                ? "¡BORRAR TODO!"
                : "Borrar Seleccionadas"}
            </button>

            <button
              className="selection-cancel"
              onClick={handleCancelSelection}
            >
              <i className="bi bi-x-lg"></i>
              Cancelar
            </button>
          </div>
        )}
      </div>

      <div className="panel-card">
        <div className="toolbar-row">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Buscar por nota, guía, receptor..."
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
                <th>FECHA ENVÍO</th>
                <th>NÚMERO GUÍA</th>
                <th>RECIBIÓ</th>
                <th>FOTO</th>
                <th>ESTATUS ENVÍO</th>
                <th>COMENTARIO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>

            <tbody>
              {pedidos.map((item) => (
                <OrderRow
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
          <span>Mostrando {pedidos.length} registros</span>

          <div className="pagination-mini">
            <button disabled>Anterior</button>
            <button>Siguiente</button>
          </div>
        </div>
      </div>

      <EditOrderModal order={selectedOrder} onSave={handleSaveEdit} />
      <UpdateOrderSuccessModal />
      <DeleteOrdersModal
        selectedCount={selectedCount}
        totalCount={pedidos.length}
        onDelete={handleDeleteSelected}
      />
      <MarkDeliveredOrdersModal
        selectedCount={selectedCount}
        onConfirm={handleMarkDelivered}
      />
    </Admin>
  );
}