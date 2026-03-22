import Modal from "bootstrap/js/dist/modal";

export default function DeleteTransactionSuccessModal({ message }) {
  const handleClose = () => {
    const modalElement = document.getElementById("deleteTransactionSuccessModal");
    if (!modalElement) return;

    const modalInstance = Modal.getOrCreateInstance(modalElement);
    modalInstance.hide();
  };

  return (
    <div
      className="modal fade"
      id="deleteTransactionSuccessModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">¡Eliminación exitosa!</h5>
          </div>

          <div className="modal-body">
            {message || "Se eliminó correctamente la transacción."}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleClose}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}