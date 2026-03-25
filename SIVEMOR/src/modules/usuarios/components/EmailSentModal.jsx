import Modal from "bootstrap/js/dist/modal";

export default function EmailSentModal({ user }) {
  const handleClose = () => {
    const modalElement = document.getElementById("emailSentModal");
    if (!modalElement) return;

    const modalInstance = Modal.getOrCreateInstance(modalElement);

    modalElement.addEventListener(
      "hidden.bs.modal",
      () => {
        document.body.classList.remove("modal-open");
        document.body.style.removeProperty("padding-right");
        document.body.style.removeProperty("overflow");

        document.querySelectorAll(".modal-backdrop").forEach((b) => b.remove());
      },
      { once: true }
    );

    modalInstance.hide();
  };

  return (
    <div
      className="modal fade"
      id="emailSentModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Correo enviado</h5>
          </div>

          <div className="modal-body text-center">
            <div className="success-icon-circle mb-3">
              <i className="bi bi-envelope text-success"></i>
            </div>

            <h4>¡Correo enviado exitosamente!</h4>
            <p className="text-muted">
              {user
                ? `Se ha enviado un correo electrónico a ${user.email} con sus credenciales de acceso.`
                : "Se ha enviado un correo electrónico con las credenciales de acceso."}
            </p>

            <div className="password-box empty-box"></div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleClose}
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}