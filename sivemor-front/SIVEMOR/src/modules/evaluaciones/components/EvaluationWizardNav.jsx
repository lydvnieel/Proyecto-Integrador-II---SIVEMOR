export default function EvaluationWizardNav({
  step = 1,
  totalSteps = 1,
  onPrev,
  onNext,
  onSave,
}) {
  return (
    <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
      <button
        type="button"
        className="btn btn-outline-secondary rounded-pill px-4"
        onClick={onPrev}
        disabled={step === 1}
      >
        Retroceder
      </button>

      <div className="fw-semibold text-secondary">
        Paso {step} de {totalSteps}
      </div>

      {step < totalSteps ? (
        <button
          type="button"
          className="btn btn-primary rounded-pill px-4"
          onClick={onNext}
        >
          Siguiente
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-success rounded-pill px-4"
          onClick={onSave}
        >
          Guardar cambios
        </button>
      )}
    </div>
  );
}