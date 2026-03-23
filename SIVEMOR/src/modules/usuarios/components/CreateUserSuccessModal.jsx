export default function CreateUserSuccessModal({ password }) {
  return (
    <div className="modal fade" id="createUserSuccessModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">¡Usuario creado!</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div className="modal-body">
            <p>Se ha creado con éxito el usuario.</p>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
              data-bs-toggle="modal"
              data-bs-target="#emailSentModal"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}