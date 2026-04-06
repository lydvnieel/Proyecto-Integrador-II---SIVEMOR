import Modal from "bootstrap/js/dist/modal";

export default function CreateSuccessModal({ message }) {
  const handleClose = () => {
    const modalElement = document.getElementById("successfulCreateNoteModal");
    if (!modalElement) return;

    const modalInstance = Modal.getOrCreateInstance(modalElement);

    modalElement.addEventListener(
      "hidden.bs.modal",
      () => {
        document.body.classList.remove("modal-open");
        document.body.style.removeProperty("padding-right");
        document.body.style.removeProperty("overflow");

        document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
          backdrop.remove();
        });
      },
      { once: true }
    );

    modalInstance.hide();
  };

  return (
    <div
      className="modal fade"
      id="successfulCreateNoteModal"
      tabIndex={-1}
      aria-labelledby="successfulCreateNoteModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-3">
          <div className="modal-header">
            <h4 className="modal-title" id="successfulCreateNoteModalLabel">
              <strong>¡Nota creada!</strong>
            </h4>
          </div>

          <div className="modal-body">
            {message || "Se ha creado con éxito la nota."}
          </div>

          <div className="modal-footer text-end mt-3">
            <button
              type="button"
              className="btn btn-primary btn-lg mt-3"
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