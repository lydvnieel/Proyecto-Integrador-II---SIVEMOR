export default function DeleteVerificationsModal({
  selectedCount,
  totalCount,
  onDelete,
}) {
  return (
    <div
      className="modal fade"
      id="deleteVerificationsModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmar Eliminación</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div className="modal-body">
            {selectedCount === totalCount ? (
              <>
                ¿Estás seguro de que deseas eliminar <strong>TODAS</strong> las
                verificaciones seleccionadas? Esta acción no se puede deshacer.
              </>
            ) : (
              <>
                ¿Estás seguro de que deseas eliminar las verificaciones
                seleccionadas? Esta acción no se puede deshacer.
              </>
            )}
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
              className="btn btn-danger"
              data-bs-dismiss="modal"
              onClick={onDelete}
            >
              {selectedCount === totalCount ? "Eliminar TODO" : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}