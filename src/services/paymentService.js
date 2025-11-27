import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const procesarPago = async (usuarioId, metodoPago) => {
  try {
    const response = await api.post("/pagos/procesarPago", {
      usuarioId,
      metodoPago,
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