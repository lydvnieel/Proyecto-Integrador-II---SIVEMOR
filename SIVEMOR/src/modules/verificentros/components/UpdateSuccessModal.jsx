export default function UpdateSuccessModal() {
  return (
    <div
      className="modal fade"
      id="updateVerificentroSuccessModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">¡Actualizacion exitosa!</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div className="modal-body">
            Se ha actualizado con éxito la informacion del verificentro.
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}