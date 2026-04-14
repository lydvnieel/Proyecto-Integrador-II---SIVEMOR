import { api } from "../../../../server/api";

const BASE_URL = "/auth";

export const loginAdmin = async ({ email, password }) => {
  return await api.post(`${BASE_URL}/login`, {
    email,
    password,
  });
};