import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Admin from "../../components/Admin";
import { api } from "../../../server/api";

export default function EvaluacionesHistorial() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarEvaluaciones = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/evaluaciones/vehiculo/${vehicleId}`);
      setEvaluaciones(Array.isArray(res?.data?.data) ? res.data.data : []);
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

  return (
    <Admin>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="mb-1">Historial de evaluaciones</h3>
            <p className="text-muted mb-0">Vehículo ID: {vehicleId}</p>
          </div>

          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/vehiculos")}
          >
            Volver
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4">Cargando historial...</div>
        ) : (
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
                      <td>{item.placa || "Sin placa"}</td>
                      <td>{item.fechaEvaluacion || item.fechaVerificacion || "Sin fecha"}</td>
                      <td>{item.tecnico || item.nombreTecnico || "Sin técnico"}</td>
                      <td>
                        <span
                          className={`badge rounded-pill ${
                            item.dictamen === "APROBADO"
                              ? "text-bg-success"
                              : "text-bg-danger"
                          }`}
                        >
                          {item.dictamen || "SIN DICTAMEN"}
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
                            onClick={() => navigate(`/evaluaciones/${item.id}/editar`)}
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
        )}
      </div>
    </Admin>
  );
}