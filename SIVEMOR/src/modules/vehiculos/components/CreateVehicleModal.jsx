export default function CrearVehiculoModal(){
    return(
        <div className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="createVehicleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 rounded-3">
                    <div className="modal-body">
                        <h4>Nuevo vehiculo</h4>
                        
                        <form action="" className="col mt-4">
                            <div className="row mb-3">
                                <div className="col">
                        <label><small>Placa</small></label>
                        <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col">
                        <label><small>Serie</small></label>
                        <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col">
                        <label className="form-label"><small>Tipo</small></label>

                    <div className="d-flex gap-4">
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="tipoCamion" value = "rabon"/>
                        <label className="form-check-label" htmlFor="rabon">Camión Rabón</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="tipoCamion" value = "rigido"/>
                        <label className="form-check-label" htmlFor="rabon">Camión Rígido(4x2)</label>
                    </div>
                    </div>
                </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col">
                        <label><small>Campo</small></label>
                        <input type="text" className="form-control" />
                        </div>
                    </div>
                        </form>
                        <div className="text-end mt-3">
                            
                            <button className="btn btn-light me-2 border border-secondary-subtle mt-3" data-bs-dismiss = "modal" 
                            style={{width: 99, height: 40}}>
                                Cancelar
                                </button>

                                <button className = "btn btn-primary mt-3">
                                &nbsp; Crear vehiculo
                                </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}