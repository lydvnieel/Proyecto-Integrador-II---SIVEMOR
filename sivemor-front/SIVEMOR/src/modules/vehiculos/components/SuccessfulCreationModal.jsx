import Modal from "bootstrap/js/dist/modal";

export default function SuccessfulCreationModal({ message }) {
  const cleanupModalArtifacts = () => {
    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("padding-right");
    document.body.style.removeProperty("overflow");

    document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
      backdrop.remove();
    });
  };

  const handleClose = () => {
    const modalElement = document.getElementById("successfulCreateVehicleModal");
    if (!modalElement) return;

    const modalInstance = Modal.getOrCreateInstance(modalElement);
    modalInstance.hide();

    setTimeout(() => {
      cleanupModalArtifacts();
    }, 200);
  };

  return (
    <div
      className="modal fade"
      id="successfulCreateVehicleModal"
      tabIndex={-1}
      aria-labelledby="successfulCreateVehicleModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-3">
          <div className="modal-header">
            <h4
              className="modal-title"
              id="successfulCreateVehicleModalLabel"
            >
              <strong>¡Vehículo creado!</strong>
            </h4>
          </div>

          <div className="modal-body">
            {message || "Se ha creado con éxito el vehículo."}
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