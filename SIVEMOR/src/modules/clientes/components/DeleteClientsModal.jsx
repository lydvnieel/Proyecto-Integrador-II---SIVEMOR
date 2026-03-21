import Modal from "bootstrap/js/dist/modal";

export default function DeleteClientsModal({
  client,
  selectedCount,
  onConfirmDelete,
}) {
  const isMultipleDelete = !client && selectedCount > 0;

  const handleClose = () => {
    const modalElement = document.getElementById("deleteClientModal");
    if (!modalElement) return;

    const modalInstance = Modal.getOrCreateInstance(modalElement);
    modalInstance.hide();
  };

  return (
    <div
      className="modal fade"
      id="deleteClientModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmar eliminación</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>

          <div className="modal-body">
            {isMultipleDelete ? (
              <>
                ¿Estás seguro de que deseas eliminar{" "}
                <strong>{selectedCount}</strong> cliente(s) seleccionado(s)?
                Esta acción no se puede deshacer.
              </>
            ) : (
              <>
                ¿Estás seguro de que deseas eliminar el cliente{" "}
                <strong>{client?.nombre}</strong>? Esta acción no se puede
                deshacer.
              </>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-light" onClick={handleClose}>
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirmDelete}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}