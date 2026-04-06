export default function UserCard({ user, onEdit, onEmail }) {
  return (
    <div className="user-card">
      <div className="user-card-top">
        <div className="user-main-info">
          <div
            className="user-avatar"
            style={{ backgroundColor: user.color }}
          >
            {user.iniciales}
          </div>

          <div>
            <h5 className="user-name">{user.nombre}</h5>
            <p className="user-email">{user.email}</p>
          </div>
        </div>

        <span className={`status-pill ${user.estadoClass}`}>{user.estado}</span>
      </div>

      <div className="user-card-divider"></div>

      <div className="user-card-meta">
        <div>
          <small>Rol</small>
          <p>{user.rol}</p>
        </div>

        <div>
          <small>Último Acceso</small>
          <p>{user.ultimoAcceso}</p>
        </div>
      </div>

      <div className="user-card-actions">
        <button
          className="outline-btn"
          data-bs-toggle="modal"
          data-bs-target="#editUserModal"
          onClick={onEdit}
          type="button"
        >
          <i className="bi bi-pencil-square"></i>&nbsp;Editar
        </button>

        <button
          className="outline-btn"
          data-bs-toggle="modal"
          data-bs-target="#emailSentModal"
          onClick={onEmail}
          type="button"
        >
          <i className="bi bi-envelope"></i>&nbsp;Enviar credenciales
        </button>
      </div>
    </div>
  );
}