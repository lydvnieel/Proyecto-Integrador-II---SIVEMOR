import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "./services/loginService";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true)

    const email = form.email.trim();
    const password = form.password.trim();

    if (!email || !password) {
      setError("Por favor, rellene todos los campos antes de continuar");
      setLoading(false)
      return;
    }

    try {
      
      const res = await loginAdmin({ email, password });
      const user = res?.data ?? res;

      if(user.rol?.toLowerCase() == "tecnico  "){
        setError("No se permite el acceso de técnicos")
        setLoading(false)
        return;
      }

      localStorage.setItem("sivemor_user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (err) {
  console.error("Error completo:", err);

        const status =
        err?.response?.status ||
        err?.status ||
        err?.response?.data?.status;

      if (status === 403) {
        setError("No se permite el acceso de técnicos en la versión web");
      } else if (status === 404) {
        setError("Usuario no encontrado");
      } else if (status === 401) {
        setError("Credenciales incorrectas");
      } else {
        setError("Error al iniciar sesión");
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="text-center mb-4">
          <img src="/img/logo_antiguo.png" alt="logo" width={114} height={74} />
          <h3 className="fw-bold mt-2">SIVEMOR</h3>
          <p className="text-muted small">Sistema de Verificación Morelos</p>
        </div>

        <div className="alert alert-primary text-center small">
          <i className="bi bi-lock me-2"></i>
          Acceso exclusivo para Administradores
        </div>

        {error && (
          <div className="alert alert-danger text-center small">{error}</div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="admin@sige.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 login-btn"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar al Sistema"}
          </button>
        </form>

        <div className="text-center mt-4 small text-muted">
          © 2026 OLYJ. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
}
