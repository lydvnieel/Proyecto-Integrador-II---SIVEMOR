import { api } from "../../../../server/api";

const unwrapData = (response) => response?.data?.data ?? response?.data ?? {};

export const dashboardService = {
  async getResumen() {
    const response = await api.get("/dashboard/resumen");
    return unwrapData(response);
  },
};