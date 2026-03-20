import Modal from "bootstrap/js/dist/modal";

export default function SuccessfulUpdateModal() {
  const handleClose = () => {
    const modalElement = document.getElementById("successfulUpdateVehicleModal");
    if (!modalElement) return;

    const modalInstance = Modal.getOrCreateInstance(modalElement);
    modalInstance.hide();

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
  };

  return (
    <div
      className="modal fade"
      id="successfulUpdateVehicleModal"
      tabIndex={-1}
      aria-labelledby="successfulUpdateVehicleModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-3">
          <div className="modal-header border-0 pb-0">
            <h4
              className="modal-title w-100"
              id="successfulUpdateVehicleModalLabel"
            >
              <strong>¡Actualización exitosa!</strong>
            </h4>
          </div>

          <div className="modal-body pt-2">
            Se ha actualizado con éxito la información del vehículo.
          </div>

          <div className="modal-footer border-0 pt-0">
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