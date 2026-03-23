export default function MarkDeliveredOrdersModal({
  selectedCount,
  onConfirm,
}) {
  return (
    <div
      className="modal fade"
      id="markDeliveredOrdersModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmar Entrega Masiva</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div className="modal-body">
            ¿Estás seguro de que deseas marcar los <strong>{selectedCount}</strong>{" "}
            pedidos seleccionados como entregados? Esta acción actualizará el estado
            de entrega de todos los pedidos seleccionados.
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-light"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>

            <button
              type="button"
              className="btn btn-success"
              data-bs-dismiss="modal"
              onClick={onConfirm}
            >
              Marcar {selectedCount} pedidos como entregados
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}