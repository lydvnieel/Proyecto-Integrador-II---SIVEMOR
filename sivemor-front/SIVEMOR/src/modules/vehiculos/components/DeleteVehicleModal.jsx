export default function DeleteVehicleModal({
  vehicle,
  selectedCount,
  onConfirmDelete,
}) {
  const isMultipleDelete = !vehicle && selectedCount > 0;

  return (
    <div
      className="modal fade"
      id="deleteVehicleModal"
      tabIndex={-1}
      aria-labelledby="deleteVehicleModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-3">
          <div className="modal-header">
            <h4 className="modal-title" id="deleteVehicleModalLabel">
              <strong>Confirmar eliminación</strong>
            </h4>
          </div>

          <div className="modal-body">
            {isMultipleDelete ? (
              <>
                ¿Estás seguro de que deseas eliminar{" "}
                <strong>{selectedCount}</strong> vehículo(s) seleccionado(s)?
                Esta acción no se puede deshacer.
              </>
            ) : (
              <>
                ¿Estás seguro de que deseas eliminar el vehículo{" "}
                <strong>{vehicle?.placa}</strong>? Esta acción no se puede deshacer.
              </>
            )}
          </div>

          <div className="modal-footer text-end mt-3">
            <button
              type="button"
              className="btn btn-light me-2 border border-secondary-subtle mt-3"
              data-bs-dismiss="modal"
              style={{ width: 99, height: 40 }}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="btn btn-danger mt-3"
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