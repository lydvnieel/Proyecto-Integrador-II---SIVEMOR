import { api } from "../../../../server/api";

const BASE_URL = "/clientes";

const unwrapData = (response) => response?.data?.data ?? response?.data;

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.mensaje ||
  error?.response?.data?.error ||
  "Ocurrió un error inesperado.";

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
  try {
    const response = await api.get(BASE_URL);
    const data = unwrapData(response);
    const lista = Array.isArray(data) ? data : [];
    return lista.map(mapCliente);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createCliente = async (cliente) => {
  try {
    const body = {
      razonSocial: cliente.razonSocial?.trim(),
      email: cliente.email?.trim(),
      telefono: cliente.telefono?.trim(),
      telefonoAlternativo: cliente.telefonoAlternativo?.trim() || "0",
      gestor: cliente.gestor?.trim(),
    };

    const response = await api.post(BASE_URL, body);
    return mapCliente(unwrapData(response));
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateCliente = async (id, cliente) => {
  try {
    const body = {
      id,
      razonSocial: cliente.razonSocial?.trim(),
      email: cliente.email?.trim(),
      telefono: cliente.telefono?.trim(),
      telefonoAlternativo: cliente.telefonoAlternativo?.trim() || "0",
      gestor: cliente.gestor?.trim(),
      activo: cliente.estado === "Activo",
    };

    const response = await api.put(`${BASE_URL}/${id}`, body);
    return mapCliente(unwrapData(response));
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteCliente = async (id) => {
  try {
    return await api.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};