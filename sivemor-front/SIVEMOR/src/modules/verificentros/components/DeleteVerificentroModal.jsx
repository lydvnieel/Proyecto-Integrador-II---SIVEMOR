export default function DeleteVerificentroModal({
  item,
  selectedCount,
  totalCount,
  onDelete,
}) {
  const isDeleteOne = !!item;
  const isDeleteAllSelected = selectedCount === totalCount && selectedCount > 0;

  return (
    <div
      className="modal fade"
      id="deleteVerificentroModal"
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
            {isDeleteOne ? (
              <>
                ¿Estás seguro de que deseas eliminar el verificentro{" "}
                <strong>{item?.nombre}</strong>? Esta acción no se puede deshacer.
              </>
            ) : isDeleteAllSelected ? (
              <>
                ¿Estás seguro de que deseas eliminar <strong>TODOS</strong> los
                verificentros seleccionados? Esta acción no se puede deshacer.
              </>
            ) : (
              <>
                ¿Estás seguro de que deseas eliminar{" "}
                <strong>{selectedCount}</strong> verificentro
                {selectedCount > 1 ? "s" : ""} seleccionado
                {selectedCount > 1 ? "s" : ""}? Esta acción no se puede
                deshacer.
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
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}