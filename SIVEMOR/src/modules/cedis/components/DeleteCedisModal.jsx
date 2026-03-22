export default function DeleteCedisModal({
  cedis,
  selectedCount,
  onConfirmDelete,
}) {
  const isMultipleDelete = !cedis && selectedCount > 0;

  return (
    <div
      className="modal fade"
      id="deleteCedisModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmar eliminación</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div className="modal-body">
            {isMultipleDelete ? (
              <>
                ¿Estás seguro de que deseas eliminar{" "}
                <strong>{selectedCount}</strong> seleccionado
                {selectedCount > 1 ? "s" : ""}? Esta acción no se puede deshacer.
              </>
            ) : (
              <>
                ¿Estás seguro de que deseas eliminar el{" "}
                <strong>{cedis?.nombre}</strong>? Esta acción no se puede deshacer.
              </>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-light" data-bs-dismiss="modal">
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