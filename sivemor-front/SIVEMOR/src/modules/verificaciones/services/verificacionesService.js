import { api } from "../../../../server/api";

const BASE_URL = "/verificaciones";

const normalizeMoney = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const number = Number(value);
  if (Number.isNaN(number)) return String(value);
  return `$${number}`;
};

const normalizeDate = (value) => {
  if (!value) return "";
  return String(value).slice(0, 10);
};

export const mapVerificacion = (v) => {
  const isPagado = v.pagado === true || v.pagado === "Sí" || v.pagado === "Si";

  return {
    id: v.id ?? v.idVerificacion,
    gestor: v.gestor ?? v.clienteGestor ?? "Pendiente",
    razonSocial: v.razonSocial ?? v.cliente ?? "Pendiente",
    placa: v.placa ?? v.vehiculoPlaca ?? "Pendiente",
    serie: v.serie ?? v.vehiculoSerie ?? "Pendiente",
    materia: v.materia ?? "",
    verificentro: v.verificentro ?? v.nombreVerificentro ?? "Pendiente",
    precio: normalizeMoney(v.precio),
    tipoPago: v.tipoPago ?? "Pendiente",
    numeroNota: v.numeroNota ?? v.folioNota ?? "Pendiente",
    cotizacion: v.cotizacion ?? "Pendiente",
    fechaFolio: normalizeDate(v.fechaVerificacion),
    folio: v.folio ?? v.folioVerificacion ?? "Pendiente",
    cuentaDeposito: v.cuentaDeposito ?? "Pendiente",
    numeroFactura: v.numeroFactura ?? "Pendiente",

    pagado: isPagado ? "Sí" : "Pendiente",
    pagadoClass: isPagado ? "status-success" : "status-warning",

    pendiente: isPagado ? "No" : "Sí",
    pendienteClass: isPagado
      ? "text-success fw-semibold"
      : "text-danger fw-semibold",

    fechaPedido: normalizeDate(v.fechaPedido),
    multa: v.multa != null ? normalizeMoney(v.multa) : "",
    dictamen: v.dictamen ?? "",
    idNota: v.idNota ?? v.notaId ?? v.nota?.id ?? null,
    idVehiculo: v.idVehiculo ?? v.vehiculoId ?? v.vehiculo?.id ?? null,
  };
};

const extractArray = (res) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.data?.content)) return res.data.content;
  return [];
};

const extractObject = (res) => {
  if (res?.data?.data) return res.data.data;
  return res?.data;
};

export const verificacionService = {
  async getAll(params = {}) {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== "" && value !== null && value !== undefined
      )
    );

    const res = await api.get(BASE_URL, { params: cleanParams });
    return extractArray(res).map(mapVerificacion);
  },

  async getById(id) {
    const res = await api.get(`${BASE_URL}/${id}`);
    return mapVerificacion(extractObject(res));
  },

  async create(payload) {
    const res = await api.post(BASE_URL, payload);
    return mapVerificacion(extractObject(res));
  },

  async update(id, payload) {
    const res = await api.put(`${BASE_URL}/${id}`, payload);
    return mapVerificacion(extractObject(res));
  },

  async remove(id) {
    const res = await api.delete(`${BASE_URL}/${id}`);
    return res.data;
  },

  async marcarPagado(ids) {
  const res = await api.put(`${BASE_URL}/marcar-pagado`, ids);
  return res.data;
  },
};