import Modal from "bootstrap/js/dist/modal";

export default function MarkDeliveredOrdersModal({
  selectedCount,
  onConfirm,
}) {
  const handleClose = () => {
    const modalElement = document.getElementById("markDeliveredOrdersModal");
    if (!modalElement) return;

    const modalInstance = Modal.getOrCreateInstance(modalElement);
    modalInstance.hide();
  };

  return (
    <div
      className="modal fade"
      id="markDeliveredOrdersModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmar entrega masiva</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>

          <div className="modal-body">
            ¿Estás seguro de que deseas marcar los <strong>{selectedCount}</strong>{" "}
            pedidos seleccionados como entregados?
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-light" onClick={handleClose}>
              Cancelar
            </button>

            <button
              type="button"
              className="btn btn-success"
              onClick={onConfirm}
            >
              Marcar como entregado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}