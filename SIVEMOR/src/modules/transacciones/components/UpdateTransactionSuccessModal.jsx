export default function UpdateTransactionSuccessModal() {
  return (
    <div
      className="modal fade"
      id="updateTransactionSuccessModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">¡Actualización exitosa!</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div className="modal-body">
            Se ha modificado con éxito la información de la transacción.
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}