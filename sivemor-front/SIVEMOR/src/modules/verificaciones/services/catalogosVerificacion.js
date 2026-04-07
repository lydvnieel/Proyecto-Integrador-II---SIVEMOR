import { api } from "../../../../server/api";

const extractArray = (res) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.data?.content)) return res.data.content;
  return [];
};

export const catalogosVerificacionService = {
  async getNotas() {
    const res = await api.get("/notas");
    return extractArray(res);
  },

  async getVehiculos() {
    const res = await api.get("/vehiculos");
    return extractArray(res);
  },
};