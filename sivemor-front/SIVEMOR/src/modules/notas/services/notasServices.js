import { api } from "../../../../server/api";

const BASE_URL = "/notas";

const unwrapResponse = (res) => {
  return res?.data?.data ?? res?.data ?? [];
};

const normalizeNota = (nota) => {
  if (!nota) return null;

  return {
    id: nota.id ?? nota.idNota ?? null,
    nota: nota.folioNota ?? nota.nota ?? "",
    cliente: nota.nombreCliente ?? nota.cliente ?? nota.razonSocialCliente ?? "",
    clienteId: nota.idCliente ?? nota.clienteId ?? nota.cliente?.id ?? null,
    verificaciones:
      nota.numeroVerificaciones ??
      nota.totalVerificaciones ??
      nota.verificaciones ??
      0,
    verificentro:
      nota.nombreVerificentro ??
      nota.verificentro ??
      nota.verificentroNombre ??
      "",
    verificentroId:
      nota.idVerificentro ?? nota.verificentroId ?? nota.verificentro?.id ?? null,
    metodo: nota.tipoPago ?? nota.metodo ?? "",
    anticipo:
      nota.anticipo !== null && nota.anticipo !== undefined
        ? String(nota.anticipo)
        : "",
    pagado:
      nota.pagadoCompleto === true || nota.pagado === true
        ? "Pagado"
        : "Pendiente",
    pagadoClass:
      nota.pagadoCompleto === true || nota.pagado === true
        ? "status-success"
        : "status-warning",
    pagadoCompleto: nota.pagadoCompleto ?? false,
    reviso:
      nota.nombreReviso ??
      nota.revisoNombre ??
      nota.reviso ??
      "",
    revisoId: nota.idReviso ?? nota.revisoId ?? nota.reviso?.id ?? null,
    atendio:
      nota.nombreAtendio ??
      nota.atendioNombre ??
      nota.atendio ??
      "",
    atendioId: nota.idAtendio ?? nota.atendioId ?? nota.atendio?.id ?? null,
    comentario: nota.comentario ?? "",
    fechaCreacion: nota.fechaCreacion ?? "",
  };
};

export const notasService = {
  async getAll(filters = {}) {
    const params = {};

    if (filters.idCliente) params.idCliente = filters.idCliente;
    if (filters.idVerificentro) params.idVerificentro = filters.idVerificentro;
    if (filters.folioNota) params.folioNota = filters.folioNota;
    if (filters.fechaInicio) params.fechaInicio = filters.fechaInicio;
    if (filters.fechaFin) params.fechaFin = filters.fechaFin;

    const res = await api.get(BASE_URL, { params });
    const data = unwrapResponse(res);

    return Array.isArray(data) ? data.map(normalizeNota) : [];
  },

  async getById(id) {
    const res = await api.get(`${BASE_URL}/${id}`);
    return normalizeNota(unwrapResponse(res));
  },

  async create(payload) {
    const res = await api.post(BASE_URL, payload);
    return normalizeNota(unwrapResponse(res));
  },

  async update(id, payload) {
    const res = await api.put(`${BASE_URL}/${id}`, payload);
    return normalizeNota(unwrapResponse(res));
  },

  async remove(id) {
    return await api.delete(`${BASE_URL}/${id}`);
  },

  async markAsPaid(id, currentNote) {
    return await this.update(id, {
      tipoPago: currentNote.metodo,
      anticipo: currentNote.anticipo ? Number(currentNote.anticipo) : 0,
      pagadoCompleto: true,
      atendio: currentNote.atendioId,
      reviso: currentNote.revisoId,
      comentario: currentNote.comentario ?? "",
    });
  },
};