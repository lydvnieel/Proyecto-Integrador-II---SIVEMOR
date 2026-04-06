import Modal from "bootstrap/js/dist/modal";

export default function SuccessfulDeleteModal({ message }) {
  const handleClose = () => {
    const modalElement = document.getElementById("successfulDeleteVehicleModal");
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
      id="successfulDeleteVehicleModal"
      tabIndex={-1}
      aria-labelledby="successfulDeleteVehicleModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-3">
          <div className="modal-header">
            <h4 className="modal-title" id="successfulDeleteVehicleModalLabel">
              <strong>Vehículo eliminado</strong>
            </h4>
          </div>

          <div className="modal-body">
            {message || "Se ha eliminado con éxito el vehículo."}
          </div>

          <div className="modal-footer text-end mt-3">
            <button
              type="button"
              className="btn btn-primary mt-3"
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