export default function CurrentCredentialModal({ user }) {
  if (!user) return null;

  return (
    <div className="modal fade" id="currentCredentialModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Credencial actual</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div className="modal-body text-center">
            <div className="success-icon-circle mb-4">
              <i className="bi bi-key-fill text-success"></i>
            </div>

            <p className="password-label">CONTRASEÑA ACTUAL</p>

            <div className="password-box">
              <strong>{user.password}</strong>
            </div>
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