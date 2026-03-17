export default function MarkPaidModal({ selectedCount, onConfirm }) {
  return (
    <div className="modal fade" id="markPaidModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmar Pago Masivo</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div className="modal-body">
            ¿Estás seguro de que deseas marcar las <strong>{selectedCount}</strong> notas
            seleccionadas como pagadas? Esta acción actualizará el estado de pago de
            todas las notas seleccionadas.
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-light" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-success"
              data-bs-dismiss="modal"
              onClick={onConfirm}
            >
              Marcar {selectedCount} nota{selectedCount > 1 ? "s" : ""} como pagada{selectedCount > 1 ? "s" : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}