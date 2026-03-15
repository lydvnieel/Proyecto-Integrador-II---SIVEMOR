import { useNavigate } from "react-router-dom";
import "../styles/Global.css";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="text-center mb-4">
          <h3 className="fw-bold mt-2">SIVEMOR</h3>
          <p className="text-muted small">Sistema de Verificación Morelos</p>
        </div>

        <div className="alert alert-primary text-center small">
          <i className="bi bi-lock me-2"></i>
          Acceso exclusivo para Administradores
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              placeholder="admin@sige.com"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 login-btn">
            Ingresar al Sistema
          </button>
        </form>

        <div className="text-center mt-4 small text-muted">
          © 2026 OLYJ. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
}

export default Login;