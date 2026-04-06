import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Admin from "../../components/Admin";
import evaluacionesData from "../../data/evaluaciones.json";

export default function EvaluacionesHistorial() {
  const { vehicleId } = useParams();
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarEvaluaciones = async () => {
    try {
      const res = await api.get(`/evaluaciones/vehiculo/${vehicleId}`);
      setEvaluaciones(res.data || res);
    } catch (error) {
      console.error("Error al cargar evaluaciones:", error);
      setEvaluaciones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEvaluaciones();
  }, [vehicleId]);

  if (loading) return <p>Cargando historial...</p>;

  if (evaluaciones.length === 0) {
    return <p>Este vehículo no tiene evaluaciones registradas.</p>;
  }

  return (
    <Admin>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="mb-1">Historial de evaluaciones</h3>
            <p className="text-muted mb-0">Vehículo: {vehicleId}</p>
          </div>

          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/vehiculos")}
          >
            Volver
          </button>
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>PLACA</th>
                <th>FECHA</th>
                <th>TÉCNICO</th>
                <th>DICTAMEN</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {evaluaciones.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No hay evaluaciones para este vehículo.
                  </td>
                </tr>
              ) : (
                evaluaciones.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.placa}</td>
                    <td>{item.fechaEvaluacion}</td>
                    <td>{item.tecnico}</td>
                    <td>
                      <span
                        className={`badge rounded-pill ${
                          item.dictamen === "APROBADO"
                            ? "text-bg-success"
                            : "text-bg-danger"
                        }`}
                      >
                        {item.dictamen}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => navigate(`/evaluaciones/${item.id}`)}
                        >
                          Ver detalle
                        </button>

                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            navigate(`/evaluaciones/${item.id}/editar`)
                          }
                        >
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Admin>
  );
}