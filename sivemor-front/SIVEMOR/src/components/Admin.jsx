import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminLayout({
  title = "Panel de Administración",
  children,
}) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { to: "/dashboard", icon: "bi-grid", label: "Dashboard" },
    { to: "/vehiculos", icon: "bi-truck", label: "Vehículos" },
    {
      to: "/verificaciones",
      icon: "bi-file-earmark-text",
      label: "Verificaciones",
    },
    { to: "/costos", icon: "bi-cash-coin", label: "Costos" },
    { to: "/notas", icon: "bi-file-earmark-medical", label: "Notas" },
    { to: "/verificentros", icon: "bi-buildings", label: "Verificentros" },
    { to: "/usuarios", icon: "bi-people", label: "Usuarios" },
    { to: "/clientes", icon: "bi-building", label: "Clientes" },
    { to: "/reportes", icon: "bi-file-earmark-bar-graph", label: "Reportes" },
    { to: "/cedis", icon: "bi-box-seam", label: "CEDIS" },
    { to: "/transacciones", icon: "bi-cash-coin", label: "Transacciones" },
    { to: "/pedidos", icon: "bi-box", label: "Pedidos" },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div
      className={`admin-layout ${!isSidebarOpen ? "sidebar-collapsed" : ""}`}
    >
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-content">
            <i className="bi bi-truck brand-icon"></i>
            <span>SIVEMOR</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-info">
            <div className="sidebar-avatar">D</div>
            <div>
              <div className="sidebar-user-name">Admin</div>
              <div className="sidebar-user-role">Admin</div>
            </div>
          </div>

          <button
            className="sidebar-logout-btn"
            onClick={() => navigate("/login")}
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button
              type="button"
              className="header-toggle-btn"
              onClick={toggleSidebar}
              aria-label="Mostrar u ocultar menú"
            >
              <i className="bi bi-list"></i>
            </button>

            <h1>{title}</h1>
          </div>

          <button
            className="header-exit-btn"
            onClick={() => navigate("/login")}
          >
            Salir
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}