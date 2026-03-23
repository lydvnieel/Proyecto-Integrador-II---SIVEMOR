export default function DeleteVerificationsModal({
  count,
  isDeletingAll,
  onConfirm,
}) {
  return (
    <div
      className="modal fade"
      id="deleteVerificationsModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow rounded-4">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">Confirmar Eliminación</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <p className="mb-0 text-secondary">
              {isDeletingAll
                ? "¿Estás seguro de que deseas eliminar TODAS las verificaciones seleccionadas? Esta acción no se puede deshacer."
                : `¿Estás seguro de que deseas eliminar las ${count} verificación/es seleccionadas? Esta acción no se puede deshacer.`}
            </p>
          </div>

          <div className="modal-footer border-0">
            <button
              type="button"
              className="btn btn-light border"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>
              {isDeletingAll ? "Eliminar TODO" : `Eliminar ${count} verificación/s`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}