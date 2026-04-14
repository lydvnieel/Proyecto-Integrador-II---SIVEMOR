const API_URL = "http://localhost:8080/sivemor/api";

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const api = {
  get: async (endpoint, options = {}) => {
    const queryString = buildQueryString(options.params);
    const res = await fetch(`${API_URL}${endpoint}${queryString}`);

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Error en GET");
    }

    return res.json();
  },

  post: async (endpoint, data) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Error en POST");
    }

    return res.json();
  },

  put: async (endpoint, data) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Error en PUT");
    }

    return res.json();
  },

  delete: async (endpoint) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Error en DELETE");
    }

    return res.json();
  },
};