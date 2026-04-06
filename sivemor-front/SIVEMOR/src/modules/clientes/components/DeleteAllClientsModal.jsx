import Modal from "bootstrap/js/dist/modal";

export default function DeleteAllClientsModal({ totalCount, onConfirmDelete }) {
  const handleClose = () => {
    const modalElement = document.getElementById("deleteAllClientsModal");
    if (!modalElement) return;

    const modalInstance = Modal.getOrCreateInstance(modalElement);
    modalInstance.hide();
  };

  return (
    <div
      className="modal fade"
      id="deleteAllClientsModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-3">
          <div className="modal-header">
            <h4 className="modal-title">
              <strong>Confirmar eliminación</strong>
            </h4>
          </div>

          <div className="modal-body">
            ¿Estás seguro de que deseas eliminar todos los clientes? Esta acción
            no se puede deshacer.
            <br />
            <span className="text-danger">Total a eliminar: {totalCount}</span>
          </div>

          <div className="modal-footer text-end mt-3">
            <button
              type="button"
              className="btn btn-light me-2 border border-secondary-subtle mt-3"
              onClick={handleClose}
              style={{ width: 99, height: 40 }}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="btn btn-danger mt-3"
              onClick={onConfirmDelete}
            >
              Eliminar TODO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}