import { api } from "../../../../server/api";

const BASE_URL = "/transacciones";

const unwrapData = (response) => response?.data?.data ?? response?.data;

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.mensaje ||
  error?.response?.data?.error ||
  "Ocurrió un error inesperado.";

const mapTransaccion = (t) => ({
  id: t.id ?? t.idTransaccion ?? null,
  nota: t.folioNota ?? t.nota ?? "",
  idNota: t.idNota ?? t.notaId ?? t.nota?.id ?? null,
  tipoPago: t.tipoPago ?? "",
  monto:
    t.monto !== null && t.monto !== undefined
      ? String(t.monto)
      : "",
  cuentaDeposito: t.cuentaDeposito ?? "",
  factura: t.numeroFactura ?? t.factura ?? "",
  pagado:
    t.pagado === true || t.pagado === "Sí" ? "Sí" : "No",
  pagadoClass:
    t.pagado === true || t.pagado === "Sí"
      ? "status-success"
      : "status-warning",
  fechaPedido: t.fechaPedido
    ? String(t.fechaPedido).slice(0, 10)
    : "",
  cotizacion: t.cotizacion ?? "",
  reviso: t.nombreReviso ?? t.reviso ?? "",
  revisoId: t.idReviso ?? t.revisoId ?? t.reviso?.id ?? null,
  atendio: t.nombreAtendio ?? t.atendio ?? "",
  atendioId: t.idAtendio ?? t.atendioId ?? t.atendio?.id ?? null,
  pendiente:
    t.pendiente === true || t.pendiente === "Sí" ? "Sí" : "No",
  pendienteClass:
    t.pendiente === true || t.pendiente === "Sí"
      ? "status-warning"
      : "status-success",
  comentario: t.comentario ?? "",
  activo: t.activo ?? true,
});

export const getTransacciones = async (filters = {}) => {
  try {
    const params = {};

    if (filters.idNota) params.idNota = filters.idNota;
    if (filters.tipoPago) params.tipoPago = filters.tipoPago;
    if (filters.fechaInicio) params.fechaInicio = filters.fechaInicio;
    if (filters.fechaFin) params.fechaFin = filters.fechaFin;
    if (filters.idAtendio) params.idAtendio = filters.idAtendio;
    if (filters.estadoPago) params.estadoPago = filters.estadoPago;
    if (filters.numeroFactura) params.numeroFactura = filters.numeroFactura;

    const response = await api.get(BASE_URL, { params });
    const data = unwrapData(response);
    const lista = Array.isArray(data) ? data : [];
    return lista.map(mapTransaccion);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getTransaccionById = async (id) => {
  try {
    const response = await api.get(`${BASE_URL}/${id}`);
    return mapTransaccion(unwrapData(response));
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createTransaccion = async (transaccion) => {
  try {
    const body = {
      idNota: Number(transaccion.idNota),
      tipoPago: transaccion.tipoPago?.trim().toUpperCase(),
      monto: Number(transaccion.monto),
      cuentaDeposito: transaccion.cuentaDeposito?.trim() || null,
      numeroFactura: transaccion.factura?.trim(),
      pagado: transaccion.pagado === "Sí",
      cotizacion: transaccion.cotizacion?.trim(),
      reviso: Number(transaccion.reviso),
      atendio: Number(transaccion.atendio),
      pendiente: transaccion.pendiente === "Sí",
      comentario: transaccion.comentario?.trim() || "",
    };

    const response = await api.post(BASE_URL, body);
    return mapTransaccion(unwrapData(response));
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateTransaccion = async (id, transaccion) => {
  try {
    const body = {
      tipoPago: transaccion.tipoPago?.trim().toUpperCase(),
      monto:
        transaccion.monto !== "" && transaccion.monto !== null
          ? Number(transaccion.monto)
          : null,
      cuentaDeposito: transaccion.cuentaDeposito?.trim() || null,
      numeroFactura: transaccion.factura?.trim(),
      pagado: transaccion.pagado === "Sí",
      cotizacion: transaccion.cotizacion?.trim(),
      reviso: Number(transaccion.reviso),
      atendio: Number(transaccion.atendio),
      pendiente: transaccion.pendiente === "Sí",
      comentario: transaccion.comentario?.trim() || "",
    };

    const response = await api.put(`${BASE_URL}/${id}`, body);
    return mapTransaccion(unwrapData(response));
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteTransaccion = async (id) => {
  try {
    return await api.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};