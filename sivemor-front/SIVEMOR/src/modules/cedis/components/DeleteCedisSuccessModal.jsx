import Modal from "bootstrap/js/dist/modal";

export default function DeleteCedisSuccessModal({ message }) {
  const handleClose = () => {
    const modalElement = document.getElementById("deleteCedisSuccessModal");
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
      id="deleteCedisSuccessModal"
      tabIndex="-1"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">¡CEDIS eliminado!</h5>
          </div>

          <div className="modal-body">
            {message || "Se ha eliminado con éxito el CEDIS."}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={handleClose}>
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}