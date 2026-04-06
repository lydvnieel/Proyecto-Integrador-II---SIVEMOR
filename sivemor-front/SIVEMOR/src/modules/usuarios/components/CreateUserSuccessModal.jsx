import Modal from "bootstrap/js/dist/modal";

export default function CreateUserSuccessModal() {
  const handleClose = () => {
    const modal = document.getElementById("createUserSuccessModal");
    const next = document.getElementById("emailSentModal");

    if (!modal || !next) return;

    const modalInstance = Modal.getOrCreateInstance(modal);
    const nextInstance = Modal.getOrCreateInstance(next);

    modal.addEventListener(
      "hidden.bs.modal",
      () => {
        document.body.classList.remove("modal-open");
        document.body.style.removeProperty("padding-right");
        document.body.style.removeProperty("overflow");

        document.querySelectorAll(".modal-backdrop").forEach((b) => b.remove());

        nextInstance.show();
      },
      { once: true }
    );

    modalInstance.hide();
  };

  return (
    <div
      className="modal fade"
      id="createUserSuccessModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">¡Usuario creado!</h5>
          </div>

          <div className="modal-body">
            <p>Se ha creado con éxito el usuario.</p>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleClose}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}