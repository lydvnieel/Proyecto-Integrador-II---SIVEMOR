export default function DeleteAllCost({
  totalCount,
  onConfirmDelete,
}) {
  return (
    <div
      className="modal fade"
      id="deleteAllCostModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-3">
          <div className="modal-header">
            <h5 className="modal-title">
              <strong>Confirmar eliminación</strong>
            </h5>
          </div>

          <div className="modal-body">
            ¿Está seguro de que deseas eliminar todos los costos? Esta acción no se puede deshacer.
            <br />
            <span className="text-danger">Total a eliminar: {totalCount}</span>
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