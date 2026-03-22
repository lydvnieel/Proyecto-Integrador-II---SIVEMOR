import { useEffect, useState } from "react";
import Modal from "bootstrap/js/dist/modal";
import Admin from "../../components/Admin";
import OrderRow from "./components/OrderRow";
import CreateOrderModal from "./components/CreateOrderModal";
import CreateOrderSuccessModal from "./components/CreateOrderSuccessModal";
import EditOrderModal from "./components/EditOrderModal";
import UpdateOrderSuccessModal from "./components/UpdateOrderSuccessModal";
import DeleteOrdersModal from "./components/DeleteOrdersModal";
import DeleteAllOrdersModal from "./components/DeleteAllOrdersModal";
import DeleteOrderSuccessModal from "./components/DeleteOrderSuccessModal.jsx";
import MarkDeliveredOrdersModal from "./components/MarkDeliveredOrdersModal";
import pedidosData from "../../data/pedidos.json";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState(() => {
    const saved = localStorage.getItem("pedidos");
    return saved ? JSON.parse(saved) : pedidosData;
  });

  const [selectedRows, setSelectedRows] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [createMessage, setCreateMessage] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
  }, [pedidos]);

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
    hideModal("createOrderModal", () => {
      openModal("createOrderSuccessModal");
    });
  };

  const showUpdateSuccessModal = (message) => {
    setUpdateMessage(message);
    hideModal("editOrderModal", () => {
      openModal("updateOrderSuccessModal");
    });
  };

  const showDeleteSuccessModal = (message, sourceModalId) => {
    setDeleteMessage(message);
    hideModal(sourceModalId, () => {
      openModal("deleteOrderSuccessModal");
    });
  };

  const handleSelectAll = () => {
    const allSelected =
      pedidos.length > 0 &&
      pedidos.every((item) => selectedRows[item.id]);

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
    setSelectedId(item.id);

    setTimeout(() => {
      openModal("editOrderModal");
    }, 0);
  };

  const handleOpenDeleteOne = (item) => {
    setSelectedRows({});
    setSelectedOrder(item);
    setSelectedId(item.id);

    setTimeout(() => {
      openModal("deleteOrdersModal");
    }, 0);
  };

  const handleOpenDeleteSelected = () => {
    setSelectedOrder(null);
    setSelectedId(null);
    openModal("deleteOrdersModal");
  };

  const handleOpenDeleteAll = () => {
    setSelectedOrder(null);
    setSelectedId(null);
    openModal("deleteAllOrdersModal");
  };

  const handleOpenMarkDelivered = () => {
    openModal("markDeliveredOrdersModal");
  };

  const handleCreate = (newOrder) => {
    const createdOrder = {
      ...newOrder,
      id: Date.now(),
    };

    setPedidos((prev) => [...prev, createdOrder]);

    showCreateSuccessModal(
      `Se creó correctamente el pedido ${createdOrder.numeroGuia}.`
    );
  };

  const handleSaveEdit = (updatedOrder) => {
    if (selectedId === null) return;

    setPedidos((prev) =>
      prev.map((item) =>
        item.id === selectedId ? { ...item, ...updatedOrder } : item
      )
    );

    showUpdateSuccessModal(
      "Se actualizó correctamente la información del pedido."
    );
  };

  const handleDeleteOne = () => {
    if (selectedId === null) return;

    const deletedName = selectedOrder?.numeroGuia || "el pedido";

    setPedidos((prev) => prev.filter((item) => item.id !== selectedId));

    setSelectedRows((prev) => {
      const updated = { ...prev };
      delete updated[selectedId];
      return updated;
    });

    setSelectedOrder(null);
    setSelectedId(null);

    showDeleteSuccessModal(
      `Se eliminó con éxito ${deletedName}.`,
      "deleteOrdersModal"
    );
  };

  const handleDeleteSelected = () => {
    const idsToDelete = Object.keys(selectedRows)
      .filter((id) => selectedRows[id])
      .map(Number);

    const count = idsToDelete.length;

    setPedidos((prev) => prev.filter((item) => !idsToDelete.includes(item.id)));

    setSelectedRows({});
    setSelectedOrder(null);
    setSelectedId(null);

    showDeleteSuccessModal(
      count === 1
        ? "Se eliminó con éxito 1 pedido."
        : `Se eliminaron con éxito ${count} pedidos.`,
      "deleteOrdersModal"
    );
  };

  const handleDeleteAll = () => {
    const total = pedidos.length;

    setPedidos([]);
    setSelectedRows({});
    setSelectedOrder(null);
    setSelectedId(null);

    showDeleteSuccessModal(
      total === 1
        ? "Se eliminó con éxito 1 pedido."
        : `Se eliminaron con éxito ${total} pedidos.`,
      "deleteAllOrdersModal"
    );
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

    hideModal("markDeliveredOrdersModal", () => {
      cleanupModalArtifacts();
    });
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

        <div className={selectedCount > 0 ? "selection-toolbar" : ""}>
          {selectedCount === 0 ? (
            <button
              className="primary-btn"
              onClick={() => openModal("createOrderModal")}
              type="button"
            >
              <i className="bi bi-plus-lg"></i>&nbsp;Nuevo Pedido
            </button>
          ) : (
            <>
              {isAllSelected ? (
                <div className="selection-info">
                  <i className="bi bi-info-circle"></i>
                  ¡Seleccionaste todo!
                </div>
              ) : (
                <div className="selection-info">
                  <i className="bi bi-info-circle"></i>
                  {selectedCount} pedido(s) seleccionado(s)
                </div>
              )}

              <button
                className="selection-paid"
                onClick={handleOpenMarkDelivered}
                type="button"
              >
                <i className="bi bi-check-circle"></i>
                Marcar como Entregado
              </button>

              {selectedCount === pedidos.length ? (
                <button
                  className="selection-delete"
                  onClick={handleOpenDeleteAll}
                  type="button"
                >
                  <i className="bi bi-trash"></i>
                  ¡BORRAR TODO!
                </button>
              ) : (
                <button
                  className="selection-delete"
                  onClick={handleOpenDeleteSelected}
                  type="button"
                >
                  <i className="bi bi-trash"></i>
                  {selectedCount === 1
                    ? " Borrar Seleccionado"
                    : " Borrar Seleccionados"}
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
              placeholder="Buscar por nota, guía, receptor..."
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
                  onDelete={() => handleOpenDeleteOne(item)}
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

      <CreateOrderModal onCreate={handleCreate} />
      <CreateOrderSuccessModal message={createMessage} />
      <EditOrderModal order={selectedOrder} onSave={handleSaveEdit} />
      <UpdateOrderSuccessModal message={updateMessage} />

      <DeleteOrdersModal
        order={selectedOrder}
        selectedCount={selectedCount}
        onConfirmDelete={selectedOrder ? handleDeleteOne : handleDeleteSelected}
      />

      <DeleteAllOrdersModal
        totalCount={pedidos.length}
        onConfirmDelete={handleDeleteAll}
      />

      <DeleteOrderSuccessModal message={deleteMessage} />

      <MarkDeliveredOrdersModal
        selectedCount={selectedCount}
        onConfirm={handleMarkDelivered}
      />
    </Admin>
  );
}