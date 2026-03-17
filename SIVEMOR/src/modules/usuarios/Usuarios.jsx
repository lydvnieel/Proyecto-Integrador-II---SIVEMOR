import Admin from  "../../components/Admin"

function Usuarios() {
  const users = [
    {
      initials: "AD",
      avatarClass: "avatar-purple",
      name: "Admin Principal",
      email: "admin@veritrack.mx",
      status: "Activo",
      statusClass: "status-success",
      rol: "Admin",
      ultimoAcceso: "2026-02-16 09:00",
    },
    {
      initials: "JU",
      avatarClass: "avatar-blue",
      name: "Juan Técnico",
      email: "juan@veritrack.mx",
      status: "Activo",
      statusClass: "status-success",
      rol: "Técnico",
      ultimoAcceso: "2026-02-15 14:30",
    },
    {
      initials: "MA",
      avatarClass: "avatar-blue",
      name: "María Técnica",
      email: "maria@veritrack.mx",
      status: "Inactivo",
      statusClass: "status-neutral",
      rol: "Técnico",
      ultimoAcceso: "2026-01-20 10:15",
    },
  ];

  return (
    <Admin>
      <div className="page-header">
        <div>
          <h2 className="page-heading">Gestión de Usuarios</h2>
          <p className="page-title">Administración de técnicos y accesos</p>
        </div>

        <button className="primary-btn">
          <i className="bi bi-person-plus"></i>
          Nuevo usuario
        </button>
      </div>

      <div className="users-grid">
        {users.map((user, index) => (
          <div className="user-card" key={index}>
            <div className="user-card-top">
              <div className="user-profile">
                <div className={`user-avatar ${user.avatarClass}`}>{user.initials}</div>
                <div>
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                </div>
              </div>

              <span className={`status-pill ${user.statusClass}`}>{user.status}</span>
            </div>

            <div className="user-divider"></div>

            <div className="user-meta">
              <div>
                <span className="user-meta-label">Rol</span>
                <strong>{user.rol}</strong>
              </div>
              <div>
                <span className="user-meta-label">Último Acceso</span>
                <strong>{user.ultimoAcceso}</strong>
              </div>
            </div>

            <div className="user-actions">
              <button><i className="bi bi-key me-2"></i>Clave</button>
              <button><i className="bi bi-pencil-square me-2"></i>Editar</button>
              <button><i className="bi bi-envelope me-2"></i>Enviar</button>
            </div>
          </div>
        ))}
      </div>
    </Admin>
  );
}

export default Usuarios;