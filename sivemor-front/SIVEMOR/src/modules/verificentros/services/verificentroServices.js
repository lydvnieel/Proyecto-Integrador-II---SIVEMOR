import { api } from "../../../../server/api";

const BASE_URL = "/verificentros";

const unwrapData = (response) => response?.data?.data ?? response?.data;

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.mensaje ||
  error?.response?.data?.error ||
  "Ocurrió un error inesperado.";

const mapVerificentro = (v) => ({
  id: v.id ?? v.idVerificentro ?? null,
  nombre: v.nombre ?? "",
  clave: v.claveVerificentro ?? v.clave ?? "",
  direccion: v.direccion ?? "",
  region: v.nombreRegion ?? v.region ?? "",
  idRegion: v.idRegion ?? v.regionId ?? v.region?.id ?? null,
  responsable: v.responsable ?? "",
  correo: v.correo ?? "",
  telefonoPrincipal: v.telefono ?? v.telefonoPrincipal ?? "",
  telefonoAlternativo: v.telefonoAlternativo ?? "",
  horario: v.horarioGeneral ?? v.horario ?? "",
  activo: v.activo ?? true,
});

export const getVerificentros = async (filters = {}) => {
  try {
    const params = {};

    if (filters.idRegion) params.idRegion = filters.idRegion;
    if (filters.nombre) params.nombre = filters.nombre;

    const response = await api.get(BASE_URL, { params });
    const data = unwrapData(response);
    const lista = Array.isArray(data) ? data : [];
    return lista.map(mapVerificentro);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getVerificentroById = async (id) => {
  try {
    const response = await api.get(`${BASE_URL}/${id}`);
    return mapVerificentro(unwrapData(response));
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createVerificentro = async (verificentro) => {
  try {
    const body = {
      idRegion: Number(verificentro.idRegion),
      nombre: verificentro.nombre?.trim(),
      claveVerificentro: verificentro.clave?.trim(),
      direccion: verificentro.direccion?.trim(),
      responsable: verificentro.responsable?.trim(),
      correo: verificentro.correo?.trim(),
      telefono: verificentro.telefonoPrincipal?.trim(),
      telefonoAlternativo: verificentro.telefonoAlternativo?.trim() || "0",
      horarioGeneral: verificentro.horario?.trim(),
    };

    const response = await api.post(BASE_URL, body);
    return mapVerificentro(unwrapData(response));
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateVerificentro = async (id, verificentro) => {
  try {
    const body = {
      idRegion: Number(verificentro.idRegion),
      nombre: verificentro.nombre?.trim(),
      claveVerificentro: verificentro.clave?.trim(),
      direccion: verificentro.direccion?.trim(),
      responsable: verificentro.responsable?.trim(),
      correo: verificentro.correo?.trim(),
      telefono: verificentro.telefonoPrincipal?.trim(),
      telefonoAlternativo: verificentro.telefonoAlternativo?.trim() || "0",
      horarioGeneral: verificentro.horario?.trim(),
    };

    const response = await api.put(`${BASE_URL}/${id}`, body);
    return mapVerificentro(unwrapData(response));
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteVerificentro = async (id) => {
  try {
    return await api.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};