export default function EliminarTodoVehiculoModal({selectedCount}){
    return(
        <div className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="deleteAllVehicleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 rounded-3">
                    <div className="modal-header">
                        <h4 className="modal-title"><strong>Confimar eliminación</strong></h4>
                    </div>

                    <div className="modal-body">
                        ¿Estás seguro de que deseas eliminar TODOS los vehículos seleccionados? Esta acción no se puede deshacer.
                    </div>

                    
                        <div className="modal-footer text-end mt-3">
                            
                            <button className="btn btn-light me-2 border border-secondary-subtle mt-3" data-bs-dismiss = "modal" 
                            style={{width: 99, height: 40}}>
                                Cancelar
                                </button>

                                <button className = "btn btn-danger mt-3">
                                &nbsp; Eliminar TODO
                                </button>
                        </div>
                    </div>
            </div>
        </div>
    )
}