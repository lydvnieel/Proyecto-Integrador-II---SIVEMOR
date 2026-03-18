export default function EmailSentModal({ user }) {
  return (
    <div className="modal fade" id="emailSentModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Correo enviado</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div className="modal-body text-center">
            <div className="success-icon-circle mb-3">
              <i className="bi bi-envelope text-success"></i>
            </div>

            <h4>¡Correo enviado exitosamente!</h4>
            <p className="text-muted">
              Se ha enviado un correo electrónico al usuario con sus
              credenciales de acceso.
            </p>

            <div className="password-box empty-box"></div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-primary" data-bs-dismiss="modal">
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}