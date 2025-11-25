import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});
export const crearCarrito = async (usuarioId) => {
  try {
    const response = await api.post("/carritos/crear", { usuarioId });
    return response.data;
  } catch (error) {
    console.error(
      "Error creando carrito:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const obtenerCarritoPorUsuario = async (usuarioId) => {
  try {
    const response = await api.get(`/carritos/ObtenerPorUsuario/${usuarioId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log("Codigo HTTP:", error.response.status);
    }
    console.error(
      "Error obteniendo carrito por usuario:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const sincronizarCarrito = async (usuarioId, items) => {
  try {
    const response = await api.post("/carritos/actualizar", {
      usuarioId,
      items,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error sincronizando carrito:",
      error.response?.data || error.message
    );
    throw error;
  }
};
