import Modal from "bootstrap/js/dist/modal";

export default function MarkPaidTransactionsModal({
  selectedCount,
  onConfirm,
}) {
  const handleClose = () => {
    const modalElement = document.getElementById("markPaidTransactionsModal");
    if (!modalElement) return;

    const modalInstance = Modal.getOrCreateInstance(modalElement);
    modalInstance.hide();
  };

  return (
    <div
      className="modal fade"
      id="markPaidTransactionsModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmar pago masivo</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>

          <div className="modal-body">
            ¿Estás seguro de que deseas marcar {selectedCount} transacción
            {selectedCount > 1 ? "es" : ""} como pagada
            {selectedCount > 1 ? "s" : ""}?
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-light"
              onClick={handleClose}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="btn btn-success"
              onClick={onConfirm}
            >
              Marcar como pagado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}