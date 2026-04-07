import Modal from "bootstrap/js/dist/modal"

export default function CreateCedisSuccessModal({message}) {
  const handleClose = () => {
        const modalElement = document.getElementById("createCedisSuccessModal");
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
    <div className="modal fade" id="createCedisSuccessModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">¡CEDIS creado!</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div className="modal-body">
            Se ha creado con éxito el CEDIS.
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