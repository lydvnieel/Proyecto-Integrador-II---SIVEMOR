export default function ActualizacionVehiculoExitosaModal({selectedCount}){
    return(
        <div className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="successfulUpdateVehicleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 rounded-3">
                    <div className="modal-header">
                        <h4 className="modal-title"><strong>¡Actualizacion exitosa!</strong></h4>
                    </div>

                    <div className="modal-body">
                        Se ha actualizado con éxito la información del vehículo.
                    </div>

                    
                        <div className="modal-footer text-end mt-3">
                                <button className = "btn btn-primary btn-lg mt-3">
                                Continuar
                                </button>
                        </div>
                    </div>
            </div>
        </div>
    )
}