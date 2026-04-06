import { api } from "../../../../server/api";

const BASE_URL = "/clientes";

const mapCliente = (c) => ({
  id: c.id ?? c.idCliente,
  razonSocial: c.razonSocial ?? "",
  email: c.email ?? "",
  telefono: c.telefono ?? "",
  telefonoAlternativo: c.telefonoAlternativo ?? "",
  gestor: c.gestor ?? "",
  activo: c.activo ?? true,
  estado: c.activo ? "Activo" : "Inactivo",
  estadoClass: c.activo ? "status-success" : "status-neutral",
});

export const getClientes = async () => {
  const response = await api.get(BASE_URL);
  const lista = Array.isArray(response?.data) ? response.data : [];
  return lista.map(mapCliente);
};

export const createCliente = async (cliente) => {
  const body = {
    razonSocial: cliente.razonSocial,
    email: cliente.email,
    telefono: cliente.telefono,
    telefonoAlternativo: cliente.telefonoAlternativo,
    gestor: cliente.gestor,
  };

  const response = await api.post(BASE_URL, body);
  return mapCliente(response.data);
};

export const updateCliente = async (id, cliente) => {
  const body = {
    id,
    razonSocial: cliente.razonSocial,
    email: cliente.email,
    telefono: cliente.telefono,
    telefonoAlternativo: cliente.telefonoAlternativo,
    gestor: cliente.gestor,
    activo: cliente.estado === "Activo",
  };

  const response = await api.put(`${BASE_URL}/${id}`, body);
  return mapCliente(response.data);
};

export const deleteCliente = async (id) => {
  return await api.delete(`${BASE_URL}/${id}`);
};