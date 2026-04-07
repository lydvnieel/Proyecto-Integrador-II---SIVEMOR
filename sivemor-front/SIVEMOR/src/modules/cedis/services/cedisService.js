import { api } from "../../../../server/api";

const CEDIS_BASE_URL = "/cedis";
const CLIENTES_BASE_URL = "/clientes";
const REGIONES_BASE_URL = "/regiones";

const mapCedis = (c) => {
  if (!c) return null;

  return {
    id: c.id ?? c.idCedis ?? null,
    nombre: c.nombre ?? "",
    idCliente: c.idCliente ?? c.cliente?.id ?? c.cliente?.idCliente ?? "",
    idRegion: c.idRegion ?? c.region?.id ?? c.region?.idRegion ?? "",
    cliente:
      c.clienteNombre ??
      c.cliente?.razonSocial ??
      c.cliente?.nombre ??
      "",
    region:
      c.regionNombre ??
      c.region?.nombre ??
      "",
    direccion: c.direccion ?? "",
    encargado: c.encargado ?? "",
    correo: c.correo ?? "",
    telefonoPrincipal: c.telefono ?? c.telefonoPrincipal ?? "",
    telefonoAlternativo: c.telefonoAlternativo ?? "",
    activo: c.activo ?? true,
  };
};

const mapCliente = (c) => {
  if (!c) return null;

  return {
    id: c.id ?? c.idCliente ?? null,
    nombre: c.razonSocial ?? c.nombre ?? "",
  };
};

const mapRegion = (r) => {
  if (!r) return null;

  return {
    id: r.id ?? r.idRegion ?? null,
    nombre: r.nombre ?? "",
    descripcion: r.descripcion ?? "",
  };
};

export const getCedis = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.idCliente) params.append("idCliente", filters.idCliente);
  if (filters.idRegion) params.append("idRegion", filters.idRegion);
  if (filters.nombre) params.append("nombre", filters.nombre);

  const res = await api.get(`/cedis?${params.toString()}`);

  const data = Array.isArray(res.data)
    ? res.data
    : Array.isArray(res.data?.data)
      ? res.data.data
      : [];

  return data.map(mapCedis).filter(Boolean);
};

export const getClientes = async () => {
  const res = await api.get(CLIENTES_BASE_URL);

  const data = Array.isArray(res.data)
    ? res.data
    : Array.isArray(res.data?.data)
      ? res.data.data
      : [];

  return data.map(mapCliente).filter(Boolean);
};

export const getRegiones = async () => {
  const res = await api.get(REGIONES_BASE_URL);

  const data = Array.isArray(res.data)
    ? res.data
    : Array.isArray(res.data?.data)
      ? res.data.data
      : [];

  return data.map(mapRegion).filter(Boolean);
};

export const createCedis = async (newCedis) => {
  const payload = {
    idCliente: Number(newCedis.idCliente),
    idRegion: Number(newCedis.idRegion),
    nombre: newCedis.nombre?.trim(),
    direccion: newCedis.direccion?.trim(),
    encargado: newCedis.encargado?.trim(),
    correo: newCedis.correo?.trim() || "",
    telefono: newCedis.telefonoPrincipal?.trim(),
    telefonoAlternativo: newCedis.telefonoAlternativo?.trim() || "",
  };

  const res = await api.post(CEDIS_BASE_URL, payload);
  return res.data;
};

export const createRegion = async (newRegion) => {
  const payload = {
    nombre: newRegion.nombre?.trim(),
    descripcion: newRegion.descripcion?.trim() || "",
  };

  const res = await api.post("/regiones", payload);
  return res.data;
};

export const updateCedis = async (id, updatedCedis) => {
  const payload = {
    idCliente: Number(updatedCedis.idCliente),
    idRegion: Number(updatedCedis.idRegion),
    nombre: updatedCedis.nombre?.trim(),
    direccion: updatedCedis.direccion?.trim(),
    encargado: updatedCedis.encargado?.trim(),
    correo: updatedCedis.correo?.trim() || "",
    telefono: updatedCedis.telefonoPrincipal?.trim(),
    telefonoAlternativo: updatedCedis.telefonoAlternativo?.trim() || "",
  };

  const res = await api.put(`${CEDIS_BASE_URL}/${id}`, payload);
  return res.data;
};

export const deleteCedis = async (id) => {
  const res = await api.delete(`${CEDIS_BASE_URL}/${id}`);
  return res.data;
};