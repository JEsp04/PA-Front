import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization header from localStorage token on each request
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      // ignore localStorage errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const procesarPago = async (usuarioId, metodoPago, direccionId) => {
  try {
    const response = await api.post("/pagos/procesarPago", {
      usuarioId,
      metodoPago,
      direccionId,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error procesando pago:",
      error.response?.data || error.message
    );
    throw error;
  }
};
