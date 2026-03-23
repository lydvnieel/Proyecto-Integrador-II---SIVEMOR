export default function CreateVerificationSuccessModal() {
  return (
    <div
      className="modal fade"
      id="createVerificationSuccessModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">¡Verificación creada!</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div className="modal-body">
            Se ha creado con éxito la verificación.
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