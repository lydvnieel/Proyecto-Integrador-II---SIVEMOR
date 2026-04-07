import { api } from "../../../../server/api";

const BASE_URL = "/pedidos";

const unwrapData = (response) => response?.data?.data ?? response?.data;

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.mensaje ||
  error?.response?.data?.error ||
  "Ocurrió un error inesperado.";

const mapPedido = (p) => ({
  id: p.id ?? p.idPedido ?? null,
  nota: p.folioNota ?? p.nota ?? "",
  idNota: p.idNota ?? p.notaId ?? p.nota?.id ?? null,
  fechaEnvio: p.fechaEnvio ? String(p.fechaEnvio).slice(0, 10) : "",
  numeroGuia: p.numeroGuia ?? "",
  recibio: p.recibio ?? "",
  foto: p.fotoNombreArchivo ?? p.foto ?? "",
  fotoBase64: p.fotoBase64 ?? "",
  fotoMimeType: p.fotoMimeType ?? "",
  fotoNombreArchivo: p.fotoNombreArchivo ?? "",
  estatusEnvio: p.estatusEnvio ?? "PENDIENTE",
  estatusClass:
    p.estatusEnvio === "ENTREGADO"
      ? "status-success"
      : p.estatusEnvio === "PENDIENTE"
      ? "status-warning"
      : "status-neutral",
  comentario: p.comentario ?? "",
  activo: p.activo ?? true,
});

export const getPedidos = async (filters = {}) => {
  try {
    const params = {};

    if (filters.folioNota) params.folioNota = filters.folioNota;
    if (filters.estatusEnvio) params.estatusEnvio = filters.estatusEnvio;
    if (filters.fechaInicio) params.fechaInicio = filters.fechaInicio;
    if (filters.fechaFin) params.fechaFin = filters.fechaFin;
    if (filters.recibio) params.recibio = filters.recibio;

    const response = await api.get(BASE_URL, { params });
    const data = unwrapData(response);
    const lista = Array.isArray(data) ? data : [];
    return lista.map(mapPedido);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getPedidoById = async (id) => {
  try {
    const response = await api.get(`${BASE_URL}/${id}`);
    return mapPedido(unwrapData(response));
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createPedido = async (pedido) => {
  try {
    const body = {
      idNota: Number(pedido.idNota),
      fechaEnvio: pedido.fechaEnvio ? `${pedido.fechaEnvio}T00:00:00` : null,
      numeroGuia: pedido.numeroGuia?.trim() || null,
      recibio: pedido.recibio?.trim() || null,
      fotoBase64: pedido.fotoBase64 || null,
      fotoMimeType: pedido.fotoMimeType || null,
      fotoNombreArchivo: pedido.fotoNombreArchivo || null,
      estatusEnvio: pedido.estatusEnvio?.trim().toUpperCase(),
      comentario: pedido.comentario?.trim() || "",
    };

    const response = await api.post(BASE_URL, body);
    return mapPedido(unwrapData(response));
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updatePedido = async (id, pedido) => {
  try {
    const body = {
      fechaEnvio: pedido.fechaEnvio ? `${pedido.fechaEnvio}T00:00:00` : null,
      numeroGuia: pedido.numeroGuia?.trim() || "",
      recibio: pedido.recibio?.trim() || "",
      fotoBase64:
        pedido.clearFoto === true ? "" : pedido.fotoBase64 ?? null,
      fotoMimeType:
        pedido.clearFoto === true ? null : pedido.fotoMimeType ?? null,
      fotoNombreArchivo:
        pedido.clearFoto === true ? null : pedido.fotoNombreArchivo ?? null,
      estatusEnvio: pedido.estatusEnvio?.trim().toUpperCase(),
      comentario: pedido.comentario?.trim() || "",
    };

    const response = await api.put(`${BASE_URL}/${id}`, body);
    return mapPedido(unwrapData(response));
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deletePedido = async (id) => {
  try {
    return await api.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};