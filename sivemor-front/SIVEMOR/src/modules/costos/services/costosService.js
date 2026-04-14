import { api } from "../../../../server/api";

const BASE_URL = "/costos";

const mapCosto = (c) => ({
  id: c.id ?? null,
  idCliente: c.idCliente ?? null,
  cliente: c.cliente ?? "",
  materia: c.materia ?? "",
  costo: c.costo ?? 0,

  encargado: c.nombreEncargado ?? "",
  encargadoId: c.encargado ?? null,

  atiendeCobra: c.nombreAtiendeYCobra ?? "",
  atiendeCobraId: c.atiendeYCobra ?? null,

  activo: c.activo ?? true,
}); 

export const getCostos = async () => {
  const response = await api.get(BASE_URL);
  const lista = Array.isArray(response?.data) ? response.data : [];
  return lista.map(mapCosto);
};

export const createCosto = async (costo) =>     {
  const body = {
    idCliente: Number(costo.idCliente),
    materia: costo.materia,
    costo: Number(costo.costo),
    encargado: Number(costo.encargado),
    atiendeYCobra: Number(costo.atiendeYCobra),
  };

  const response = await api.post(BASE_URL, body);
  return mapCosto(response.data);
};

export const updateCosto = async (id, costo) => {
  const body = {
    materia: costo.materia,
    costo: Number(costo.costo),
    encargado: Number(costo.encargado),
    atiendeYCobra: Number(costo.atiendeYCobra),
  };

  const response = await api.put(`${BASE_URL}/${id}`, body);
  return mapCosto(response.data);
};

export const deleteCosto = async (id) => {
  return await api.delete(`${BASE_URL}/${id}`);
};