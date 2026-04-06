export default function DeleteCostsModal({
  cost,
  selectedCount,
  totalCount,
  onDelete,
}) {
  return (
    <div
      className="modal fade"
      id="deleteCostsModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
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
            {cost ? (
              <>
                ¿Está seguro de que deseas eliminar el costo de{" "}
                <strong>{cost.cliente}</strong>? Esta acción no se puede deshacer.
              </>
            ) : selectedCount === totalCount ? (
              <>
                ¿Está seguro de que deseas eliminar <strong>TODOS</strong> los
                costos seleccionados? Esta acción no se puede deshacer.
              </>
            ) : (
              <>
                ¿Está seguro de que deseas eliminar los costos seleccionados?
                Esta acción no se puede deshacer.
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
              onClick={onDelete}
            >
              {cost
                ? "Eliminar"
                : selectedCount === totalCount
                ? "Eliminar TODO"
                : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}