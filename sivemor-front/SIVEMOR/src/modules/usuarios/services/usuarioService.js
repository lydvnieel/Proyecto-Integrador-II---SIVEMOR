import { api } from "../../../../server/api";

const mapUsuario = (u) => ({
  id: u.id ?? null,
  nombre: u.nombreUsuario ?? "",
  email: u.email ?? "",
  rol: u.tipoUsuario === "ADMIN" ? "Admin" : "Técnico",
  estado: u.activo ? "Activo" : "Inactivo",
  iniciales: String(u.nombreUsuario || "")
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || "")
    .join(""),
  color: "#179CE6",
});

export const getUsuarios = async () => {
  const res = await api.get("/usuarios");
  const data = Array.isArray(res)
    ? res
    : Array.isArray(res?.data)
      ? res.data
      : [];

  return data.map(mapUsuario);
};

export const createUsuario = async (newUser) => {
  return await api.post("/usuarios", {
    nombreUsuario: newUser.nombre,
    email: newUser.email,
    tipoUsuario: newUser.rol === "Admin" ? "ADMIN" : "TECNICO",
  });
};

export const updateUsuario = async (id, updatedUser) => {
  const res = await api.put(`/usuarios/${id}`, {
    nombreUsuario: updatedUser.nombre,
    email: updatedUser.email,
    tipoUsuario: updatedUser.rol === "Admin" ? "ADMIN" : "TECNICO",
    activo: updatedUser.estado === "Activo",
  });

  const usuario = res?.data ?? res;
  return mapUsuario(usuario);
};

export const regenerarContrasenaUsuario = async (id) => {
  return await api.post(`/usuarios/${id}/regenerar-contrasena`);
};