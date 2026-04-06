export default function MarkPaidVerificationsModal({
  selectedCount,
  onConfirm,
}) {
  return (
    <div
      className="modal fade"
      id="markPaidVerificationsModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmar Pago Masivo</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div className="modal-body">
            ¿Estás seguro de que deseas marcar las <strong>{selectedCount}</strong>{" "}
            verificaciones seleccionadas como pagadas?
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
              Marcar como pagado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}