import { useEffect, useMemo, useState } from "react";
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
import {
  getPedidos,
  createPedido,
  updatePedido,
  deletePedido,
} from "./services/pedidosService";
import { api } from "../../../server/api";

const STATUS_OPTIONS = ["PENDIENTE", "ENVIADO", "ENTREGADO", "INCIDENCIA"];

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRows, setSelectedRows] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [createMessage, setCreateMessage] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstatus, setFilterEstatus] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [pedidosData, notasRes] = await Promise.all([
        getPedidos(),
        api.get("/notas"),
      ]);

      setPedidos(pedidosData);

      setNotas(
        Array.isArray(notasRes?.data?.data)
          ? notasRes.data.data
          : Array.isArray(notasRes?.data)
          ? notasRes.data
          : []
      );
    } catch (error) {
      console.error("Error cargando pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPedidos = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return pedidos.filter((item) => {
      const nota = String(item.nota || "").toLowerCase();
      const fechaEnvio = String(item.fechaEnvio || "").toLowerCase();
      const recibio = String(item.recibio || "").toLowerCase();
      const estatusEnvio = String(item.estatusEnvio || "").toUpperCase();

      const matchesSearch =
        !search ||
        nota.includes(search) ||
        fechaEnvio.includes(search) ||
        recibio.includes(search);

      const matchesEstatus = filterEstatus ? estatusEnvio === filterEstatus : true;

      return matchesSearch && matchesEstatus;
    });
  }, [pedidos, searchTerm, filterEstatus]);

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
      filteredPedidos.length > 0 &&
      filteredPedidos.every((item) => selectedRows[item.id]);

    const newSelected = { ...selectedRows };
    filteredPedidos.forEach((item) => {
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

  const handleCreate = async (newOrder) => {
    try {
      const createdOrder = await createPedido(newOrder);

      setPedidos((prev) => [...prev, createdOrder]);

      showCreateSuccessModal(
        `Se creó correctamente el pedido ${
          createdOrder.numeroGuia || createdOrder.nota
        }.`
      );

      return createdOrder;
    } catch (error) {
      console.error("Error creando pedido:", error);
      throw error;
    }
  };

  const handleSaveEdit = async (updatedOrder) => {
    if (selectedId === null) return;

    try {
      const updated = await updatePedido(selectedId, updatedOrder);

      setPedidos((prev) =>
        prev.map((item) => (item.id === selectedId ? updated : item))
      );

      setSelectedOrder(updated);

      showUpdateSuccessModal(
        "Se actualizó correctamente la información del pedido."
      );
    } catch (error) {
      console.error("Error actualizando pedido:", error);
      alert(error.message || "No se pudo actualizar el pedido.");
    }
  };

  const handleDeleteOne = async () => {
    if (selectedId === null) return;

    try {
      const deletedName = selectedOrder?.numeroGuia || "el pedido";

      await deletePedido(selectedId);

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
    } catch (error) {
      console.error("Error eliminando pedido:", error);
      alert(error.message || "No se pudo eliminar el pedido.");
    }
  };

  const handleDeleteSelected = async () => {
    const idsToDelete = Object.keys(selectedRows)
      .filter((id) => selectedRows[id])
      .map(Number);

    try {
      await Promise.all(idsToDelete.map((id) => deletePedido(id)));

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
    } catch (error) {
      console.error("Error eliminando pedidos:", error);
      alert(error.message || "No se pudieron eliminar los pedidos.");
    }
  };

  const handleDeleteAll = async () => {
    try {
      const ids = pedidos.map((p) => p.id);

      await Promise.all(ids.map((id) => deletePedido(id)));

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
    } catch (error) {
      console.error("Error eliminando todos los pedidos:", error);
      alert(error.message || "No se pudieron eliminar todos los pedidos.");
    }
  };

  const handleMarkDelivered = async () => {
    const idsToUpdate = Object.keys(selectedRows)
      .filter((id) => selectedRows[id])
      .map(Number);

    try {
      const selectedItems = pedidos.filter((p) => idsToUpdate.includes(p.id));

      const updatedItems = await Promise.all(
        selectedItems.map((item) =>
          updatePedido(item.id, {
            ...item,
            estatusEnvio: "ENTREGADO",
          })
        )
      );

      setPedidos((prev) =>
        prev.map((item) => {
          const updated = updatedItems.find((u) => u.id === item.id);
          return updated || item;
        })
      );

      setSelectedRows({});

      hideModal("markDeliveredOrdersModal", () => {
        cleanupModalArtifacts();
      });
    } catch (error) {
      console.error("Error marcando pedidos como entregados:", error);
      alert(error.message || "No se pudieron marcar como entregados.");
    }
  };

  const isAllSelected =
    filteredPedidos.length > 0 &&
    filteredPedidos.every((item) => selectedRows[item.id]);

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
            <div className="d-flex gap-2">
              <button
                className="primary-btn"
                onClick={() => openModal("createOrderModal")}
                type="button"
              >
                <i className="bi bi-plus-lg"></i>&nbsp;Nuevo Pedido
              </button>
            </div>
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

              {selectedCount === filteredPedidos.length && filteredPedidos.length > 0 ? (
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
        <div className="toolbar-row d-flex align-items-center gap-2 flex-wrap">
          <div className="search-box flex-grow-1">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Buscar por número de nota, fecha o persona que recibió..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="form-select"
            style={{ maxWidth: "220px", marginLeft: "auto" }}
            value={filterEstatus}
            onChange={(e) => setFilterEstatus(e.target.value)}
          >
            <option value="">Estado del envío</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
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
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    Cargando pedidos...
                  </td>
                </tr>
              ) : filteredPedidos.length > 0 ? (
                filteredPedidos.map((item) => (
                  <OrderRow
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
                  <td colSpan="9" className="text-center py-4">
                    No se encontraron pedidos con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>Mostrando {filteredPedidos.length} de {pedidos.length} registros</span>

          <div className="pagination-mini">
            <button disabled>Anterior</button>
            <button>Siguiente</button>
          </div>
        </div>
      </div>

      <CreateOrderModal onCreate={handleCreate} notas={notas} />
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