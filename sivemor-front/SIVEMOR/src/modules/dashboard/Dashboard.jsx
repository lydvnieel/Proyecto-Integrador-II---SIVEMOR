import { useEffect, useMemo, useState } from "react";
import Admin from "../../components/Admin";
import { dashboardService } from "./services/dashboardService";

function Dashboard() {
  const [resumen, setResumen] = useState({
    pagosPendientes: 0,
    totalVerificaciones: 0,
    aprobadas: 0,
    reprobadas: 0,
    conMulta: 0,
    notas: 0,
    pedidos: 0,
    pedidosEntregados: 0,
    regiones: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await dashboardService.getResumen();

      setResumen({
        pagosPendientes: data.pagosPendientes ?? 0,
        totalVerificaciones: data.totalVerificaciones ?? 0,
        aprobadas: data.aprobadas ?? 0,
        reprobadas: data.reprobadas ?? 0,
        conMulta: data.conMulta ?? 0,
        notas: data.notas ?? 0,
        pedidos: data.pedidos ?? 0,
        pedidosEntregados: data.pedidosEntregados ?? 0,
        regiones: Array.isArray(data.regiones) ? data.regiones : [],
      });
    } catch (err) {
      console.error("Error cargando dashboard:", err);
      setError("No se pudieron cargar las métricas del dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString("es-MX");
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    }).format(Number(value || 0));
  };

  const metricasTop = [
    {
      titulo: "Total Verificaciones",
      valor: loading ? "..." : formatNumber(resumen.totalVerificaciones),
      cambio: "Registros activos",
      cambioClass: "text-success",
      icono: "bi-truck",
      iconBg: "metric-icon-blue",
    },
    {
      titulo: "Aprobadas",
      valor: loading ? "..." : formatNumber(resumen.aprobadas),
      cambio: "Dictamen aprobado",
      cambioClass: "text-success",
      icono: "bi-check-circle",
      iconBg: "metric-icon-green",
    },
    {
      titulo: "Reprobadas",
      valor: loading ? "..." : formatNumber(resumen.reprobadas),
      cambio: "Dictamen reprobado",
      cambioClass: "text-danger",
      icono: "bi-x-circle",
      iconBg: "metric-icon-red",
    },
    {
      titulo: "Con Multa",
      valor: loading ? "..." : formatNumber(resumen.conMulta),
      cambio: "Verificaciones con multa",
      cambioClass: resumen.conMulta > 0 ? "text-success" : "text-muted",
      icono: "bi-exclamation-triangle",
      iconBg: "metric-icon-orange",
    },
  ];

  const metricasBottom = [
    {
      titulo: "Pagos Pendientes",
      valor: loading ? "..." : formatCurrency(resumen.pagosPendientes),
      extra: "MXN",
      icono: "bi-credit-card",
      iconBg: "metric-icon-purple",
    },
    {
      titulo: "Notas Activas",
      valor: loading ? "..." : formatNumber(resumen.notas),
      extra: "En proceso",
      icono: "bi-file-earmark-text",
      iconBg: "metric-icon-indigo",
    },
  ];

  const regiones = useMemo(() => {
    if (!Array.isArray(resumen.regiones) || resumen.regiones.length === 0) {
      return [
        { nombre: "Norte", valor: 0 },
        { nombre: "Sur", valor: 0 },
        { nombre: "Centro", valor: 0 },
        { nombre: "Bajío", valor: 0 },
      ];
    }

    return resumen.regiones.map((region) => ({
      nombre: region.nombre ?? "Sin región",
      valor: Number(region.valor ?? 0),
    }));
  }, [resumen.regiones]);

  const maxValor = useMemo(() => {
    const mayor = Math.max(...regiones.map((r) => Number(r.valor || 0)), 0);
    return mayor > 0 ? Math.ceil(mayor / 50) * 50 : 100;
  }, [regiones]);

  return (
    <Admin>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Dashboard General</h2>
          <p className="page-title">Resumen de actividad y métricas clave</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="metrics-grid-top">
        {metricasTop.map((item, index) => (
          <div className="metric-card" key={index}>
            <div>
              <div className="metric-title">{item.titulo}</div>
              <div className="metric-value">{item.valor}</div>
              <div className={`metric-change ${item.cambioClass}`}>{item.cambio}</div>
            </div>

            <div className={`metric-icon ${item.iconBg}`}>
              <i className={`bi ${item.icono}`}></i>
            </div>
          </div>
        ))}
      </div>

      <div className="metrics-grid-bottom">
        {metricasBottom.map((item, index) => (
          <div className="metric-card metric-card-wide" key={index}>
            <div>
              <div className="metric-title">{item.titulo}</div>
              <div className="d-flex align-items-end gap-2 flex-wrap">
                <div className="metric-value">{item.valor}</div>
                <div className="metric-subtext">{item.extra}</div>
              </div>
            </div>

            <div className={`metric-icon ${item.iconBg}`}>
              <i className={`bi ${item.icono}`}></i>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-card">
        <h3 className="chart-title">Verificaciones por Región</h3>

        <div className="chart-shell">
          <div className="chart-y-axis">
            <span>{maxValor}</span>
            <span>{Math.round(maxValor * 0.75)}</span>
            <span>{Math.round(maxValor * 0.5)}</span>
            <span>{Math.round(maxValor * 0.25)}</span>
            <span>0</span>
          </div>

          <div className="chart-area">
            <div className="chart-grid-lines">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="chart-bars">
              {regiones.map((region, index) => (
                <div className="chart-bar-item" key={index}>
                  <div
                    className="chart-bar"
                    style={{
                      height: `${maxValor > 0 ? (region.valor / maxValor) * 280 : 0}px`,
                    }}
                    title={`${region.nombre}: ${region.valor}`}
                  ></div>
                  <span className="chart-label">{region.nombre}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Admin>
  );
}

export default Dashboard;