export default function CreacionVehiculoExitosaModal({selectedCount}){

    const handleContinue = () => {
    const successModalElement = document.getElementById("successfulCreateVehicleModal");
    const successModalInstance = Modal.getOrCreateInstance(successModalElement);
    successModalInstance.hide();

    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("padding-right");

    const backdrops = document.querySelectorAll(".modal-backdrop");
    backdrops.forEach((backdrop) => backdrop.remove());
};


    return(
        <div className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="successfulCreateVehicleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 rounded-3">
                    <div className="modal-header">
                        <h4 className="modal-title"><strong>¡Vehículo creado!</strong></h4>
                    </div>

                    <div className="modal-body">
                        Se ha creado con exito el vehículo.
                    </div>
                        <div className="modal-footer text-end mt-3">
                                <button className = "btn btn-primary btn-lg mt-3" data-bs-dismiss = "modal"
                                onClick={handleContinue}>
                                Continuar
                                </button>
                        </div>
                    </div>
            </div>
        </div>
    )
}