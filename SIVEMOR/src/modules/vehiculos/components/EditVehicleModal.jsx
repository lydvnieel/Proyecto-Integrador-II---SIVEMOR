export default function EditarVehiculoModal(){
    return(
        <div className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="editVehicleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 rounded-3">
                    <div className="modal-body">
                        <h4><strong>Editar vehículo</strong></h4>
                        
                        <form action="" className="col mt-4">
                            <div className="row mb-3">
                                <div className="col">
                        <label><small>Placa</small></label>
                        <input type="text" className="form-control" placeholder="AB-123-CD" />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col">
                        <label><small>Serie</small></label>
                        <input type="text" className="form-control" placeholder="XYZ987654321" />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col">
                        <label><small>Tipo</small></label>
                        <input type="text" className="form-control" placeholder="Camion rabón / Camion rígido" />
                        </div>
                    </div>
                        </form>
                        <div className="text-end mt-3">
                            
                            <button className="btn btn-light me-2 border border-secondary-subtle mt-3" data-bs-dismiss = "modal" 
                            style={{width: 99, height: 40}}>
                                Cancelar
                                </button>

                                <button className = "btn btn-primary mt-3">
                                &nbsp; Guardar cambios
                                </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}