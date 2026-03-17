import Admin from  "../../components/Admin"

function Dashboard() {
  const metricasTop = [
    {
      titulo: "Total Verificaciones",
      valor: "1,245",
      cambio: "+12% vs mes anterior",
      cambioClass: "text-success",
      icono: "bi-truck",
      iconBg: "metric-icon-blue",
    },
    {
      titulo: "Aprobadas",
      valor: "980",
      cambio: "+5% vs mes anterior",
      cambioClass: "text-success",
      icono: "bi-check-circle",
      iconBg: "metric-icon-green",
    },
    {
      titulo: "Reprobadas",
      valor: "145",
      cambio: "-2% vs mes anterior",
      cambioClass: "text-danger",
      icono: "bi-x-circle",
      iconBg: "metric-icon-red",
    },
    {
      titulo: "Con Multa",
      valor: "45",
      cambio: "+1% vs mes anterior",
      cambioClass: "text-success",
      icono: "bi-exclamation-triangle",
      iconBg: "metric-icon-orange",
    },
  ];

  const metricasBottom = [
    {
      titulo: "Pagos Pendientes",
      valor: "$ 125,400.00",
      extra: "MXN",
      icono: "bi-credit-card",
      iconBg: "metric-icon-purple",
    },
    {
      titulo: "Notas Activas",
      valor: "24",
      extra: "En proceso",
      icono: "bi-file-earmark-text",
      iconBg: "metric-icon-indigo",
    },
  ];

  const regiones = [
    { nombre: "Norte", valor: 400 },
    { nombre: "Sur", valor: 300 },
    { nombre: "Centro", valor: 550 },
    { nombre: "Bajío", valor: 200 },
  ];

  const maxValor = 600;

  return (
    <Admin>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Dashboard General</h2>
          <p className="page-title">Resumen de actividad y métricas clave</p>
        </div>

        <div className="d-flex gap-3 flex-wrap">
          <button className="outline-btn">
            <i className="bi bi-calendar3"></i>
            Feb 2026
          </button>

          <button className="outline-btn">
            <i className="bi bi-search"></i>
            Filtrar
          </button>
        </div>
      </div>

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
            <span>600</span>
            <span>450</span>
            <span>300</span>
            <span>150</span>
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
                    style={{ height: `${(region.valor / maxValor) * 280}px` }}
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